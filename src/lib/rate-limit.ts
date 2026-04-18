interface Entry {
	count: number;
	resetAt: number;
}

const store = new Map<string, Entry>();

export interface RateLimitOptions {
	windowMs: number;
	max: number;
}

/**
 * In-memory rate limiter. Returns true if the request is allowed, false if it
 * exceeds the limit. Safe for single-process deployments (dev + Docker Compose).
 */
export function checkRateLimit(key: string, opts: RateLimitOptions): boolean {
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || now > entry.resetAt) {
		store.set(key, { count: 1, resetAt: now + opts.windowMs });
		return true;
	}

	if (entry.count >= opts.max) {
		return false;
	}

	entry.count++;
	return true;
}
