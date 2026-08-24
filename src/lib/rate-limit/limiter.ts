import { getRateLimitConfig } from "./config";
import { AuthRateLimitResult, RateLimitResult, RateLimitTier } from "./types";

interface WindowRecord {
  timestamps: number[];
}

interface BackoffRecord {
  consecutiveFailures: number;
  lastFailureTime: number;
  lockedUntil: number; // Unix timestamp in ms
}

class MemoryRateLimiter {
  private windowStore: Map<string, WindowRecord> = new Map();
  private backoffStore: Map<string, BackoffRecord> = new Map();
  private lastCleanup: number = Date.now();
  private readonly CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

  constructor() {
    // Schedule periodic garbage collection if timer is available in runtime
    if (typeof setInterval !== "undefined") {
      const timer = setInterval(() => {
        this.pruneExpired();
      }, this.CLEANUP_INTERVAL_MS);

      // Prevent keeping Node process open solely for timer
      if (timer && typeof timer === "object" && "unref" in timer) {
        (timer as { unref: () => void }).unref();
      }
    }
  }

  /**
   * Remove expired keys to prevent memory leaks in persistent instances
   */
  public pruneExpired() {
    const now = Date.now();
    const config = getRateLimitConfig();
    const maxWindowMs = Math.max(
      config.authIpWindowSec,
      config.authAccountWindowSec,
      config.publicWindowSec,
      config.authenticatedWindowSec,
      config.strictWindowSec,
      config.authBackoffMaxSec
    ) * 1000;

    // Prune window store
    for (const [key, record] of this.windowStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindowMs);
      if (record.timestamps.length === 0) {
        this.windowStore.delete(key);
      }
    }

    // Prune backoff store
    for (const [key, record] of this.backoffStore.entries()) {
      if (now > record.lockedUntil && now - record.lastFailureTime > maxWindowMs) {
        this.backoffStore.delete(key);
      }
    }

