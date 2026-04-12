"use client";

import type { ProjectRole } from "@prisma/client";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

interface ProjectCardProps {
	id: string;
	name: string;
	description?: string | null;
	color: string;
	role: ProjectRole;
	memberCount: number;
	documentCount: number;
	updatedAt: Date;
}

export default function ProjectCard({
	id,
	name,
	description,
	color,
	role,
	memberCount,
	documentCount,
	updatedAt,
}: ProjectCardProps) {
	const t = useTranslation();

	const roleColorClass: Record<ProjectRole, string> = {
		OWNER: "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
		COLLABORATOR:
			"bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-300",
		VIEWER: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
	};

	const updatedLabel = new Intl.RelativeTimeFormat(
		typeof window !== "undefined"
			? navigator.language
			: "en",
		{ numeric: "auto" },
	).format(
		Math.round((updatedAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
		"day",
	);

	return (
		<Link
			href={`/dashboard/projects/${id}`}
			className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-lg dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-700"
		>
			{/* Color bar + name */}
			<div className="flex items-start gap-3">
				<span
					className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full"
					style={{ backgroundColor: color }}
				/>
				<div className="min-w-0 flex-1">
					<h3 className="truncate text-base font-semibold text-gray-800 group-hover:text-brand-600 dark:text-white/90 dark:group-hover:text-brand-400">
						{name}
					</h3>
					{description && (
						<p className="mt-0.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
							{description}
						</p>
					)}
				</div>
				<span
					className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${roleColorClass[role]}`}
				>
					{t.roles[role]}
				</span>
			</div>

			{/* Stats footer */}
			<div className="mt-4 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
				<span>
					<span className="font-medium text-gray-600 dark:text-gray-300">
						{memberCount}
					</span>{" "}
					{memberCount === 1
						? t.dashboard.memberSingular
						: t.dashboard.memberPlural}
				</span>
				<span>
					<span className="font-medium text-gray-600 dark:text-gray-300">
						{documentCount}
					</span>{" "}
					{documentCount === 1
						? t.dashboard.documentSingular
						: t.dashboard.documentPlural}
				</span>
				<span className="ml-auto">
					{t.dashboard.updatedPrefix} {updatedLabel}
				</span>
			</div>
		</Link>
	);
}
