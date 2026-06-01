const CACHE = "qanubis-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
				),
			),
	);
	self.clients.claim();
});

self.addEventListener("fetch", (e) => {
	const { request } = e;
	const url = new URL(request.url);

	// Skip non-GET, API routes, Next.js internals, and cross-origin
	if (
		request.method !== "GET" ||
		url.pathname.startsWith("/api/") ||
		url.pathname.startsWith("/_next/") ||
		url.origin !== self.location.origin
	) {
		return;
	}

	// Network-first: serve fresh content, fall back to cache when offline
	e.respondWith(
		fetch(request)
			.then((res) => {
				if (res.ok && request.mode === "navigate") {
					caches.open(CACHE).then((c) => c.put(request, res.clone()));
				}
				return res;
			})
			.catch(() => caches.match(request)),
	);
});
