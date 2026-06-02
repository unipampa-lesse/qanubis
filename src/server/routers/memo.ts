import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { recordAuditEventSafe } from "@/server/services/audit";
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
		.input(
			z.object({
				projectId: z.string(),
				limit: z.number().int().min(1).max(100).default(30),
				cursor: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const items = await prisma.memo.findMany({
				where: { projectId: input.projectId },
				select: memoSummarySelect,
				orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
				take: input.limit + 1,
				...(input.cursor
					? {
							cursor: { id: input.cursor },
							skip: 1,
						}
					: {}),
			});

			const hasMore = items.length > input.limit;
			const page = hasMore ? items.slice(0, -1) : items;
			const nextCursor = hasMore ? page[page.length - 1]?.id : null;

			return {
				items: page,
				nextCursor,
			};
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
			const memo = await prisma.memo.create({
				data: {
					projectId: input.projectId,
					createdById: ctx.userId,
					name: input.name,
					content: {},
				},
				select: memoSummarySelect,
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "MEMO_CREATED",
				entityType: "MEMO",
				entityId: memo.id,
				summary: `Memo created: ${memo.name}`,
			});

			return memo;
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
		.mutation(async ({ ctx, input }) => {
			const memo = await prisma.memo.findFirst({
				where: { id: input.memoId, projectId: input.projectId },
				select: { id: true, name: true },
			});
			if (!memo) throw new TRPCError({ code: "NOT_FOUND" });

			const updated = await prisma.memo.update({
				where: { id: input.memoId },
				data: {
					...(input.name !== undefined && { name: input.name }),
					...(input.content !== undefined && {
						content: input.content as Prisma.InputJsonValue,
					}),
				},
				select: memoSelect,
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "MEMO_UPDATED",
				entityType: "MEMO",
				entityId: input.memoId,
				summary: `Memo updated: ${updated.name}`,
				details: {
					before: { name: memo.name },
					after: { name: updated.name },
					hasContentUpdate: input.content !== undefined,
				},
			});

			return updated;
		}),

	/** Delete a memo. Collaborator+ only. */
	delete: collaboratorProcedure
		.input(z.object({ projectId: z.string(), memoId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const memo = await prisma.memo.findFirst({
				where: { id: input.memoId, projectId: input.projectId },
				select: { id: true, name: true },
			});
			if (!memo) throw new TRPCError({ code: "NOT_FOUND" });

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "MEMO_DELETED",
				entityType: "MEMO",
				entityId: input.memoId,
				summary: `Memo deleted: ${memo.name}`,
			});

			await prisma.memo.delete({ where: { id: input.memoId } });
			return { success: true };
		}),
});
