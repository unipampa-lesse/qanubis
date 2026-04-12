import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
	collaboratorProcedure,
	createTRPCRouter,
	projectProcedure,
} from "../trpc";

const memoSelect = {
	id: true,
	name: true,
	content: true,
	createdAt: true,
	updatedAt: true,
	createdBy: { select: { id: true, name: true } },
} as const;

const memoSummarySelect = {
	id: true,
	name: true,
	createdAt: true,
	updatedAt: true,
	createdBy: { select: { id: true, name: true } },
} as const;

export const memoRouter = createTRPCRouter({
	/** List all memos for a project (summary — no content body). */
	list: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			return prisma.memo.findMany({
				where: { projectId: input.projectId },
				select: memoSummarySelect,
				orderBy: { updatedAt: "desc" },
			});
		}),

	/** Get a single memo including its full content. */
	get: projectProcedure
		.input(z.object({ projectId: z.string(), memoId: z.string() }))
		.query(async ({ input }) => {
			const memo = await prisma.memo.findFirst({
				where: { id: input.memoId, projectId: input.projectId },
				select: memoSelect,
			});
			if (!memo) throw new TRPCError({ code: "NOT_FOUND" });
			return memo;
		}),

	/** Create a new memo. Collaborator+ only. */
	create: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				name: z.string().min(1).max(200),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.memo.create({
				data: {
					projectId: input.projectId,
					createdById: ctx.userId,
					name: input.name,
					content: {},
				},
				select: memoSummarySelect,
			});
		}),

	/** Update a memo's name and/or content. Collaborator+ only. */
	update: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				memoId: z.string(),
				name: z.string().min(1).max(200).optional(),
				// Tiptap JSON document — accept any JSON object
				content: z.record(z.string(), z.unknown()).optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const memo = await prisma.memo.findFirst({
				where: { id: input.memoId, projectId: input.projectId },
				select: { id: true },
			});
			if (!memo) throw new TRPCError({ code: "NOT_FOUND" });

			return prisma.memo.update({
				where: { id: input.memoId },
				data: {
					...(input.name !== undefined && { name: input.name }),
					...(input.content !== undefined && {
						content: input.content as Prisma.InputJsonValue,
					}),
				},
				select: memoSelect,
			});
		}),

	/** Delete a memo. Collaborator+ only. */
	delete: collaboratorProcedure
		.input(z.object({ projectId: z.string(), memoId: z.string() }))
		.mutation(async ({ input }) => {
			const memo = await prisma.memo.findFirst({
				where: { id: input.memoId, projectId: input.projectId },
				select: { id: true },
			});
			if (!memo) throw new TRPCError({ code: "NOT_FOUND" });

			await prisma.memo.delete({ where: { id: input.memoId } });
			return { success: true };
		}),
});
