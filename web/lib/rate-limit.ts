/**
 * In-memory rate limiter for API routes.
 * Tracks requests per IP within a sliding window.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds.
// `.unref()` lets Node exit even if this interval is still pending — important
// for test runners and short-lived edge invocations.
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 60_000);
if (typeof cleanupTimer.unref === "function") {
  cleanupTimer.unref();
}

/**
 * Check if a request should be rate limited.
 * @param identifier - Unique ID (usually IP address)
 * @param limit - Max requests per window
 * @param windowMs - Time window in milliseconds
 * @returns { limited, remaining, resetIn }
 */
export function rateLimit(
  identifier: string,
  limit: number = 20,
  windowMs: number = 60_000
): { limited: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return { limited: false, remaining: limit - 1, resetIn: windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, limit - entry.count);
  const resetIn = entry.resetTime - now;

  if (entry.count > limit) {
    return { limited: true, remaining: 0, resetIn };
  }

  return { limited: false, remaining, resetIn };
}

/**
 * Extract client IP from Next.js request headers.
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
