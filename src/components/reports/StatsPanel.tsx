"use client";

import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

interface StatsPanelProps {
	projectId: string;
}

function StatCard({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
			<p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
			<p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
				{value}
			</p>
		</div>
	);
}

export default function StatsPanel({ projectId }: StatsPanelProps) {
	const t = useTranslation();
	const { data: stats, isLoading } = trpc.report.stats.useQuery({ projectId });

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
				{["card-1", "card-2", "card-3", "card-4", "card-5"].map((itemKey) => (
					<div
						key={itemKey}
						className="h-20 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		);
	}

	if (!stats) return null;

	return (
		<div className="space-y-8">
			{/* Totals */}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
				<StatCard
					label={t.reports.totalDocuments}
					value={stats.totals.documents}
				/>
				<StatCard label={t.reports.totalQuotes} value={stats.totals.quotes} />
				<StatCard label={t.reports.totalCodes} value={stats.totals.codes} />
				<StatCard label={t.reports.totalMemos} value={stats.totals.memos} />
				<StatCard
					label={t.reports.uncodedQuotes}
					value={stats.totals.uncodedQuotes}
				/>
			</div>

			{/* Quotes per code (bar-like) */}
			{stats.quotesPerCode.length > 0 && (
				<div>
					<h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
						{t.reports.codeFrequency}
					</h3>
					<div className="space-y-2">
						{stats.quotesPerCode.map((c) => {
							const max = stats.quotesPerCode[0].count;
							const pct = max > 0 ? (c.count / max) * 100 : 0;
							return (
								<div key={c.codeId} className="flex items-center gap-3">
									<span
										className="inline-flex min-w-20 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
										style={{ backgroundColor: c.color }}
									>
										{c.name}
									</span>
									<div className="relative flex-1 h-5 rounded-full bg-gray-100 dark:bg-gray-800">
										<div
											className="absolute inset-y-0 left-0 rounded-full"
											style={{
												width: `${pct}%`,
												backgroundColor: c.color,
												opacity: 0.6,
											}}
										/>
									</div>
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-8 text-right">
										{c.count}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Quotes per document */}
			{stats.quotesPerDocument.length > 0 && (
				<div>
					<h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
						{t.reports.documentDistribution}
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
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
								{stats.quotesPerDocument.map((d) => (
									<tr
										key={d.documentId}
										className="hover:bg-gray-50 dark:hover:bg-white/2"
									>
										<td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">
											{d.name}
										</td>
										<td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
											{d.count}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
