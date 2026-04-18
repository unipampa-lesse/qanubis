"use client";

import { useMemo, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineTrash } from "react-icons/hi2";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function AdminProjectsPage() {
	const t = useTranslation();
	const { locale } = useLanguage();
	const utils = trpc.useUtils();
	const { data: projects, isLoading } = trpc.admin.listProjects.useQuery();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [search, setSearch] = useState("");

	const deleteProject = trpc.admin.deleteProject.useMutation({
		onSuccess: () => {
			utils.admin.listProjects.invalidate();
			utils.admin.stats.invalidate();
			setDeletingId(null);
		},
	});

	const filtered = useMemo(() => {
		if (!projects) return [];
		const q = search.trim().toLowerCase();
		if (!q) return projects;
		return projects.filter((p) => p.name.toLowerCase().includes(q));
	}, [projects, search]);

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
				{t.admin.projects}
			</h1>

			{/* Search */}
			<div className="relative max-w-sm">
				<HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t.admin.searchProjects}
					className="h-9 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
				/>
			</div>

			{filtered.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
					{t.admin.noResults}
				</div>
			) : (
				<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 dark:bg-gray-800/50">
							<tr>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.admin.project}
								</th>
								<th className="hidden px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
									{t.admin.members}
								</th>
								<th className="hidden px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
									{t.admin.documents}
								</th>
								<th className="hidden px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400 md:table-cell">
									{t.admin.codes}
								</th>
								<th className="hidden px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400 md:table-cell">
									{t.admin.memos}
								</th>
								<th className="hidden px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400 lg:table-cell">
									{t.admin.storage}
								</th>
								<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
									{t.common.actions}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
							{filtered.map((project) => (
								<tr
									key={project.id}
									className="hover:bg-gray-50 dark:hover:bg-white/2"
								>
									<td className="px-5 py-3">
										<div className="flex items-center gap-2">
											<span
												className="h-3 w-3 shrink-0 rounded-full"
												style={{ backgroundColor: project.color }}
											/>
											<span className="font-medium text-gray-800 dark:text-white/90">
												{project.name}
											</span>
										</div>
										<div className="mt-0.5 pl-5 text-xs text-gray-400">
											{new Date(project.createdAt).toLocaleDateString(locale)}
										</div>
									</td>
									<td className="hidden px-5 py-3 text-center text-gray-500 dark:text-gray-400 sm:table-cell">
										{project._count.members}
									</td>
									<td className="hidden px-5 py-3 text-center text-gray-500 dark:text-gray-400 sm:table-cell">
										{project._count.documents}
									</td>
									<td className="hidden px-5 py-3 text-center text-gray-500 dark:text-gray-400 md:table-cell">
										{project._count.codes}
									</td>
									<td className="hidden px-5 py-3 text-center text-gray-500 dark:text-gray-400 md:table-cell">
										{project._count.memos}
									</td>
									<td className="hidden px-5 py-3 text-right text-gray-500 dark:text-gray-400 lg:table-cell">
										{formatBytes(project.storageBytes)}
									</td>
									<td className="px-5 py-3 text-right">
										{deletingId === project.id ? (
											<div className="inline-flex gap-2">
												<button
													type="button"
													onClick={() =>
														deleteProject.mutate({ projectId: project.id })
													}
													disabled={deleteProject.isPending}
													className="rounded bg-error-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-error-600 disabled:opacity-50"
												>
													{deleteProject.isPending
														? t.common.loading
														: t.common.delete}
												</button>
												<button
													type="button"
													onClick={() => setDeletingId(null)}
													className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
												>
													{t.common.cancel}
												</button>
											</div>
										) : (
											<button
												type="button"
												onClick={() => setDeletingId(project.id)}
												className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10"
											>
												<HiOutlineTrash className="h-3.5 w-3.5" />
												{t.common.delete}
											</button>
										)}
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
