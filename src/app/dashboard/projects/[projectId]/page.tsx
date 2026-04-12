"use client";

import type { ProjectRole } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { HiOutlineDocument, HiOutlineUsers } from "react-icons/hi2";
import DocumentsTab from "@/components/projects/DocumentsTab";
import MembersTab from "@/components/projects/MembersTab";
import { trpc } from "@/server/client";

type Tab = "documents" | "members";

export default function ProjectPage() {
	const { projectId } = useParams<{ projectId: string }>();
	const router = useRouter();
	const { data: session } = useSession();
	const t = useTranslation();
	const [activeTab, setActiveTab] = useState<Tab>("documents");

	const { data: project, isLoading } = trpc.project.get.useQuery(
		{ projectId },
		{ retry: false },
	);

	const { data: members } = trpc.member.list.useQuery(
		{ projectId },
		{ enabled: !!project },
	);

	const utils = trpc.useUtils();
	const deleteProject = trpc.project.delete.useMutation({
		onSuccess: () => {
			utils.project.list.invalidate();
			router.push("/dashboard");
		},
	});

	// Derive the current user's role from the members list.
	// Falls back to COLLABORATOR (read-only UI) while the list is loading.
	const myRole: ProjectRole =
		members?.find((m) => m.user.id === session?.user?.id)?.role ??
		"COLLABORATOR";

	const TABS: {
		id: Tab;
		label: string;
		Icon: React.FC<React.SVGProps<SVGSVGElement>>;
	}[] = [
		{ id: "documents", label: t.tabs.documents, Icon: HiOutlineDocument },
		{ id: "members", label: t.tabs.members, Icon: HiOutlineUsers },
	];

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
				<div className="h-4 w-64 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
			</div>
		);
	}

	if (!project) {
		return (
			<div className="text-sm text-gray-500">{t.project.notFound}</div>
		);
	}

	return (
		<div>
			{/* Project header */}
			<div className="mb-6 flex items-start gap-4">
				<span
					className="mt-1 h-5 w-5 flex-shrink-0 rounded-full"
					style={{ backgroundColor: project.color }}
				/>
				<div className="flex-1 min-w-0">
					<h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
						{project.name}
					</h1>
					{project.description && (
						<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
							{project.description}
						</p>
					)}
					<div className="mt-2 flex gap-4 text-xs text-gray-400">
						<span>
							<span className="font-medium text-gray-600 dark:text-gray-300">
								{project._count.members}
							</span>{" "}
							{project._count.members === 1
								? t.dashboard.memberSingular
								: t.dashboard.memberPlural}
						</span>
						<span>
							<span className="font-medium text-gray-600 dark:text-gray-300">
								{project._count.documents}
							</span>{" "}
							{project._count.documents === 1
								? t.dashboard.documentSingular
								: t.dashboard.documentPlural}
						</span>
						<span>
							<span className="font-medium text-gray-600 dark:text-gray-300">
								{project._count.codes}
							</span>{" "}
							{project._count.codes === 1
								? t.dashboard.codeSingular
								: t.dashboard.codePlural}
						</span>
					</div>
				</div>
				{myRole === "OWNER" && (
					<button
						type="button"
						onClick={() => {
							if (
								window.confirm(
									`${t.project.deleteProject} "${project.name}"? ${t.project.deleteConfirm}`,
								)
							) {
								deleteProject.mutate({ projectId });
							}
						}}
						disabled={deleteProject.isPending}
						className="flex-shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-error-500 hover:bg-error-50 disabled:opacity-50 dark:hover:bg-error-500/10"
					>
						{deleteProject.isPending
							? t.project.deleting
							: t.project.deleteProject}
					</button>
				)}
			</div>

			{/* Tabs */}
			<div className="mb-6 border-b border-gray-200 dark:border-gray-800">
				<nav className="-mb-px flex gap-1">
					{TABS.map(({ id, label, Icon }) => (
						<button
							key={id}
							type="button"
							onClick={() => setActiveTab(id)}
							className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
								activeTab === id
									? "border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-400"
									: "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
							}`}
						>
							<Icon className="h-4 w-4" />
							{label}
						</button>
					))}
				</nav>
			</div>

			{/* Tab content */}
			{activeTab === "documents" && (
				<DocumentsTab projectId={projectId} currentRole={myRole} />
			)}
			{activeTab === "members" && (
				<MembersTab projectId={projectId} currentRole={myRole} />
			)}
		</div>
	);
}
