"use client";

import type { ProjectRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import {
	HiOutlineArrowUpTray,
	HiOutlineBookOpen,
	HiOutlineChevronDown,
	HiOutlineChevronUp,
	HiOutlineSparkles,
	HiOutlineTrash,
} from "react-icons/hi2";
import Button from "@/components/ui/button/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

interface BibliographyTabProps {
	projectId: string;
	currentRole: ProjectRole;
}

/**
 * Fetches a presigned view URL on demand, then switches to a direct <a> link
 * to avoid popup-blocker issues.
 */
function ViewPdfButton({
	projectId,
	documentId,
	label,
}: {
	projectId: string;
	documentId: string;
	label: string;
}) {
	const [enabled, setEnabled] = useState(false);
	const { data, isFetching } = trpc.document.getViewUrl.useQuery(
		{ projectId, documentId },
		{ enabled, retry: false },
	);

	if (data?.url) {
		return (
			<a
				href={data.url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-brand-200 hover:bg-brand-50 dark:text-brand-400 dark:ring-brand-800 dark:hover:bg-brand-500/10"
			>
				<HiOutlineBookOpen className="h-3 w-3" />
				PDF
			</a>
		);
	}

	return (
		<button
			type="button"
			title={label}
			disabled={isFetching}
			onClick={() => setEnabled(true)}
			className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-brand-200 hover:bg-brand-50 disabled:opacity-40 dark:text-brand-400 dark:ring-brand-800 dark:hover:bg-brand-500/10"
		>
			<HiOutlineBookOpen className="h-3 w-3" />
			PDF
		</button>
	);
}

function formatAuthors(authors: string[]): string {
	if (authors.length === 0) return "—";
	if (authors.length <= 3) return authors.join("; ");
	return `${authors.slice(0, 2).join("; ")} et al.`;
}

export default function BibliographyTab({
	projectId,
	currentRole,
}: BibliographyTabProps) {
	const t = useTranslation();
	const router = useRouter();
	const canEdit = currentRole === "OWNER" || currentRole === "COLLABORATOR";

	const [showImport, setShowImport] = useState(false);
	const [bibtexText, setBibtexText] = useState("");
	const [importResult, setImportResult] = useState<{
		imported: number;
		skipped: number;
	} | null>(null);

	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const pdfFileRef = useRef<HTMLInputElement>(null);
	const [uploadingPdfFor, setUploadingPdfFor] = useState<string | null>(null);
	const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);

	const utils = trpc.useUtils();

	const { data: entries, isLoading } = trpc.document.list.useQuery({
		projectId,
		source: "bibtex",
	});

	const importMutation = trpc.bibtex.importText.useMutation({
		onSuccess: (result) => {
			setImportResult(result);
			setBibtexText("");
			utils.document.list.invalidate({ projectId });
		},
	});

	const deleteMutation = trpc.document.delete.useMutation({
		onSuccess: () => utils.document.list.invalidate({ projectId }),
	});

	const enrichMutation = trpc.bibtex.triggerEnrichment.useMutation({
		onSuccess: () => utils.document.list.invalidate({ projectId }),
	});

	function handleImport() {
		const trimmed = bibtexText.trim();
		if (!trimmed) return;
		setImportResult(null);
		importMutation.mutate({ projectId, bibtex: trimmed });
	}

	function handleAttachPdf(documentId: string) {
		setUploadingPdfFor(documentId);
		setPdfUploadError(null);
		pdfFileRef.current?.click();
	}

	async function handlePdfFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		const documentId = uploadingPdfFor;
		if (!file || !documentId) return;

		const form = new FormData();
		form.set("projectId", projectId);
		form.set("documentId", documentId);
		form.set("file", file);

		try {
			const res = await fetch("/api/upload/bibtex-pdf", {
				method: "POST",
				body: form,
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error((body as { error?: string }).error ?? "Upload failed");
			}
			await utils.document.list.invalidate({ projectId });
		} catch (err) {
			setPdfUploadError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploadingPdfFor(null);
			if (pdfFileRef.current) pdfFileRef.current.value = "";
		}
	}

	const deletingEntry = entries?.find((e) => e.id === deletingId);

	return (
		<div className="space-y-4">
			{/* Hidden file input for manual PDF attachment */}
			<input
				ref={pdfFileRef}
				type="file"
				accept="application/pdf"
				className="sr-only"
				onChange={handlePdfFileChange}
			/>

			{/* Import panel — collaborator+ only */}
			{canEdit && (
				<div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
					<button
						type="button"
						onClick={() => {
							setShowImport(!showImport);
							setImportResult(null);
						}}
						className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.02]"
					>
						<span className="flex items-center gap-2">
							<HiOutlineArrowUpTray className="h-4 w-4" />
							{t.bibliography.importBibtex}
						</span>
						{showImport ? (
							<HiOutlineChevronUp className="h-4 w-4 text-gray-400" />
						) : (
							<HiOutlineChevronDown className="h-4 w-4 text-gray-400" />
						)}
					</button>

					{showImport && (
						<div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-800">
							<textarea
								value={bibtexText}
								onChange={(e) => setBibtexText(e.target.value)}
								placeholder={t.bibliography.importPlaceholder}
								rows={8}
								className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
							/>
							<div className="mt-2 flex items-center gap-3">
								<Button
									size="sm"
									variant="primary"
									disabled={!bibtexText.trim() || importMutation.isPending}
									onClick={handleImport}
								>
									{importMutation.isPending
										? t.bibliography.importing
										: t.bibliography.importButton}
								</Button>
								{importResult && (
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{importResult.imported} {t.bibliography.importedCount}
										{importResult.skipped > 0 &&
											`, ${importResult.skipped} ${t.bibliography.skippedCount}`}
									</span>
								)}
								{importMutation.error && (
									<span className="text-xs text-error-500">
										{importMutation.error.message}
									</span>
								)}
							</div>
						</div>
					)}
				</div>
			)}

			{pdfUploadError && (
				<p className="text-sm text-error-500">{pdfUploadError}</p>
			)}

			{/* Entry list */}
			{isLoading ? (
				<div className="space-y-2">
					{(["sk-a", "sk-b", "sk-c"] as const).map((k) => (
						<div
							key={k}
							className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
						/>
					))}
				</div>
			) : entries && entries.length > 0 ? (
				<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 dark:bg-gray-800/50">
							<tr>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.bibliography.reference}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
									{t.bibliography.year}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 md:table-cell">
									{t.bibliography.venue}
								</th>
								<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
									{t.common.actions}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
							{entries.map((entry) => {
								const isExpanded = expandedId === entry.id;
								const hasAbstract = !!entry.abstract;
								const venue = entry.journal ?? entry.publisher ?? null;
								const isUploadingPdf = uploadingPdfFor === entry.id;
								const hasPdf = !!entry.storageKey;

								return (
									<Fragment key={entry.id}>
										<tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
											{/* Reference column */}
											<td className="px-5 py-3">
												<div className="flex items-start gap-2">
													{hasAbstract && (
														<button
															type="button"
															onClick={() =>
																setExpandedId(isExpanded ? null : entry.id)
															}
															className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
														>
															{isExpanded ? (
																<HiOutlineChevronUp className="h-3.5 w-3.5" />
															) : (
																<HiOutlineChevronDown className="h-3.5 w-3.5" />
															)}
														</button>
													)}
													<div className="min-w-0">
														<div className="font-medium text-gray-800 dark:text-white/90">
															{entry.name}
														</div>
														<div className="truncate text-xs text-gray-400">
															{formatAuthors(entry.authors)}
														</div>
														{entry.doi && (
															<a
																href={`https://doi.org/${entry.doi}`}
																target="_blank"
																rel="noopener noreferrer"
																className="text-xs text-brand-500 hover:underline dark:text-brand-400"
																onClick={(e) => e.stopPropagation()}
															>
																{entry.doi}
															</a>
														)}
													</div>
												</div>
											</td>

											{/* Year */}
											<td className="hidden whitespace-nowrap px-5 py-3 text-gray-500 dark:text-gray-400 sm:table-cell">
												{entry.year ?? "—"}
											</td>

											{/* Venue */}
											<td className="hidden px-5 py-3 text-gray-500 dark:text-gray-400 md:table-cell">
												<span className="line-clamp-1 max-w-[200px]">
													{venue ?? "—"}
												</span>
											</td>

											{/* Actions */}
											<td className="px-5 py-3">
												<div className="flex items-center justify-end gap-2">
													{/* Enrichment badge */}
													{entry.enriched ? (
														<span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-success-600 ring-1 ring-success-200 dark:text-success-400 dark:ring-success-800">
															{t.bibliography.enriched}
														</span>
													) : (
														<span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700">
															{t.bibliography.pending}
														</span>
													)}

													{/* PDF actions */}
													{hasPdf ? (
														<ViewPdfButton
															projectId={projectId}
															documentId={entry.id}
															label={t.bibliography.viewPdf}
														/>
													) : canEdit ? (
														<button
															type="button"
															title={t.bibliography.uploadPdf}
															disabled={isUploadingPdf}
															onClick={() => handleAttachPdf(entry.id)}
															className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.02]"
														>
															<HiOutlineArrowUpTray className="h-3 w-3" />
															{isUploadingPdf
																? t.bibliography.uploadingPdf
																: t.bibliography.uploadPdf}
														</button>
													) : null}

													{/* Enrich */}
													{canEdit && entry.doi && !entry.enriched && (
														<button
															type="button"
															title={t.bibliography.enrich}
															disabled={enrichMutation.isPending}
															onClick={() =>
																enrichMutation.mutate({
																	projectId,
																	documentId: entry.id,
																})
															}
															className="text-gray-400 hover:text-brand-600 disabled:opacity-40 dark:hover:text-brand-400"
														>
															<HiOutlineSparkles className="h-4 w-4" />
														</button>
													)}

													{/* Open for coding — only when PDF is available */}
													{hasPdf && (
														<button
															type="button"
															title={t.bibliography.openForCoding}
															onClick={() =>
																router.push(
																	`/dashboard/projects/${projectId}/documents/${entry.id}`,
																)
															}
															className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-brand-200 hover:bg-brand-50 dark:text-brand-400 dark:ring-brand-800 dark:hover:bg-brand-500/10"
														>
															{t.bibliography.openForCoding}
														</button>
													)}

													{/* Delete */}
													{canEdit && (
														<button
															type="button"
															title={t.bibliography.deleteEntry}
															onClick={() => setDeletingId(entry.id)}
															className="text-gray-400 hover:text-error-500 dark:hover:text-error-400"
														>
															<HiOutlineTrash className="h-4 w-4" />
														</button>
													)}
												</div>
											</td>
										</tr>

										{/* Expanded abstract row */}
										{isExpanded && entry.abstract && (
											<tr className="bg-gray-50 dark:bg-white/[0.01]">
												<td
													colSpan={4}
													className="px-5 pb-4 pt-2 pl-12 text-xs text-gray-600 dark:text-gray-400"
												>
													<span className="mb-1 block font-semibold text-gray-700 dark:text-gray-300">
														{t.bibliography.abstract}
													</span>
													{entry.abstract}
												</td>
											</tr>
										)}
									</Fragment>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
					<HiOutlineBookOpen className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{t.bibliography.noEntries}
						{canEdit && ` ${t.bibliography.noEntriesHint}`}
					</p>
				</div>
			)}

			<ConfirmModal
				isOpen={!!deletingId}
				title={t.bibliography.deleteEntry}
				message={`"${deletingEntry?.name ?? ""}" — ${t.bibliography.deleteConfirm}`}
				confirmLabel={t.common.delete}
				cancelLabel={t.common.cancel}
				isPending={deleteMutation.isPending}
				onConfirm={() => {
					if (!deletingId) return;
					deleteMutation.mutate({ projectId, documentId: deletingId });
					setDeletingId(null);
				}}
				onCancel={() => setDeletingId(null)}
			/>
		</div>
	);
}