    this.lastCleanup = now;
  }

  /**
   * General sliding-window rate limit checker
   */
  public checkLimit(
    identifier: string,
    tier: RateLimitTier,
    customMax?: number,
    customWindowSec?: number
  ): RateLimitResult {
    const now = Date.now();
    const config = getRateLimitConfig();

    let maxRequests: number;
    let windowSec: number;

    switch (tier) {
      case "auth":
        maxRequests = customMax ?? config.authIpMax;
        windowSec = customWindowSec ?? config.authIpWindowSec;
        break;
      case "authenticated":
        maxRequests = customMax ?? config.authenticatedMax;
        windowSec = customWindowSec ?? config.authenticatedWindowSec;
        break;
      case "strict":
        maxRequests = customMax ?? config.strictMax;
        windowSec = customWindowSec ?? config.strictWindowSec;
        break;
      case "public":
      default:
        maxRequests = customMax ?? config.publicMax;
        windowSec = customWindowSec ?? config.publicWindowSec;
        break;
    }

    const windowMs = windowSec * 1000;
    const storeKey = `${tier}:${identifier}`;

    let record = this.windowStore.get(storeKey);
    if (!record) {
      record = { timestamps: [] };
      this.windowStore.set(storeKey, record);
    }

    // Filter out timestamps older than the sliding window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    const currentCount = record.timestamps.length;
    const resetTimeSec = Math.ceil((now + windowMs) / 1000);

    if (currentCount >= maxRequests) {
      // Oldest timestamp determines when the first slot frees up
      const oldestTs = record.timestamps[0] || now;
      const retryAfterSec = Math.max(1, Math.ceil((oldestTs + windowMs - now) / 1000));

      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: resetTimeSec,
        retryAfter: retryAfterSec,
        reason: `Rate limit exceeded for tier '${tier}'. Maximum ${maxRequests} requests per ${windowSec}s.`,
        tier,
      };
    }

    // Record this request
    record.timestamps.push(now);

    return {
      success: true,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - (currentCount + 1)),
      reset: resetTimeSec,
      tier,
    };
  }

  /**
   * Check Auth limits for IP and Account with exponential backoff calculation
   */
  public checkAuthLimits(ip: string, account?: string): AuthRateLimitResult {
    const now = Date.now();
    const config = getRateLimitConfig();

    const normalizedIp = ip.trim() || "127.0.0.1";
    const ipBackoffKey = `auth_backoff_ip:${normalizedIp}`;
    const ipRecord = this.backoffStore.get(ipBackoffKey);

    // 1. Check IP lockout due to exponential backoff
    if (ipRecord && now < ipRecord.lockedUntil) {
      const retryAfterSec = Math.max(1, Math.ceil((ipRecord.lockedUntil - now) / 1000));
      return {
        allowed: false,
        retryAfterSec,
        violationsCount: ipRecord.consecutiveFailures,
        reason: `Too many failed attempts from this IP. Please wait ${retryAfterSec} seconds before trying again.`,
        ipRemaining: 0,
      };
    }

    // 2. Check Account lockout due to exponential backoff (if account specified)
    let accountRecord: BackoffRecord | undefined;
    if (account) {
      const normalizedAccount = account.toLowerCase().trim();
      const accountBackoffKey = `auth_backoff_acct:${normalizedAccount}`;
      accountRecord = this.backoffStore.get(accountBackoffKey);

      if (accountRecord && now < accountRecord.lockedUntil) {
        const retryAfterSec = Math.max(1, Math.ceil((accountRecord.lockedUntil - now) / 1000));
        return {
          allowed: false,
          retryAfterSec,
          violationsCount: accountRecord.consecutiveFailures,
          reason: `Account temporarily throttled due to multiple failed login attempts. Try again in ${retryAfterSec}s.`,
          ipRemaining: 0,
          accountRemaining: 0,
        };
      }
    }

    // 3. Check standard sliding-window attempts for IP
    const ipWindowResult = this.checkLimit(
      normalizedIp,
      "auth",
      config.authIpMax,
      config.authIpWindowSec
    );

    if (!ipWindowResult.success) {
      return {
        allowed: false,
        retryAfterSec: ipWindowResult.retryAfter || config.authBackoffBaseSec,
        reason: ipWindowResult.reason,
        ipRemaining: 0,
      };
    }

    // 4. Check standard sliding-window attempts for Account
    let accountRemaining: number | undefined;
    if (account) {
      const normalizedAccount = account.toLowerCase().trim();
      const accountWindowResult = this.checkLimit(
        normalizedAccount,
        "auth",
        config.authAccountMax,
        config.authAccountWindowSec
      );

      if (!accountWindowResult.success) {
        return {
          allowed: false,
          retryAfterSec: accountWindowResult.retryAfter || config.authBackoffBaseSec,
          reason: accountWindowResult.reason,
          ipRemaining: ipWindowResult.remaining,
          accountRemaining: 0,
        };
      }
      accountRemaining = accountWindowResult.remaining;
    }

    return {
      allowed: true,
      ipRemaining: ipWindowResult.remaining,
      accountRemaining,
    };
  }

  /**
   * Record a failed authentication attempt (calculates & applies exponential backoff)
   */
  public recordAuthFailure(ip: string, account?: string): { backoffSec: number; totalFailures: number } {
    const now = Date.now();
    const config = getRateLimitConfig();

    const normalizedIp = ip.trim() || "127.0.0.1";
    const ipKey = `auth_backoff_ip:${normalizedIp}`;

    const ipRecord = this.backoffStore.get(ipKey) || {
      consecutiveFailures: 0,
      lastFailureTime: now,
      lockedUntil: 0,
    };

    ipRecord.consecutiveFailures += 1;
    ipRecord.lastFailureTime = now;

    // Calculate exponential penalty: baseSec * (multiplier ^ (failures - threshold))
    // Backoff begins escalating once failure count meets/exceeds configured max
    let penaltySec = 0;
    if (ipRecord.consecutiveFailures >= config.authIpMax) {
      const exponent = ipRecord.consecutiveFailures - config.authIpMax;
      const exponentialDelay = config.authBackoffBaseSec * Math.pow(config.authBackoffMultiplier, exponent);
      penaltySec = Math.min(exponentialDelay, config.authBackoffMaxSec);
      ipRecord.lockedUntil = now + penaltySec * 1000;
    }

    this.backoffStore.set(ipKey, ipRecord);

    // Also update account record if provided
    if (account) {
      const normalizedAccount = account.toLowerCase().trim();
      const acctKey = `auth_backoff_acct:${normalizedAccount}`;
      const acctRecord = this.backoffStore.get(acctKey) || {
        consecutiveFailures: 0,
        lastFailureTime: now,
        lockedUntil: 0,
      };

      acctRecord.consecutiveFailures += 1;
      acctRecord.lastFailureTime = now;

      if (acctRecord.consecutiveFailures >= config.authAccountMax) {
        const exponent = acctRecord.consecutiveFailures - config.authAccountMax;
        const exponentialDelay = config.authBackoffBaseSec * Math.pow(config.authBackoffMultiplier, exponent);
        const acctPenaltySec = Math.min(exponentialDelay, config.authBackoffMaxSec);
        acctRecord.lockedUntil = now + acctPenaltySec * 1000;
        penaltySec = Math.max(penaltySec, acctPenaltySec);
      }

      this.backoffStore.set(acctKey, acctRecord);
    }

    return {
      backoffSec: penaltySec,
      totalFailures: ipRecord.consecutiveFailures,
    };
  }

  /**
   * Record a successful authentication attempt (clears backoff penalty & resets streak)
   */
  public recordAuthSuccess(ip: string, account?: string) {
    const normalizedIp = ip.trim() || "127.0.0.1";
    this.backoffStore.delete(`auth_backoff_ip:${normalizedIp}`);
    this.windowStore.delete(`auth:${normalizedIp}`);

    if (account) {
      const normalizedAccount = account.toLowerCase().trim();
      this.backoffStore.delete(`auth_backoff_acct:${normalizedAccount}`);
      this.windowStore.delete(`auth:${normalizedAccount}`);
    }
  }

  /**
   * Clear all stores (used in unit testing and resets)
   */
  public resetAll() {
    this.windowStore.clear();
    this.backoffStore.clear();
  }
}

