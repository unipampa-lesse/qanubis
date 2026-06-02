import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const supportRouter = createTRPCRouter({
	/** Open a new support ticket. The message becomes the ticket's description. */
	createTicket: protectedProcedure
		.input(
			z.object({
				subject: z.string().min(1).max(200),
				message: z.string().min(1).max(5000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.supportTicket.create({
				data: {
					userId: ctx.userId,
					subject: input.subject,
					description: input.message,
					status: "OPEN",
				},
				select: { id: true },
			});
		}),

	/** List all tickets opened by the current user. */
	listMyTickets: protectedProcedure
		.input(
			z
				.object({
					limit: z.number().int().min(1).max(100).default(30),
					cursor: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const limit = input?.limit ?? 30;
			const items = await prisma.supportTicket.findMany({
				where: { userId: ctx.userId },
				select: {
					id: true,
					subject: true,
					status: true,
					createdAt: true,
					updatedAt: true,
					_count: { select: { messages: true } },
				},
				orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
				take: limit + 1,
				...(input?.cursor
					? {
							cursor: { id: input.cursor },
							skip: 1,
						}
					: {}),
			});

			const hasMore = items.length > limit;
			const page = hasMore ? items.slice(0, -1) : items;
			const nextCursor = hasMore ? page[page.length - 1]?.id : null;

			return { items: page, nextCursor };
		}),

	/** Get a single ticket with its full message thread (owner only). */
	getMyTicket: protectedProcedure
		.input(z.object({ ticketId: z.string() }))
		.query(async ({ ctx, input }) => {
			const ticket = await prisma.supportTicket.findUnique({
				where: { id: input.ticketId },
				select: {
					id: true,
					subject: true,
					description: true,
					status: true,
					createdAt: true,
					messages: {
						select: {
							id: true,
							content: true,
							createdAt: true,
							user: { select: { id: true, name: true, role: true } },
						},
						orderBy: { createdAt: "asc" },
					},
				},
			});
			if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
			// Fetch userId separately to avoid exposing it in the select above
			const raw = await prisma.supportTicket.findUnique({
				where: { id: input.ticketId },
				select: { userId: true },
			});
			if (!raw || raw.userId !== ctx.userId)
				throw new TRPCError({ code: "FORBIDDEN" });
			return ticket;
		}),

	/** Add a reply message to the user's own ticket. */
	replyToMyTicket: protectedProcedure
		.input(
			z.object({
				ticketId: z.string(),
				message: z.string().min(1).max(5000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const ticket = await prisma.supportTicket.findUnique({
				where: { id: input.ticketId },
				select: { userId: true, status: true },
			});
			if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
			if (ticket.userId !== ctx.userId)
				throw new TRPCError({ code: "FORBIDDEN" });
			if (ticket.status === "CLOSED")
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ticket_closed",
				});

			await prisma.ticketMessage.create({
				data: {
					ticketId: input.ticketId,
					userId: ctx.userId,
					content: input.message,
				},
			});

			// Re-open if resolved so admin knows there's a new reply
			await prisma.supportTicket.update({
				where: { id: input.ticketId },
				data: {
					status: ticket.status === "RESOLVED" ? "OPEN" : ticket.status,
					updatedAt: new Date(),
				},
			});

			return { success: true };
		}),
});
