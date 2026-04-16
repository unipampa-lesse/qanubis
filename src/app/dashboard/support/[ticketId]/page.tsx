"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const STATUS_COLORS: Record<string, string> = {
	OPEN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	IN_PROGRESS:
		"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
	RESOLVED:
		"bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300",
	CLOSED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function SupportTicketPage() {
	const { ticketId } = useParams<{ ticketId: string }>();
	const t = useTranslation();
	const utils = trpc.useUtils();

	const { data: ticket, isLoading } = trpc.support.getMyTicket.useQuery({
		ticketId,
	});

	const [draft, setDraft] = useState("");
	const [replyError, setReplyError] = useState<string | null>(null);

	const reply = trpc.support.replyToMyTicket.useMutation({
		onSuccess: () => {
			utils.support.getMyTicket.invalidate({ ticketId });
			utils.support.listMyTickets.invalidate();
			setDraft("");
			setReplyError(null);
		},
		onError: (err) => setReplyError(err.message),
	});

	function statusLabel(status: string) {
		const map: Record<string, string> = {
			OPEN: t.support.statusOpen,
			IN_PROGRESS: t.support.statusInProgress,
			RESOLVED: t.support.statusResolved,
			CLOSED: t.support.statusClosed,
		};
		return map[status] ?? status;
	}

	if (isLoading) {
		return (
			<div className="max-w-2xl space-y-4">
				<div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
				<div className="h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
			</div>
		);
	}

	if (!ticket) {
		return <p className="text-sm text-gray-500">{t.support.ticketNotFound}</p>;
	}

	const isClosed = ticket.status === "CLOSED";

	return (
		<div className="max-w-2xl space-y-6">
			<div className="flex items-center gap-3">
				<Link
					href="/dashboard/support"
					className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					<HiOutlineArrowLeft className="h-4 w-4" />
					{t.support.backToTickets}
				</Link>
			</div>

			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
						{ticket.subject}
					</h1>
					<p className="mt-0.5 text-xs text-gray-400">
						{new Date(ticket.createdAt).toLocaleString()}
					</p>
				</div>
				<span
					className={`flex-shrink-0 rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[ticket.status] ?? ""}`}
				>
					{statusLabel(ticket.status)}
				</span>
			</div>

			{/* Original description */}
			<div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-300">
				<p className="whitespace-pre-wrap">{ticket.description}</p>
			</div>

			{/* Reply messages */}
			{ticket.messages.length > 0 && (
				<div className="space-y-3">
					{ticket.messages.map((msg) => {
						const isAdmin = msg.user.role === "ADMIN";
						return (
							<div
								key={msg.id}
								className={`rounded-xl border p-4 ${
									isAdmin
										? "border-brand-200 bg-brand-50 dark:border-brand-800/50 dark:bg-brand-900/10"
										: "border-gray-200 bg-white dark:border-gray-800 dark:bg-transparent"
								}`}
							>
								<div className="mb-2 flex items-center justify-between gap-2">
									<span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
										{isAdmin
											? t.support.supportAgent
											: (msg.user.name ?? t.support.you)}
									</span>
									<span className="text-xs text-gray-400">
										{new Date(msg.createdAt).toLocaleString()}
									</span>
								</div>
								<p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
									{msg.content}
								</p>
							</div>
						);
					})}
				</div>
			)}

			{/* Reply form */}
			{isClosed ? (
				<p className="text-sm text-gray-400">{t.support.ticketClosed}</p>
			) : (
				<div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-transparent">
					<h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
						{t.support.reply}
					</h2>
					<textarea
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						placeholder={t.support.replyPlaceholder}
						rows={4}
						maxLength={5000}
						className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
					/>
					{replyError && (
						<p className="mt-2 text-sm text-error-500">{replyError}</p>
					)}
					<div className="mt-3 flex justify-end">
						<button
							type="button"
							disabled={reply.isPending || !draft.trim()}
							onClick={() => reply.mutate({ ticketId, message: draft.trim() })}
							className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
						>
							{reply.isPending ? t.support.sending : t.support.send}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
