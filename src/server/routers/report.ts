import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, projectProcedure } from "../trpc";

/** Full quote shape for report views. */
const reportQuoteSelect = {
	id: true,
	text: true,
	page: true,
	color: true,
	createdAt: true,
	document: { select: { id: true, name: true } },
	createdBy: { select: { id: true, name: true } },
	quoteCodes: {
		select: {
			code: {
				select: { id: true, name: true, color: true, textColor: true },
			},
		},
	},
} as const;

export const reportRouter = createTRPCRouter({
	/**
	 * All quotes for a project across every document.
	 * Used by the quote explorer, heatmaps, and export.
	 */
	quotes: projectProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ input }) => {
			return prisma.quote.findMany({
				where: { document: { projectId: input.projectId } },
				select: reportQuoteSelect,
				orderBy: [
					{ document: { name: "asc" } },
					{ page: "asc" },
					{ createdAt: "asc" },
				],
			});
		}),
});
