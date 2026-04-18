import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/providers/storage";
import {
	collaboratorProcedure,
	createTRPCRouter,
	projectProcedure,
} from "../trpc";

export const documentRouter = createTRPCRouter({
	/** List all documents in a project. Available to all members. */
	list: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			const [docs, codedGroups] = await Promise.all([
				prisma.document.findMany({
					where: { projectId: input.projectId },
					select: {
						id: true,
						name: true,
						description: true,
						mimeType: true,
						pageCount: true,
						fileSize: true,
						extractedTitle: true,
						createdAt: true,
						_count: { select: { quotes: true } },
					},
					orderBy: { createdAt: "desc" },
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
			const codedMap = new Map(codedGroups.map((g) => [g.documentId, g._count.id]));
			return docs.map((doc) => ({
				...doc,
				codedQuoteCount: codedMap.get(doc.id) ?? 0,
			}));
		}),

	/** Get a presigned URL to view (GET) a document PDF. Available to all members. */
	getViewUrl: projectProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.query(async ({ input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: { storageKey: true },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });

			const storage = getStorageProvider();
			const url = await storage.getPresignedUrl(doc.storageKey, 1800);
			return { url };
		}),

	/** Get a presigned URL to download (force-download) a document PDF. Available to all members. */
	getDownloadUrl: projectProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.query(async ({ input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: { storageKey: true, name: true },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });

			const storage = getStorageProvider();
			const filename = doc.name.endsWith(".pdf") ? doc.name : `${doc.name}.pdf`;
			const url = await storage.getPresignedUrl(doc.storageKey, 3600, {
				filename,
			});
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
		.mutation(async ({ input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });

			return prisma.document.update({
				where: { id: input.documentId },
				data: {
					...(input.name !== undefined && { name: input.name }),
					...(input.description !== undefined && {
						description: input.description,
					}),
				},
			});
		}),

	/** Delete a document and remove its file from object storage (collaborator+). */
	delete: collaboratorProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.mutation(async ({ input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: { storageKey: true },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });

			// Remove from storage first; if it fails, the DB record stays intact.
			const storage = getStorageProvider();
			await storage.delete(doc.storageKey);

			await prisma.document.delete({ where: { id: input.documentId } });
			return { success: true };
		}),
});
