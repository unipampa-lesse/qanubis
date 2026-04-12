import "server-only";
// pdf-parse is a CommonJS module; use require to avoid ESM default-export issues.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (
	buffer: Buffer,
	options?: Record<string, unknown>,
) => Promise<{ numpages: number; info: Record<string, unknown> | null }>;

export interface PdfMetadata {
	pageCount: number;
	extractedTitle: string | null;
}

/**
 * Extracts metadata from a PDF buffer without reading the full text content.
 * Used at upload time to populate Document.pageCount and Document.extractedTitle.
 */
export async function extractPdfMetadata(buffer: Buffer): Promise<PdfMetadata> {
	// max_pages: 0 means parse only metadata, not all pages' text — faster for large files.
	const data = await pdfParse(buffer, { max: 0 });

	const extractedTitle =
		(data.info?.Title as string | undefined)?.trim() || null;

	return {
		pageCount: data.numpages ?? 0,
		extractedTitle: extractedTitle || null,
	};
}
