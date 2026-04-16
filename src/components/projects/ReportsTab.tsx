"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import ExportPanel from "@/components/reports/ExportPanel";
import QuoteExplorer from "@/components/reports/QuoteExplorer";
import StatsPanel from "@/components/reports/StatsPanel";
import SummaryPanel from "@/components/reports/SummaryPanel";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

const ChartsPanel = dynamic(() => import("@/components/reports/ChartsPanel"), {
	ssr: false,
	loading: () => (
		<div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800" />
	),
});

interface ReportsTabProps {
	projectId: string;
	projectName: string;
}

type SubTab = "explorer" | "stats" | "charts" | "summary" | "export";

export default function ReportsTab({
	projectId,
	projectName,
}: ReportsTabProps) {
	const t = useTranslation();
	const [activeSubTab, setActiveSubTab] = useState<SubTab>("explorer");

	const { data: quotes, isLoading } = trpc.report.quotes.useQuery({
		projectId,
	});

	const SUB_TABS: { id: SubTab; label: string }[] = [
		{ id: "explorer", label: t.reports.explorer },
		{ id: "stats", label: t.reports.stats },
		{ id: "charts", label: t.reports.charts },
		{ id: "summary", label: t.reports.summary },
		{ id: "export", label: t.reports.export },
	];

	if (isLoading) {
		return (
			<div className="space-y-3">
				{(["a", "b", "c"] as const).map((k) => (
					<div
						key={k}
						className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
					/>
				))}
			</div>
		);
	}

	const safeQuotes = quotes ?? [];

	return (
		<div className="space-y-5">
			{/* Sub-tab bar */}
			<div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
				{SUB_TABS.map(({ id, label }) => (
					<button
						key={id}
						type="button"
						onClick={() => setActiveSubTab(id)}
						className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
							activeSubTab === id
								? "border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-400"
								: "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						}`}
					>
						{label}
					</button>
				))}
			</div>

			{activeSubTab === "explorer" && <QuoteExplorer quotes={safeQuotes} />}
			{activeSubTab === "stats" && <StatsPanel projectId={projectId} />}
			{activeSubTab === "charts" && <ChartsPanel quotes={safeQuotes} />}
			{activeSubTab === "summary" && <SummaryPanel projectId={projectId} />}
			{activeSubTab === "export" && (
				<ExportPanel quotes={safeQuotes} projectName={projectName} />
			)}
		</div>
	);
}
