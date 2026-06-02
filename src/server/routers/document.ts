import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/providers/storage";
import { recordAuditEventSafe } from "@/server/services/audit";
import {
	collaboratorProcedure,
	createTRPCRouter,
	projectProcedure,
} from "../trpc";

export const documentRouter = createTRPCRouter({
	/** Get a single document with full bibliographic metadata. */
	get: projectProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.query(async ({ input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: {
					id: true,
					name: true,
					source: true,
					storageKey: true,
					pageCount: true,
					authors: true,
					year: true,
					doi: true,
					abstract: true,
					journal: true,
					volume: true,
					issue: true,
					pages: true,
					publisher: true,
					citeKey: true,
					enriched: true,
				},
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });
			return doc;
		}),

	/** List documents in a project. Optional source filter: "upload" | "bibtex". */
	list: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				source: z.enum(["upload", "bibtex"]).optional(),
				limit: z.number().int().min(1).max(100).default(30),
				cursor: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const limit = input.limit;
			const [docs, codedGroups] = await Promise.all([
				prisma.document.findMany({
					where: {
						projectId: input.projectId,
						...(input.source && { source: input.source }),
					},
					select: {
						id: true,
						name: true,
						description: true,
						mimeType: true,
						storageKey: true,
						pageCount: true,
						fileSize: true,
						extractedTitle: true,
						source: true,
						citeKey: true,
						entryType: true,
						authors: true,
						year: true,
						doi: true,
						abstract: true,
						journal: true,
						volume: true,
						issue: true,
						pages: true,
						publisher: true,
						bibUrl: true,
						enriched: true,
						createdAt: true,
						_count: { select: { quotes: true } },
					},
					orderBy: [{ createdAt: "desc" }, { id: "desc" }],
					take: limit + 1,
					...(input.cursor
						? {
								cursor: { id: input.cursor },
								skip: 1,
							}
						: {}),
				}),
				prisma.quote.groupBy({
					by: ["documentId"],
					where: {
						document: { projectId: input.projectId },
						quoteCodes: { some: {} },
					},
					_count: { id: true },
				}),
			]);

			const hasMore = docs.length > limit;
			const page = hasMore ? docs.slice(0, -1) : docs;
			const nextCursor = hasMore ? page[page.length - 1]?.id : null;
			const codedMap = new Map(
				codedGroups.map((g) => [g.documentId, g._count.id]),
			);
			return {
				items: page.map((doc) => ({
					...doc,
					codedQuoteCount: codedMap.get(doc.id) ?? 0,
				})),
				nextCursor,
			};
		}),

	/** Get a presigned URL to view a document PDF. Throws NOT_FOUND if no PDF. */
	getViewUrl: projectProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.query(async ({ input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: { storageKey: true },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });
			if (!doc.storageKey)
				throw new TRPCError({ code: "NOT_FOUND", message: "No PDF available" });

			const url = await getStorageProvider().getPresignedUrl(
				doc.storageKey,
				1800,
			);
			return { url };
		}),

	/** Get a presigned URL to force-download a document PDF. */
	getDownloadUrl: projectProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.query(async ({ input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: { storageKey: true, name: true },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });
			if (!doc.storageKey)
				throw new TRPCError({ code: "NOT_FOUND", message: "No PDF available" });

			const filename = doc.name.endsWith(".pdf") ? doc.name : `${doc.name}.pdf`;
			const url = await getStorageProvider().getPresignedUrl(
				doc.storageKey,
				3600,
				{ filename },
			);
			return { url, filename };
		}),

	/** Update document name/description (collaborator+). */
	update: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				documentId: z.string(),
				name: z.string().min(1).max(200).optional(),
				description: z.string().max(1000).nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });

			const updated = await prisma.document.update({
				where: { id: input.documentId },
				data: {
					...(input.name !== undefined && { name: input.name }),
					...(input.description !== undefined && {
						description: input.description,
					}),
				},
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "DOCUMENT_UPDATED",
				entityType: "DOCUMENT",
				entityId: input.documentId,
				summary: `Document updated: ${updated.name}`,
				details: {
					before: {
						name: doc.name,
						description: doc.description,
					},
					after: {
						name: updated.name,
						description: updated.description,
					},
				},
			});

			return updated;
		}),

	/** Delete a document and remove its PDF from object storage if present (collaborator+). */
	delete: collaboratorProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: { storageKey: true, name: true },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "DOCUMENT_DELETED",
				entityType: "DOCUMENT",
				entityId: input.documentId,
				summary: `Document deleted: ${doc.name}`,
			});

			if (doc.storageKey) {
				await getStorageProvider()
					.delete(doc.storageKey)
					.catch(() => {});
			}

			await prisma.document.delete({ where: { id: input.documentId } });
			return { success: true };
		}),
});
