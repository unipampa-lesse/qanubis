import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const supportRouter = createTRPCRouter({
	/** Open a new support ticket. */
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
					status: "OPEN",
					messages: {
						create: {
							senderId: ctx.userId,
							content: input.message,
						},
					},
				},
				select: { id: true },
			});
		}),

	/** List all tickets opened by the current user. */
	listMyTickets: protectedProcedure.query(async ({ ctx }) => {
		return prisma.supportTicket.findMany({
			where: { userId: ctx.userId },
			select: {
				id: true,
				subject: true,
				status: true,
				createdAt: true,
				updatedAt: true,
				_count: { select: { messages: true } },
			},
			orderBy: { updatedAt: "desc" },
		});
	}),

	/** Get a single ticket with its full message thread (owner only). */
	getMyTicket: protectedProcedure
		.input(z.object({ ticketId: z.string() }))
		.query(async ({ ctx, input }) => {
			const ticket = await prisma.supportTicket.findUnique({
				where: { id: input.ticketId },
				include: {
					messages: {
						include: { sender: { select: { id: true, name: true, role: true } } },
						orderBy: { createdAt: "asc" },
					},
				},
			});
			if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
			if (ticket.userId !== ctx.userId)
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
					senderId: ctx.userId,
					content: input.message,
				},
			});

			// Re-open if resolved so admin knows there's a new reply
			if (ticket.status === "RESOLVED") {
				await prisma.supportTicket.update({
					where: { id: input.ticketId },
					data: { status: "OPEN" },
				});
			} else {
				await prisma.supportTicket.update({
					where: { id: input.ticketId },
					data: { updatedAt: new Date() },
				});
			}

			return { success: true };
		}),
});
