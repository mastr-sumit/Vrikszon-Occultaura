export type RateLimitTier = "auth" | "public" | "authenticated" | "strict";

export interface RateLimitConfig {
  /** Max attempts allowed within the window for IP */
  authIpMax: number;
  /** IP rate limit window in seconds for auth */
  authIpWindowSec: number;
  /** Max attempts allowed within the window for Account (email/username) */
  authAccountMax: number;
  /** Account rate limit window in seconds for auth */
  authAccountWindowSec: number;
  /** Base penalty/backoff delay in seconds */
  authBackoffBaseSec: number;
  /** Exponential backoff multiplier (e.g. 2 for 2^N growth) */
  authBackoffMultiplier: number;
  /** Maximum backoff ceiling in seconds */
  authBackoffMaxSec: number;
  /** Max requests per window for public endpoints */
  publicMax: number;
  /** Public rate limit window in seconds */
  publicWindowSec: number;
  /** Max requests per window for authenticated admin endpoints */
  authenticatedMax: number;
  /** Authenticated rate limit window in seconds */
  authenticatedWindowSec: number;
  /** Max requests per window for strict mutation endpoints (e.g., upload, orders) */
  strictMax: number;
  /** Strict rate limit window in seconds */
  strictWindowSec: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  retryAfter?: number; // In seconds, if rate limited
  reason?: string;
  tier: RateLimitTier;
}

export interface AuthRateLimitResult {
  allowed: boolean;
  retryAfterSec?: number;
  reason?: string;
  violationsCount?: number;
  ipRemaining: number;
  accountRemaining?: number;
}
