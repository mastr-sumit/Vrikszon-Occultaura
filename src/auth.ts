import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { rateLimiter, extractClientIp } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations/schemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Strict Schema Validation (Type, Length, Format, Unknown fields rejection)
        const validation = loginSchema.safeParse(credentials);
        if (!validation.success) {
          console.warn("[AUTH] Credentials validation rejected:", validation.error.issues);
          return null;
        }

        const { email, password } = validation.data;

        // 2. Extract Client IP & Check Per-IP and Per-Account Rate Limits with Exponential Backoff
        let clientIp = "127.0.0.1";
        try {
          const reqHeaders = await headers();
          clientIp = extractClientIp(reqHeaders);
        } catch {
          // Fallback if headers() context unavailable
        }

        const rateLimitStatus = rateLimiter.checkAuthLimits(clientIp, email);
        if (!rateLimitStatus.allowed) {
          console.warn(
            `[AUTH RATE LIMITED] IP: ${clientIp}, Email: ${email}, RetryAfter: ${rateLimitStatus.retryAfterSec}s, Reason: ${rateLimitStatus.reason}`
          );
          throw new Error(
            rateLimitStatus.reason ||
              `Too many login attempts. Please wait ${rateLimitStatus.retryAfterSec || 30} seconds before trying again.`
          );
        }

        try {
          const admin = await prisma.adminUser.findUnique({
            where: { email },
          });

          if (!admin || !admin.passwordHash) {
            // Record failure to apply exponential backoff against account enumeration
            rateLimiter.recordAuthFailure(clientIp, email);
            console.warn("[AUTH] Admin user record not found for:", email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

          if (!isPasswordValid) {
            // Increment failure count and trigger exponential backoff penalty
            const failureInfo = rateLimiter.recordAuthFailure(clientIp, email);
            console.warn(
              `[AUTH] Invalid password for ${email} from ${clientIp}. Total failures: ${failureInfo.totalFailures}, Next backoff: ${failureInfo.backoffSec}s`
            );
            return null;
          }

          // Successful authentication: clear all rate-limiting and backoff penalties
          rateLimiter.recordAuthSuccess(clientIp, email);
          console.log("[AUTH] Authentication successful for:", email);

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          };
        } catch (error) {
          if (error instanceof Error && error.message.includes("Too many")) {
            throw error;
          }
          console.error("[AUTH] Exception during authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
