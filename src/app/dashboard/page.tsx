"use client";

import type { ProjectRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlinePlus } from "react-icons/hi2";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectCard from "@/components/projects/ProjectCard";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c"] as const;

const SELECT_CLASS =
	"h-9 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

export default function DashboardPage() {
	const router = useRouter();
	const t = useTranslation();
	const [showCreate, setShowCreate] = useState(false);
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<ProjectRole | "">("");
	const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

	const projectsQuery = trpc.project.list.useInfiniteQuery(
		{ limit: 24 },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined },
	);

	const projects = useMemo(
		() => projectsQuery.data?.pages.flatMap((page) => page.items) ?? [],
		[projectsQuery.data],
	);

	const filtered = useMemo(() => {
		if (!projects.length) return [];

		const q = search.trim().toLowerCase();

		let result = projects.filter((p) => {
			const matchesSearch =
				!q ||
				p.name.toLowerCase().includes(q) ||
				(p.description ?? "").toLowerCase().includes(q);
			const matchesRole = !roleFilter || p.role === roleFilter;
			return matchesSearch && matchesRole;
		});

		if (sortOrder === "oldest") {
			result = [...result].reverse();
		}

		return result;
	}, [projects, search, roleFilter, sortOrder]);

	const hasProjects = projects.length > 0;
	const hasResults = filtered.length > 0;
	const isLoading = projectsQuery.isLoading;

	return (
		<div>
			{/* Page header */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
						{t.dashboard.title}
					</h1>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						{t.dashboard.subtitle}
					</p>
				</div>
				<Button
					size="sm"
					startIcon={<HiOutlinePlus className="h-4 w-4" />}
					onClick={() => setShowCreate(true)}
				>
					{t.dashboard.newProject}
				</Button>
			</div>

			{/* Search and filters */}
			{!isLoading && hasProjects && (
				<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={t.dashboard.searchPlaceholder}
							className="h-9 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
						/>
					</div>

					<div className="relative">
						<select
							value={roleFilter}
							onChange={(e) =>
								setRoleFilter(e.target.value as ProjectRole | "")
							}
							className={SELECT_CLASS}
						>
							<option value="">{t.dashboard.roleAll}</option>
							<option value="OWNER">{t.roles.OWNER}</option>
							<option value="COLLABORATOR">{t.roles.COLLABORATOR}</option>
							<option value="VIEWER">{t.roles.VIEWER}</option>
						</select>
					</div>

					<div className="relative">
						<select
							value={sortOrder}
							onChange={(e) =>
								setSortOrder(e.target.value as "newest" | "oldest")
							}
							className={SELECT_CLASS}
						>
							<option value="newest">{t.dashboard.sortNewest}</option>
							<option value="oldest">{t.dashboard.sortOldest}</option>
						</select>
					</div>
				</div>
			)}

			{/* Project grid */}
			{isLoading ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{SKELETON_KEYS.map((k) => (
						<div
							key={k}
							className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
						/>
					))}
				</div>
			) : !hasProjects ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						{t.dashboard.noProjects}
					</p>
					<Button
						size="sm"
						startIcon={<HiOutlinePlus className="h-4 w-4" />}
						onClick={() => setShowCreate(true)}
					>
						{t.dashboard.newProject}
					</Button>
				</div>
			) : hasResults ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{filtered.map((p) => (
						<ProjectCard
							key={p.id}
							id={p.id}
							name={p.name}
							description={p.description}
							color={p.color}
							role={p.role}
							memberCount={p._count.members}
							documentCount={p._count.documents}
							updatedAt={p.updatedAt}
						/>
					))}
				</div>
			) : (
				<div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{t.dashboard.noResults}
					</p>
				</div>
			)}

			{showCreate && (
				<CreateProjectModal
					onClose={() => setShowCreate(false)}
					onCreated={(id) => {
						setShowCreate(false);
						router.push(`/dashboard/projects/${id}`);
					}}
				/>
			)}

			{projectsQuery.hasNextPage && (
				<div className="mt-5 flex justify-center">
					<Button
						size="sm"
						variant="outline"
						disabled={projectsQuery.isFetchingNextPage}
						onClick={() => projectsQuery.fetchNextPage()}
					>
						{projectsQuery.isFetchingNextPage
							? t.audit.loadingMore
							: t.audit.loadMore}
					</Button>
				</div>
			)}
		</div>
	);
}
