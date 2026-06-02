import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { recordAuditEventSafe } from "@/server/services/audit";
import {
	createTRPCRouter,
	ownerProcedure,
	projectProcedure,
	protectedProcedure,
} from "../trpc";

export const projectRouter = createTRPCRouter({
	/** List all projects the current user is a member of. */
	list: protectedProcedure
		.input(
			z
				.object({
					limit: z.number().int().min(1).max(100).default(20),
					cursor: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const limit = input?.limit ?? 20;
			const memberships = await prisma.projectMember.findMany({
				where: { userId: ctx.userId },
				include: {
					project: {
						include: {
							_count: { select: { members: true, documents: true } },
						},
					},
				},
				orderBy: [{ project: { updatedAt: "desc" } }, { id: "desc" }],
				take: limit + 1,
				...(input?.cursor
					? {
							cursor: { id: input.cursor },
							skip: 1,
						}
					: {}),
			});

			const hasMore = memberships.length > limit;
			const page = hasMore ? memberships.slice(0, -1) : memberships;
			const nextCursor = hasMore ? page[page.length - 1]?.id : null;

			return {
				items: page.map((m) => ({
					...m.project,
					role: m.role,
				})),
				nextCursor,
			};
		}),

	/** Get a single project (member-only). */
	get: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			const project = await prisma.project.findUnique({
				where: { id: input.projectId },
				include: {
					_count: { select: { members: true, documents: true, codes: true } },
				},
			});
			if (!project) throw new TRPCError({ code: "NOT_FOUND" });
			return project;
		}),

	/** Create a new project. The caller becomes the OWNER. */
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100),
				description: z.string().max(500).optional(),
				color: z
					.string()
					.regex(/^#[0-9a-fA-F]{6}$/)
					.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const project = await prisma.project.create({
				data: {
					name: input.name,
					description: input.description,
					color: input.color ?? "#6366f1",
					members: {
						create: { userId: ctx.userId, role: "OWNER" },
					},
				},
			});
			await recordAuditEventSafe({
				projectId: project.id,
				actorId: ctx.userId,
				action: "PROJECT_CREATED",
				entityType: "PROJECT",
				entityId: project.id,
				summary: `Project created: ${project.name}`,
				details: {
					name: project.name,
					color: project.color,
				},
			});
			return project;
		}),

	/** Update project name, description, or color (owner only). */
	update: ownerProcedure
		.input(
			z.object({
				projectId: z.string(),
				name: z.string().min(1).max(100).optional(),
				description: z.string().max(500).nullable().optional(),
				color: z
					.string()
					.regex(/^#[0-9a-fA-F]{6}$/)
					.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const before = await prisma.project.findUnique({
				where: { id: input.projectId },
				select: { name: true, description: true, color: true },
			});

			const updated = await prisma.project.update({
				where: { id: input.projectId },
				data: {
					...(input.name !== undefined && { name: input.name }),
					...(input.description !== undefined && {
						description: input.description,
					}),
					...(input.color !== undefined && { color: input.color }),
				},
			});

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "PROJECT_UPDATED",
				entityType: "PROJECT",
				entityId: input.projectId,
				summary: `Project updated: ${updated.name}`,
				details: {
					before,
					after: {
						name: updated.name,
						description: updated.description,
						color: updated.color,
					},
				},
			});

			return updated;
		}),

	/** Delete a project and all its data (owner only). */
	delete: ownerProcedure
		.input(z.object({ projectId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const project = await prisma.project.findUnique({
				where: { id: input.projectId },
				select: { id: true, name: true },
			});
			if (!project) throw new TRPCError({ code: "NOT_FOUND" });

			await recordAuditEventSafe({
				projectId: input.projectId,
				actorId: ctx.userId,
				action: "PROJECT_DELETED",
				entityType: "PROJECT",
				entityId: input.projectId,
				summary: `Project deleted: ${project.name}`,
			});

			await prisma.project.delete({ where: { id: input.projectId } });
			return { success: true };
		}),
});
