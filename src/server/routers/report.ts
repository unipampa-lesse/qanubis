import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { computeCohensKappa } from "@/lib/report/agreement";
import { createTRPCRouter, projectProcedure } from "../trpc";

const savedReportFiltersSchema = z.object({
	search: z.string().trim().max(200).optional(),
	documentId: z.string().cuid().optional(),
	codeId: z.string().cuid().optional(),
	uncodedOnly: z.boolean().optional(),
});

type SavedReportFilters = z.infer<typeof savedReportFiltersSchema>;

function buildQuoteWhereForFilters(
	projectId: string,
	filters: SavedReportFilters,
) {
	const search = filters.search?.trim();

	return {
		document: {
			projectId,
			...(filters.documentId ? { id: filters.documentId } : {}),
		},
		...(search
			? {
					text: {
						contains: search,
						mode: "insensitive" as const,
					},
				}
			: {}),
		...(filters.codeId
			? {
					quoteCodes: {
						some: {
							codeId: filters.codeId,
						},
					},
				}
			: {}),
		...(filters.uncodedOnly ? { quoteCodes: { none: {} } } : {}),
	};
}

/** Full quote shape for report views. */
const reportQuoteSelect = {
	id: true,
	text: true,
	page: true,
	color: true,
	createdAt: true,
	document: { select: { id: true, name: true } },
	createdBy: { select: { id: true, name: true } },
	quoteCodes: {
		select: {
			code: {
				select: { id: true, name: true, color: true, textColor: true },
			},
		},
	},
} as const;

