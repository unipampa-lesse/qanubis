import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { extractPdfMetadata } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { pushSSENotification } from "@/lib/sse-registry";
import { getStorageProvider } from "@/providers/storage";
import type { IEnrichmentProvider } from "./interface";

const MAX_PDF_BYTES = 50 * 1024 * 1024;
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]);
const politeEmail = () =>
	env.ENRICHMENT_CONTACT_EMAIL ?? "qanubis-bot@example.com";

interface CrossRefWork {
	title?: string[];
	abstract?: string;
	author?: Array<{ given?: string; family?: string }>;
	published?: { "date-parts"?: number[][] };
}

interface UnpaywallResponse {
	best_oa_location?: { url_for_pdf?: string | null };
	oa_locations?: Array<{ url_for_pdf?: string | null }>;
}

export class CrossrefEnrichmentProvider implements IEnrichmentProvider {
	private readonly log = logger.child({ module: "enrichment/crossref" });

	private async fetchCrossRef(doi: string): Promise<CrossRefWork | null> {
		try {
			const res = await fetch(
				`https://api.crossref.org/works/${encodeURIComponent(doi)}`,
				{
					headers: { "User-Agent": `QAnubis/1.0 (mailto:${politeEmail()})` },
					signal: AbortSignal.timeout(10_000),
				},
			);
			if (!res.ok) return null;
			const data = await res.json();
			return (data?.message as CrossRefWork) ?? null;
		} catch {
			return null;
		}
	}

	private async findPdfUrl(doi: string): Promise<string | null> {
		try {
			const res = await fetch(
				`https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=${politeEmail()}`,
				{ signal: AbortSignal.timeout(10_000) },
			);
			if (res.ok) {
				const data: UnpaywallResponse = await res.json();
				const url =
					data.best_oa_location?.url_for_pdf ??
					data.oa_locations?.find((l) => l.url_for_pdf)?.url_for_pdf ??
					null;
				if (url) return url;
			}
		} catch {
			// fall through
		}

		try {
			const res = await fetch(
				`https://api.openalex.org/works/doi:${encodeURIComponent(doi)}`,
				{
					headers: { "User-Agent": `QAnubis/1.0 (mailto:${politeEmail()})` },
					signal: AbortSignal.timeout(10_000),
				},
			);
			if (res.ok) {
				const data = await res.json();
				const url: string | undefined = data?.open_access?.oa_url;
				if (url?.endsWith(".pdf")) return url;
			}
		} catch {
			// PDF not found
		}

		return null;
	}

	private async downloadAndStorePdf(
		documentId: string,
		projectId: string,
		pdfUrl: string,
	): Promise<{ key: string; fileSize: number; pageCount: number } | null> {
		try {
			const res = await fetch(pdfUrl, {
				headers: { "User-Agent": `QAnubis/1.0 (mailto:${politeEmail()})` },
				signal: AbortSignal.timeout(30_000),
			});
			if (!res.ok) return null;

			const contentLength = res.headers.get("content-length");
			if (contentLength && Number(contentLength) > MAX_PDF_BYTES) return null;

			const buffer = Buffer.from(await res.arrayBuffer());
			if (buffer.length > MAX_PDF_BYTES) return null;
			if (buffer.length < 5 || !buffer.subarray(0, 5).equals(PDF_MAGIC))
				return null;

			const key = `projects/${projectId}/documents/${documentId}.pdf`;
			await getStorageProvider().upload(key, buffer, "application/pdf");

			let pageCount = 0;
			try {
				const meta = await extractPdfMetadata(buffer);
				pageCount = meta.pageCount;
			} catch {
				// non-fatal
			}

			return { key, fileSize: buffer.length, pageCount };
		} catch {
			return null;
		}
	}

	async enrich(documentId: string): Promise<void> {
		const doc = await prisma.document.findUnique({ where: { id: documentId } });
		if (!doc?.doi) return;

		type Updates = {
			enriched: boolean;
			abstract?: string;
			authors?: string[];
			year?: number;
			storageKey?: string;
			fileSize?: number;
			pageCount?: number;
		};

		const updates: Updates = { enriched: true };

		const work = await this.fetchCrossRef(doc.doi);
		if (work) {
			if (!doc.abstract && work.abstract) {
				updates.abstract = work.abstract.replace(/<[^>]+>/g, "").trim();
			}
			if (doc.authors.length === 0 && work.author?.length) {
				updates.authors = work.author.map((a) =>
					[a.given, a.family].filter(Boolean).join(" "),
				);
			}
			if (!doc.year && work.published?.["date-parts"]?.[0]?.[0]) {
				updates.year = work.published["date-parts"][0][0];
			}
		}

		if (!doc.storageKey) {
			const pdfUrl = await this.findPdfUrl(doc.doi);
			if (pdfUrl) {
				const result = await this.downloadAndStorePdf(
					documentId,
					doc.projectId,
					pdfUrl,
				);
				if (result) {
					updates.storageKey = result.key;
					updates.fileSize = result.fileSize;
					updates.pageCount = result.pageCount;
				}
			}
		}

		try {
			await prisma.document.update({
				where: { id: documentId },
				data: updates,
			});
		} catch (err) {
			this.log.error(
				{ err, documentId },
				"failed to persist enrichment updates",
			);
			return;
		}

		if (updates.storageKey) {
			try {
				const members = await prisma.projectMember.findMany({
					where: { projectId: doc.projectId },
					select: { userId: true },
				});
				await Promise.all(
					members.map(async ({ userId }) => {
						const notif = await prisma.notification.create({
							data: {
								userId,
								type: "enrichment_complete",
								title: doc.name,
								body: "PDF encontrado e adicionado à referência",
								link: `/dashboard/projects/${doc.projectId}`,
							},
						});
						pushSSENotification(userId, notif);
					}),
				);
			} catch (err) {
				this.log.warn(
					{ err, documentId },
					"failed to send enrichment notifications",
				);
			}
		}
	}

	schedule(documentIds: string[]): void {
		if (documentIds.length === 0) return;
		void Promise.allSettled(documentIds.map((id) => this.enrich(id))).catch(
			(err) => {
				this.log.error({ err }, "batch enrichment error");
			},
		);
	}
}
