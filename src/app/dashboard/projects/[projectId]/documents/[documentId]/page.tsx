"use client";

import type { ProjectRole } from "@prisma/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
	HiOutlineArrowLeft,
	HiOutlineChatBubbleLeftRight,
	HiOutlineTag,
	HiOutlineTrash,
	HiOutlineXMark,
} from "react-icons/hi2";
import type {
	PendingSelection,
	VisualPosition,
	QuoteHighlight,
} from "@/components/projects/PdfViewer";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

// Dynamically import the PDF viewer — pdfjs-dist requires browser APIs
function PdfViewerLoading() {
	const t = useTranslation();
	return (
		<div className="flex h-64 items-center justify-center text-sm text-gray-400">
			<span className="animate-pulse">{t.viewer.loading}</span>
		</div>
	);
}

const PdfViewer = dynamic(() => import("@/components/projects/PdfViewer"), {
	ssr: false,
	loading: PdfViewerLoading,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Rotating palette used when auto-assigning a color to a new quote. */
const QUOTE_COLORS = [
	"#fbbf24", // amber
	"#34d399", // emerald
	"#60a5fa", // blue
	"#f87171", // red
	"#a78bfa", // purple
	"#fb923c", // orange
	"#f472b6", // pink
	"#2dd4bf", // teal
];

type QuoteData = {
	id: string;
	text: string;
	page: number;
	position: unknown; // Json from Prisma — cast to VisualPosition
	color: string;
	createdAt: Date;
	createdBy: { id: string; name: string | null };
	quoteCodes: {
		code: { id: string; name: string; color: string; textColor: string };
	}[];
	_count: { comments: number };
};

type CodeData = {
	id: string;
	name: string;
	color: string;
	textColor: string;
};

// ---------------------------------------------------------------------------
// Comment section (lazy-loaded per quote)
// ---------------------------------------------------------------------------

function QuoteComments({
	projectId,
	quoteId,
	commentCount,
	currentUserId,
	canEdit,
}: {
	projectId: string;
	quoteId: string;
	commentCount: number;
	currentUserId: string;
	canEdit: boolean;
}) {
	const t = useTranslation();
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState("");
	const utils = trpc.useUtils();

	const { data: comments, isLoading } = trpc.quote.listComments.useQuery(
		{ projectId, quoteId },
		{ enabled: open },
	);

	const addComment = trpc.quote.addComment.useMutation({
		onSuccess: () => {
			utils.quote.listComments.invalidate({ projectId, quoteId });
			utils.quote.list.invalidate({ projectId });
			setDraft("");
		},
	});

	const deleteComment = trpc.quote.deleteComment.useMutation({
		onSuccess: () => {
			utils.quote.listComments.invalidate({ projectId, quoteId });
			utils.quote.list.invalidate({ projectId });
		},
	});

	const count = commentCount;

	return (
		<div className="mt-2">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
			>
				<HiOutlineChatBubbleLeftRight className="h-3.5 w-3.5" />
				{count === 0
					? t.viewer.noComments
					: `${count} ${count === 1 ? t.viewer.comments : t.viewer.commentsPlural}`}
			</button>

			{open && (
				<div className="mt-2 space-y-2">
					{isLoading ? (
						<div className="h-4 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
					) : (
						comments?.map((c) => (
							<div key={c.id} className="flex items-start gap-2">
								<div className="flex-1 rounded-lg bg-gray-50 px-2.5 py-1.5 dark:bg-gray-800/50">
									<div className="flex items-center justify-between gap-2">
										<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
											{c.user.name ?? "?"}
										</span>
										{(c.user.id === currentUserId || canEdit) && (
											<button
												type="button"
												title={t.viewer.deleteComment}
												onClick={() =>
													deleteComment.mutate({ projectId, commentId: c.id })
												}
												className="text-gray-300 hover:text-error-400 dark:text-gray-600 dark:hover:text-error-400"
											>
												<HiOutlineTrash className="h-3 w-3" />
											</button>
										)}
									</div>
									<p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
										{c.content}
									</p>
								</div>
							</div>
						))
					)}

					<div className="flex gap-2">
						<input
							type="text"
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && draft.trim()) {
									addComment.mutate({
										projectId,
										quoteId,
										content: draft.trim(),
									});
								}
							}}
							placeholder={t.viewer.addComment}
							className="h-7 flex-1 rounded border border-gray-200 bg-transparent px-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-brand-400 dark:border-gray-700 dark:text-gray-300"
						/>
						<button
							type="button"
							disabled={!draft.trim() || addComment.isPending}
							onClick={() =>
								addComment.mutate({ projectId, quoteId, content: draft.trim() })
							}
							className="rounded px-2 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-40 dark:text-brand-400"
						>
							{t.viewer.submitComment}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Quote card in sidebar
// ---------------------------------------------------------------------------

function QuoteCard({
	quote,
	projectId,
	documentId,
	codes,
	isSelected,
	currentUserId,
	currentRole,
	onSelect,
}: {
	quote: QuoteData;
	projectId: string;
	documentId: string;
	codes: CodeData[];
	isSelected: boolean;
	currentUserId: string;
	currentRole: ProjectRole;
	onSelect: () => void;
}) {
	const t = useTranslation();
	const canEdit = currentRole === "OWNER" || currentRole === "COLLABORATOR";
	const [showCodePicker, setShowCodePicker] = useState(false);
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const utils = trpc.useUtils();

	const assignCode = trpc.quote.assignCode.useMutation({
		onMutate: async ({ quoteId, codeId }) => {
			await utils.quote.list.cancel({ projectId, documentId });
			const prev = utils.quote.list.getData({ projectId, documentId });
			utils.quote.list.setData({ projectId, documentId }, (old) =>
				old?.map((q) => {
					if (q.id !== quoteId) return q;
					const code = codes.find((c) => c.id === codeId);
					if (!code) return q;
					return { ...q, quoteCodes: [...q.quoteCodes, { code }] };
				}),
			);
			return { prev };
		},
		onError: (_e, _v, ctx) => {
			if (ctx?.prev)
				utils.quote.list.setData({ projectId, documentId }, ctx.prev);
		},
		onSettled: () => utils.quote.list.invalidate({ projectId, documentId }),
	});
	const removeCode = trpc.quote.removeCode.useMutation({
		onMutate: async ({ quoteId, codeId }) => {
			await utils.quote.list.cancel({ projectId, documentId });
			const prev = utils.quote.list.getData({ projectId, documentId });
			utils.quote.list.setData({ projectId, documentId }, (old) =>
				old?.map((q) => {
					if (q.id !== quoteId) return q;
					return {
						...q,
						quoteCodes: q.quoteCodes.filter((qc) => qc.code.id !== codeId),
					};
				}),
			);
			return { prev };
		},
		onError: (_e, _v, ctx) => {
			if (ctx?.prev)
				utils.quote.list.setData({ projectId, documentId }, ctx.prev);
		},
		onSettled: () => utils.quote.list.invalidate({ projectId, documentId }),
	});
	const deleteQuote = trpc.quote.delete.useMutation({
		onSuccess: () => utils.quote.list.invalidate({ projectId }),
	});
	const updateColor = trpc.quote.updateColor.useMutation({
		onSuccess: () => utils.quote.list.invalidate({ projectId }),
	});

	const assignedIds = new Set(quote.quoteCodes.map((qc) => qc.code.id));
	const unassigned = codes.filter((c) => !assignedIds.has(c.id));

	function handleDelete() {
		setShowDeleteConfirm(true);
	}

	return (
		<div
			className={`rounded-xl border p-3 transition-colors ${
				isSelected
					? "border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/20"
					: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-transparent dark:hover:border-gray-700"
			}`}
		>
			{/* Text */}
			<button
				type="button"
				onClick={onSelect}
				className="w-full text-left text-xs text-gray-700 dark:text-gray-300"
			>
				<span className="line-clamp-3 italic">"{quote.text}"</span>
			</button>

			{/* Code badges */}
			{quote.quoteCodes.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-1">
					{quote.quoteCodes.map(({ code }) => (
						<span
							key={code.id}
							className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
							style={{ backgroundColor: code.color, color: code.textColor }}
						>
							{code.name}
							{canEdit && (
								<button
									type="button"
									title={t.viewer.removeCode}
									onClick={() =>
										removeCode.mutate({
											projectId,
											quoteId: quote.id,
											codeId: code.id,
										})
									}
									className="opacity-60 hover:opacity-100"
								>
									<HiOutlineXMark className="h-3 w-3" />
								</button>
							)}
						</span>
					))}
				</div>
			)}

			{/* Actions row */}
			{canEdit && (
				<div className="mt-2 flex items-center gap-2">
					{/* Highlight color picker */}
					<div className="relative">
						<button
							type="button"
							title={t.viewer.changeHighlightColor}
							onClick={() => {
								setShowColorPicker((v) => !v);
								setShowCodePicker(false);
							}}
							className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
							style={{ backgroundColor: quote.color }}
						/>
						{showColorPicker && (
							<div className="absolute left-0 top-full z-10 mt-1 flex gap-1.5 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
								{QUOTE_COLORS.map((c) => (
									<button
										key={c}
										type="button"
										onClick={() => {
											updateColor.mutate({
												projectId,
												quoteId: quote.id,
												color: c,
											});
											setShowColorPicker(false);
										}}
										className="h-4 w-4 flex-shrink-0 rounded-full ring-offset-1 hover:ring-2 hover:ring-gray-400"
										style={{ backgroundColor: c }}
									/>
								))}
							</div>
						)}
					</div>

					{/* Assign code */}
					<div className="relative">
						<button
							type="button"
							onClick={() => {
								setShowCodePicker((v) => !v);
								setShowColorPicker(false);
							}}
							className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
						>
							<HiOutlineTag className="h-3.5 w-3.5" />
							{t.viewer.assignCode}
						</button>
						{showCodePicker && (
							<div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
								{unassigned.length === 0 ? (
									<p className="px-3 py-2 text-xs text-gray-400">
										{assignedIds.size === codes.length
											? t.viewer.allCodesAssigned
											: t.viewer.noCodesAvailable}
									</p>
								) : (
									unassigned.map((code) => (
										<button
											key={code.id}
											type="button"
											onClick={() => {
												assignCode.mutate({
													projectId,
													quoteId: quote.id,
													codeId: code.id,
												});
												setShowCodePicker(false);
											}}
											className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
										>
											<span
												className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
												style={{ backgroundColor: code.color }}
											/>
											<span className="text-gray-700 dark:text-gray-300">
												{code.name}
											</span>
										</button>
									))
								)}
							</div>
						)}
					</div>

					{/* Delete */}
					<button
						type="button"
						title={t.viewer.deleteQuote}
						onClick={handleDelete}
						disabled={deleteQuote.isPending}
						className="ml-auto text-gray-300 hover:text-error-500 dark:text-gray-700 dark:hover:text-error-400"
					>
						<HiOutlineTrash className="h-3.5 w-3.5" />
					</button>
				</div>
			)}

			{/* Comments */}
			<QuoteComments
				projectId={projectId}
				quoteId={quote.id}
				commentCount={quote._count.comments}
				currentUserId={currentUserId}
				canEdit={canEdit}
			/>

			<ConfirmModal
				isOpen={showDeleteConfirm}
				title={t.viewer.deleteQuote}
				message={t.viewer.deleteQuoteConfirm}
				confirmLabel={t.common.delete}
				cancelLabel={t.common.cancel}
				isPending={deleteQuote.isPending}
				onConfirm={() => {
					deleteQuote.mutate({ projectId, quoteId: quote.id });
					setShowDeleteConfirm(false);
				}}
				onCancel={() => setShowDeleteConfirm(false)}
			/>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DocumentViewerPage() {
	const { projectId, documentId } = useParams<{
		projectId: string;
		documentId: string;
	}>();
	const { data: session } = useSession();
	const t = useTranslation();
	const utils = trpc.useUtils();

	const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
	const [pendingSelection, setPendingSelection] = useState<
		(PendingSelection & { color: string }) | null
	>(null);
	const [pendingCodeIds, setPendingCodeIds] = useState<string[]>([]);

	// Derive current role (default COLLABORATOR while loading)
	const { data: members } = trpc.member.list.useQuery({ projectId });
	const currentRole: ProjectRole =
		members?.find((m) => m.user.id === session?.user?.id)?.role ??
		"COLLABORATOR";
	const canEdit = currentRole === "OWNER" || currentRole === "COLLABORATOR";

	// Fetch presigned URL
	const { data: urlData, isLoading: urlLoading } =
		trpc.document.getViewUrl.useQuery(
			{ projectId, documentId },
			{ staleTime: 25 * 60 * 1000, refetchInterval: 25 * 60 * 1000 },
		);

	// Fetch quotes
	const { data: quotes = [] } = trpc.quote.list.useQuery({
		projectId,
		documentId,
	});

	// Fetch codes
	const { data: codes = [] } = trpc.code.list.useQuery({ projectId });

	const assignCode = trpc.quote.assignCode.useMutation();

	// Create quote mutation — chains code assignments from the pending modal
	const createQuote = trpc.quote.create.useMutation({
		onSuccess: async (newQuote) => {
			if (pendingCodeIds.length > 0) {
				await Promise.all(
					pendingCodeIds.map((codeId) =>
						assignCode.mutateAsync({ projectId, quoteId: newQuote.id, codeId }),
					),
				);
			}
			utils.quote.list.invalidate({ projectId, documentId });
			setSelectedQuoteId(newQuote.id);
			setPendingSelection(null);
			setPendingCodeIds([]);
		},
	});

	function handleSelection(selection: PendingSelection) {
		const color = QUOTE_COLORS[quotes.length % QUOTE_COLORS.length];
		setPendingSelection({ ...selection, color });
		setPendingCodeIds([]);
	}

	function confirmCreateQuote() {
		if (!pendingSelection) return;
		createQuote.mutate({
			projectId,
			documentId,
			text: pendingSelection.text,
			page: pendingSelection.page,
			position: pendingSelection.position,
			color: pendingSelection.color,
		});
	}

	// Build QuoteHighlight array for PdfViewer — uses each quote's own color
	const highlights: QuoteHighlight[] = quotes.map((q) => ({
		id: q.id,
		page: q.page,
		position: (q.position ?? { kind: "visual", rects: [] }) as VisualPosition,
		color: q.color,
	}));

	// Group quotes by page for sidebar
	const quotesByPage = quotes.reduce<Record<number, QuoteData[]>>((acc, q) => {
		if (!acc[q.page]) acc[q.page] = [];
		acc[q.page].push(q as QuoteData);
		return acc;
	}, {});
	const pageGroups = Object.entries(quotesByPage)
		.map(([page, qs]) => ({ page: Number(page), quotes: qs }))
		.sort((a, b) => a.page - b.page);

	return (
		<div className="flex h-full flex-col gap-4">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Link
					href={`/dashboard/projects/${projectId}`}
					className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					<HiOutlineArrowLeft className="h-4 w-4" />
					{t.viewer.backToProject}
				</Link>
			</div>

			{/* Quote creation modal */}
			{pendingSelection && (
				<div className="fixed inset-0 z-[100000] flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black/50"
						onClick={() => {
							setPendingSelection(null);
							setPendingCodeIds([]);
						}}
						aria-hidden
					/>
					<div className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-gray-900">
						<h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
							{t.viewer.quoteCreateTitle}
						</h3>
						<blockquote
							className="mb-4 line-clamp-4 rounded-lg border-l-4 bg-gray-50 px-3 py-2 text-xs italic text-gray-600 dark:bg-gray-800 dark:text-gray-300"
							style={{ borderColor: pendingSelection.color }}
						>
							"{pendingSelection.text}"
						</blockquote>
						{codes.length > 0 && (
							<div className="mb-4">
								<p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
									{t.viewer.quoteCreateCodes}
								</p>
								<div className="flex flex-wrap gap-1.5">
									{(codes as CodeData[]).map((code) => {
										const active = pendingCodeIds.includes(code.id);
										return (
											<button
												key={code.id}
												type="button"
												onClick={() =>
													setPendingCodeIds((prev) =>
														active
															? prev.filter((id) => id !== code.id)
															: [...prev, code.id],
													)
												}
												className={`rounded-full px-2.5 py-1 text-xs font-medium transition-opacity ${active ? "opacity-100 ring-2 ring-offset-1 ring-black/20" : "opacity-60 hover:opacity-90"}`}
												style={{
													backgroundColor: code.color,
													color: code.textColor,
												}}
											>
												{code.name}
											</button>
										);
									})}
								</div>
							</div>
						)}
						<div className="flex justify-end gap-2">
							<button
								type="button"
								onClick={() => {
									setPendingSelection(null);
									setPendingCodeIds([]);
								}}
								className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
							>
								{t.common.cancel}
							</button>
							<button
								type="button"
								disabled={createQuote.isPending}
								onClick={confirmCreateQuote}
								className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
							>
								{createQuote.isPending
									? "…"
									: pendingCodeIds.length > 0
										? t.viewer.quoteCreateConfirm
										: t.viewer.quoteCreateSkip}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Split layout */}
			<div className="flex min-h-0 flex-1 gap-6">
				{/* PDF viewer */}
				<div className="min-w-0 flex-1 overflow-auto">
					{urlLoading ? (
						<div className="flex h-64 items-center justify-center text-sm text-gray-400">
							<span className="animate-pulse">{t.viewer.loading}</span>
						</div>
					) : urlData?.url ? (
						<ErrorBoundary>
							<PdfViewer
								url={urlData.url}
								quotes={highlights}
								selectedQuoteId={selectedQuoteId}
								canEdit={canEdit}
								onSelection={handleSelection}
								onHighlightClick={setSelectedQuoteId}
							/>
						</ErrorBoundary>
					) : (
						<p className="text-sm text-error-500">{t.viewer.loadError}</p>
					)}
				</div>

				{/* Quote sidebar */}
				<div className="w-80 flex-shrink-0 overflow-y-auto">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							{t.viewer.quotesTitle}
							{quotes.length > 0 && (
								<span className="ml-2 font-normal text-gray-400">
									({quotes.length})
								</span>
							)}
						</h2>
					</div>

					{quotes.length === 0 ? (
						<div className="rounded-xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700">
							<p className="text-sm text-gray-400">{t.viewer.noQuotes}</p>
							{canEdit && (
								<p className="mt-1 text-xs text-gray-300 dark:text-gray-600">
									{t.viewer.noQuotesHint}
								</p>
							)}
						</div>
					) : (
						<div className="space-y-4">
							{pageGroups.map(({ page, quotes: pageQuotes }) => (
								<div key={page}>
									<p className="mb-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
										{t.viewer.page} {page}
									</p>
									<div className="space-y-2">
										{pageQuotes.map((quote) => (
											<QuoteCard
												key={quote.id}
												quote={quote}
												projectId={projectId}
												documentId={documentId}
												codes={codes as CodeData[]}
												isSelected={selectedQuoteId === quote.id}
												currentUserId={session?.user?.id ?? ""}
												currentRole={currentRole}
												onSelect={() =>
													setSelectedQuoteId(
														selectedQuoteId === quote.id ? null : quote.id,
													)
												}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
