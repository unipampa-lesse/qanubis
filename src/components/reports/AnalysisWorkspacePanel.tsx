"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

interface QuoteOption {
	id: string;
	document: { id: string; name: string };
	quoteCodes: { code: { id: string; name: string } }[];
}

interface AnalysisWorkspacePanelProps {
	projectId: string;
	quotes: QuoteOption[];
}

export default function AnalysisWorkspacePanel({
	projectId,
	quotes,
}: AnalysisWorkspacePanelProps) {
	const t = useTranslation();
	const utils = trpc.useUtils();

	const [savedName, setSavedName] = useState("");
	const [savedSearch, setSavedSearch] = useState("");
	const [savedDocumentId, setSavedDocumentId] = useState("");
	const [savedCodeId, setSavedCodeId] = useState("");
	const [savedUncodedOnly, setSavedUncodedOnly] = useState(false);
	const [selectedSavedQueryId, setSelectedSavedQueryId] = useState("");
	const [agreementCodeId, setAgreementCodeId] = useState("");
	const [coderAId, setCoderAId] = useState("");
	const [coderBId, setCoderBId] = useState("");

	const { data: matrixData, isLoading: matrixLoading } =
		trpc.report.matrix.useQuery({
			projectId,
			limitDocuments: 20,
			limitCodes: 20,
		});

	const { data: membersData } = trpc.member.list.useQuery({
		projectId,
		limit: 100,
	});

	const { data: savedQueries } = trpc.report.listSavedQueries.useQuery({
		projectId,
	});

	const runSavedQuery = trpc.report.runSavedQuery.useQuery(
		{ projectId, savedQueryId: selectedSavedQueryId },
		{ enabled: Boolean(selectedSavedQueryId) },
	);

	const createSavedQuery = trpc.report.createSavedQuery.useMutation({
		onSuccess: () => {
			utils.report.listSavedQueries.invalidate({ projectId });
			setSavedName("");
		},
	});

	const deleteSavedQuery = trpc.report.deleteSavedQuery.useMutation({
		onSuccess: () => {
			utils.report.listSavedQueries.invalidate({ projectId });
			setSelectedSavedQueryId("");
		},
	});

	const agreementQuery = trpc.report.coderAgreement.useQuery(
		{
			projectId,
			codeId: agreementCodeId,
			coderAId,
			coderBId,
		},
		{
			enabled:
				Boolean(agreementCodeId) && Boolean(coderAId) && Boolean(coderBId),
		},
	);

	const documents = useMemo(
		() =>
			Array.from(
				new Map(quotes.map((q) => [q.document.id, q.document])).values(),
			),
		[quotes],
	);

	const codes = useMemo(
		() =>
			Array.from(
				new Map(
					quotes.flatMap((q) =>
						q.quoteCodes.map((qc) => [qc.code.id, qc.code]),
					),
				).values(),
			),
		[quotes],
	);

	const members = membersData?.items ?? [];

	return (
		<div className="space-y-8">
			<section className="space-y-3">
				<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
					{t.reports.matrixTitle}
				</h3>
				{matrixLoading ? (
					<div className="h-24 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800" />
				) : !matrixData ||
					matrixData.documents.length === 0 ||
					matrixData.codes.length === 0 ? (
					<div className="rounded-xl border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400 dark:border-gray-700">
						{t.reports.noData}
					</div>
				) : (
					<div className="overflow-auto rounded-2xl border border-gray-200 dark:border-gray-800">
						<table className="min-w-full text-sm">
							<thead className="bg-gray-50 dark:bg-gray-800/50">
								<tr>
									<th className="sticky left-0 z-10 bg-gray-50 px-4 py-2 text-left font-medium text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
										{t.reports.code}
									</th>
									{matrixData.documents.map((doc) => (
										<th
											key={doc.id}
											className="px-4 py-2 text-right font-medium text-gray-500 dark:text-gray-400"
										>
											{doc.name}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
								{matrixData.rows.map((row) => {
									const code = matrixData.codes.find(
										(c) => c.id === row.codeId,
									);
									if (!code) return null;
									return (
										<tr key={row.codeId}>
											<td className="sticky left-0 z-10 bg-white px-4 py-2 dark:bg-gray-900">
												<span
													className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
													style={{
														backgroundColor: code.color,
														color: code.textColor,
													}}
												>
													{code.name}
												</span>
											</td>
											{row.cells.map((cell) => (
												<td
													key={cell.documentId}
													className="px-4 py-2 text-right text-gray-600 dark:text-gray-400"
												>
													{cell.count}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</section>

			<section className="space-y-3">
				<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
					{t.reports.agreementTitle}
				</h3>
				<div className="flex flex-wrap items-center gap-2">
					<select
						value={agreementCodeId}
						onChange={(e) => setAgreementCodeId(e.target.value)}
						className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
					>
						<option value="">{t.reports.selectCode}</option>
						{codes.map((code) => (
							<option key={code.id} value={code.id}>
								{code.name}
							</option>
						))}
					</select>
					<select
						value={coderAId}
						onChange={(e) => setCoderAId(e.target.value)}
						className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
					>
						<option value="">{t.reports.selectCoderA}</option>
						{members.map((member) => (
							<option key={member.user.id} value={member.user.id}>
								{member.user.name ?? member.user.email}
							</option>
						))}
					</select>
					<select
						value={coderBId}
						onChange={(e) => setCoderBId(e.target.value)}
						className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
					>
						<option value="">{t.reports.selectCoderB}</option>
						{members.map((member) => (
							<option key={member.user.id} value={member.user.id}>
								{member.user.name ?? member.user.email}
							</option>
						))}
					</select>
				</div>

				{agreementQuery.data && (
					<div className="grid grid-cols-1 gap-2 rounded-xl border border-gray-200 p-4 text-sm dark:border-gray-800 md:grid-cols-3">
						<div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/40">
							<div className="text-xs text-gray-500 dark:text-gray-400">
								{t.reports.kappa}
							</div>
							<div className="text-lg font-semibold text-gray-800 dark:text-white/90">
								{agreementQuery.data.metrics.kappa.toFixed(3)}
							</div>
						</div>
						<div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/40">
							<div className="text-xs text-gray-500 dark:text-gray-400">
								{t.reports.observedAgreement}
							</div>
							<div className="text-lg font-semibold text-gray-800 dark:text-white/90">
								{(agreementQuery.data.metrics.agreementRate * 100).toFixed(1)}%
							</div>
						</div>
						<div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/40">
							<div className="text-xs text-gray-500 dark:text-gray-400">
								{t.reports.units}
							</div>
							<div className="text-lg font-semibold text-gray-800 dark:text-white/90">
								{agreementQuery.data.metrics.total}
							</div>
						</div>
					</div>
				)}
			</section>

			<section className="space-y-3">
				<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
					{t.reports.savedQueriesTitle}
				</h3>
				<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
					<input
						type="text"
						value={savedName}
						onChange={(e) => setSavedName(e.target.value)}
						placeholder={t.reports.savedQueryName}
						className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
					/>
					<input
						type="text"
						value={savedSearch}
						onChange={(e) => setSavedSearch(e.target.value)}
						placeholder={t.reports.searchPlaceholder}
						className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
					/>
					<select
						value={savedDocumentId}
						onChange={(e) => setSavedDocumentId(e.target.value)}
						className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
					>
						<option value="">{t.reports.allDocuments}</option>
						{documents.map((doc) => (
							<option key={doc.id} value={doc.id}>
								{doc.name}
							</option>
						))}
					</select>
					<select
						value={savedCodeId}
						onChange={(e) => setSavedCodeId(e.target.value)}
						className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
					>
						<option value="">{t.reports.allCodes}</option>
						{codes.map((code) => (
							<option key={code.id} value={code.id}>
								{code.name}
							</option>
						))}
					</select>
				</div>
				<label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
					<input
						type="checkbox"
						checked={savedUncodedOnly}
						onChange={(e) => setSavedUncodedOnly(e.target.checked)}
					/>
					{t.reports.uncodedOnly}
				</label>
				<div>
					<button
						type="button"
						onClick={() =>
							createSavedQuery.mutate({
								projectId,
								name: savedName.trim() || t.reports.savedQueryDefaultName,
								filters: {
									...(savedSearch.trim() ? { search: savedSearch.trim() } : {}),
									...(savedDocumentId ? { documentId: savedDocumentId } : {}),
									...(savedCodeId ? { codeId: savedCodeId } : {}),
									...(savedUncodedOnly ? { uncodedOnly: true } : {}),
								},
							})
						}
						disabled={createSavedQuery.isPending}
						className="h-9 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
					>
						{t.reports.saveQuery}
					</button>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<select
						value={selectedSavedQueryId}
						onChange={(e) => setSelectedSavedQueryId(e.target.value)}
						className="h-9 min-w-72 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
					>
						<option value="">{t.reports.selectSavedQuery}</option>
						{savedQueries?.map((query) => (
							<option key={query.id} value={query.id}>
								{query.name}
							</option>
						))}
					</select>
					{selectedSavedQueryId && (
						<button
							type="button"
							onClick={() =>
								deleteSavedQuery.mutate({
									projectId,
									savedQueryId: selectedSavedQueryId,
								})
							}
							className="h-9 rounded-lg border border-red-300 px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-900/20"
						>
							{t.common.delete}
						</button>
					)}
				</div>

				{selectedSavedQueryId && (
					<div className="rounded-xl border border-gray-200 p-4 text-sm dark:border-gray-800">
						<div className="text-gray-600 dark:text-gray-300">
							{t.reports.savedQueryResults}: {runSavedQuery.data?.length ?? 0}
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