// Global Singleton to maintain rate limiting state across requests in process
const globalForLimiter = globalThis as unknown as {
  rateLimiterInstance: MemoryRateLimiter | undefined;
};

export const rateLimiter = globalForLimiter.rateLimiterInstance ?? new MemoryRateLimiter();

if (process.env.NODE_ENV !== "production") {
  globalForLimiter.rateLimiterInstance = rateLimiter;
}

/**
 * Safely extracts client IP address from request headers or socket
 */
export function extractClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const getHeader = (name: string): string | undefined => {
    if ("get" in headers && typeof headers.get === "function") {
      return headers.get(name) || undefined;
    }
    const val = (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  // 1. Standard proxy forward header (format: "client, proxy1, proxy2")
  const xForwardedFor = getHeader("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp && isValidIp(firstIp)) {
      return firstIp;
    }
  }

  // 2. Cloudflare Connecting IP
  const cfConnectingIp = getHeader("cf-connecting-ip");
  if (cfConnectingIp && isValidIp(cfConnectingIp.trim())) {
    return cfConnectingIp.trim();
  }

  // 3. Real IP header (Nginx / Vercel)
  const xRealIp = getHeader("x-real-ip");
  if (xRealIp && isValidIp(xRealIp.trim())) {
    return xRealIp.trim();
  }

  // 4. Fastly / True-Client-IP
  const trueClientIp = getHeader("true-client-ip") || getHeader("fastly-client-ip");
  if (trueClientIp && isValidIp(trueClientIp.trim())) {
    return trueClientIp.trim();
  }

  return "127.0.0.1";
}

function isValidIp(ip: string): boolean {
  // IPv4 simple regex
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return true;
  // IPv6 simple regex
  if (/^[0-9a-fA-F:]+$/.test(ip) && ip.includes(":")) return true;
  return false;
}
