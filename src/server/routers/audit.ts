import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from "@/lib/audit/catalog";
import {
	buildAuditTextSearchWhere,
	normalizeAuditTextQuery,
	parseAuditDateRange,
} from "@/lib/audit/filters";
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
				action: z.enum(AUDIT_ACTIONS).optional(),
				entityType: z.enum(AUDIT_ENTITY_TYPES).optional(),
				actorId: z.string().optional(),
				dateFrom: z.string().max(10).optional(),
				dateTo: z.string().max(10).optional(),
			}),
		)
		.query(async ({ input }) => {
			const textQuery = normalizeAuditTextQuery(input.query);
			const { dateFrom, dateToExclusive, invalid } = parseAuditDateRange({
				dateFrom: input.dateFrom,
				dateTo: input.dateTo,
			});

			if (invalid) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid date range",
				});
			}

			const items = await prisma.auditEvent.findMany({
				where: {
					projectId: input.projectId,
					...(input.action && { action: input.action }),
					...(input.entityType && { entityType: input.entityType }),
					...(input.actorId && { actorId: input.actorId }),
					...(dateFrom || dateToExclusive
						? {
								createdAt: {
									...(dateFrom && { gte: dateFrom }),
									...(dateToExclusive && { lt: dateToExclusive }),
								},
							}
						: {}),
					...(textQuery ? buildAuditTextSearchWhere(textQuery) : {}),
				},
				select: {
					id: true,
					action: true,
					entityType: true,
					entityId: true,
					summary: true,
					createdAt: true,
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
