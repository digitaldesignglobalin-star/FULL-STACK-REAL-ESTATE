import { NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
};

const AUTH_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
};

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  let entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  entry.count++;

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const success = entry.count <= config.maxRequests;

  if (!success) {
    const waitTime = entry.resetTime - now;
    setTimeout(() => {
      rateLimitStore.delete(key);
    }, waitTime);
  }

  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: entry.resetTime,
  };
}

export function authRateLimit(
  identifier: string
): { success: boolean; limit: number; remaining: number; reset: number } {
  return rateLimit(identifier, AUTH_CONFIG);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return "unknown";
}

export function createRateLimitResponse(
  limit: number,
  remaining: number,
  reset: number
): NextResponse {
  return NextResponse.json(
    { message: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": Math.ceil(reset / 1000).toString(),
        "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    }
  );
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);
