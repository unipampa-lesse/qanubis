"use client";

import type { ProjectRole } from "@prisma/client";
import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import {
	HiOutlineArrowDownTray,
	HiOutlineArrowUpTray,
	HiOutlineBookOpen,
	HiOutlineCheck,
	HiOutlineChevronDown,
	HiOutlineChevronUp,
	HiOutlineDocumentText,
	HiOutlinePencilSquare,
	HiOutlineSparkles,
	HiOutlineTrash,
	HiOutlineXMark,
} from "react-icons/hi2";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

interface DocumentsTabProps {
	projectId: string;
	currentRole: ProjectRole;
}

const MAX_MB = 50;

function DocTypeIcon({
	mimeType,
	size = "sm",
}: {
	mimeType: string;
	size?: "sm" | "lg";
}) {
	const label =
		mimeType === "application/pdf"
			? "PDF"
			: (mimeType.split("/")[1]?.toUpperCase().slice(0, 4) ?? "DOC");
	const badgeColor =
		mimeType === "application/pdf"
			? "bg-red-500 text-white"
			: "bg-gray-400 text-white";
	const iconSize = size === "lg" ? "h-8 w-8" : "h-5 w-5";
	return (
		<div className="relative flex-shrink-0">
			<HiOutlineDocumentText className={`${iconSize} text-gray-400`} />
			<span
				className={`absolute -bottom-1 -right-1.5 rounded px-0.5 text-[7px] font-bold leading-tight ${badgeColor}`}
			>
				{label}
			</span>
		</div>
	);
}

function DownloadButton({
	projectId,
	documentId,
	title,
}: {
	projectId: string;
	documentId: string;
	title: string;
}) {
	const [fetch, setFetch] = useState(false);
	const { data, isFetching } = trpc.document.getDownloadUrl.useQuery(
		{ projectId, documentId },
		{ enabled: fetch, retry: false },
	);

	if (data?.url && fetch) {
		const a = document.createElement("a");
		a.href = data.url;
		a.download = data.filename;
		a.click();
		setFetch(false);
	}

	return (
		<button
			type="button"
			title={title}
			disabled={isFetching}
			onClick={() => setFetch(true)}
			className="text-gray-400 hover:text-brand-600 disabled:opacity-40 dark:hover:text-brand-400"
		>
			<HiOutlineArrowDownTray className="h-4 w-4" />
		</button>
	);
}

