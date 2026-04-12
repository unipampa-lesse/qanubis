"use client";

import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/context/LanguageContext";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuoteHighlight {
	id: string;
	page: number;
	position: { start: number; end: number };
	/** The quote's own highlight color — independent of any code colors. */
	color: string;
}

export interface PendingSelection {
	text: string;
	page: number;
	position: { start: number; end: number };
}

interface HighlightRect {
	quoteId: string;
	left: number;
	top: number;
	width: number;
	height: number;
	color: string;
}

interface PdfViewerProps {
	url: string;
	quotes: QuoteHighlight[];
	selectedQuoteId: string | null;
	canEdit: boolean;
	/** Called when the user selects text — parent decides whether to create a quote */
	onSelection: (selection: PendingSelection) => void;
	/** Called when the user clicks an existing highlight */
	onHighlightClick: (quoteId: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Walk all text nodes in `container` and compute global char offsets for a selection Range. */
function getGlobalOffsets(
	container: HTMLElement,
	startNode: Node,
	startNodeOffset: number,
	endNode: Node,
	endNodeOffset: number,
): { start: number; end: number } | null {
	let charCount = 0;
	let start = -1;
	let end = -1;

	function walk(node: Node): boolean {
		if (node.nodeType === Node.TEXT_NODE) {
			const len = (node.textContent ?? "").length;
			if (node === startNode && start === -1) {
				start = charCount + startNodeOffset;
			}
			if (node === endNode) {
				end = charCount + endNodeOffset;
				return true;
			}
			charCount += len;
		} else {
			for (const child of Array.from(node.childNodes)) {
				if (walk(child)) return true;
			}
		}
		return false;
	}

	walk(container);
	return start >= 0 && end > start ? { start, end } : null;
}

/** Reconstruct a DOM Range from stored global char offsets. */
function globalOffsetsToRange(
	container: HTMLElement,
	start: number,
	end: number,
): Range | null {
	let charCount = 0;
	let range: Range | null = null;

	function walk(node: Node): boolean {
		if (node.nodeType === Node.TEXT_NODE) {
			const len = (node.textContent ?? "").length;

			if (range === null && start < charCount + len) {
				range = document.createRange();
				range.setStart(node, start - charCount);
			}
			if (range !== null && end <= charCount + len) {
				range.setEnd(node, end - charCount);
				return true;
			}

			charCount += len;
		} else {
			for (const child of Array.from(node.childNodes)) {
				if (walk(child)) return true;
			}
		}
		return false;
	}

	walk(container);
	return range;
}

/** Compute highlight rects for all quotes on the current page. */
function computeHighlights(
	textLayerEl: HTMLElement,
	pageContainerEl: HTMLElement,
	quotes: QuoteHighlight[],
	currentPage: number,
): HighlightRect[] {
	const containerRect = pageContainerEl.getBoundingClientRect();
	const result: HighlightRect[] = [];

	for (const quote of quotes) {
		if (quote.page !== currentPage) continue;

		const range = globalOffsetsToRange(
			textLayerEl,
			quote.position.start,
			quote.position.end,
		);
		if (!range) continue;

		const primaryColor = quote.color;

		for (const rect of Array.from(range.getClientRects())) {
			if (rect.width < 1) continue;
			result.push({
				quoteId: quote.id,
				left: rect.left - containerRect.left,
				top: rect.top - containerRect.top,
				width: rect.width,
				height: rect.height,
				color: primaryColor,
			});
		}
	}

	return result;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PdfViewer({
	url,
	quotes,
	selectedQuoteId,
	canEdit,
	onSelection,
	onHighlightClick,
}: PdfViewerProps) {
	const t = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const textLayerRef = useRef<HTMLDivElement>(null);
	const pageContainerRef = useRef<HTMLDivElement>(null);

	const pdfRef = useRef<PDFDocumentProxy | null>(null);
	const renderTaskRef = useRef<ReturnType<PDFPageProxy["render"]> | null>(null);

	const [numPages, setNumPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [highlights, setHighlights] = useState<HighlightRect[]>([]);
	const [isScanned, setIsScanned] = useState(false);

	// Tooltip for "Quote" button after text selection
	const [selectionTooltip, setSelectionTooltip] = useState<{
		x: number;
		y: number;
		selection: PendingSelection;
	} | null>(null);

	// ---------------------------------------------------------------------------
	// Load PDF
	// ---------------------------------------------------------------------------

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);

		pdfjsLib
			.getDocument({ url, withCredentials: false })
			.promise.then((pdf) => {
				if (cancelled) return;
				pdfRef.current = pdf;
				setNumPages(pdf.numPages);
				setCurrentPage(1);
				setLoading(false);
			})
			.catch(() => {
				if (!cancelled) setError("load");
			});

		return () => {
			cancelled = true;
			pdfRef.current?.destroy();
			pdfRef.current = null;
		};
	}, [url]);

	// ---------------------------------------------------------------------------
	// Render page
	// ---------------------------------------------------------------------------

	const renderPage = useCallback(
		async (pageNum: number) => {
			const pdf = pdfRef.current;
			const canvas = canvasRef.current;
			const textLayerEl = textLayerRef.current;
			const container = containerRef.current;
			if (!pdf || !canvas || !textLayerEl || !container) return;

			// Cancel any in-flight render
			renderTaskRef.current?.cancel();

			const page = await pdf.getPage(pageNum);

			// Scale to fit the container width
			const containerWidth = container.clientWidth || 800;
			const viewport = page.getViewport({ scale: 1 });
			const scale = Math.min((containerWidth - 2) / viewport.width, 2.5);
			const scaledViewport = page.getViewport({ scale });

			canvas.width = scaledViewport.width;
			canvas.height = scaledViewport.height;
			canvas.style.width = `${scaledViewport.width}px`;
			canvas.style.height = `${scaledViewport.height}px`;

			const renderTask = page.render({
				canvas,
				viewport: scaledViewport,
			});
			renderTaskRef.current = renderTask;
			await renderTask.promise;

			// Render text layer
			textLayerEl.innerHTML = "";
			textLayerEl.style.width = `${scaledViewport.width}px`;
			textLayerEl.style.height = `${scaledViewport.height}px`;

			const textContent = await page.getTextContent();

			// Detect scanned PDFs (no text items) on the first page
			if (pageNum === 1) {
				setIsScanned(textContent.items.length === 0);
			}

			const textLayer = new pdfjsLib.TextLayer({
				textContentSource: textContent,
				container: textLayerEl,
				viewport: scaledViewport,
			});
			await textLayer.render();

			// Recompute highlights after text layer is ready
			if (pageContainerRef.current) {
				setHighlights(
					computeHighlights(
						textLayerEl,
						pageContainerRef.current,
						quotes,
						pageNum,
					),
				);
			}
		},
		[quotes],
	);

	useEffect(() => {
		if (!loading && !error) {
			renderPage(currentPage);
		}
	}, [currentPage, loading, error, renderPage]);

	// ---------------------------------------------------------------------------
	// Navigate to selected quote's page
	// ---------------------------------------------------------------------------

	useEffect(() => {
		if (!selectedQuoteId) return;
		const q = quotes.find((q) => q.id === selectedQuoteId);
		if (q && q.page !== currentPage) {
			setCurrentPage(q.page);
		}
	}, [selectedQuoteId, quotes, currentPage]);

	// ---------------------------------------------------------------------------
	// Text selection → tooltip
	// ---------------------------------------------------------------------------

	function handleMouseUp(_e: React.MouseEvent) {
		const textLayerEl = textLayerRef.current;
		if (!textLayerEl) return;

		const sel = window.getSelection();
		if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
			setSelectionTooltip(null);
			return;
		}

		const range = sel.getRangeAt(0);
		const text = sel.toString().trim();
		if (!text) {
			setSelectionTooltip(null);
			return;
		}

		// Verify selection is within our text layer
		if (!textLayerEl.contains(range.commonAncestorContainer)) {
			setSelectionTooltip(null);
			return;
		}

		const offsets = getGlobalOffsets(
			textLayerEl,
			range.startContainer,
			range.startOffset,
			range.endContainer,
			range.endOffset,
		);
		if (!offsets) {
			setSelectionTooltip(null);
			return;
		}

		// Position tooltip above the selection
		const selRects = Array.from(range.getClientRects());
		const firstRect = selRects[0];
		const containerRect = containerRef.current?.getBoundingClientRect();
		if (!firstRect || !containerRect) return;

		setSelectionTooltip({
			x: firstRect.left - containerRect.left + firstRect.width / 2,
			y: firstRect.top - containerRect.top - 8,
			selection: { text, page: currentPage, position: offsets },
		});
	}

