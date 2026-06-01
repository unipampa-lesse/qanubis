"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	HiOutlineBell,
	HiOutlineChatBubbleLeft,
	HiOutlineCheckCircle,
} from "react-icons/hi2";
import { useTranslation } from "@/context/LanguageContext";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import { trpc } from "@/server/client";

export default function NotificationDropdown() {
	const t = useTranslation();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useNotificationStream();

	const { data: count = 0 } = trpc.notification.unreadCount.useQuery();
	const { data: notifications = [], isLoading } =
		trpc.notification.list.useQuery({ limit: 10 }, { enabled: open });
	const utils = trpc.useUtils();

	const markAllRead = trpc.notification.markAllRead.useMutation({
		onSuccess: () => {
			utils.notification.unreadCount.invalidate();
			utils.notification.list.invalidate();
		},
	});

	const markRead = trpc.notification.markRead.useMutation({
		onSuccess: () => {
			utils.notification.unreadCount.invalidate();
			utils.notification.list.invalidate();
		},
	});

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
				aria-label={t.notifications.title}
			>
				<HiOutlineBell className="h-5 w-5" />
				{count > 0 && (
					<span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
						{count > 9 ? "9+" : count}
					</span>
				)}
			</button>

			{open && (
				<div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
						<span className="text-sm font-semibold text-gray-800 dark:text-white/90">
							{t.notifications.title}
						</span>
						{count > 0 && (
							<button
								type="button"
								onClick={() => markAllRead.mutate()}
								disabled={markAllRead.isPending}
								className="flex items-center gap-1 text-xs text-brand-600 hover:underline dark:text-brand-400 disabled:opacity-50"
							>
								<HiOutlineCheckCircle className="h-3.5 w-3.5" />
								{t.notifications.markAllRead}
							</button>
						)}
					</div>

					{/* List */}
					<div className="max-h-72 overflow-y-auto">
						{isLoading && (
							<div className="space-y-2 p-3">
								{[1, 2, 3].map((k) => (
									<div
										key={k}
										className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
									/>
								))}
							</div>
						)}
						{!isLoading && notifications.length === 0 && (
							<p className="p-6 text-center text-sm text-gray-400">
								{t.notifications.empty}
							</p>
						)}
						{notifications.map((n) => {
							const rowClass = `block w-full border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.03] ${
								!n.read ? "bg-brand-50/50 dark:bg-brand-900/10" : ""
							}`;
							const handleClick = () => {
								if (!n.read) markRead.mutate({ notificationId: n.id });
								setOpen(false);
							};
							return n.link ? (
								<Link
									key={n.id}
									href={n.link}
									onClick={handleClick}
									className={rowClass}
								>
									<div className="flex items-start gap-2">
										<HiOutlineChatBubbleLeft className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" />
										<div className="min-w-0 flex-1">
											<p className="text-sm font-medium text-gray-800 dark:text-white/90">
												{n.title}
											</p>
											{n.body && (
												<p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
													{n.body}
												</p>
											)}
										</div>
										{!n.read && (
											<span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
										)}
									</div>
								</Link>
							) : (
								<button
									key={n.id}
									type="button"
									onClick={handleClick}
									className={rowClass}
								>
									<div className="flex items-start gap-2">
										<HiOutlineChatBubbleLeft className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" />
										<div className="min-w-0 flex-1">
											<p className="text-sm font-medium text-gray-800 dark:text-white/90">
												{n.title}
											</p>
											{n.body && (
												<p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
													{n.body}
												</p>
											)}
										</div>
										{!n.read && (
											<span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
