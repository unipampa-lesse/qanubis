"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { trpc } from "@/server/client";

/**
 * Subscribes to the SSE notification stream and invalidates React Query
 * caches on incoming events, keeping the badge and dropdown up-to-date.
 */
export function useNotificationStream() {
	const { data: session } = useSession();
	const utils = trpc.useUtils();

	useEffect(() => {
		if (!session?.user?.id) return;

		const source = new EventSource("/api/notifications/stream");

		source.addEventListener("notification", () => {
			utils.notification.unreadCount.invalidate();
			utils.notification.list.invalidate();
		});

		source.onerror = () => {
			// Browser retries automatically; no action needed
		};

		return () => source.close();
	}, [session?.user?.id, utils]);
}