	function handleCreateQuote() {
		if (!selectionTooltip) return;
		onSelection(selectionTooltip.selection);
		window.getSelection()?.removeAllRanges();
		setSelectionTooltip(null);
	}

	// ---------------------------------------------------------------------------
	// Render
	// ---------------------------------------------------------------------------

	const canGoPrev = currentPage > 1;
	const canGoNext = currentPage < numPages;

	if (loading) {
		return (
			<div className="flex h-64 items-center justify-center text-sm text-gray-400">
				<span className="animate-pulse">Loading PDF…</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-64 items-center justify-center text-sm text-error-500">
				Failed to load PDF.
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4">
			{/* Scanned PDF warning */}
			{isScanned && (
				<div className="w-full rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-700/50 dark:bg-yellow-900/20 dark:text-yellow-300">
					⚠️ {t.viewer.scannedWarning}
				</div>
			)}

			{/* Page navigation */}
			<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
				<button
					type="button"
					onClick={() => setCurrentPage((p) => p - 1)}
					disabled={!canGoPrev}
					className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
				>
					←
				</button>
				<span>
					Page {currentPage} / {numPages}
				</span>
				<button
					type="button"
					onClick={() => setCurrentPage((p) => p + 1)}
					disabled={!canGoNext}
					className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
				>
					→
				</button>
			</div>

			{/* Page container — canvas + text layer + highlights */}
			<div ref={containerRef} className="relative w-full">
				<div ref={pageContainerRef} className="relative inline-block shadow-md">
					<canvas ref={canvasRef} className="block" />

					{/* Text layer — mouseup captured here for selection */}
					<div
						ref={textLayerRef}
						className="pdf-text-layer"
						role="document"
						onMouseUp={canEdit ? handleMouseUp : undefined}
					/>

					{/* Highlight overlays */}
					{highlights.map((h, i) => (
						<button
							type="button"
							key={`${h.quoteId}-${i}`}
							onClick={() => onHighlightClick(h.quoteId)}
							style={{
								position: "absolute",
								left: h.left,
								top: h.top,
								width: h.width,
								height: h.height,
								backgroundColor: h.color,
								opacity: selectedQuoteId === h.quoteId ? 0.55 : 0.3,
								cursor: "pointer",
								borderRadius: 2,
								transition: "opacity 0.15s",
								padding: 0,
								border: "none",
							}}
						/>
					))}

					{/* "Quote" tooltip */}
					{selectionTooltip && (
						<div
							style={{
								position: "absolute",
								left: selectionTooltip.x,
								top: selectionTooltip.y,
								transform: "translate(-50%, -100%)",
								zIndex: 20,
							}}
						>
							<button
								type="button"
								onClick={handleCreateQuote}
								className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-brand-700"
							>
								Quote
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
