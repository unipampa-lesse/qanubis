"use client";

import type { ProjectRole } from "@prisma/client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	HiOutlineDocumentText,
	HiOutlinePencilSquare,
	HiOutlineTrash,
} from "react-icons/hi2";
import Button from "@/components/ui/button/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const MemoEditor = dynamic(() => import("@/components/memos/MemoEditor"), {
	ssr: false,
	loading: () => (
		<div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800" />
	),
});

interface MemosTabProps {
	projectId: string;
	currentRole: ProjectRole;
}

function formatDate(date: Date | string, locale: string) {
	return new Date(date).toLocaleDateString(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

type SaveStatus = "idle" | "saving" | "saved";

export default function MemosTab({ projectId, currentRole }: MemosTabProps) {
	const t = useTranslation();
	const { locale } = useLanguage();
	const canEdit = currentRole === "OWNER" || currentRole === "COLLABORATOR";

	const utils = trpc.useUtils();
	const memosQuery = trpc.memo.list.useInfiniteQuery(
		{ projectId, limit: 30 },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined },
	);
	const memos = memosQuery.data?.pages.flatMap((page) => page.items) ?? [];
	const isLoading = memosQuery.isLoading;

	const createMemo = trpc.memo.create.useMutation({
		onSuccess: (newMemo) => {
			utils.memo.list.invalidate();
			selectMemo(newMemo.id);
		},
	});

	const updateMemo = trpc.memo.update.useMutation({
		onSuccess: () => {
			utils.memo.list.invalidate();
			setSaveStatus("saved");
		},
	});

	const deleteMemo = trpc.memo.delete.useMutation({
		onSuccess: () => {
			utils.memo.list.invalidate();
			selectMemo(null);
		},
	});

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
	const [nameEdit, setNameEdit] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const nameInputRef = useRef<HTMLInputElement>(null);
	const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const selectedIdRef = useRef(selectedId);
	selectedIdRef.current = selectedId;

	/** Switch selection and reset editor state in one call. */
	function selectMemo(id: string | null) {
		setSelectedId(id);
		setSaveStatus("idle");
		setNameEdit(null);
	}

	// Load full memo content when selection changes
	const { data: selectedMemo } = trpc.memo.get.useQuery(
		{ projectId, memoId: selectedId ?? "" },
		{ enabled: !!selectedId },
	);

	// Auto-select the first memo when the list loads or when selection is cleared.
	// Functional updater avoids needing selectedId in deps while still reading the current value.
	useEffect(() => {
		if (memos.length > 0) {
			setSelectedId((prev) => prev ?? memos[0].id);
		}
	}, [memos]);

	// Focus name input when entering edit mode
	const prevNameEdit = useRef<string | null>(null);
	useEffect(() => {
		if (nameEdit !== null && prevNameEdit.current === null) {
			nameInputRef.current?.focus();
			nameInputRef.current?.select();
		}
		prevNameEdit.current = nameEdit;
	}, [nameEdit]);

	const handleContentChange = useCallback(
		(content: Record<string, unknown>) => {
			const id = selectedIdRef.current;
			if (!id) return;
			setSaveStatus("saving");
			if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
			saveTimerRef.current = setTimeout(() => {
				updateMemo.mutate({ projectId, memoId: id, content });
			}, 800);
		},
		[projectId, updateMemo],
	);

	function handleNameSave() {
		if (!selectedId || nameEdit === null) return;
		const trimmed = nameEdit.trim();
		if (!trimmed) {
			setNameEdit(null);
			return;
		}
		updateMemo.mutate(
			{ projectId, memoId: selectedId, name: trimmed },
			{ onSuccess: () => setNameEdit(null) },
		);
	}

	function handleCreate() {
		createMemo.mutate({
			projectId,
			name: t.memos.untitled,
		});
	}

	function handleDelete(memoId: string) {
		setPendingDeleteId(memoId);
	}

	return (
		<>
			<ConfirmModal
				isOpen={pendingDeleteId !== null}
				title={t.memos.deleteMemo}
				message={t.memos.deleteConfirm}
				confirmLabel={t.common.delete}
				cancelLabel={t.common.cancel}
				isPending={deleteMemo.isPending}
				onConfirm={() => {
					if (pendingDeleteId) {
						deleteMemo.mutate({ projectId, memoId: pendingDeleteId });
						setPendingDeleteId(null);
					}
				}}
				onCancel={() => setPendingDeleteId(null)}
			/>
			<div className="flex gap-4" style={{ minHeight: "480px" }}>
				{/* Sidebar: memo list */}
				<div className="flex w-56 flex-shrink-0 flex-col gap-2">
					{canEdit && (
						<Button
							size="sm"
							variant="outline"
							disabled={createMemo.isPending}
							startIcon={<HiOutlinePencilSquare className="h-4 w-4" />}
							onClick={handleCreate}
						>
							{createMemo.isPending ? t.memos.creating : t.memos.newMemo}
						</Button>
					)}

					{isLoading ? (
						<div className="space-y-2">
							{(["a", "b", "c"] as const).map((k) => (
								<div
									key={k}
									className="h-12 animate-pulse rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
								/>
							))}
						</div>
					) : memos.length > 0 ? (
						<ul className="space-y-1">
							{memos.map((memo) => (
								<li key={memo.id}>
									<button
										type="button"
										onClick={() => selectMemo(memo.id)}
										className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
											selectedId === memo.id
												? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
												: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
										}`}
									>
										<div className="flex items-center gap-2">
											<HiOutlineDocumentText className="h-4 w-4 flex-shrink-0 text-gray-400" />
											<span className="truncate font-medium">{memo.name}</span>
										</div>
										<div className="mt-0.5 pl-6 text-xs text-gray-400">
											{formatDate(memo.updatedAt, locale)}
										</div>
									</button>
								</li>
							))}
						</ul>
					) : (
						<div className="rounded-xl border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{t.memos.noMemos}
								{canEdit && ` ${t.memos.noMemosHint}`}
							</p>
						</div>
					)}

					{memosQuery.hasNextPage && (
						<button
							type="button"
							onClick={() => memosQuery.fetchNextPage()}
							disabled={memosQuery.isFetchingNextPage}
							className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
						>
							{memosQuery.isFetchingNextPage
								? t.audit.loadingMore
								: t.audit.loadMore}
						</button>
					)}
				</div>

				{/* Main editor area */}
				<div className="flex flex-1 flex-col gap-3">
					{selectedMemo ? (
						<>
							{/* Memo header */}
							<div className="flex items-center gap-2">
								{canEdit && nameEdit !== null ? (
									<input
										ref={nameInputRef}
										value={nameEdit}
										onChange={(e) => setNameEdit(e.target.value)}
										onBlur={handleNameSave}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleNameSave();
											if (e.key === "Escape") setNameEdit(null);
										}}
										className="flex-1 rounded-lg border border-brand-400 bg-white px-3 py-1.5 text-lg font-bold text-gray-800 focus:outline-none dark:border-brand-500 dark:bg-gray-900 dark:text-white/90"
										maxLength={200}
									/>
								) : (
									<button
										type="button"
										disabled={!canEdit}
										onClick={() => canEdit && setNameEdit(selectedMemo.name)}
										className={`flex-1 rounded-lg px-3 py-1.5 text-left text-lg font-bold text-gray-800 dark:text-white/90 ${
											canEdit
												? "hover:bg-gray-100 dark:hover:bg-gray-800"
												: "cursor-default"
										}`}
									>
										{selectedMemo.name}
									</button>
								)}

								<div className="flex items-center gap-2">
									{saveStatus === "saving" && (
										<span className="text-xs text-gray-400">
											{t.memos.saving}
										</span>
									)}
									{saveStatus === "saved" && (
										<span className="text-xs text-brand-500">
											{t.memos.saved}
										</span>
									)}
									{canEdit && (
										<button
											type="button"
											title={t.memos.deleteMemo}
											onClick={() => handleDelete(selectedMemo.id)}
											className="rounded p-1 text-gray-400 hover:text-error-500 dark:hover:text-error-400"
										>
											<HiOutlineTrash className="h-4 w-4" />
										</button>
									)}
								</div>
							</div>

							<div className="text-xs text-gray-400">
								{t.memos.lastUpdated}{" "}
								{formatDate(selectedMemo.updatedAt, locale)} {t.memos.by}{" "}
								{selectedMemo.createdBy.name ?? "—"}
							</div>

							<MemoEditor
								content={
									(selectedMemo.content as Record<string, unknown> | null) ?? {}
								}
								editable={canEdit}
								placeholder={t.memos.editorPlaceholder}
								onChange={handleContentChange}
								projectId={projectId}
							/>
						</>
					) : (
						!isLoading && (
							<div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
								<p className="text-sm text-gray-400">{t.memos.noMemos}</p>
							</div>
						)
					)}
				</div>
			</div>
		</>
	);
}
