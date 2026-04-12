import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
	createTRPCRouter,
	ownerProcedure,
	projectProcedure,
	protectedProcedure,
} from "../trpc";

export const projectRouter = createTRPCRouter({
	/** List all projects the current user is a member of. */
	list: protectedProcedure.query(async ({ ctx }) => {
		const memberships = await prisma.projectMember.findMany({
			where: { userId: ctx.userId },
			include: {
				project: {
					include: {
						_count: { select: { members: true, documents: true } },
					},
				},
			},
			orderBy: { project: { updatedAt: "desc" } },
		});

		return memberships.map((m) => ({
			...m.project,
			role: m.role,
		}));
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
		.mutation(async ({ input }) => {
			return prisma.project.update({
				where: { id: input.projectId },
				data: {
					...(input.name !== undefined && { name: input.name }),
					...(input.description !== undefined && {
						description: input.description,
					}),
					...(input.color !== undefined && { color: input.color }),
				},
			});
		}),

	/** Delete a project and all its data (owner only). */
	delete: ownerProcedure
		.input(z.object({ projectId: z.string() }))
		.mutation(async ({ input }) => {
			await prisma.project.delete({ where: { id: input.projectId } });
			return { success: true };
		}),
});
