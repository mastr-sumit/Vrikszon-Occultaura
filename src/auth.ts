import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        try {
          console.log("[AUTH DEBUG] authorize() called for email:", email);
          console.log("[AUTH DEBUG] process.env.DATABASE_URL exists:", !!process.env.DATABASE_URL);
          console.log("[AUTH DEBUG] process.env.AUTH_SECRET exists:", !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET));

          const admin = await prisma.adminUser.findUnique({
            where: { email },
          });

          console.log("[AUTH DEBUG] Admin user query result:", admin ? { id: admin.id, email: admin.email, hasPasswordHash: !!admin.passwordHash } : "NOT_FOUND");

          if (!admin || !admin.passwordHash) {
            console.warn("[AUTH DEBUG] Admin user record or passwordHash missing");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
          console.log("[AUTH DEBUG] bcrypt.compare result:", isPasswordValid);

          if (!isPasswordValid) {
            console.warn("[AUTH DEBUG] Password compare failed for:", email);
            return null;
          }

          console.log("[AUTH DEBUG] Authentication successful for:", email);
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          };
        } catch (error) {
          console.error("[AUTH DEBUG] Exception in authorize():", error);
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
