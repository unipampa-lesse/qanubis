"use client";

import { useTranslation } from "@/context/LanguageContext";

type Quote = {
	document: { id: string; name: string };
	quoteCodes: {
		code: { id: string; name: string; color: string; textColor: string };
	}[];
};

interface SummaryPanelProps {
	quotes: Quote[];
}

export default function SummaryPanel({ quotes }: SummaryPanelProps) {
	const t = useTranslation();

	if (quotes.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400 dark:border-gray-700">
				{t.reports.noData}
			</div>
		);
	}

	// --- Documents table ---
	const docMap = new Map<
		string,
		{ name: string; quoteCount: number; codeIds: Set<string> }
	>();
	for (const q of quotes) {
		const entry = docMap.get(q.document.id) ?? {
			name: q.document.name,
			quoteCount: 0,
			codeIds: new Set(),
		};
		entry.quoteCount++;
		for (const qc of q.quoteCodes) entry.codeIds.add(qc.code.id);
		docMap.set(q.document.id, entry);
	}
	const docRows = [...docMap.values()].sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	// --- Codes table ---
	const codeMap = new Map<
		string,
		{
			name: string;
			color: string;
			textColor: string;
			quoteCount: number;
			docIds: Set<string>;
		}
	>();
	for (const q of quotes) {
		for (const qc of q.quoteCodes) {
			const entry = codeMap.get(qc.code.id) ?? {
				name: qc.code.name,
				color: qc.code.color,
				textColor: qc.code.textColor,
				quoteCount: 0,
				docIds: new Set(),
			};
			entry.quoteCount++;
			entry.docIds.add(q.document.id);
			codeMap.set(qc.code.id, entry);
		}
	}
	const codeRows = [...codeMap.values()].sort(
		(a, b) => b.quoteCount - a.quoteCount,
	);

	return (
		<div className="space-y-8">
			{/* Documents table */}
			<div>
				<h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
					{t.reports.documentsTable}
				</h3>
				<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 dark:bg-gray-800/50">
							<tr>
								<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
									{t.reports.document}
								</th>
								<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
									{t.reports.quotesCount}
								</th>
								<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
									{t.reports.codesUsed}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
							{docRows.map((row) => (
								<tr
									key={row.name}
									className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
								>
									<td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">
										{row.name}
									</td>
									<td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
										{row.quoteCount}
									</td>
									<td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
										{row.codeIds.size}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Codes table */}
			<div>
				<h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
					{t.reports.codesTable}
				</h3>
				{codeRows.length === 0 ? (
					<p className="text-sm text-gray-400">{t.reports.noData}</p>
				) : (
					<div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 dark:bg-gray-800/50">
								<tr>
									<th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
										{t.reports.code}
									</th>
									<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
										{t.reports.quotesCount}
									</th>
									<th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
										{t.reports.documentsUsed}
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
								{codeRows.map((row) => (
									<tr
										key={row.name}
										className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
									>
										<td className="px-5 py-3">
											<span
												className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
												style={{
													backgroundColor: row.color,
													color: row.textColor,
												}}
											>
												{row.name}
											</span>
										</td>
										<td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
											{row.quoteCount}
										</td>
										<td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
											{row.docIds.size}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
