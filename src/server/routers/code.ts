import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
	collaboratorProcedure,
	createTRPCRouter,
	projectProcedure,
} from "../trpc";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color");

export const codeRouter = createTRPCRouter({
	/** List all codes in a project (flat — tree is built client-side). */
	list: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			return prisma.code.findMany({
				where: { projectId: input.projectId },
				select: {
					id: true,
					name: true,
					color: true,
					textColor: true,
					description: true,
					parentId: true,
					createdAt: true,
					_count: { select: { quoteCodes: true, children: true } },
				},
				orderBy: { createdAt: "asc" },
			});
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
		.mutation(async ({ input }) => {
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
			return prisma.code.create({
				data: {
					projectId: input.projectId,
					name: input.name,
					color: input.color,
					textColor: input.textColor,
					description: input.description ?? null,
					parentId: input.parentId ?? null,
				},
			});
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
		.mutation(async ({ input }) => {
			const code = await prisma.code.findUnique({
				where: { id: input.codeId, projectId: input.projectId },
			});
			if (!code) throw new TRPCError({ code: "NOT_FOUND" });

			return prisma.code.update({
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
		}),

	/** Delete a code — cascades to QuoteCode associations and child codes. */
	delete: collaboratorProcedure
		.input(z.object({ projectId: z.string(), codeId: z.string() }))
		.mutation(async ({ input }) => {
			const code = await prisma.code.findUnique({
				where: { id: input.codeId, projectId: input.projectId },
			});
			if (!code) throw new TRPCError({ code: "NOT_FOUND" });

			await prisma.code.delete({ where: { id: input.codeId } });
			return { success: true };
		}),
});
