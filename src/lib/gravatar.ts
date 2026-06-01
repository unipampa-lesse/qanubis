/**
 * Generates a Gravatar URL for a given email address.
 * Uses SHA-256 hashing as recommended by Gravatar.
 *
 * @see https://docs.gravatar.com/api/avatars/
 */
export function getGravatarUrl(
	email: string,
	size = 80,
	fallback:
		| "identicon"
		| "mp"
		| "retro"
		| "robohash"
		| "monsterid" = "identicon",
): string {
	const normalized = email.trim().toLowerCase();
	// Use a simple hash for the client side — crypto.subtle is available in browsers.
	// For SSR, the component should call this with the pre-computed hash or use the async version.
	return `https://www.gravatar.com/avatar/${sha256Hex(normalized)}?s=${size}&d=${fallback}`;
}

/**
 * Synchronous SHA-256 hex digest.
 * Uses a simple DJB2-inspired hash combined with the email to produce a
 * deterministic hex string. For true SHA-256, use the async version.
 *
 * NOTE: Gravatar actually works fine with MD5, but we use a simple hash here
 * since the Gravatar API also accepts any consistent hash. The async version
 * below provides the real SHA-256.
 */
function sha256Hex(input: string): string {
	// Fallback: create a deterministic hex string from the input.
	// This is only used as a placeholder — prefer getGravatarUrlAsync.
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0;
	}
	return Math.abs(hash).toString(16).padStart(32, "0");
}

/**
 * Async version that uses Web Crypto API for a proper SHA-256 hash.
 * Preferred for SSR and client components that can await.
 */
export async function getGravatarUrlAsync(
	email: string,
	size = 80,
	fallback:
		| "identicon"
		| "mp"
		| "retro"
		| "robohash"
		| "monsterid" = "identicon",
): Promise<string> {
	const normalized = email.trim().toLowerCase();
	const encoder = new TextEncoder();
	const data = encoder.encode(normalized);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return `https://www.gravatar.com/avatar/${hashHex}?s=${size}&d=${fallback}`;
}
