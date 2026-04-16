"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface Code {
	id: string;
	name: string;
}

interface Quote {
	id: string;
	document: { id: string; name: string };
	quoteCodes: { code: Code }[];
}

interface ChartsPanelProps {
	quotes: Quote[];
}

function PlotChart({
	title,
	data,
	options,
}: {
	title: string;
	data: object[];
	options: Plot.PlotOptions;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current || data.length === 0) return;
		const chart = Plot.plot(options);
		// Plot renders the color legend as HTML outside the SVG, so the `style`
		// option does not reach it. Inject a scoped <style> to override.
		const color =
			options.style && typeof options.style === "object" && "color" in options.style
				? String((options.style as { color?: string }).color ?? "")
				: "";
		if (color) {
			const styleEl = document.createElement("style");
			styleEl.textContent = `figure { color: ${color}; } figure div, figure span, figure label { color: ${color} !important; }`;
			chart.prepend(styleEl);
		}
		ref.current.replaceChildren(chart);
		return () => chart.remove();
	});

	return (
		<div>
			<h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
				{title}
			</h3>
			<div
				ref={ref}
				className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50"
			/>
		</div>
	);
}

export default function ChartsPanel({ quotes }: ChartsPanelProps) {
	const t = useTranslation();
	const { theme } = useTheme();

	const isDark = theme === "dark";
	const textColor = isDark ? "#e5e7eb" : "#374151"; // gray-200 : gray-700
	const gridColor = isDark ? "#374151" : "#e5e7eb"; // gray-700 : gray-200
	const bgColor = isDark ? "#111827" : "#ffffff"; // gray-900 : white

	const plotStyle = {
		background: "transparent",
		color: textColor,
		fontSize: "12px",
	};

	// Build quotes × codes matrix
	const quotesHeatmapRows: { document: string; code: string; count: number }[] =
		[];
	const docCodeMap = new Map<string, Map<string, number>>();
	for (const q of quotes) {
		for (const { code } of q.quoteCodes) {
			const docMap =
				docCodeMap.get(q.document.name) ?? new Map<string, number>();
			docMap.set(code.name, (docMap.get(code.name) ?? 0) + 1);
			docCodeMap.set(q.document.name, docMap);
		}
	}
	for (const [doc, codes] of docCodeMap) {
		for (const [code, count] of codes) {
			quotesHeatmapRows.push({ document: doc, code, count });
		}
	}

	// Build code co-occurrence matrix
	const coOccRows: { codeA: string; codeB: string; count: number }[] = [];
	const coMap = new Map<string, number>();
	for (const q of quotes) {
		const codes = q.quoteCodes.map(({ code }) => code.name).sort();
		for (let i = 0; i < codes.length; i++) {
			for (let j = i; j < codes.length; j++) {
				const key = `${codes[i]}|||${codes[j]}`;
				coMap.set(key, (coMap.get(key) ?? 0) + 1);
			}
		}
	}
	for (const [key, count] of coMap) {
		const [codeA, codeB] = key.split("|||");
		coOccRows.push({ codeA: codeA ?? "", codeB: codeB ?? "", count });
	}

	const hasData = quotesHeatmapRows.length > 0;

	if (!hasData) {
		return (
			<div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
				{t.reports.noDataForCharts}
			</div>
		);
	}

	const allDocs = [...new Set(quotesHeatmapRows.map((r) => r.document))];
	const allCodes = [...new Set(quotesHeatmapRows.map((r) => r.code))];
	const allCodesForCo = [
		...new Set(coOccRows.flatMap((r) => [r.codeA, r.codeB])),
	];

	return (
		<div className="space-y-8">
			<PlotChart
				title={t.reports.quotesHeatmapTitle}
				data={quotesHeatmapRows}
				options={{
					marginLeft: 140,
					marginBottom: 80,
					style: plotStyle,
					x: { domain: allCodes, label: t.reports.code, tickRotate: -40 },
					y: { domain: allDocs, label: t.reports.document },
					color: { scheme: "blues", legend: true, label: t.reports.count },
					marks: [
						Plot.cell(quotesHeatmapRows, {
							x: "code",
							y: "document",
							fill: "count",
							tip: true,
						}),
						Plot.text(quotesHeatmapRows, {
							x: "code",
							y: "document",
							text: (d: { count: number }) => String(d.count),
							fill: "white",
							fontSize: 11,
							fontWeight: "bold",
						}),
					],
				}}
			/>

			{coOccRows.length > 0 && (
				<PlotChart
					title={t.reports.coOccurrenceTitle}
					data={coOccRows}
					options={{
						marginLeft: 140,
						marginBottom: 80,
						style: plotStyle,
						x: {
							domain: allCodesForCo,
							label: t.reports.code,
							tickRotate: -40,
						},
						y: { domain: allCodesForCo, label: t.reports.code },
						color: { scheme: "greens", legend: true, label: t.reports.count },
						marks: [
							Plot.cell(coOccRows, {
								x: "codeA",
								y: "codeB",
								fill: "count",
								tip: true,
							}),
							Plot.cell(coOccRows, {
								x: "codeB",
								y: "codeA",
								fill: "count",
							}),
							Plot.text(coOccRows, {
								x: "codeA",
								y: "codeB",
								text: (d: { count: number }) => String(d.count),
								fill: "white",
								fontSize: 11,
								fontWeight: "bold",
							}),
						],
					}}
				/>
			)}
		</div>
	);
}
