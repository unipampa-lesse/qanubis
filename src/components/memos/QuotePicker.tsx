"use client";

import { useMemo, useState } from "react";
import {
	HiOutlineMagnifyingGlass,
	HiOutlineXMark,
} from "react-icons/hi2";
import { useTranslation } from "@/context/LanguageContext";
import { trpc } from "@/server/client";

interface QuotePickerProps {
	projectId: string;
	onSelect: (quote: {
		id: string;
		text: string;
		page: number;
		document: { id: string; name: string };
	}) => void;
	onClose: () => void;
}

export default function QuotePicker({
	projectId,
	onSelect,
	onClose,
}: QuotePickerProps) {
	const t = useTranslation();
	const [search, setSearch] = useState("");

	const { data: quotes, isLoading } = trpc.quote.listForProject.useQuery({
		projectId,
	});

	const filtered = useMemo(() => {
		if (!quotes) return [];
		const q = search.trim().toLowerCase();
		if (!q) return quotes;
		return quotes.filter(
			(qt) =>
				qt.text.toLowerCase().includes(q) ||
				qt.document.name.toLowerCase().includes(q),
		);
	}, [quotes, search]);

	return (
		<div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 p-4">
			<div className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
					<h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">
						{t.memos.quotePicker}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
					>
						<HiOutlineXMark className="h-5 w-5" />
					</button>
				</div>

				{/* Search */}
				<div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
					<div className="relative">
						<HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							autoFocus
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={t.memos.quotePickerSearch}
							className="h-9 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
						/>
					</div>
				</div>

				{/* Quote list */}
				<div className="overflow-y-auto">
					{isLoading && (
						<div className="space-y-2 p-4">
							{[1, 2, 3].map((k) => (
								<div
									key={k}
									className="h-14 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
								/>
							))}
						</div>
					)}
					{!isLoading && filtered.length === 0 && (
						<p className="p-6 text-center text-sm text-gray-400">
							{t.memos.quotePickerEmpty}
						</p>
					)}
					{filtered.map((qt) => (
						<button
							key={qt.id}
							type="button"
							onClick={() => {
								onSelect(qt);
								onClose();
							}}
							className="w-full border-b border-gray-100 px-5 py-3 text-left last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.03]"
						>
							<p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
								"{qt.text}"
							</p>
							<p className="mt-0.5 text-xs text-gray-400">
								{qt.document.name} · p. {qt.page}
							</p>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
