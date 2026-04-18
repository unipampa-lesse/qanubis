"use client";

import {
	HiOutlineArrowDownTray,
	HiOutlineDocumentText,
	HiOutlineTag,
	HiOutlineNewspaper,
} from "react-icons/hi2";
import Button from "@/components/ui/button/Button";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

interface Code {
	id: string;
	name: string;
}

interface Quote {
	id: string;
	text: string;
	page: number;
	document: { id: string; name: string };
	quoteCodes: { code: Code }[];
}

interface ExportPanelProps {
	projectId: string;
	quotes: Quote[];
	projectName: string;
}

function downloadFile(content: string, filename: string, mime: string) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

function buildTxtByCode(quotes: Quote[]): string {
	const groups = new Map<string, { quoteName: string; quotes: Quote[] }>();
	for (const q of quotes) {
		const codes = q.quoteCodes.map((qc) => qc.code);
		if (codes.length === 0) {
			const key = "__uncoded__";
			const g = groups.get(key) ?? { quoteName: "(Uncoded)", quotes: [] };
			g.quotes.push(q);
			groups.set(key, g);
		}
		for (const code of codes) {
			const g = groups.get(code.id) ?? { quoteName: code.name, quotes: [] };
			g.quotes.push(q);
			groups.set(code.id, g);
		}
	}

	let out = "";
	for (const { quoteName, quotes: qs } of groups.values()) {
		out += `\n${"=".repeat(60)}\nCODE: ${quoteName}\n${"=".repeat(60)}\n\n`;
		for (const q of qs) {
			out += `[${q.document.name} — p.${q.page}]\n"${q.text}"\n\n`;
		}
	}
	return out.trim();
}

function buildTxtByDocument(quotes: Quote[]): string {
	const groups = new Map<string, { docName: string; quotes: Quote[] }>();
	for (const q of quotes) {
		const g = groups.get(q.document.id) ?? {
			docName: q.document.name,
			quotes: [],
		};
		g.quotes.push(q);
		groups.set(q.document.id, g);
	}

	let out = "";
	for (const { docName, quotes: qs } of groups.values()) {
		out += `\n${"=".repeat(60)}\nDOCUMENT: ${docName}\n${"=".repeat(60)}\n\n`;
		for (const q of qs) {
			const codes = q.quoteCodes.map((qc) => qc.code.name).join(", ");
			out += `[p.${q.page}${codes ? ` | ${codes}` : ""}]\n"${q.text}"\n\n`;
		}
	}
	return out.trim();
}

