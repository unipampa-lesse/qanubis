import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

export interface RateLimitOptions {
	windowMs: number;
	max: number;
}

// ---------------------------------------------------------------------------
// Upstash Redis backend (production)
// ---------------------------------------------------------------------------

function makeRedisLimiter(opts: RateLimitOptions): Ratelimit {
	const redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL!,
		token: env.UPSTASH_REDIS_REST_TOKEN!,
	});
	return new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(opts.max, `${opts.windowMs}ms`),
		analytics: false,
	});
}

// ---------------------------------------------------------------------------
// In-memory fallback (local dev / tests — single process only)
// ---------------------------------------------------------------------------

interface Entry {
	count: number;
	resetAt: number;
}

const store = new Map<string, Entry>();

// Periodic sweep to evict all expired entries and prevent unbounded Map growth
// across long-running processes (dev server, tests). Skip in edge runtimes.
if (typeof setInterval !== "undefined") {
	setInterval(
		() => {
			const now = Date.now();
			for (const [k, entry] of store) {
				if (now > entry.resetAt) store.delete(k);
			}
		},
		5 * 60 * 1000,
	).unref?.();
}

function checkInMemory(key: string, opts: RateLimitOptions): boolean {
	const now = Date.now();
	const entry = store.get(key);

	// Evict expired entries on every write to prevent unbounded growth.
	if (!entry || now > entry.resetAt) {
		store.set(key, { count: 1, resetAt: now + opts.windowMs });
		return true;
	}

	if (entry.count >= opts.max) return false;

	entry.count++;
	return true;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const limiterCache = new Map<string, Ratelimit>();

/**
 * Returns true if the request is allowed, false if it exceeds the limit.
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL is set (production),
 * falls back to an in-memory sliding window for local dev and tests.
 */
export async function checkRateLimit(
	key: string,
	opts: RateLimitOptions,
): Promise<boolean> {
	if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
		return checkInMemory(key, opts);
	}

	const cacheKey = `${opts.max}:${opts.windowMs}`;
	let limiter = limiterCache.get(cacheKey);
	if (!limiter) {
		limiter = makeRedisLimiter(opts);
		limiterCache.set(cacheKey, limiter);
	}

	const { success } = await limiter.limit(key);
	return success;
}
