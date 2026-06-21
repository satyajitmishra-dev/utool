import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { SubscriptionTier } from "@/types/schema";

// Initialize Upstash Redis Client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://mock-redis.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "mock-token",
});

// Cache configurations
export const CACHE_TTL = {
  USER_PROFILE: 300, // 5 minutes
  TOOL_METADATA: 3600, // 1 hour
  BILLING_STATUS: 600, // 10 minutes
};

/**
 * Creates or retrieves a Ratelimit instance for a specific user tier.
 * Tiers: 'free', 'pro', 'enterprise'
 */
export function getRateLimiter(tier: SubscriptionTier = "free") {
  // Define limits per tier
  const limits = {
    free: {
      requests: 10,
      window: "60 s" as const,
    },
    pro: {
      requests: 60,
      window: "60 s" as const,
    },
    enterprise: {
      requests: 300,
      window: "60 s" as const,
    },
  };

  const config = limits[tier] || limits.free;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: `@ratelimit:${tier}`,
  });
}

/**
 * Helper to cache items easily in Upstash Redis
 */
export async function getCachedItem<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key);
  } catch (error) {
    console.error(`Redis cache read error for key: ${key}`, error);
    return null;
  }
}

export async function setCachedItem<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  try {
    if (ttlSeconds) {
      await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
    } else {
      await redis.set(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Redis cache write error for key: ${key}`, error);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Redis cache deletion error for key: ${key}`, error);
  }
}
