"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import Link from "next/link";
import { HiOutlineDocumentText } from "react-icons/hi2";

export default function QuoteReferenceView({ node, selected }: NodeViewProps) {
	const { quoteText, documentName, projectId, documentId, page } =
		node.attrs as {
			quoteText: string;
			documentName: string;
			projectId: string | null;
			documentId: string | null;
			page: number;
		};

	return (
		<NodeViewWrapper>
			<div
				className={`my-2 rounded-lg border-l-4 border-brand-400 bg-brand-50 p-3 dark:border-brand-500 dark:bg-brand-900/20 ${
					selected ? "ring-2 ring-brand-400/50" : ""
				}`}
				data-drag-handle
			>
				<p className="mb-1 line-clamp-3 text-sm italic text-gray-700 dark:text-gray-300">
					&ldquo;{quoteText}&rdquo;
				</p>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-1 text-xs text-gray-400">
						<HiOutlineDocumentText className="h-3.5 w-3.5" />
						<span className="max-w-[200px] truncate">{documentName}</span>
						<span>· p. {page}</span>
					</div>
					{projectId && documentId && (
						<Link
							href={`/dashboard/projects/${projectId}/documents/${documentId}`}
							className="shrink-0 text-xs text-brand-600 hover:underline dark:text-brand-400"
							onClick={(e) => e.stopPropagation()}
						>
							ver →
						</Link>
					)}
				</div>
			</div>
		</NodeViewWrapper>
	);
}
