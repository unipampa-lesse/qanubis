"use client";

import type { ProjectRole } from "@prisma/client";
import { useRef, useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { HiOutlineArrowUpTray, HiOutlineDocument, HiOutlineTrash } from "react-icons/hi2";
import Button from "@/components/ui/button/Button";
import { trpc } from "@/server/client";

interface DocumentsTabProps {
	projectId: string;
	currentRole: ProjectRole;
}

const MAX_MB = 50;

function formatBytes(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentsTab({
	projectId,
	currentRole,
}: DocumentsTabProps) {
	const t = useTranslation();
	const canEdit = currentRole === "OWNER" || currentRole === "COLLABORATOR";
	const fileRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const utils = trpc.useUtils();
	const { data: documents, isLoading } = trpc.document.list.useQuery({
		projectId,
	});
	const remove = trpc.document.delete.useMutation({
		onSuccess: () => utils.document.list.invalidate({ projectId }),
	});

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

	return (
		<div className="space-y-4">
			{/* Upload button */}
			{canEdit && (
				<div className="flex items-center gap-3">
					<input
						ref={fileRef}
						type="file"
						accept="application/pdf"
						className="sr-only"
						onChange={handleFileChange}
					/>
					<Button
						size="sm"
						variant="outline"
						disabled={uploading}
						startIcon={<HiOutlineArrowUpTray className="h-4 w-4" />}
						onClick={() => fileRef.current?.click()}
					>
						{uploading ? t.documents.uploading : t.documents.upload}
					</Button>
					{uploadError && (
						<span className="text-sm text-error-500">{uploadError}</span>
					)}
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
									{t.documents.pages}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
									{t.documents.size}
								</th>
								<th className="hidden px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400 md:table-cell">
									{t.documents.quotes}
								</th>
								{canEdit && (
									<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
										{t.common.actions}
									</th>
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
							{documents.map((doc) => (
								<tr
									key={doc.id}
									className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
								>
									<td className="px-5 py-3">
										<div className="flex items-center gap-2">
											<HiOutlineDocument className="h-5 w-5 flex-shrink-0 text-gray-400" />
											<div>
												<div className="font-medium text-gray-800 dark:text-white/90">
													{doc.name}
												</div>
												{doc.extractedTitle &&
													doc.extractedTitle !== doc.name && (
														<div className="text-xs text-gray-400">
															{doc.extractedTitle}
														</div>
													)}
											</div>
										</div>
									</td>
									<td className="hidden px-5 py-3 text-gray-500 dark:text-gray-400 sm:table-cell">
										{doc.pageCount > 0 ? doc.pageCount : "—"}
									</td>
									<td className="hidden px-5 py-3 text-gray-500 dark:text-gray-400 sm:table-cell">
										{doc.fileSize > 0 ? formatBytes(doc.fileSize) : "—"}
									</td>
									<td className="hidden px-5 py-3 text-gray-500 dark:text-gray-400 md:table-cell">
										{doc._count.quotes}
									</td>
									{canEdit && (
										<td className="px-5 py-3 text-right">
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
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
					<HiOutlineDocument className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{t.documents.noDocuments}
						{canEdit && ` ${t.documents.noDocumentsHint}`}
					</p>
					{canEdit && (
						<Button
							size="sm"
							variant="outline"
							className="mt-4"
							startIcon={<HiOutlineArrowUpTray className="h-4 w-4" />}
							onClick={() => fileRef.current?.click()}
						>
							{t.documents.upload}
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
