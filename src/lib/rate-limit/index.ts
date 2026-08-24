import { NextResponse } from "next/server";
import { rateLimiter, extractClientIp } from "./limiter";
import { RateLimitResult, RateLimitTier, AuthRateLimitResult } from "./types";
import { getRateLimitConfig } from "./config";

export * from "./types";
export * from "./config";
export * from "./limiter";

/**
 * Generate standard RFC rate-limiting HTTP headers
 */
export function createRateLimitHeaders(
  result: RateLimitResult | AuthRateLimitResult
): HeadersInit {
  const headers: Record<string, string> = {};

  if ("limit" in result) {
    headers["X-RateLimit-Limit"] = String(result.limit);
    headers["X-RateLimit-Remaining"] = String(Math.max(0, result.remaining));
    headers["X-RateLimit-Reset"] = String(result.reset);
  }

  if ("retryAfter" in result && result.retryAfter) {
    headers["Retry-After"] = String(result.retryAfter);
  } else if ("retryAfterSec" in result && result.retryAfterSec) {
    headers["Retry-After"] = String(result.retryAfterSec);
  }

  return headers;
}

/**
 * Returns a standardized JSON 429 Too Many Requests response with RFC headers
 */
export function rateLimitResponse(
  result: RateLimitResult | AuthRateLimitResult,
  customMessage?: string
): NextResponse {
  const retrySec =
    ("retryAfter" in result ? result.retryAfter : undefined) ||
    ("retryAfterSec" in result ? result.retryAfterSec : undefined) ||
    getRateLimitConfig().authBackoffBaseSec;

  const errorMessage =
    customMessage ||
    result.reason ||
    `Too many requests. Please slow down and try again in ${retrySec} seconds.`;

  return NextResponse.json(
    {
      error: errorMessage,
      retryAfter: retrySec,
      rateLimited: true,
    },
    {
      status: 429,
      headers: createRateLimitHeaders(result),
    }
  );
}

/**
 * Convenience helper to check rate limits inside Next.js Route Handlers
 */
export function checkRouteRateLimit(
  request: Request,
  tier: RateLimitTier = "public",
  customMax?: number,
  customWindowSec?: number
): { allowed: boolean; response?: NextResponse; result: RateLimitResult } {
  const ip = extractClientIp(request.headers);
  const result = rateLimiter.checkLimit(ip, tier, customMax, customWindowSec);

  if (!result.success) {
    return {
      allowed: false,
      response: rateLimitResponse(result),
      result,
    };
  }

  return {
    allowed: true,
    result,
  };
}
