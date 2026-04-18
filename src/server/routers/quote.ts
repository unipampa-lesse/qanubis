import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
	collaboratorProcedure,
	createTRPCRouter,
	projectProcedure,
} from "../trpc";

const rectSchema = z.object({
	x: z.number().min(0).max(1),
	y: z.number().min(0).max(1),
	width: z.number().min(0).max(1),
	height: z.number().min(0).max(1),
});

/**
 * Discriminated-union position — add new variants as new document types arrive.
 *   visual   → PDF / image  (page-relative rects, fractions 0–1)
 *   temporal → video / audio (millisecond offsets)
 *   text     → plain-text files (character offsets)
 */
const positionSchema = z.discriminatedUnion("kind", [
	z.object({ kind: z.literal("visual"), rects: z.array(rectSchema).min(1) }),
	z.object({
		kind: z.literal("temporal"),
		startMs: z.number().int().min(0),
		endMs: z.number().int().min(0),
	}),
	z.object({
		kind: z.literal("text"),
		start: z.number().int().min(0),
		end: z.number().int().min(0),
	}),
]);

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color");

/** Shape returned for a single quote (list + create). */
const quoteSelect = {
	id: true,
	text: true,
	page: true,
	position: true,
	color: true,
	createdAt: true,
	createdBy: { select: { id: true, name: true } },
	quoteCodes: {
		select: {
			code: { select: { id: true, name: true, color: true, textColor: true } },
		},
	},
	_count: { select: { comments: true } },
} as const;

export const quoteRouter = createTRPCRouter({
	/** List all quotes for a document. Available to all project members. */
	list: projectProcedure
		.input(z.object({ projectId: z.string(), documentId: z.string() }))
		.query(async ({ input }) => {
			return prisma.quote.findMany({
				where: {
					documentId: input.documentId,
					document: { projectId: input.projectId },
				},
				select: quoteSelect,
				orderBy: [{ page: "asc" }, { createdAt: "asc" }],
			});
		}),

	/** Create a quote from a text selection. Collaborator+ only. */
	create: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				documentId: z.string(),
				text: z.string().min(1).max(5000),
				page: z.number().int().min(1),
				position: positionSchema,
				color: hexColor.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const doc = await prisma.document.findUnique({
				where: { id: input.documentId, projectId: input.projectId },
				select: { id: true },
			});
			if (!doc) throw new TRPCError({ code: "NOT_FOUND" });

			return prisma.quote.create({
				data: {
					documentId: input.documentId,
					createdById: ctx.userId,
					text: input.text,
					page: input.page,
					position: input.position,
					...(input.color !== undefined && { color: input.color }),
				},
				select: quoteSelect,
			});
		}),

	/** Change the highlight color of a quote. Collaborator+ only. */
	updateColor: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				quoteId: z.string(),
				color: hexColor,
			}),
		)
		.mutation(async ({ input }) => {
			const quote = await prisma.quote.findFirst({
				where: { id: input.quoteId, document: { projectId: input.projectId } },
				select: { id: true },
			});
			if (!quote) throw new TRPCError({ code: "NOT_FOUND" });

			return prisma.quote.update({
				where: { id: input.quoteId },
				data: { color: input.color },
				select: quoteSelect,
			});
		}),

	/** Delete a quote and all its codes/comments. Collaborator+ only. */
	delete: collaboratorProcedure
		.input(z.object({ projectId: z.string(), quoteId: z.string() }))
		.mutation(async ({ input }) => {
			const quote = await prisma.quote.findFirst({
				where: { id: input.quoteId, document: { projectId: input.projectId } },
				select: { id: true },
			});
			if (!quote) throw new TRPCError({ code: "NOT_FOUND" });

			await prisma.quote.delete({ where: { id: input.quoteId } });
			return { success: true };
		}),

	/** Assign a code to a quote. Collaborator+ only. */
	assignCode: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				quoteId: z.string(),
				codeId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const quote = await prisma.quote.findFirst({
				where: { id: input.quoteId, document: { projectId: input.projectId } },
				select: { id: true },
			});
			if (!quote) throw new TRPCError({ code: "NOT_FOUND" });

			const code = await prisma.code.findUnique({
				where: { id: input.codeId, projectId: input.projectId },
				select: { id: true },
			});
			if (!code) throw new TRPCError({ code: "NOT_FOUND" });

			await prisma.quoteCode.upsert({
				where: {
					quoteId_codeId: { quoteId: input.quoteId, codeId: input.codeId },
				},
				create: { quoteId: input.quoteId, codeId: input.codeId },
				update: {},
			});
			return { success: true };
		}),

	/** Remove a code from a quote. Collaborator+ only. */
	removeCode: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				quoteId: z.string(),
				codeId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const quote = await prisma.quote.findFirst({
				where: { id: input.quoteId, document: { projectId: input.projectId } },
				select: { id: true },
			});
			if (!quote) throw new TRPCError({ code: "NOT_FOUND" });

			const code = await prisma.code.findUnique({
				where: { id: input.codeId, projectId: input.projectId },
				select: { id: true },
			});
			if (!code) throw new TRPCError({ code: "NOT_FOUND" });

			await prisma.quoteCode.deleteMany({
				where: { quoteId: input.quoteId, codeId: input.codeId },
			});
			return { success: true };
		}),

	/** List comments on a quote. Available to all project members. */
	listComments: projectProcedure
		.input(z.object({ projectId: z.string(), quoteId: z.string() }))
		.query(async ({ input }) => {
			return prisma.quoteComment.findMany({
				where: { quoteId: input.quoteId },
				select: {
					id: true,
					content: true,
					createdAt: true,
					user: { select: { id: true, name: true } },
				},
				orderBy: { createdAt: "asc" },
			});
		}),

	/** Add a comment to a quote. Available to all project members. */
	addComment: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				quoteId: z.string(),
				content: z.string().min(1).max(2000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const quote = await prisma.quote.findFirst({
				where: { id: input.quoteId, document: { projectId: input.projectId } },
				select: { id: true },
			});
			if (!quote) throw new TRPCError({ code: "NOT_FOUND" });

			return prisma.quoteComment.create({
				data: {
					quoteId: input.quoteId,
					userId: ctx.userId,
					content: input.content,
				},
				select: {
					id: true,
					content: true,
					createdAt: true,
					user: { select: { id: true, name: true } },
				},
			});
		}),

	/**
	 * Delete a comment. Own comments can always be deleted; a VIEWER cannot
	 * delete another member's comment.
	 */
	deleteComment: projectProcedure
		.input(z.object({ projectId: z.string(), commentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const comment = await prisma.quoteComment.findFirst({
				where: {
					id: input.commentId,
					quote: { document: { projectId: input.projectId } },
				},
				select: { id: true, userId: true },
			});
			if (!comment) throw new TRPCError({ code: "NOT_FOUND" });

			if (comment.userId !== ctx.userId && ctx.member.role === "VIEWER") {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			await prisma.quoteComment.delete({ where: { id: input.commentId } });
			return { success: true };
		}),
});
