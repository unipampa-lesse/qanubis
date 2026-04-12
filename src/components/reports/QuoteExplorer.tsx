"use client";

import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";

interface Code {
	id: string;
	name: string;
	color: string;
	textColor: string;
}

interface Quote {
	id: string;
	text: string;
	page: number;
	color: string;
	createdAt: Date;
	document: { id: string; name: string };
	createdBy: { id: string; name: string | null };
	quoteCodes: { code: Code }[];
}

interface QuoteExplorerProps {
	quotes: Quote[];
}

export default function QuoteExplorer({ quotes }: QuoteExplorerProps) {
	const t = useTranslation();
	const [docFilter, setDocFilter] = useState("all");
	const [codeFilter, setCodeFilter] = useState("all");
	const [search, setSearch] = useState("");

	const allDocs = Array.from(
		new Map(quotes.map((q) => [q.document.id, q.document])).values(),
	);
	const allCodes = Array.from(
		new Map(
			quotes.flatMap((q) => q.quoteCodes.map(({ code }) => [code.id, code])),
		).values(),
	);

	const filtered = quotes.filter((q) => {
		if (docFilter !== "all" && q.document.id !== docFilter) return false;
		if (
			codeFilter !== "all" &&
			!q.quoteCodes.some(({ code }) => code.id === codeFilter)
		)
			return false;
		if (search && !q.text.toLowerCase().includes(search.toLowerCase()))
			return false;
		return true;
	});

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-wrap gap-2">
				<input
					type="search"
					placeholder="Search quotes…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="flex-1 min-w-48 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
				/>
				<select
					value={docFilter}
					onChange={(e) => setDocFilter(e.target.value)}
					className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
				>
					<option value="all">{t.reports.allDocuments}</option>
					{allDocs.map((d) => (
						<option key={d.id} value={d.id}>
							{d.name}
						</option>
					))}
				</select>
				<select
					value={codeFilter}
					onChange={(e) => setCodeFilter(e.target.value)}
					className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
				>
					<option value="all">{t.reports.allCodes}</option>
					{allCodes.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>
				<span className="self-center text-xs text-gray-400">
					{filtered.length} {t.reports.quoteCount}
				</span>
			</div>

			{/* Quote list */}
			{filtered.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400 dark:border-gray-700">
					{t.reports.noQuotes}
				</div>
			) : (
				<div className="space-y-2">
					{filtered.map((q) => (
						<div
							key={q.id}
							className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50"
						>
							<div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
								<span className="font-medium text-gray-600 dark:text-gray-300">
									{q.document.name}
								</span>
								<span>·</span>
								<span>
									{t.reports.page} {q.page}
								</span>
								{q.createdBy.name && (
									<>
										<span>·</span>
										<span>{q.createdBy.name}</span>
									</>
								)}
							</div>

							<blockquote
								className="border-l-4 pl-3 text-sm text-gray-700 italic dark:text-gray-300"
								style={{ borderColor: q.color }}
							>
								"{q.text}"
							</blockquote>

							{q.quoteCodes.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-1">
									{q.quoteCodes.map(({ code }) => (
										<span
											key={code.id}
											className="rounded px-2 py-0.5 text-xs font-medium"
											style={{
												backgroundColor: code.color,
												color: code.textColor,
											}}
										>
											{code.name}
										</span>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
