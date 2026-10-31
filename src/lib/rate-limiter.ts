/**
 * In-memory sliding window rate limiter for API session throttling
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const windowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 30; // 30 requests per minute per session

const sessionStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(sessionId: string): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = sessionStore.get(sessionId);

  if (!record || now > record.resetAt) {
    sessionStore.set(sessionId, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequestsPerWindow - 1,
      resetInSec: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxRequestsPerWindow) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequestsPerWindow - record.count,
    resetInSec: Math.ceil((record.resetAt - now) / 1000),
  };
}
