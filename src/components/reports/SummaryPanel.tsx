"use client";

import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

interface SummaryPanelProps {
	projectId: string;
}

export default function SummaryPanel({ projectId }: SummaryPanelProps) {
	const t = useTranslation();
	const { data, isLoading } = trpc.report.summary.useQuery({ projectId });

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 3 }, (_, i) => (
					<div
						key={i}
						className="h-12 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		);
	}

	if (!data || (data.documents.length === 0 && data.codes.length === 0)) {
		return (
			<div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400 dark:border-gray-700">
				{t.reports.noData}
			</div>
		);
	}

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
							{data.documents.map((row) => (
								<tr
									key={row.id}
									className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
								>
									<td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">
										{row.name}
									</td>
									<td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
										{row.quoteCount}
									</td>
									<td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
										{row.codesUsed}
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
				{data.codes.length === 0 ? (
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
								{data.codes.map((row) => (
									<tr
										key={row.id}
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
											{row.documentsUsed}
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
