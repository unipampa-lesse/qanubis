"use client";

import type { ProjectRole } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
	HiOutlineChartBar,
	HiOutlineDocument,
	HiOutlineDocumentText,
	HiOutlinePencilSquare,
	HiOutlineTag,
	HiOutlineUsers,
} from "react-icons/hi2";
import CodesTab from "@/components/projects/CodesTab";
import DocumentsTab from "@/components/projects/DocumentsTab";
import EditProjectModal from "@/components/projects/EditProjectModal";
import MembersTab from "@/components/projects/MembersTab";
import MemosTab from "@/components/projects/MemosTab";
import ReportsTab from "@/components/projects/ReportsTab";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

type Tab = "documents" | "codes" | "memos" | "reports" | "members";

export default function ProjectPage() {
	const { projectId } = useParams<{ projectId: string }>();
	const router = useRouter();
	const { data: session } = useSession();
	const t = useTranslation();
	const [activeTab, setActiveTab] = useState<Tab>("documents");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

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
		{ id: "codes", label: t.tabs.codes, Icon: HiOutlineTag },
		{ id: "memos", label: t.tabs.memos, Icon: HiOutlineDocumentText },
		{ id: "reports", label: t.tabs.reports, Icon: HiOutlineChartBar },
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
		return <div className="text-sm text-gray-500">{t.project.notFound}</div>;
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
					<div className="flex flex-shrink-0 items-center gap-2">
						<button
							type="button"
							onClick={() => setShowEditModal(true)}
							className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
						>
							<HiOutlinePencilSquare className="h-3.5 w-3.5" />
							{t.project.editProject}
						</button>
						<button
							type="button"
							onClick={() => setShowDeleteConfirm(true)}
							disabled={deleteProject.isPending}
							className="rounded-lg px-3 py-2 text-xs font-medium text-error-500 hover:bg-error-50 disabled:opacity-50 dark:hover:bg-error-500/10"
						>
							{deleteProject.isPending
								? t.project.deleting
								: t.project.deleteProject}
						</button>
					</div>
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
			{activeTab === "codes" && (
				<CodesTab projectId={projectId} currentRole={myRole} />
			)}
			{activeTab === "memos" && (
				<MemosTab projectId={projectId} currentRole={myRole} />
			)}
			{activeTab === "reports" && (
				<ReportsTab projectId={projectId} projectName={project.name} />
			)}
			{activeTab === "members" && (
				<MembersTab projectId={projectId} currentRole={myRole} />
			)}

			<ConfirmModal
				isOpen={showDeleteConfirm}
				title={t.project.deleteProject}
				message={`"${project.name}" — ${t.project.deleteConfirm}`}
				confirmLabel={t.common.delete}
				cancelLabel={t.common.cancel}
				isPending={deleteProject.isPending}
				onConfirm={() => {
					deleteProject.mutate({ projectId });
					setShowDeleteConfirm(false);
				}}
				onCancel={() => setShowDeleteConfirm(false)}
			/>

			{showEditModal && (
				<EditProjectModal
					projectId={projectId}
					initialName={project.name}
					initialDescription={project.description ?? null}
					initialColor={project.color}
					onClose={() => setShowEditModal(false)}
				/>
			)}
		</div>
	);
}
