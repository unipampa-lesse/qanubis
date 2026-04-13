"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

const STATUS_COLORS: Record<string, string> = {
	OPEN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	IN_PROGRESS:
		"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
	RESOLVED:
		"bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300",
	CLOSED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function AdminTicketDetailPage() {
	const { ticketId } = useParams<{ ticketId: string }>();
	const t = useTranslation();
	const utils = trpc.useUtils();

	const { data: ticket, isLoading } = trpc.admin.getTicket.useQuery({
		ticketId,
	});

	const updateStatus = trpc.admin.updateTicketStatus.useMutation({
		onSuccess: () => utils.admin.getTicket.invalidate({ ticketId }),
	});

	const reply = trpc.admin.replyTicket.useMutation({
		onSuccess: () => {
			utils.admin.getTicket.invalidate({ ticketId });
			setReplyText("");
		},
	});

	const [replyText, setReplyText] = useState("");

	function statusLabel(status: string) {
		const map: Record<string, string> = {
			OPEN: t.admin.statusOpen,
			IN_PROGRESS: t.admin.statusInProgress,
			RESOLVED: t.admin.statusResolved,
			CLOSED: t.admin.statusClosed,
		};
		return map[status] ?? status;
	}

	if (isLoading) {
		return (
			<div className="space-y-3">
				<div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
				<div className="h-32 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800" />
			</div>
		);
	}

	if (!ticket) {
		return <div className="text-sm text-gray-500">{t.admin.ticketNotFound}</div>;
	}

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			{/* Back + header */}
			<div>
				<Link
					href="/dashboard/admin/tickets"
					className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
				>
					<HiOutlineArrowLeft className="h-4 w-4" />
					{t.admin.backToTickets}
				</Link>
				<div className="flex items-start gap-3">
					<div className="flex-1">
						<h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
							{ticket.subject}
						</h1>
						<div className="mt-1 text-sm text-gray-400">
							{t.admin.openedBy}: {ticket.user.name ?? ticket.user.email}
						</div>
					</div>
					<span
						className={`rounded px-2 py-1 text-xs font-semibold ${STATUS_COLORS[ticket.status] ?? ""}`}
					>
						{statusLabel(ticket.status)}
					</span>
				</div>
			</div>

			{/* Original description */}
			<div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-300">
				{ticket.description}
			</div>

			{/* Messages thread */}
			{ticket.messages.length > 0 && (
				<div className="space-y-3">
					{ticket.messages.map((msg) => (
						<div
							key={msg.id}
							className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
						>
							<div className="mb-1 flex items-center justify-between text-xs text-gray-400">
								<span className="font-medium text-gray-600 dark:text-gray-300">
									{msg.user.name ?? "—"}
								</span>
								<span>{new Date(msg.createdAt).toLocaleString()}</span>
							</div>
							<p className="text-sm text-gray-700 dark:text-gray-300">
								{msg.content}
							</p>
						</div>
					))}
				</div>
			)}

			{/* Reply box */}
			<div className="space-y-2">
				<textarea
					value={replyText}
					onChange={(e) => setReplyText(e.target.value)}
					placeholder={t.admin.replyPlaceholder}
					rows={3}
					className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
				/>
				<div className="flex items-center justify-between gap-3">
					{/* Status changer */}
					<div className="flex flex-wrap gap-2">
						<span className="self-center text-xs text-gray-400">
							{t.admin.markAs}:
						</span>
						{STATUS_OPTIONS.filter((s) => s !== ticket.status).map((s) => (
							<button
								key={s}
								type="button"
								disabled={updateStatus.isPending}
								onClick={() => updateStatus.mutate({ ticketId, status: s })}
								className={`rounded px-2 py-0.5 text-xs font-medium disabled:opacity-40 ${STATUS_COLORS[s] ?? ""}`}
							>
								{statusLabel(s)}
							</button>
						))}
					</div>

					<button
						type="button"
						disabled={reply.isPending || !replyText.trim()}
						onClick={() =>
							reply.mutate({ ticketId, content: replyText.trim() })
						}
						className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
					>
						{reply.isPending ? t.admin.sending : t.admin.send}
					</button>
				</div>
			</div>
		</div>
	);
}
