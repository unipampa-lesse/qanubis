import "server-only";
import { PDFDocument } from "pdf-lib";

export interface PdfMetadata {
	pageCount: number;
	extractedTitle: string | null;
}

/**
 * Extracts metadata (page count + embedded title) from a PDF buffer.
 * Uses pdf-lib — a pure-JS library with no browser-API dependencies —
 * so it is safe to call in any Node.js server context (route handlers,
 * tRPC procedures, etc.).
 */
export async function extractPdfMetadata(buffer: Buffer): Promise<PdfMetadata> {
	const pdfDoc = await PDFDocument.load(buffer, {
		// Don't throw on encrypted PDFs — just read what's available
		ignoreEncryption: true,
		updateMetadata: false,
	});

	const pageCount = pdfDoc.getPageCount();
	const rawTitle = pdfDoc.getTitle()?.trim() ?? null;

	return {
		pageCount,
		extractedTitle: rawTitle || null,
	};
}
