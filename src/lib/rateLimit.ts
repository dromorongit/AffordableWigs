/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API endpoints
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every minute
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}, 60000);

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

/**
 * Simple rate limiter for API routes
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns { allowed: boolean, remaining: number, resetIn: number }
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = identifier;
  
  let entry = rateLimitStore.get(key);
  
  // Reset if window has passed
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }
  
  entry.count++;
  
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = Math.max(0, entry.resetTime - now);
  
  return {
    allowed: entry.count <= config.maxRequests,
    remaining,
    resetIn,
  };
}

// Pre-configured rate limit settings
export const RATE_LIMITS = {
  // Strict: 5 requests per minute (for sensitive endpoints like login)
  LOGIN: { windowMs: 60000, maxRequests: 5 },
  
  // Medium: 10 requests per minute (for payment endpoints)
  PAYMENT: { windowMs: 60000, maxRequests: 10 },
  
  // Medium: 20 requests per minute (for admin APIs)
  ADMIN_API: { windowMs: 60000, maxRequests: 20 },
  
  // Relaxed: 60 requests per minute (for general API)
  GENERAL: { windowMs: 60000, maxRequests: 60 },
};

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  // Check various headers for client IP
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
}