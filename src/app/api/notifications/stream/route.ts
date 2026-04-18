import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "@/lib/env";
import {
	registerSSEConnection,
	unregisterSSEConnection,
} from "@/lib/sse-registry";

export const dynamic = "force-dynamic";

/**
 * GET /api/notifications/stream
 * Server-Sent Events endpoint. Streams notification events to the authenticated user.
 */
export async function GET(req: NextRequest) {
	const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });
	if (!token?.sub) {
		return new Response("Unauthorized", { status: 401 });
	}
	const userId = token.sub;

	const encoder = new TextEncoder();
	let sendFn: ((data: string) => void) | null = null;
	let closed = false;

	const stream = new ReadableStream({
		start(controller) {
			sendFn = (data: string) => {
				if (closed) return;
				try {
					controller.enqueue(encoder.encode(data));
				} catch {
					closed = true;
					if (sendFn) unregisterSSEConnection(userId, sendFn);
				}
			};

			registerSSEConnection(userId, sendFn);
			// Heartbeat comment to keep the connection alive
			sendFn(": connected\n\n");
		},
		cancel() {
			closed = true;
			if (sendFn) unregisterSSEConnection(userId, sendFn);
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no",
		},
	});
}
