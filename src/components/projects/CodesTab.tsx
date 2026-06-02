"use client";

import type { ProjectRole } from "@prisma/client";
import { useRef, useState } from "react";
import {
	HiOutlineChatBubbleLeftEllipsis,
	HiOutlineChevronDown,
	HiOutlineChevronRight,
	HiOutlinePencil,
	HiOutlinePlus,
	HiOutlineTag,
	HiOutlineTrash,
	HiOutlineXMark,
} from "react-icons/hi2";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CodeFlat {
	id: string;
	name: string;
	color: string;
	textColor: string;
	description: string | null;
	parentId: string | null;
	_count: { quoteCodes: number; children: number; comments: number };
}

interface CodeTreeNode extends CodeFlat {
	children: CodeTreeNode[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildTree(codes: CodeFlat[]): CodeTreeNode[] {
	const map = new Map<string, CodeTreeNode>();
	for (const c of codes) map.set(c.id, { ...c, children: [] });
	const roots: CodeTreeNode[] = [];
	for (const node of map.values()) {
		if (node.parentId) {
			map.get(node.parentId)?.children.push(node);
		} else {
			roots.push(node);
		}
	}
	return roots;
}

function contrastColor(hex: string): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return r * 0.299 + g * 0.587 + b * 0.114 > 128 ? "#000000" : "#ffffff";
}

// ---------------------------------------------------------------------------
// Code form (create / edit)
// ---------------------------------------------------------------------------

interface CodeFormProps {
	projectId: string;
	mode: "create" | "edit";
	initialData?: {
		id: string;
		name: string;
		color: string;
		textColor: string;
		description: string | null;
	};
	parentId?: string | null;
	onClose: () => void;
}

function CodeForm({
	projectId,
	mode,
	initialData,
	parentId,
	onClose,
}: CodeFormProps) {
	const t = useTranslation();
	const utils = trpc.useUtils();

	const [name, setName] = useState(initialData?.name ?? "");
	const [color, setColor] = useState(initialData?.color ?? "#6366f1");
	const [textColor, setTextColor] = useState(
		initialData?.textColor ?? "#ffffff",
	);
	const [description, setDescription] = useState(
		initialData?.description ?? "",
	);

	const create = trpc.code.create.useMutation({
		onSuccess: () => {
			utils.code.list.invalidate({ projectId });
			utils.project.get.invalidate({ projectId });
			onClose();
		},
	});

	const update = trpc.code.update.useMutation({
		onSuccess: () => {
			utils.code.list.invalidate({ projectId });
			onClose();
		},
	});

	const isPending = create.isPending || update.isPending;

	function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		if (mode === "create") {
			create.mutate({
				projectId,
				name: name.trim(),
				color,
				textColor,
				description: description.trim() || undefined,
				parentId: parentId ?? null,
			});
		} else if (initialData) {
			update.mutate({
				projectId,
				codeId: initialData.id,
				name: name.trim(),
				color,
				textColor,
				description: description.trim() || null,
			});
		}
	}

	const inputClass =
		"h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30";

	const labelClass =
		"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400";

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
		>
			<h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
				{mode === "create" ? t.codes.createCode : t.codes.editCode}
			</h3>

			<div className="space-y-4">
				{/* Name */}
				<div>
					<label htmlFor="code-name" className={labelClass}>
						{t.codes.codeName}
					</label>
					<input
						id="code-name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={t.codes.codeNamePlaceholder}
						required
						className={inputClass}
					/>
				</div>

				{/* Colors row */}
				<div className="flex gap-4">
					<div className="flex-1">
						<label htmlFor="code-bg-color" className={labelClass}>
							{t.codes.backgroundColor}
						</label>
						<div className="flex items-center gap-2">
							<input
								id="code-bg-color"
								type="color"
								value={color}
								onChange={(e) => {
									setColor(e.target.value);
									setTextColor(contrastColor(e.target.value));
								}}
								className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 bg-transparent p-1 dark:border-gray-700"
							/>
							{/* Preview badge */}
							<span
								className="rounded-full px-3 py-1 text-xs font-medium"
								style={{ backgroundColor: color, color: textColor }}
							>
								{name || t.codes.codeNamePlaceholder}
							</span>
						</div>
					</div>
					<div>
						<label htmlFor="code-text-color" className={labelClass}>
							{t.codes.textColor}
						</label>
						<input
							id="code-text-color"
							type="color"
							value={textColor}
							onChange={(e) => setTextColor(e.target.value)}
							className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 bg-transparent p-1 dark:border-gray-700"
						/>
					</div>
				</div>

