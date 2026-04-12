"use client";

import Link from "next/link";
import {
	HiOutlineChatBubbleLeftRight,
	HiOutlineChatBubbleOvalLeft,
	HiOutlineDocumentText,
	HiOutlineFolderOpen,
	HiOutlineUsers,
} from "react-icons/hi2";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

function StatCard({
	label,
	value,
	icon,
	href,
}: {
	label: string;
	value: number | undefined;
	icon: React.ReactNode;
	href?: string;
}) {
	const content = (
		<div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
			<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
				{icon}
			</div>
			<div>
				<div className="text-2xl font-bold text-gray-800 dark:text-white">
					{value ?? "—"}
				</div>
				<div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
			</div>
		</div>
	);

	return href ? (
		<Link href={href} className="block hover:opacity-90">
			{content}
		</Link>
	) : (
		content
	);
}

export default function AdminDashboardPage() {
	const t = useTranslation();
	const { data } = trpc.admin.stats.useQuery();

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
					{t.admin.dashboard}
				</h1>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<StatCard
					label={t.admin.totalUsers}
					value={data?.users}
					icon={<HiOutlineUsers className="h-6 w-6" />}
					href="/dashboard/admin/users"
				/>
				<StatCard
					label={t.admin.totalProjects}
					value={data?.projects}
					icon={<HiOutlineFolderOpen className="h-6 w-6" />}
					href="/dashboard/admin/projects"
				/>
				<StatCard
					label={t.admin.totalDocuments}
					value={data?.documents}
					icon={<HiOutlineDocumentText className="h-6 w-6" />}
				/>
				<StatCard
					label={t.admin.totalQuotes}
					value={data?.quotes}
					icon={<HiOutlineChatBubbleLeftRight className="h-6 w-6" />}
				/>
				<StatCard
					label={t.admin.openTickets}
					value={data?.tickets}
					icon={<HiOutlineChatBubbleOvalLeft className="h-6 w-6" />}
					href="/dashboard/admin/tickets"
				/>
			</div>
		</div>
	);
}
