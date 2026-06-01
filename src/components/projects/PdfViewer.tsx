"use client";

import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/context/LanguageContext";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A highlight rect stored as fractions of the page container's dimensions (0–1). */
export type PositionRect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

/** Visual position produced by the PDF viewer. */
export type VisualPosition = {
	kind: "visual";
	rects: PositionRect[];
};

export interface QuoteHighlight {
	id: string;
	page: number;
	position: VisualPosition;
	/** The quote's own highlight color — independent of any code colors. */
	color: string;
}

export interface PendingSelection {
	text: string;
	page: number;
	position: VisualPosition;
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
	const [pageReady, setPageReady] = useState(false);
	const [isScanned, setIsScanned] = useState(false);

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
		setPageReady(false);

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

	const renderPage = useCallback(async (pageNum: number) => {
		const pdf = pdfRef.current;
		const canvas = canvasRef.current;
		const textLayerEl = textLayerRef.current;
		const container = containerRef.current;
		if (!pdf || !canvas || !textLayerEl || !container) return;

		renderTaskRef.current?.cancel();
		setPageReady(false);

		const page = await pdf.getPage(pageNum);

		const containerWidth = container.clientWidth || 800;
		const viewport = page.getViewport({ scale: 1 });
		const scale = Math.min((containerWidth - 2) / viewport.width, 2.5);
		const scaledViewport = page.getViewport({ scale });

		canvas.width = scaledViewport.width;
		canvas.height = scaledViewport.height;
		canvas.style.width = `${scaledViewport.width}px`;
		canvas.style.height = `${scaledViewport.height}px`;

		const renderTask = page.render({ canvas, viewport: scaledViewport });
		renderTaskRef.current = renderTask;
		await renderTask.promise;

		textLayerEl.innerHTML = "";

		const textContent = await page.getTextContent();

		if (pageNum === 1) {
			setIsScanned(textContent.items.length === 0);
		}

		const textLayer = new pdfjsLib.TextLayer({
			textContentSource: textContent,
			container: textLayerEl,
			viewport: scaledViewport,
		});
		await textLayer.render();

		// pdfjs v5 positions and sizes all text spans using the CSS custom property
		// --total-scale-factor. It defaults to 1 in our CSS, which makes the text
		// layer render at PDF-user-unit scale instead of the actual viewport scale.
		// Setting it here (after render) aligns the text layer exactly with the
		// canvas so that browser text selection maps to the correct characters.
		const { pageWidth } = scaledViewport.rawDims as { pageWidth: number };
		textLayerEl.style.setProperty(
			"--total-scale-factor",
			String(scaledViewport.width / pageWidth),
		);

		setPageReady(true);
	}, []);

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
		const pageContainerEl = pageContainerRef.current;
		if (!textLayerEl || !pageContainerEl) return;

		const sel = window.getSelection();
		if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
			setSelectionTooltip(null);
			return;
		}

		const range = sel.getRangeAt(0);

		if (!textLayerEl.contains(range.commonAncestorContainer)) {
			setSelectionTooltip(null);
			return;
		}

		const text = sel.toString().trim();
		if (!text) {
			setSelectionTooltip(null);
			return;
		}

		const rawRects = Array.from(range.getClientRects()).filter(
			(r) => r.width > 1 && r.height > 1,
		);
		if (rawRects.length === 0) {
			setSelectionTooltip(null);
			return;
		}

		const pageRect = pageContainerEl.getBoundingClientRect();
		const position: VisualPosition = {
			kind: "visual",
			rects: rawRects.map((r) => ({
				x: (r.left - pageRect.left) / pageRect.width,
				y: (r.top - pageRect.top) / pageRect.height,
				width: r.width / pageRect.width,
				height: r.height / pageRect.height,
			})),
		};

		const firstRect = rawRects[0];
		const containerRect = containerRef.current?.getBoundingClientRect();
		if (!containerRect) return;

		setSelectionTooltip({
			x: firstRect.left - containerRect.left + firstRect.width / 2,
			y: firstRect.top - containerRect.top - 8,
			selection: { text, page: currentPage, position },
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
				<span className="animate-pulse">{t.viewer.loading}</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-64 items-center justify-center text-sm text-error-500">
				{t.viewer.loadError}
			</div>
		);
	}

	const pageHighlights = quotes.filter((q) => q.page === currentPage);

	return (
		<div className="flex flex-col items-center gap-4">
			{isScanned && (
				<div className="w-full rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-700/50 dark:bg-yellow-900/20 dark:text-yellow-300">
					⚠️ {t.viewer.scannedWarning}
				</div>
			)}

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

					{/* Highlight overlays — rendered directly from stored percentage rects */}
					{pageReady &&
						pageHighlights.flatMap((quote) =>
							quote.position.rects.map((rect, i) => (
								<button
									type="button"
									// biome-ignore lint/suspicious/noArrayIndexKey: rects within a quote have no stable id
									key={`${quote.id}-${i}`}
									onClick={() => onHighlightClick(quote.id)}
									style={{
										position: "absolute",
										left: `${rect.x * 100}%`,
										top: `${rect.y * 100}%`,
										width: `${rect.width * 100}%`,
										height: `${rect.height * 100}%`,
										backgroundColor: quote.color,
										opacity: selectedQuoteId === quote.id ? 0.55 : 0.3,
										cursor: "pointer",
										borderRadius: 2,
										transition: "opacity 0.15s",
										padding: 0,
										border: "none",
									}}
								/>
							)),
						)}

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
