import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, projectProcedure } from "../trpc";

export const auditRouter = createTRPCRouter({
	list: projectProcedure
		.input(
			z.object({
				projectId: z.string(),
				limit: z.number().int().min(1).max(100).default(50),
				cursor: z.string().optional(),
				query: z.string().trim().max(200).optional(),
				action: z.string().optional(),
				entityType: z.string().optional(),
				actorId: z.string().optional(),
				dateFrom: z.coerce.date().optional(),
				dateTo: z.coerce.date().optional(),
			}),
		)
		.query(async ({ input }) => {
			const textQuery = input.query?.trim();
			const actionFilter =
				input.action && input.action !== "ALL" ? input.action : undefined;
			const entityTypeFilter =
				input.entityType && input.entityType !== "ALL"
					? input.entityType
					: undefined;
			const actorIdFilter =
				input.actorId && input.actorId !== "ALL" ? input.actorId : undefined;
			const dateToExclusive = input.dateTo
				? new Date(input.dateTo.getTime() + 24 * 60 * 60 * 1000)
				: undefined;

			const items = await prisma.auditEvent.findMany({
				where: {
					projectId: input.projectId,
					...(actionFilter && { action: actionFilter }),
					...(entityTypeFilter && { entityType: entityTypeFilter }),
					...(actorIdFilter && { actorId: actorIdFilter }),
					...(input.dateFrom || dateToExclusive
						? {
								createdAt: {
									...(input.dateFrom && { gte: input.dateFrom }),
									...(dateToExclusive && { lt: dateToExclusive }),
								},
							}
						: {}),
					...(textQuery
						? {
								OR: [
									{ action: { contains: textQuery, mode: "insensitive" } },
									{ entityType: { contains: textQuery, mode: "insensitive" } },
									{ entityId: { contains: textQuery, mode: "insensitive" } },
									{ summary: { contains: textQuery, mode: "insensitive" } },
									{
										actor: {
											is: {
												OR: [
													{
														name: { contains: textQuery, mode: "insensitive" },
													},
													{
														email: { contains: textQuery, mode: "insensitive" },
													},
												],
											},
										},
									},
								],
							}
						: {}),
				},
				include: {
					actor: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
				orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
});
