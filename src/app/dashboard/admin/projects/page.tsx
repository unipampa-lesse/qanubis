"use client";

import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

export default function AdminProjectsPage() {
	const t = useTranslation();
	const { data: projects, isLoading } = trpc.admin.listProjects.useQuery();

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
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
						{(projects ?? []).map((project) => (
							<tr
								key={project.id}
								className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
							>
								<td className="px-5 py-3">
									<div className="flex items-center gap-2">
										<span
											className="h-3 w-3 flex-shrink-0 rounded-full"
											style={{ backgroundColor: project.color }}
										/>
										<span className="font-medium text-gray-800 dark:text-white/90">
											{project.name}
										</span>
									</div>
									<div className="mt-0.5 pl-5 text-xs text-gray-400">
										{new Date(project.createdAt).toLocaleDateString()}
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
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