export const reportRouter = createTRPCRouter({
	/**
	 * Analytical matrix: codes x documents with assignment counts.
	 */
	matrix: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				limitDocuments: z.number().int().min(1).max(100).default(25),
				limitCodes: z.number().int().min(1).max(100).default(25),
			}),
		)
		.query(async ({ input }) => {
			const [topDocuments, topCodes, assignments] = await Promise.all([
				prisma.document.findMany({
					where: { projectId: input.projectId },
					select: {
						id: true,
						name: true,
						_count: { select: { quotes: true } },
					},
					orderBy: [{ quotes: { _count: "desc" } }, { name: "asc" }],
					take: input.limitDocuments,
				}),
				prisma.code.findMany({
					where: { projectId: input.projectId },
					select: {
						id: true,
						name: true,
						color: true,
						textColor: true,
						_count: { select: { quoteCodes: true } },
					},
					orderBy: [{ quoteCodes: { _count: "desc" } }, { name: "asc" }],
					take: input.limitCodes,
				}),
				prisma.quoteCode.findMany({
					where: {
						quote: { document: { projectId: input.projectId } },
					},
					select: {
						codeId: true,
						quote: { select: { documentId: true } },
					},
				}),
			]);

			const allowedDocumentIds = new Set(topDocuments.map((d) => d.id));
			const allowedCodeIds = new Set(topCodes.map((c) => c.id));

			const matrixMap = new Map<string, number>();
			for (const assignment of assignments) {
				if (
					!allowedCodeIds.has(assignment.codeId) ||
					!allowedDocumentIds.has(assignment.quote.documentId)
				) {
					continue;
				}
				const key = `${assignment.codeId}:${assignment.quote.documentId}`;
				matrixMap.set(key, (matrixMap.get(key) ?? 0) + 1);
			}

			return {
				documents: topDocuments.map((d) => ({
					id: d.id,
					name: d.name,
					quoteCount: d._count.quotes,
				})),
				codes: topCodes.map((c) => ({
					id: c.id,
					name: c.name,
					color: c.color,
					textColor: c.textColor,
					quoteCount: c._count.quoteCodes,
				})),
				rows: topCodes.map((code) => ({
					codeId: code.id,
					cells: topDocuments.map((document) => ({
						documentId: document.id,
						count: matrixMap.get(`${code.id}:${document.id}`) ?? 0,
					})),
				})),
			};
		}),

	/**
	 * Saved filter queries for reports workflow.
	 */
	listSavedQueries: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			const items = await prisma.reportSavedQuery.findMany({
				where: { projectId: input.projectId },
				select: {
					id: true,
					name: true,
					filters: true,
					createdAt: true,
					updatedAt: true,
					createdBy: {
						select: { id: true, name: true, email: true },
					},
				},
				orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
			});

			return items.map((item) => ({
				...item,
				filters: savedReportFiltersSchema.parse(item.filters),
			}));
		}),

	createSavedQuery: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				name: z.string().trim().min(1).max(80),
				filters: savedReportFiltersSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.reportSavedQuery.create({
				data: {
					projectId: input.projectId,
					createdById: ctx.userId,
					name: input.name,
					filters: input.filters,
				},
				select: {
					id: true,
					name: true,
					filters: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		}),

	deleteSavedQuery: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				savedQueryId: z.string().cuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const query = await prisma.reportSavedQuery.findFirst({
				where: {
					id: input.savedQueryId,
					projectId: input.projectId,
				},
				select: { id: true, createdById: true },
			});

			if (!query) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			if (query.createdById !== ctx.userId && ctx.member.role !== "OWNER") {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Only owner or query author can delete it",
				});
			}

			await prisma.reportSavedQuery.delete({ where: { id: query.id } });
			return { success: true };
		}),

	runSavedQuery: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				savedQueryId: z.string().cuid(),
			}),
		)
		.query(async ({ input }) => {
			const savedQuery = await prisma.reportSavedQuery.findFirst({
				where: {
					id: input.savedQueryId,
					projectId: input.projectId,
				},
				select: { filters: true },
			});

			if (!savedQuery) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const filters = savedReportFiltersSchema.parse(savedQuery.filters);

			return prisma.quote.findMany({
				where: buildQuoteWhereForFilters(input.projectId, filters),
				select: reportQuoteSelect,
				orderBy: [
					{ document: { name: "asc" } },
					{ page: "asc" },
					{ createdAt: "asc" },
				],
			});
		}),

	/**
	 * Inter-coder agreement (Cohen's Kappa) from audit coding actions.
	 */
	coderAgreement: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				codeId: z.string().cuid(),
				coderAId: z.string().cuid(),
				coderBId: z.string().cuid(),
			}),
		)
		.query(async ({ input }) => {
			if (input.coderAId === input.coderBId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Coders must be different users",
				});
			}

			const [quotes, coders, events] = await Promise.all([
				prisma.quote.findMany({
					where: { document: { projectId: input.projectId } },
					select: { id: true },
					orderBy: { createdAt: "asc" },
				}),
				prisma.user.findMany({
					where: { id: { in: [input.coderAId, input.coderBId] } },
					select: { id: true, name: true, email: true },
				}),
				prisma.auditEvent.findMany({
					where: {
						projectId: input.projectId,
						entityType: "QUOTE_CODE",
						action: { in: ["QUOTE_CODE_ASSIGNED", "QUOTE_CODE_REMOVED"] },
						actorId: { in: [input.coderAId, input.coderBId] },
						details: {
							path: ["codeId"],
							equals: input.codeId,
						},
					},
					select: {
						id: true,
						action: true,
						actorId: true,
						details: true,
						createdAt: true,
					},
					orderBy: [{ createdAt: "asc" }, { id: "asc" }],
				}),
			]);

			if (coders.length !== 2) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Coder not found" });
			}

			const coderState = new Map<string, boolean>();

			for (const event of events) {
				if (!event.actorId) {
					continue;
				}

				const details = event.details as { quoteId?: unknown } | null;
				const quoteId =
					typeof details?.quoteId === "string" ? details.quoteId : null;
				if (!quoteId) {
					continue;
				}

				const stateKey = `${event.actorId}:${quoteId}`;
				coderState.set(stateKey, event.action === "QUOTE_CODE_ASSIGNED");
			}

			let aYesBYes = 0;
			let aYesBNo = 0;
			let aNoBYes = 0;
			let aNoBNo = 0;

			for (const quote of quotes) {
				const a = coderState.get(`${input.coderAId}:${quote.id}`) ?? false;
				const b = coderState.get(`${input.coderBId}:${quote.id}`) ?? false;

				if (a && b) aYesBYes++;
				else if (a && !b) aYesBNo++;
				else if (!a && b) aNoBYes++;
				else aNoBNo++;
			}

			const metrics = computeCohensKappa({
				total: quotes.length,
				aYesBYes,
				aYesBNo,
				aNoBYes,
				aNoBNo,
			});

			const coderA = coders.find((coder) => coder.id === input.coderAId);
			const coderB = coders.find((coder) => coder.id === input.coderBId);

			return {
				codeId: input.codeId,
				coderA: {
					id: input.coderAId,
					name: coderA?.name ?? coderA?.email ?? "Unknown",
				},
				coderB: {
					id: input.coderBId,
					name: coderB?.name ?? coderB?.email ?? "Unknown",
				},
				metrics,
			};
		}),

	/**
	 * Server-side full-text search across quote texts for a project.
	 * Uses Postgres ILIKE via Prisma's insensitive mode — activated when
	 * the explorer has an active search query.
	 */
	searchQuotes: projectProcedure
		.input(z.object({ projectId: z.string(), query: z.string().min(1) }))
		.query(async ({ input }) => {
			return prisma.quote.findMany({
				where: {
					document: { projectId: input.projectId },
					text: { contains: input.query, mode: "insensitive" },
				},
				select: reportQuoteSelect,
				orderBy: [
					{ document: { name: "asc" } },
					{ page: "asc" },
					{ createdAt: "asc" },
				],
			});
		}),

	/**
	 * Narrative export data: codes (sorted by quote count) with their quotes,
	 * plus all project memos (with full Tiptap JSON content).
	 */
	narrativeExport: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			const [codes, memos] = await Promise.all([
				prisma.code.findMany({
					where: { projectId: input.projectId },
					select: {
						id: true,
						name: true,
						description: true,
						quoteCodes: {
							select: {
								quote: {
									select: {
										id: true,
										text: true,
										page: true,
										document: { select: { name: true } },
									},
								},
							},
							orderBy: { quote: { document: { name: "asc" } } },
						},
					},
				}),
				prisma.memo.findMany({
					where: { projectId: input.projectId },
					select: { id: true, name: true, content: true },
					orderBy: { updatedAt: "desc" },
				}),
			]);

			return {
				codes: codes
					.map((c) => ({
						id: c.id,
						name: c.name,
						description: c.description,
						quotes: c.quoteCodes.map((qc) => qc.quote),
					}))
					.sort((a, b) => b.quotes.length - a.quotes.length),
				memos,
			};
		}),

	/**
	 * All quotes for a project across every document.
	 * Used by the quote explorer, heatmaps, and export.
	 */
	quotes: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			return prisma.quote.findMany({
				where: { document: { projectId: input.projectId } },
				select: reportQuoteSelect,
				orderBy: [
					{ document: { name: "asc" } },
					{ page: "asc" },
					{ createdAt: "asc" },
				],
			});
		}),

	/**
	 * Summary: all documents and codes in the project with their quote/code counts.
	 * Includes items with 0 quotes so counts are consistent with the stats panel.
	 */
	summary: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			const [documents, codes, quoteCodes] = await Promise.all([
				// All documents with their quote count
				prisma.document.findMany({
					where: { projectId: input.projectId },
					select: {
						id: true,
						name: true,
						_count: { select: { quotes: true } },
					},
					orderBy: { name: "asc" },
				}),
				// All codes with color info
				prisma.code.findMany({
					where: { projectId: input.projectId },
					select: { id: true, name: true, color: true, textColor: true },
				}),
				// QuoteCode join to compute cross-references
				prisma.quoteCode.findMany({
					where: { quote: { document: { projectId: input.projectId } } },
					select: {
						codeId: true,
						quote: { select: { documentId: true } },
					},
				}),
			]);

			// Build code → {quoteCount, docIds} map
			const codeStats = new Map<
				string,
				{ quoteCount: number; docIds: Set<string> }
			>();
			for (const qc of quoteCodes) {
				const entry = codeStats.get(qc.codeId) ?? {
					quoteCount: 0,
					docIds: new Set(),
				};
				entry.quoteCount++;
				entry.docIds.add(qc.quote.documentId);
				codeStats.set(qc.codeId, entry);
			}

			// Build document → unique codeIds map
			const docCodeIds = new Map<string, Set<string>>();
			for (const qc of quoteCodes) {
				const set = docCodeIds.get(qc.quote.documentId) ?? new Set<string>();
				set.add(qc.codeId);
				docCodeIds.set(qc.quote.documentId, set);
			}

			return {
				documents: documents.map((d) => ({
					id: d.id,
					name: d.name,
					quoteCount: d._count.quotes,
					codesUsed: docCodeIds.get(d.id)?.size ?? 0,
				})),
				codes: codes
					.map((c) => ({
						id: c.id,
						name: c.name,
						color: c.color,
						textColor: c.textColor,
						quoteCount: codeStats.get(c.id)?.quoteCount ?? 0,
						documentsUsed: codeStats.get(c.id)?.docIds.size ?? 0,
					}))
					.sort((a, b) => b.quoteCount - a.quoteCount),
			};
		}),

	/**
	 * Aggregated statistics for the project reports summary.
	 * Computes counts and distributions server-side.
	 */
	stats: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			const [
				totalDocuments,
				totalQuotes,
				totalCodes,
				totalMemos,
				quotesPerDocument,
				quotesPerCode,
				uncodedQuotes,
				quotesOverTime,
			] = await Promise.all([
				prisma.document.count({
					where: { projectId: input.projectId },
				}),
				prisma.quote.count({
					where: { document: { projectId: input.projectId } },
				}),
				prisma.code.count({
					where: { projectId: input.projectId },
				}),
				prisma.memo.count({
					where: { projectId: input.projectId },
				}),
				// Quotes grouped by document
				prisma.quote.groupBy({
					by: ["documentId"],
					where: { document: { projectId: input.projectId } },
					_count: { id: true },
				}),
				// Quotes grouped by code
				prisma.quoteCode.groupBy({
					by: ["codeId"],
					where: { quote: { document: { projectId: input.projectId } } },
					_count: { quoteId: true },
				}),
				// Quotes without any code
				prisma.quote.count({
					where: {
						document: { projectId: input.projectId },
						quoteCodes: { none: {} },
					},
				}),
				// Quotes per day (last 30 days)
				prisma.$queryRaw<{ date: string; count: bigint }[]>`
					SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
					FROM "Quote"
					WHERE "documentId" IN (SELECT id FROM "Document" WHERE "projectId" = ${input.projectId})
					AND "createdAt" >= NOW() - INTERVAL '30 days'
					GROUP BY DATE("createdAt")
					ORDER BY date ASC`,
			]);

			// Resolve document names for the per-document breakdown
			const docIds = quotesPerDocument.map((d) => d.documentId);
			const documents =
				docIds.length > 0
					? await prisma.document.findMany({
							where: { id: { in: docIds } },
							select: { id: true, name: true },
						})
					: [];
			const docNameMap = new Map(documents.map((d) => [d.id, d.name]));

			// Resolve code names for the per-code breakdown
			const codeIds = quotesPerCode.map((c) => c.codeId);
			const codes =
				codeIds.length > 0
					? await prisma.code.findMany({
							where: { id: { in: codeIds } },
							select: { id: true, name: true, color: true },
						})
					: [];
			const codeInfoMap = new Map(
				codes.map((c) => [c.id, { name: c.name, color: c.color }]),
			);

			return {
				totals: {
					documents: totalDocuments,
					quotes: totalQuotes,
					codes: totalCodes,
					memos: totalMemos,
					uncodedQuotes,
				},
				quotesPerDocument: quotesPerDocument
					.map((d) => ({
						documentId: d.documentId,
						name: docNameMap.get(d.documentId) ?? "Unknown",
						count: d._count.id,
					}))
					.sort((a, b) => b.count - a.count),
				quotesPerCode: quotesPerCode
					.map((c) => ({
						codeId: c.codeId,
						name: codeInfoMap.get(c.codeId)?.name ?? "Unknown",
						color: codeInfoMap.get(c.codeId)?.color ?? "#6366f1",
						count: c._count.quoteId,
					}))
					.sort((a, b) => b.count - a.count),
				quotesOverTime: quotesOverTime.map((r) => ({
					date: String(r.date),
					count: Number(r.count),
				})),
			};
		}),
});
