"use client";

import Link from "next/link";
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

export default function AdminTicketsPage() {
	const t = useTranslation();
	const { data: tickets, isLoading } = trpc.admin.listTickets.useQuery();

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

			{!tickets || tickets.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
					{t.admin.noTickets}
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
							{tickets.map((ticket) => (
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
										{new Date(ticket.updatedAt).toLocaleDateString()}
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
