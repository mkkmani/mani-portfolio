import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { REDIS_CONFIG } from "./config";


let redis: Redis | null = null;
if (REDIS_CONFIG.enabled) {
  redis = new Redis({ url: REDIS_CONFIG.url, token: REDIS_CONFIG.token });
}

const limiters = new Map<string, Ratelimit>();

type Window = `${number} ${"s" | "m" | "h" | "d"}`;

function getLimiter(name: string, max: number, window: Window): Ratelimit | null {
  if (!redis) return null;
  const key = `${name}:${max}:${window}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, window),
      analytics: false,
      prefix: `rl:${name}`,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  name: string,
  identifier: string,
  max: number,
  window: Window
): Promise<RateLimitResult> {
  const limiter = getLimiter(name, max, window);
  if (!limiter) return { success: true, remaining: max, reset: 0 };
  try {
    const { success, remaining, reset } = await limiter.limit(identifier);
    return { success, remaining, reset };
  } catch (err) {
    // Never let a limiter outage take down the route.
    console.error(`[rate-limit] ${name} check failed:`, err);
    return { success: true, remaining: max, reset: 0 };
  }
}

export function tooManyRequests(reset: number): NextResponse {
  const retryAfter = reset ? Math.max(1, Math.ceil((reset - Date.now()) / 1000)) : 60;
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
