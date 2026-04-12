"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectCard from "@/components/projects/ProjectCard";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c"] as const;

export default function DashboardPage() {
	const router = useRouter();
	const t = useTranslation();
	const [showCreate, setShowCreate] = useState(false);

	const { data: projects, isLoading } = trpc.project.list.useQuery();

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
			) : projects && projects.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{projects.map((p) => (
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
		</div>
	);
}