export default function DocumentsTab({
	projectId,
	currentRole,
}: DocumentsTabProps) {
	const t = useTranslation();
	const canEdit = currentRole === "OWNER" || currentRole === "COLLABORATOR";

	// PDF upload (new document)
	const fileRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	// BibTeX import panel
	const [showImport, setShowImport] = useState(false);
	const [bibtexText, setBibtexText] = useState("");
	const [importResult, setImportResult] = useState<{
		imported: number;
		skipped: number;
	} | null>(null);

	// Attach PDF to existing bib-only document
	const bibPdfRef = useRef<HTMLInputElement>(null);
	const [attachingPdfFor, setAttachingPdfFor] = useState<string | null>(null);
	const [attachError, setAttachError] = useState<string | null>(null);

	// .bib file upload (populates textarea)
	const bibFileRef = useRef<HTMLInputElement>(null);

	// Expanded metadata row
	const [expandedId, setExpandedId] = useState<string | null>(null);

	// Inline rename
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draftName, setDraftName] = useState("");

	const utils = trpc.useUtils();

	const { data: documents, isLoading } = trpc.document.list.useQuery({
		projectId,
	});

	const remove = trpc.document.delete.useMutation({
		onSuccess: () => utils.document.list.invalidate({ projectId }),
	});
	const rename = trpc.document.update.useMutation({
		onSuccess: () => {
			utils.document.list.invalidate({ projectId });
			setEditingId(null);
		},
	});
	const importMutation = trpc.bibtex.importText.useMutation({
		onSuccess: (result) => {
			setImportResult(result);
			setBibtexText("");
			utils.document.list.invalidate({ projectId });
		},
	});
	const enrichMutation = trpc.bibtex.triggerEnrichment.useMutation({
		onSuccess: () => utils.document.list.invalidate({ projectId }),
	});

	function startEdit(id: string, currentName: string) {
		setEditingId(id);
		setDraftName(currentName);
	}
	function cancelEdit() {
		setEditingId(null);
		setDraftName("");
	}
	function commitEdit(documentId: string) {
		const trimmed = draftName.trim();
		if (!trimmed) return cancelEdit();
		rename.mutate({ projectId, documentId, name: trimmed });
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > MAX_MB * 1024 * 1024) {
			setUploadError(`File exceeds the ${MAX_MB} MB limit`);
			return;
		}
		setUploadError(null);
		setUploading(true);
		const form = new FormData();
		form.set("projectId", projectId);
		form.set("file", file);
		try {
			const res = await fetch("/api/upload/document", {
				method: "POST",
				body: form,
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error((body as { error?: string }).error ?? "Upload failed");
			}
			await utils.document.list.invalidate({ projectId });
		} catch (err) {
			setUploadError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}

	async function handleBibPdfChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		const documentId = attachingPdfFor;
		if (!file || !documentId) return;
		setAttachError(null);
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
			setAttachError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setAttachingPdfFor(null);
			if (bibPdfRef.current) bibPdfRef.current.value = "";
		}
	}

	function handleBibFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			const text = ev.target?.result;
			if (typeof text === "string") {
				setBibtexText(text);
				setShowImport(true);
				setImportResult(null);
			}
		};
		reader.readAsText(file);
		if (bibFileRef.current) bibFileRef.current.value = "";
	}

	return (
		<div className="space-y-4">
			{/* Hidden file inputs */}
			<input
				ref={fileRef}
				type="file"
				accept="application/pdf"
				className="sr-only"
				onChange={handleFileChange}
			/>
			<input
				ref={bibPdfRef}
				type="file"
				accept="application/pdf"
				className="sr-only"
				onChange={handleBibPdfChange}
			/>
			<input
				ref={bibFileRef}
				type="file"
				accept=".bib,.txt"
				className="sr-only"
				onChange={handleBibFileChange}
			/>

			{/* Action buttons row */}
			{canEdit && (
				<div className="flex flex-wrap items-center gap-3">
					<Button
						size="sm"
						variant="outline"
						disabled={uploading}
						startIcon={<HiOutlineArrowUpTray className="h-4 w-4" />}
						onClick={() => fileRef.current?.click()}
					>
						{uploading ? t.documents.uploading : t.documents.upload}
					</Button>

					<Button
						size="sm"
						variant="outline"
						startIcon={<HiOutlineBookOpen className="h-4 w-4" />}
						onClick={() => {
							setShowImport(!showImport);
							setImportResult(null);
						}}
					>
						{t.bibliography.importBibtex}
					</Button>

					{uploadError && (
						<span className="text-sm text-error-500">{uploadError}</span>
					)}
					{attachError && (
						<span className="text-sm text-error-500">{attachError}</span>
					)}
				</div>
			)}

			{/* BibTeX import panel */}
			{canEdit && showImport && (
				<div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
					<div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{t.bibliography.importBibtex}
						</span>
						<button
							type="button"
							onClick={() => setShowImport(false)}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						>
							<HiOutlineChevronUp className="h-4 w-4" />
						</button>
					</div>
					<div className="px-4 pb-4 pt-3">
						<div className="mb-2 flex items-center gap-2">
							<button
								type="button"
								onClick={() => bibFileRef.current?.click()}
								className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
							>
								<HiOutlineArrowUpTray className="h-3.5 w-3.5" />
								{t.bibliography.uploadBibFile}
							</button>
							<span className="text-xs text-gray-400">{t.bibliography.orPaste}</span>
						</div>
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
								onClick={() => {
									const trimmed = bibtexText.trim();
									if (!trimmed) return;
									setImportResult(null);
									importMutation.mutate({ projectId, bibtex: trimmed });
								}}
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
				</div>
			)}

			{/* Documents list */}
			{isLoading ? (
				<div className="space-y-2">
					{(["sk-a", "sk-b", "sk-c"] as const).map((k) => (
						<div
							key={k}
							className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
						/>
					))}
				</div>
			) : documents && documents.length > 0 ? (
				<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 dark:bg-gray-800/50">
							<tr>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.documents.document}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
									{t.documents.status}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
									{t.documents.pages}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 md:table-cell">
									{t.documents.quotes}
								</th>
								<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
									{t.common.actions}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
							{documents.map((doc) => {
								const isEditing = editingId === doc.id;
								const hasPdf = !!doc.storageKey;
								const isBib = doc.source === "bibtex";
								const isAttaching = attachingPdfFor === doc.id;
								const isExpanded = expandedId === doc.id;
								const hasMeta =
									isBib &&
									(doc.abstract ||
										doc.authors.length > 0 ||
										doc.journal ||
										doc.doi ||
										doc.year);

								return (
									<Fragment key={doc.id}>
									<tr
										className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
									>
										{/* Document name */}
										<td className="px-5 py-3">
											{isEditing ? (
												<form
													className="flex items-center gap-2"
													onSubmit={(e) => {
														e.preventDefault();
														commitEdit(doc.id);
													}}
												>
													<DocTypeIcon mimeType={doc.mimeType} />
													<input
														type="text"
														value={draftName}
														onChange={(e) => setDraftName(e.target.value)}
														onKeyDown={(e) =>
															e.key === "Escape" && cancelEdit()
														}
														maxLength={200}
														required
														className="h-8 flex-1 rounded-lg border border-brand-400 bg-transparent px-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-brand-500 dark:text-white/90"
													/>
													<button
														type="submit"
														disabled={rename.isPending || !draftName.trim()}
														className="text-success-600 hover:text-success-700 disabled:opacity-40 dark:text-success-400"
														title={t.common.save}
													>
														<HiOutlineCheck className="h-4 w-4" />
													</button>
													<button
														type="button"
														onClick={cancelEdit}
														className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
														title={t.common.cancel}
													>
														<HiOutlineXMark className="h-4 w-4" />
													</button>
												</form>
											) : hasPdf ? (
												<Link
													href={`/dashboard/projects/${projectId}/documents/${doc.id}`}
													className="flex items-center gap-2 hover:underline"
												>
													<DocTypeIcon mimeType={doc.mimeType} />
													<div className="min-w-0">
														<div className="font-medium text-gray-800 dark:text-white/90">
															{doc.name}
														</div>
														<div className="truncate text-xs text-gray-400">
															{doc.authors.length > 0
																? `${doc.authors.slice(0, 2).join("; ")}${doc.authors.length > 2 ? " et al." : ""}`
																: doc.extractedTitle && doc.extractedTitle !== doc.name
																	? doc.extractedTitle
																	: null}
														</div>
													</div>
												</Link>
											) : (
												<div className="flex items-center gap-2">
													<DocTypeIcon mimeType={doc.mimeType} />
													<div className="min-w-0">
														<div className="font-medium text-gray-800 dark:text-white/90">
															{doc.name}
														</div>
														{doc.authors.length > 0 && (
															<div className="truncate text-xs text-gray-400">
																{doc.authors.slice(0, 2).join("; ")}
																{doc.authors.length > 2 ? " et al." : ""}
															</div>
														)}
													</div>
												</div>
											)}
										</td>

										{/* Status column */}
										<td className="hidden px-5 py-3 sm:table-cell">
											<div className="flex items-center gap-1.5">
												{hasPdf ? (
													<span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-success-700 ring-1 ring-success-200 dark:text-success-400 dark:ring-success-800">
														PDF
													</span>
												) : (
													<span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700">
														{t.documents.noPdf}
													</span>
												)}
												{isBib && (
													<span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-brand-600 ring-1 ring-brand-200 dark:text-brand-400 dark:ring-brand-800">
														Ref
													</span>
												)}
											</div>
										</td>

										{/* Pages */}
										<td className="hidden px-5 py-3 text-gray-500 dark:text-gray-400 sm:table-cell">
											{doc.pageCount > 0 ? doc.pageCount : "—"}
										</td>

										{/* Quotes + progress */}
										<td className="hidden px-5 py-3 md:table-cell">
											<div className="flex flex-col gap-1">
												<span className="text-gray-500 dark:text-gray-400">
													{doc._count.quotes}
												</span>
												{doc._count.quotes > 0 && (
													<div
														className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
														title={`${doc.codedQuoteCount}/${doc._count.quotes} ${t.documents.codingProgress}`}
													>
														<div
															className="h-full rounded-full bg-brand-500 transition-[width]"
															style={{
																width: `${Math.round((doc.codedQuoteCount / doc._count.quotes) * 100)}%`,
															}}
														/>
													</div>
												)}
											</div>
										</td>

										{/* Actions */}
										<td className="px-5 py-3 text-right">
											{!isEditing && (
												<div className="flex items-center justify-end gap-2">
													{/* Expand metadata — bib docs with any metadata */}
													{hasMeta && (
														<button
															type="button"
															title={isExpanded ? t.common.collapse : t.common.expand}
															onClick={() =>
																setExpandedId(isExpanded ? null : doc.id)
															}
															className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
														>
															{isExpanded ? (
																<HiOutlineChevronUp className="h-4 w-4" />
															) : (
																<HiOutlineChevronDown className="h-4 w-4" />
															)}
														</button>
													)}

													{/* Attach PDF — bib docs without PDF */}
													{isBib && !hasPdf && canEdit && (
														<button
															type="button"
															title={t.bibliography.uploadPdf}
															disabled={isAttaching}
															onClick={() => {
																setAttachingPdfFor(doc.id);
																bibPdfRef.current?.click();
															}}
															className="text-gray-400 hover:text-brand-600 disabled:opacity-40 dark:hover:text-brand-400"
														>
															<HiOutlineArrowUpTray className="h-4 w-4" />
														</button>
													)}

													{/* Enrich — bib docs with DOI, not yet enriched */}
													{isBib && doc.doi && !doc.enriched && canEdit && (
														<button
															type="button"
															title={t.bibliography.enrich}
															disabled={enrichMutation.isPending}
															onClick={() =>
																enrichMutation.mutate({
																	projectId,
																	documentId: doc.id,
																})
															}
															className="text-gray-400 hover:text-brand-600 disabled:opacity-40 dark:hover:text-brand-400"
														>
															<HiOutlineSparkles className="h-4 w-4" />
														</button>
													)}

													{/* Download — only when PDF exists */}
													{hasPdf && (
														<DownloadButton
															projectId={projectId}
															documentId={doc.id}
															title={t.documents.download}
														/>
													)}

													{canEdit && (
														<>
															<button
																type="button"
																title={t.documents.renameDocument}
																onClick={() => startEdit(doc.id, doc.name)}
																className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
															>
																<HiOutlinePencilSquare className="h-4 w-4" />
															</button>
															<button
																type="button"
																title={t.documents.deleteDocument}
																onClick={() =>
																	remove.mutate({
																		projectId,
																		documentId: doc.id,
																	})
																}
																className="text-gray-400 hover:text-error-500 dark:hover:text-error-400"
															>
																<HiOutlineTrash className="h-4 w-4" />
															</button>
														</>
													)}
												</div>
											)}
										</td>
									</tr>
									{isExpanded && hasMeta && (
										<tr className="bg-gray-50/70 dark:bg-white/[0.015]">
											<td colSpan={5} className="px-8 pb-4 pt-2">
												<dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-xs sm:grid-cols-2">
													{doc.authors.length > 0 && (
														<>
															<dt className="font-medium text-gray-500 dark:text-gray-400">
																{t.bibliography.authors}
															</dt>
															<dd className="text-gray-700 dark:text-gray-300">
																{doc.authors.join("; ")}
															</dd>
														</>
													)}
													{doc.year && (
														<>
															<dt className="font-medium text-gray-500 dark:text-gray-400">
																{t.bibliography.year}
															</dt>
															<dd className="text-gray-700 dark:text-gray-300">
																{doc.year}
															</dd>
														</>
													)}
													{doc.journal && (
														<>
															<dt className="font-medium text-gray-500 dark:text-gray-400">
																{t.bibliography.venue}
															</dt>
															<dd className="text-gray-700 dark:text-gray-300">
																{doc.journal}
																{doc.volume && `, ${t.bibliography.vol} ${doc.volume}`}
																{doc.issue && `(${doc.issue})`}
																{doc.pages && `, ${doc.pages}`}
															</dd>
														</>
													)}
													{doc.doi && (
														<>
															<dt className="font-medium text-gray-500 dark:text-gray-400">
																DOI
															</dt>
															<dd>
																<a
																	href={`https://doi.org/${doc.doi}`}
																	target="_blank"
																	rel="noreferrer"
																	className="break-all text-brand-600 hover:underline dark:text-brand-400"
																>
																	{doc.doi}
																</a>
															</dd>
														</>
													)}
													{doc.abstract && (
														<>
															<dt className="col-span-full font-medium text-gray-500 dark:text-gray-400">
																{t.bibliography.abstract}
															</dt>
															<dd className="col-span-full leading-relaxed text-gray-700 dark:text-gray-300">
																{doc.abstract}
															</dd>
														</>
													)}
												</dl>
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
					<DocTypeIcon mimeType="application/pdf" size="lg" />
					<p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
						{t.documents.noDocuments}
						{canEdit && ` ${t.documents.noDocumentsHint}`}
					</p>
					{canEdit && (
						<div className="mt-4 flex gap-2">
							<Button
								size="sm"
								variant="outline"
								startIcon={<HiOutlineArrowUpTray className="h-4 w-4" />}
								onClick={() => fileRef.current?.click()}
							>
								{t.documents.upload}
							</Button>
							<Button
								size="sm"
								variant="outline"
								startIcon={<HiOutlineBookOpen className="h-4 w-4" />}
								onClick={() => setShowImport(true)}
							>
								{t.bibliography.importBibtex}
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
