import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import {
  rateLimiter,
  extractClientIp,
  createRateLimitHeaders,
  rateLimitResponse,
  RateLimitTier,
} from "@/lib/rate-limit";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  // ─────────────────────────────────────────────
  // 1. API Route Rate Limiting & Interception
  // ─────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ip = extractClientIp(req.headers);

    // Determine appropriate tier for the endpoint
    let tier: RateLimitTier = "public";

    if (pathname.startsWith("/api/auth")) {
      tier = "auth";
    } else if (pathname.startsWith("/api/admin")) {
      tier = isLoggedIn ? "authenticated" : "strict";
    } else if (pathname === "/api/orders" || pathname === "/api/admin/upload") {
      tier = "strict";
    }

    const limitResult = rateLimiter.checkLimit(ip, tier);

    if (!limitResult.success) {
      return rateLimitResponse(limitResult);
    }

    // Pass through to Route Handler with rate limit response headers attached
    const response = NextResponse.next();
    const headers = createRateLimitHeaders(limitResult);
    Object.entries(headers).forEach(([k, v]) => {
      response.headers.set(k, String(v));
    });

    return response;
  }

  // ─────────────────────────────────────────────
  // 2. Admin Page Authentication Guards
  // ─────────────────────────────────────────────
  // Unauthenticated user attempting to access protected admin routes
  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user attempting to visit login page -> redirect to admin
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
