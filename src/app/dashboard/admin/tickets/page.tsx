"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
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

export default function AdminTicketsPage() {
	const t = useTranslation();
	const { locale } = useLanguage();
	const { data: tickets, isLoading } = trpc.admin.listTickets.useQuery();

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"" | TicketStatus>("");

	const filtered = useMemo(() => {
		if (!tickets) return [];
		const q = search.trim().toLowerCase();
		return tickets.filter((tk) => {
			const matchSearch =
				!q ||
				tk.subject.toLowerCase().includes(q) ||
				(tk.user.name ?? "").toLowerCase().includes(q) ||
				tk.user.email.toLowerCase().includes(q);
			const matchStatus = !statusFilter || tk.status === statusFilter;
			return matchSearch && matchStatus;
		});
	}, [tickets, search, statusFilter]);

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
				{[1, 2, 3].map((k) => (
					<div
						key={k}
						className="h-14 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
				{t.admin.tickets}
			</h1>

			{/* Filters */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t.admin.searchTickets}
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
						<option value="">{t.admin.filterAllStatuses}</option>
						<option value="OPEN">{t.admin.statusOpen}</option>
						<option value="IN_PROGRESS">{t.admin.statusInProgress}</option>
						<option value="RESOLVED">{t.admin.statusResolved}</option>
						<option value="CLOSED">{t.admin.statusClosed}</option>
					</select>
				</div>
			</div>

			{filtered.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
					{tickets && tickets.length > 0
						? t.admin.noResults
						: t.admin.noTickets}
				</div>
			) : (
				<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 dark:bg-gray-800/50">
							<tr>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.admin.subject}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
									{t.admin.openedBy}
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
											href={`/dashboard/admin/tickets/${ticket.id}`}
											className="font-medium text-gray-800 hover:underline dark:text-white/90"
										>
											{ticket.subject}
										</Link>
										<div className="text-xs text-gray-400">
											{ticket._count.messages} {t.admin.messages}
										</div>
									</td>
									<td className="hidden px-5 py-3 text-gray-500 dark:text-gray-400 sm:table-cell">
										<div>{ticket.user.name ?? "—"}</div>
										<div className="text-xs">{ticket.user.email}</div>
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
		</div>
	);
}
