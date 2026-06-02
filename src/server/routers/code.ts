import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { pushSSENotification } from "@/lib/sse-registry";
import { recordAuditEventSafe } from "@/server/services/audit";
import {
	collaboratorProcedure,
	createTRPCRouter,
	projectProcedure,
} from "../trpc";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color");

export const codeRouter = createTRPCRouter({
	/** List all codes in a project (flat — tree is built client-side). */
	list: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				limit: z.number().int().min(1).max(200).default(100),
				cursor: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const items = await prisma.code.findMany({
				where: { projectId: input.projectId },
				select: {
					id: true,
					name: true,
					color: true,
					textColor: true,
					description: true,
					parentId: true,
					createdAt: true,
					_count: {
						select: { quoteCodes: true, children: true, comments: true },
					},
				},
				orderBy: [{ createdAt: "asc" }, { id: "asc" }],
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

	/** Create a new code (OWNER or COLLABORATOR). */
	create: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				name: z.string().min(1).max(100),
				color: hexColor,
				textColor: hexColor,
				description: z.string().max(500).optional(),
				parentId: z.string().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Verify parent belongs to the same project.
			if (input.parentId) {
				const parent = await prisma.code.findUnique({
					where: { id: input.parentId },
					select: { projectId: true },
				});
				if (!parent || parent.projectId !== input.projectId) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Parent code not found in this project",
					});
				}
			}
			const code = await prisma.code.create({
				data: {
					projectId: input.projectId,
					name: input.name,
					color: input.color,
					textColor: input.textColor,
					description: input.description ?? null,
					parentId: input.parentId ?? null,
				},
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "CODE_CREATED",
				entityType: "CODE",
				entityId: code.id,
				summary: `Code created: ${code.name}`,
				details: {
					name: code.name,
					parentId: code.parentId,
				},
			});

			return code;
		}),

	/** Update code name, color, textColor, or description (OWNER or COLLABORATOR). */
	update: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				codeId: z.string(),
				name: z.string().min(1).max(100).optional(),
				color: hexColor.optional(),
				textColor: hexColor.optional(),
				description: z.string().max(500).nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const code = await prisma.code.findUnique({
				where: { id: input.codeId, projectId: input.projectId },
			});
			if (!code) throw new TRPCError({ code: "NOT_FOUND" });

			const updated = await prisma.code.update({
				where: { id: input.codeId },
				data: {
					...(input.name !== undefined && { name: input.name }),
					...(input.color !== undefined && { color: input.color }),
					...(input.textColor !== undefined && { textColor: input.textColor }),
					...(input.description !== undefined && {
						description: input.description,
					}),
				},
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "CODE_UPDATED",
				entityType: "CODE",
				entityId: input.codeId,
				summary: `Code updated: ${updated.name}`,
				details: {
					before: {
						name: code.name,
						color: code.color,
						textColor: code.textColor,
						description: code.description,
					},
					after: {
						name: updated.name,
						color: updated.color,
						textColor: updated.textColor,
						description: updated.description,
					},
				},
			});

			return updated;
		}),

	/** Delete a code — cascades to QuoteCode associations and child codes. */
	delete: collaboratorProcedure
		.input(z.object({ projectId: z.string(), codeId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const code = await prisma.code.findUnique({
				where: { id: input.codeId, projectId: input.projectId },
			});
			if (!code) throw new TRPCError({ code: "NOT_FOUND" });

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "CODE_DELETED",
				entityType: "CODE",
				entityId: input.codeId,
				summary: `Code deleted: ${code.name}`,
			});

			await prisma.code.delete({ where: { id: input.codeId } });
			return { success: true };
		}),

	// -------------------------------------------------------------------------
	// Code comments (T21)
	// -------------------------------------------------------------------------

	/** List comments for a code (all project members). */
	listComments: projectProcedure
		.input(z.object({ projectId: z.string(), codeId: z.string() }))
		.query(async ({ input }) => {
			return prisma.codeComment.findMany({
				where: { codeId: input.codeId },
				select: {
					id: true,
					content: true,
					createdAt: true,
					user: { select: { id: true, name: true } },
				},
				orderBy: { createdAt: "asc" },
			});
		}),

	/** Add a comment to a code. Notifies project owner if different from commenter. */
	addComment: collaboratorProcedure
		.input(
			z.object({
				projectId: z.string(),
				codeId: z.string(),
				content: z.string().min(1).max(2000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const code = await prisma.code.findUnique({
				where: { id: input.codeId, projectId: input.projectId },
				select: { id: true, name: true, projectId: true },
			});
			if (!code) throw new TRPCError({ code: "NOT_FOUND" });

			const [comment, commenter, owner] = await Promise.all([
				prisma.codeComment.create({
					data: {
						codeId: input.codeId,
						userId: ctx.userId,
						content: input.content,
					},
					select: {
						id: true,
						content: true,
						createdAt: true,
						user: { select: { id: true, name: true } },
					},
				}),
				prisma.user.findUnique({
					where: { id: ctx.userId },
					select: { name: true },
				}),
				prisma.projectMember.findFirst({
					where: { projectId: input.projectId, role: "OWNER" },
					select: { userId: true },
				}),
			]);

			if (owner && owner.userId !== ctx.userId) {
				const notification = await prisma.notification.create({
					data: {
						userId: owner.userId,
						type: "code_comment",
						title: commenter?.name ?? "Alguém",
						body: `${code.name}: ${input.content.slice(0, 100)}`,
						link: `/dashboard/projects/${input.projectId}`,
					},
				});
				pushSSENotification(owner.userId, notification);
			}

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "CODE_COMMENT_ADDED",
				entityType: "CODE",
				entityId: input.codeId,
				summary: `Comment added to code: ${code.name}`,
				details: {
					commentId: comment.id,
					commentPreview: input.content.slice(0, 180),
				},
			});

			return comment;
		}),

	/** Delete a comment — comment owner or project OWNER only. */
	deleteComment: collaboratorProcedure
		.input(z.object({ projectId: z.string(), commentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const comment = await prisma.codeComment.findUnique({
				where: { id: input.commentId },
				select: {
					id: true,
					content: true,
					userId: true,
					code: { select: { id: true, name: true, projectId: true } },
				},
			});
			if (!comment || comment.code.projectId !== input.projectId) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}
			if (comment.userId !== ctx.userId && ctx.member.role !== "OWNER") {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "CODE_COMMENT_DELETED",
				entityType: "CODE",
				entityId: comment.code.id,
				summary: `Comment removed from code: ${comment.code.name}`,
				details: {
					commentId: comment.id,
					commentPreview: comment.content.slice(0, 180),
				},
			});

			await prisma.codeComment.delete({ where: { id: input.commentId } });
			return { success: true };
		}),
});
