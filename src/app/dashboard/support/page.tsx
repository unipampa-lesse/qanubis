"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlinePlus } from "react-icons/hi2";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const STATUS_COLORS: Record<string, string> = {
	OPEN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	IN_PROGRESS:
		"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
	RESOLVED:
		"bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300",
	CLOSED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const SELECT_CLASS =
	"h-9 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export default function SupportPage() {
	const t = useTranslation();
	const { locale } = useLanguage();
	const router = useRouter();
	const utils = trpc.useUtils();

	const { data: tickets, isLoading } = trpc.support.listMyTickets.useQuery();

	const [showForm, setShowForm] = useState(false);
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"" | TicketStatus>("");

	const createTicket = trpc.support.createTicket.useMutation({
		onSuccess: (data) => {
			utils.support.listMyTickets.invalidate();
			router.push(`/dashboard/support/${data.id}`);
		},
		onError: (err) => setFormError(err.message),
	});

	const filtered = useMemo(() => {
		if (!tickets) return [];
		const q = search.trim().toLowerCase();
		return tickets.filter((tk) => {
			const matchSearch = !q || tk.subject.toLowerCase().includes(q);
			const matchStatus = !statusFilter || tk.status === statusFilter;
			return matchSearch && matchStatus;
		});
	}, [tickets, search, statusFilter]);

	function statusLabel(status: string) {
		const map: Record<string, string> = {
			OPEN: t.support.statusOpen,
			IN_PROGRESS: t.support.statusInProgress,
			RESOLVED: t.support.statusResolved,
			CLOSED: t.support.statusClosed,
		};
		return map[status] ?? status;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
					{t.support.title}
				</h1>
				<button
					type="button"
					onClick={() => setShowForm((v) => !v)}
					className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
				>
					<HiOutlinePlus className="h-4 w-4" />
					{t.support.newTicket}
				</button>
			</div>

			{/* New ticket form */}
			{showForm && (
				<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-transparent">
					<h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
						{t.support.newTicket}
					</h2>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setFormError(null);
							createTicket.mutate({
								subject: subject.trim(),
								message: message.trim(),
							});
						}}
						className="space-y-4"
					>
						<div>
							<label
								htmlFor="ticket-subject"
								className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								{t.support.subject}
							</label>
							<input
								id="ticket-subject"
								type="text"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								placeholder={t.support.subjectPlaceholder}
								maxLength={200}
								required
								className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
							/>
						</div>
						<div>
							<label
								htmlFor="ticket-message"
								className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								{t.support.message}
							</label>
							<textarea
								id="ticket-message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder={t.support.messagePlaceholder}
								maxLength={5000}
								rows={5}
								required
								className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
							/>
						</div>
						{formError && <p className="text-sm text-error-500">{formError}</p>}
						<div className="flex justify-end gap-3">
							<button
								type="button"
								onClick={() => setShowForm(false)}
								className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
							>
								{t.common.cancel}
							</button>
							<button
								type="submit"
								disabled={
									createTicket.isPending || !subject.trim() || !message.trim()
								}
								className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
							>
								{createTicket.isPending
									? t.support.submitting
									: t.support.submit}
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Ticket list */}
			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3].map((k) => (
						<div
							key={k}
							className="h-14 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
						/>
					))}
				</div>
			) : !tickets || tickets.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
					{t.support.noTickets}
				</div>
			) : (
				<>
					{/* Search + filter — only shown when there are tickets */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder={t.support.searchPlaceholder}
								className="h-9 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
							/>
						</div>
						<div className="relative">
							<select
								value={statusFilter}
								onChange={(e) =>
									setStatusFilter(e.target.value as "" | TicketStatus)
								}
								className={SELECT_CLASS}
							>
								<option value="">{t.support.filterAllStatuses}</option>
								<option value="OPEN">{t.support.statusOpen}</option>
								<option value="IN_PROGRESS">{t.support.statusInProgress}</option>
								<option value="RESOLVED">{t.support.statusResolved}</option>
								<option value="CLOSED">{t.support.statusClosed}</option>
							</select>
						</div>
					</div>

					{filtered.length === 0 ? (
						<div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
							{t.support.noResults}
						</div>
					) : (
						<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
							<table className="w-full text-sm">
								<thead className="bg-gray-50 dark:bg-gray-800/50">
									<tr>
										<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
											{t.support.subject}
										</th>
										<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
											{t.admin.ticketStatus}
										</th>
										<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 md:table-cell">
											{t.admin.lastActivity}
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
									{filtered.map((ticket) => (
										<tr
											key={ticket.id}
											className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
										>
											<td className="px-5 py-3">
												<Link
													href={`/dashboard/support/${ticket.id}`}
													className="font-medium text-gray-800 hover:underline dark:text-white/90"
												>
													{ticket.subject}
												</Link>
												<div className="text-xs text-gray-400">
													{ticket._count.messages} {t.support.messages}
												</div>
											</td>
											<td className="px-5 py-3">
												<span
													className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[ticket.status] ?? ""}`}
												>
													{statusLabel(ticket.status)}
												</span>
											</td>
											<td className="hidden px-5 py-3 text-xs text-gray-400 md:table-cell">
												{new Date(ticket.updatedAt).toLocaleDateString(locale)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</>
			)}
		</div>
	);
}