function buildCsvByCode(quotes: Quote[]): string {
	const rows: string[][] = [["code", "document", "page", "quote"]];
	for (const q of quotes) {
		const codes =
			q.quoteCodes.length > 0
				? q.quoteCodes.map((qc) => qc.code.name)
				: ["(uncoded)"];
		for (const code of codes) {
			rows.push([
				code,
				q.document.name,
				String(q.page),
				q.text.replace(/"/g, '""'),
			]);
		}
	}
	return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
}

function buildCsvByDocument(quotes: Quote[]): string {
	const rows: string[][] = [["document", "page", "codes", "quote"]];
	for (const q of quotes) {
		const codes = q.quoteCodes.map((qc) => qc.code.name).join("; ");
		rows.push([
			q.document.name,
			String(q.page),
			codes,
			q.text.replace(/"/g, '""'),
		]);
	}
	return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
}

// Recursively extracts plain text from a Tiptap JSON document node.
function tiptapToText(node: unknown): string {
	if (!node || typeof node !== "object") return "";
	const n = node as { type?: string; text?: string; content?: unknown[] };
	if (typeof n.text === "string") return n.text;
	if (Array.isArray(n.content)) {
		const blockTypes = new Set([
			"paragraph",
			"heading",
			"blockquote",
			"listItem",
			"bulletList",
			"orderedList",
			"codeBlock",
		]);
		return (
			n.content.map(tiptapToText).join("") +
			(blockTypes.has(n.type ?? "") ? "\n" : "")
		);
	}
	return "";
}

type NarrativeData = {
	codes: {
		id: string;
		name: string;
		description: string | null;
		quotes: { id: string; text: string; page: number; document: { name: string } }[];
	}[];
	memos: { id: string; name: string; content: unknown }[];
};

function buildNarrativeMarkdown(
	data: NarrativeData,
	projectName: string,
): string {
	const lines: string[] = [];
	const date = new Date().toLocaleDateString("en-CA"); // ISO date
	lines.push(`# ${projectName} — Narrative Report`);
	lines.push(`\n*Generated: ${date}*\n`);
	lines.push("---\n");

	for (const code of data.codes) {
		if (code.quotes.length === 0) continue;
		lines.push(`## ${code.name}`);
		if (code.description) lines.push(`\n*${code.description}*`);
		lines.push(`\n*${code.quotes.length} quote(s)*\n`);
		for (const q of code.quotes) {
			lines.push(`> "${q.text}"`);
			lines.push(`> — ${q.document.name}, p. ${q.page}\n`);
		}
		lines.push("---\n");
	}

	if (data.memos.length > 0) {
		lines.push("## Memos\n");
		for (const memo of data.memos) {
			lines.push(`### ${memo.name}\n`);
			const text = tiptapToText(memo.content).trim();
			if (text) lines.push(text + "\n");
		}
	}

	return lines.join("\n");
}

export default function ExportPanel({ projectId, quotes, projectName }: ExportPanelProps) {
	const t = useTranslation();
	const slug = projectName.toLowerCase().replace(/\s+/g, "-");

	const { data: narrativeData, isLoading: isLoadingNarrative } =
		trpc.report.narrativeExport.useQuery({ projectId });

	const hasCodesWithQuotes =
		narrativeData?.codes.some((c) => c.quotes.length > 0) ?? false;

	if (quotes.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
				{t.reports.exportEmptyHint}
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2">
			{/* By code */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
				<div className="mb-3 flex items-center gap-2">
					<HiOutlineTag className="h-5 w-5 text-brand-500" />
					<h3 className="font-semibold text-gray-700 dark:text-gray-300">
						{t.reports.exportByCode}
					</h3>
				</div>
				<p className="mb-4 text-xs text-gray-400">
					{quotes.length} {t.reports.quoteCount} · grouped by code
				</p>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						startIcon={<HiOutlineArrowDownTray className="h-4 w-4" />}
						onClick={() =>
							downloadFile(
								buildTxtByCode(quotes),
								`${slug}-by-code.txt`,
								"text/plain;charset=utf-8",
							)
						}
					>
						{t.reports.exportTXT}
					</Button>
					<Button
						size="sm"
						variant="outline"
						startIcon={<HiOutlineArrowDownTray className="h-4 w-4" />}
						onClick={() =>
							downloadFile(
								buildCsvByCode(quotes),
								`${slug}-by-code.csv`,
								"text/csv;charset=utf-8",
							)
						}
					>
						{t.reports.exportCSV}
					</Button>
				</div>
			</div>

			{/* By document */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
				<div className="mb-3 flex items-center gap-2">
					<HiOutlineDocumentText className="h-5 w-5 text-brand-500" />
					<h3 className="font-semibold text-gray-700 dark:text-gray-300">
						{t.reports.exportByDocument}
					</h3>
				</div>
				<p className="mb-4 text-xs text-gray-400">
					{quotes.length} {t.reports.quoteCount} · grouped by document
				</p>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						startIcon={<HiOutlineArrowDownTray className="h-4 w-4" />}
						onClick={() =>
							downloadFile(
								buildTxtByDocument(quotes),
								`${slug}-by-document.txt`,
								"text/plain;charset=utf-8",
							)
						}
					>
						{t.reports.exportTXT}
					</Button>
					<Button
						size="sm"
						variant="outline"
						startIcon={<HiOutlineArrowDownTray className="h-4 w-4" />}
						onClick={() =>
							downloadFile(
								buildCsvByDocument(quotes),
								`${slug}-by-document.csv`,
								"text/csv;charset=utf-8",
							)
						}
					>
						{t.reports.exportCSV}
					</Button>
				</div>
			</div>

			{/* JSON export */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50 sm:col-span-2">
				<div className="mb-3 flex items-center gap-2">
					<HiOutlineArrowDownTray className="h-5 w-5 text-brand-500" />
					<h3 className="font-semibold text-gray-700 dark:text-gray-300">
						{t.reports.exportJSON}
					</h3>
				</div>
				<p className="mb-4 text-xs text-gray-400">
					{t.reports.exportJSONHint}
				</p>
				<Button
					size="sm"
					variant="outline"
					startIcon={<HiOutlineArrowDownTray className="h-4 w-4" />}
					onClick={() =>
						downloadFile(
							JSON.stringify(
								quotes.map((q) => ({
									text: q.text,
									page: q.page,
									document: q.document.name,
									codes: q.quoteCodes.map((qc) => qc.code.name),
								})),
								null,
								2,
							),
							`${slug}-quotes.json`,
							"application/json;charset=utf-8",
						)
					}
				>
					{t.reports.exportJSON}
				</Button>
			</div>

			{/* Narrative export */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50 sm:col-span-2">
				<div className="mb-3 flex items-center gap-2">
					<HiOutlineNewspaper className="h-5 w-5 text-brand-500" />
					<h3 className="font-semibold text-gray-700 dark:text-gray-300">
						{t.reports.exportNarrative}
					</h3>
				</div>
				<p className="mb-4 text-xs text-gray-400">
					{t.reports.exportNarrativeHint}
				</p>
				{isLoadingNarrative ? (
					<div className="h-8 w-48 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
				) : !hasCodesWithQuotes ? (
					<p className="text-xs text-gray-400">{t.reports.exportNarrativeEmpty}</p>
				) : (
					<Button
						size="sm"
						variant="outline"
						startIcon={<HiOutlineArrowDownTray className="h-4 w-4" />}
						onClick={() =>
							downloadFile(
								buildNarrativeMarkdown(narrativeData!, projectName),
								`${slug}-narrative.md`,
								"text/markdown;charset=utf-8",
							)
						}
					>
						{t.reports.exportMarkdown}
					</Button>
				)}
			</div>
		</div>
	);
}
