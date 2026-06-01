/**
 * In-memory SSE connection registry.
 * Works correctly for single-instance deploys (dev + simple prod).
 * Multi-instance prod would require a pub/sub layer (e.g. Redis).
 */
type SendFn = (data: string) => void;

const registry = new Map<string, Set<SendFn>>();

export function registerSSEConnection(userId: string, send: SendFn): void {
	if (!registry.has(userId)) registry.set(userId, new Set());
	const conns = registry.get(userId);
	if (!conns) return;
	conns.add(send);
}

export function unregisterSSEConnection(userId: string, send: SendFn): void {
	const conns = registry.get(userId);
	if (!conns) return;
	conns.delete(send);
	if (conns.size === 0) registry.delete(userId);
}

export function pushSSENotification(userId: string, payload: object): void {
	const conns = registry.get(userId);
	if (!conns?.size) return;
	const msg = `event: notification\ndata: ${JSON.stringify(payload)}\n\n`;
	for (const send of conns) {
		try {
			send(msg);
		} catch {
			conns.delete(send);
		}
	}
}
