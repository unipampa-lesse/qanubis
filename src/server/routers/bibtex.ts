import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getBibtexParser } from "@/providers/bibtex-parser";
import { getEnrichmentProvider } from "@/providers/enrichment";
import { recordAuditEventSafe } from "@/server/services/audit";
import { collaboratorProcedure, createTRPCRouter } from "../trpc";

export const bibtexRouter = createTRPCRouter({
	/**
	 * Parse raw BibTeX text and create Document records for each entry.
	 * Skips entries whose DOI already exists in the project (P2002 unique violation).
	 * Schedules async metadata + PDF enrichment for imported entries.
	 */
	importText: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				bibtex: z.string().min(1).max(500_000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const parsed = getBibtexParser().parse(input.bibtex);

			if (parsed.length === 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "No valid BibTeX entries found in the provided text",
				});
			}

			const results = { imported: 0, skipped: 0, total: parsed.length };
			const importedIds: string[] = [];

			for (const entry of parsed) {
				try {
					const created = await prisma.document.create({
						data: {
							projectId: input.projectId,
							name: entry.title,
							source: "bibtex",
							citeKey: entry.citeKey,
							entryType: entry.entryType,
							authors: entry.authors,
							year: entry.year,
							doi: entry.doi,
							abstract: entry.abstract,
							journal: entry.journal,
							volume: entry.volume,
							issue: entry.issue,
							pages: entry.pages,
							publisher: entry.publisher,
							bibUrl: entry.url,
						},
					});
					importedIds.push(created.id);
					results.imported++;
				} catch (err) {
					if (
						err instanceof Prisma.PrismaClientKnownRequestError &&
						err.code === "P2002"
					) {
						results.skipped++;
					} else {
						throw err;
					}
				}
			}

			getEnrichmentProvider().schedule(importedIds);

			if (results.imported > 0 || results.skipped > 0) {
				await recordAuditEventSafe({
					projectId: input.projectId,
					actorId: ctx.userId,
					action: "BIBTEX_IMPORTED",
					entityType: "DOCUMENT",
					summary: `BibTeX import finished: ${results.imported} imported, ${results.skipped} skipped`,
					details: {
						imported: results.imported,
						skipped: results.skipped,
						total: results.total,
						importedDocumentIds: importedIds,
					},
				});
			}

			return results;
		}),

	/** Re-trigger CrossRef + PDF enrichment for a document that has a DOI. */
	triggerEnrichment: collaboratorProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: { id: true, doi: true, name: true },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });
			if (!doc.doi) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Document has no DOI — enrichment requires a DOI",
				});
			}

			getEnrichmentProvider().schedule([doc.id]);

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "DOCUMENT_ENRICHMENT_SCHEDULED",
				entityType: "DOCUMENT",
				entityId: doc.id,
				summary: `Enrichment scheduled: ${doc.name}`,
				details: { doi: doc.doi },
			});

			return { scheduled: true };
		}),
});