				{/* Description */}
				<div>
					<label htmlFor="code-description" className={labelClass}>
						{t.codes.description}
					</label>
					<textarea
						id="code-description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder={t.codes.descriptionPlaceholder}
						rows={2}
						className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
					/>
				</div>
			</div>

			<div className="mt-4 flex justify-end gap-2">
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={onClose}
					disabled={isPending}
				>
					{t.common.cancel}
				</Button>
				<Button type="submit" size="sm" disabled={isPending || !name.trim()}>
					{isPending
						? mode === "create"
							? t.codes.creating
							: t.codes.saving
						: mode === "create"
							? t.codes.createCode
							: t.common.save}
				</Button>
			</div>
		</form>
	);
}

// ---------------------------------------------------------------------------
// Delete confirmation panel
// ---------------------------------------------------------------------------

interface DeleteConfirmProps {
	code: CodeFlat;
	projectId: string;
	onClose: () => void;
}

function DeleteConfirm({ code, projectId, onClose }: DeleteConfirmProps) {
	const t = useTranslation();
	const utils = trpc.useUtils();

	const del = trpc.code.delete.useMutation({
		onSuccess: () => {
			utils.code.list.invalidate({ projectId });
			utils.project.get.invalidate({ projectId });
			onClose();
		},
	});

	return (
		<div className="rounded-2xl border border-error-200 bg-error-50 p-4 dark:border-error-500/30 dark:bg-error-500/10">
			<p className="mb-1 text-sm font-semibold text-error-700 dark:text-error-400">
				{t.codes.deleteConfirmLine1}
			</p>
			{code._count.quoteCodes > 0 && (
				<p className="text-xs text-error-600 dark:text-error-400">
					{t.codes.deleteUsedIn} {code._count.quoteCodes}{" "}
					{t.codes.deleteUsedInSuffix}
				</p>
			)}
			{code._count.children > 0 && (
				<p className="text-xs text-error-600 dark:text-error-400">
					{t.codes.deleteHasChildren} {code._count.children}{" "}
					{t.codes.deleteHasChildrenSuffix}
				</p>
			)}
			<div className="mt-3 flex gap-2">
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={onClose}
					disabled={del.isPending}
				>
					{t.common.cancel}
				</Button>
				<button
					type="button"
					onClick={() => del.mutate({ projectId, codeId: code.id })}
					disabled={del.isPending}
					className="rounded-lg bg-error-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-error-600 disabled:opacity-50"
				>
					{del.isPending ? "…" : t.codes.deleteCode}
				</button>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Code comments panel
// ---------------------------------------------------------------------------

interface CodeCommentsProps {
	codeId: string;
	projectId: string;
	canComment: boolean;
	onClose: () => void;
}

function CodeComments({
	codeId,
	projectId,
	canComment,
	onClose,
}: CodeCommentsProps) {
	const t = useTranslation();
	const utils = trpc.useUtils();
	const [draft, setDraft] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const { data: comments, isLoading } = trpc.code.listComments.useQuery({
		projectId,
		codeId,
	});

	const add = trpc.code.addComment.useMutation({
		onSuccess: () => {
			utils.code.listComments.invalidate({ projectId, codeId });
			utils.code.list.invalidate({ projectId });
			setDraft("");
		},
	});

	const del = trpc.code.deleteComment.useMutation({
		onSuccess: () => {
			utils.code.listComments.invalidate({ projectId, codeId });
			utils.code.list.invalidate({ projectId });
		},
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const content = draft.trim();
		if (!content) return;
		add.mutate({ projectId, codeId, content });
	}

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
			<div className="mb-3 flex items-center justify-between">
				<span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
					{t.codes.viewComments}
				</span>
				<button
					type="button"
					onClick={onClose}
					className="rounded p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				>
					<HiOutlineXMark className="h-4 w-4" />
				</button>
			</div>

			{/* Comment list */}
			<div className="mb-3 space-y-2">
				{isLoading && (
					<div className="h-8 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
				)}
				{!isLoading && comments?.length === 0 && (
					<p className="text-xs text-gray-400">{t.codes.noComments}</p>
				)}
				{comments?.map((c) => (
					<div key={c.id} className="group flex gap-2">
						<div className="flex-1 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
							<div className="mb-0.5 flex items-center gap-2">
								<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
									{c.user.name ?? "—"}
								</span>
								<span className="text-xs text-gray-400">
									{new Date(c.createdAt).toLocaleDateString()}
								</span>
							</div>
							<p className="whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-300">
								{c.content}
							</p>
						</div>
						{canComment && (
							<button
								type="button"
								onClick={() => del.mutate({ projectId, commentId: c.id })}
								disabled={del.isPending}
								className="self-start rounded p-1 text-gray-300 opacity-0 transition-opacity hover:text-error-500 group-hover:opacity-100 dark:text-gray-600 dark:hover:text-error-400"
							>
								<HiOutlineTrash className="h-3.5 w-3.5" />
							</button>
						)}
					</div>
				))}
			</div>

			{/* Add comment */}
			{canComment && (
				<form onSubmit={handleSubmit} className="flex gap-2">
					<textarea
						ref={textareaRef}
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(e as unknown as React.FormEvent);
							}
						}}
						placeholder={t.codes.addComment}
						rows={2}
						className="flex-1 resize-none rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
					/>
					<Button
						type="submit"
						size="sm"
						disabled={!draft.trim() || add.isPending}
					>
						{t.codes.submitComment}
					</Button>
				</form>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Single tree node (recursive)
// ---------------------------------------------------------------------------

interface CodeNodeProps {
	node: CodeTreeNode;
	projectId: string;
	canEdit: boolean;
	depth: number;
}

function CodeNode({ node, projectId, canEdit, depth }: CodeNodeProps) {
	const t = useTranslation();
	const [expanded, setExpanded] = useState(true);
	const [action, setAction] = useState<
		"addChild" | "edit" | "delete" | "comments" | null
	>(null);

	const hasChildren = node.children.length > 0;
	const indentStyle = { paddingLeft: `${depth * 24}px` };

	function closeAction() {
		setAction(null);
	}

	return (
		<div>
			{/* Node row */}
			<div
				className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
				style={indentStyle}
			>
				{/* Expand/collapse toggle */}
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600 ${
						hasChildren ? "visible" : "invisible"
					}`}
				>
					{expanded ? (
						<HiOutlineChevronDown className="h-4 w-4" />
					) : (
						<HiOutlineChevronRight className="h-4 w-4" />
					)}
				</button>

				{/* Color chip */}
				<span
					className="h-5 w-5 flex-shrink-0 rounded-full border border-black/10 dark:border-white/10"
					style={{ backgroundColor: node.color }}
				/>

				{/* Name + quote count */}
				<span className="flex-1 truncate text-sm font-medium text-gray-800 dark:text-white/90">
					{node.name}
				</span>
				{node._count.quoteCodes > 0 && (
					<span
						className="rounded-full px-2 py-0.5 text-xs font-medium"
						style={{ backgroundColor: node.color, color: node.textColor }}
					>
						{node._count.quoteCodes}{" "}
						{node._count.quoteCodes === 1
							? t.codes.quoteSingular
							: t.codes.quotePlural}
					</span>
				)}

				{/* Comments badge — always visible if there are comments */}
				{node._count.comments > 0 && action !== "comments" && (
					<button
						type="button"
						onClick={() => setAction("comments")}
						className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<HiOutlineChatBubbleLeftEllipsis className="h-3.5 w-3.5" />
						{node._count.comments}
					</button>
				)}

				{/* Action buttons — visible on hover when canEdit */}
				{canEdit && (
					<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
						<button
							type="button"
							title={t.codes.viewComments}
							onClick={() =>
								setAction((a) => (a === "comments" ? null : "comments"))
							}
							className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
						>
							<HiOutlineChatBubbleLeftEllipsis className="h-3.5 w-3.5" />
						</button>
						<button
							type="button"
							title={t.codes.addSubCode}
							onClick={() =>
								setAction((a) => (a === "addChild" ? null : "addChild"))
							}
							className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
						>
							<HiOutlinePlus className="h-3.5 w-3.5" />
						</button>
						<button
							type="button"
							title={t.codes.editCode}
							onClick={() => setAction((a) => (a === "edit" ? null : "edit"))}
							className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
						>
							<HiOutlinePencil className="h-3.5 w-3.5" />
						</button>
						<button
							type="button"
							title={t.codes.deleteCode}
							onClick={() =>
								setAction((a) => (a === "delete" ? null : "delete"))
							}
							className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-error-600 dark:hover:bg-error-500/20 dark:hover:text-error-400"
						>
							<HiOutlineTrash className="h-3.5 w-3.5" />
						</button>
					</div>
				)}
			</div>

			{/* Inline action panels */}
			{action === "addChild" && (
				<div
					style={{ paddingLeft: `${(depth + 1) * 24 + 12}px` }}
					className="mb-2 pr-3"
				>
					<CodeForm
						projectId={projectId}
						mode="create"
						parentId={node.id}
						onClose={closeAction}
					/>
				</div>
			)}
			{action === "edit" && (
				<div
					style={{ paddingLeft: `${(depth + 1) * 24 + 12}px` }}
					className="mb-2 pr-3"
				>
					<CodeForm
						projectId={projectId}
						mode="edit"
						initialData={node}
						onClose={closeAction}
					/>
				</div>
			)}
			{action === "delete" && (
				<div
					style={{ paddingLeft: `${(depth + 1) * 24 + 12}px` }}
					className="mb-2 pr-3"
				>
					<DeleteConfirm
						code={node}
						projectId={projectId}
						onClose={closeAction}
					/>
				</div>
			)}
			{action === "comments" && (
				<div
					style={{ paddingLeft: `${(depth + 1) * 24 + 12}px` }}
					className="mb-2 pr-3"
				>
					<CodeComments
						codeId={node.id}
						projectId={projectId}
						canComment={canEdit}
						onClose={closeAction}
					/>
				</div>
			)}

			{/* Children */}
			{expanded && node.children.length > 0 && (
				<div>
					{node.children.map((child) => (
						<CodeNode
							key={child.id}
							node={child}
							projectId={projectId}
							canEdit={canEdit}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Main CodesTab
// ---------------------------------------------------------------------------

interface CodesTabProps {
	projectId: string;
	currentRole: ProjectRole;
}

export default function CodesTab({ projectId, currentRole }: CodesTabProps) {
	const t = useTranslation();
	const canEdit = currentRole === "OWNER" || currentRole === "COLLABORATOR";
	const [showCreateForm, setShowCreateForm] = useState(false);

	const codesQuery = trpc.code.list.useInfiniteQuery(
		{ projectId, limit: 100 },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined },
	);
	const codes = codesQuery.data?.pages.flatMap((page) => page.items) ?? [];
	const tree = buildTree(codes);
	const isLoading = codesQuery.isLoading;

	if (isLoading) {
		return (
			<div className="space-y-2">
				{(["sk-a", "sk-b", "sk-c"] as const).map((k) => (
					<div
						key={k}
						className="h-10 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Top action bar */}
			{canEdit && (
				<div>
					<Button
						size="sm"
						variant="outline"
						startIcon={<HiOutlinePlus className="h-4 w-4" />}
						onClick={() => setShowCreateForm((v) => !v)}
					>
						{t.codes.newCode}
					</Button>
				</div>
			)}

			{/* Create root code form */}
			{showCreateForm && (
				<CodeForm
					projectId={projectId}
					mode="create"
					parentId={null}
					onClose={() => setShowCreateForm(false)}
				/>
			)}

			{/* Tree or empty state */}
			{tree.length > 0 ? (
				<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 dark:border-gray-800 dark:bg-white/[0.02]">
					{tree.map((node) => (
						<CodeNode
							key={node.id}
							node={node}
							projectId={projectId}
							canEdit={canEdit}
							depth={0}
						/>
					))}
				</div>
			) : (
				!showCreateForm && (
					<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
						<HiOutlineTag className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t.codes.noCodes}
							{canEdit && ` ${t.codes.noCodesHint}`}
						</p>
						{canEdit && (
							<Button
								size="sm"
								variant="outline"
								className="mt-4"
								startIcon={<HiOutlinePlus className="h-4 w-4" />}
								onClick={() => setShowCreateForm(true)}
							>
								{t.codes.newCode}
							</Button>
						)}
					</div>
				)
			)}

			{codesQuery.hasNextPage && (
				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => codesQuery.fetchNextPage()}
						disabled={codesQuery.isFetchingNextPage}
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
					>
						{codesQuery.isFetchingNextPage
							? t.audit.loadingMore
							: t.audit.loadMore}
					</button>
				</div>
			)}
		</div>
	);
}
