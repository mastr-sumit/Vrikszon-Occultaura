import { RateLimitConfig } from "./types";

function parseEnvInt(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (!raw) return defaultValue;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

function parseEnvFloat(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (!raw) return defaultValue;
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

/**
 * Dynamic Rate Limiting Configuration loaded from Environment Variables.
 * All thresholds are fully configurable and not hardcoded.
 */
export function getRateLimitConfig(): RateLimitConfig {
  return {
    // Auth Routes (strict + exponential backoff)
    authIpMax: parseEnvInt("RATE_LIMIT_AUTH_IP_MAX", 5),
    authIpWindowSec: parseEnvInt("RATE_LIMIT_AUTH_IP_WINDOW_SEC", 60),
    authAccountMax: parseEnvInt("RATE_LIMIT_AUTH_ACCOUNT_MAX", 5),
    authAccountWindowSec: parseEnvInt("RATE_LIMIT_AUTH_ACCOUNT_WINDOW_SEC", 300),
    authBackoffBaseSec: parseEnvInt("RATE_LIMIT_AUTH_BACKOFF_BASE_SEC", 15),
    authBackoffMultiplier: parseEnvFloat("RATE_LIMIT_AUTH_BACKOFF_MULTIPLIER", 2),
    authBackoffMaxSec: parseEnvInt("RATE_LIMIT_AUTH_BACKOFF_MAX_SEC", 3600),

    // Public Endpoints (moderate)
    publicMax: parseEnvInt("RATE_LIMIT_PUBLIC_MAX", 40),
    publicWindowSec: parseEnvInt("RATE_LIMIT_PUBLIC_WINDOW_SEC", 60),

    // Authenticated User Endpoints (loose)
    authenticatedMax: parseEnvInt("RATE_LIMIT_AUTHENTICATED_MAX", 150),
    authenticatedWindowSec: parseEnvInt("RATE_LIMIT_AUTHENTICATED_WINDOW_SEC", 60),

    // Strict Mutation Endpoints (e.g., checkout order creation, file upload)
    strictMax: parseEnvInt("RATE_LIMIT_STRICT_MAX", 10),
    strictWindowSec: parseEnvInt("RATE_LIMIT_STRICT_WINDOW_SEC", 60),
  };
}
