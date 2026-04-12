import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
	/** Platform-wide stats shown on the admin dashboard. */
	stats: adminProcedure.query(async () => {
		const [users, projects, documents, quotes, tickets] = await Promise.all([
			prisma.user.count(),
			prisma.project.count(),
			prisma.document.count(),
			prisma.quote.count(),
			prisma.supportTicket.count(),
		]);
		return { users, projects, documents, quotes, tickets };
	}),

	// -------------------------------------------------------------------------
	// Users
	// -------------------------------------------------------------------------

	listUsers: adminProcedure.query(async () => {
		return prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				suspended: true,
				createdAt: true,
				_count: {
					select: { projectMembers: true, quotes: true },
				},
			},
			orderBy: { createdAt: "asc" },
		});
	}),

	updateUser: adminProcedure
		.input(
			z.object({
				userId: z.string(),
				role: z.enum(["USER", "ADMIN"]).optional(),
				suspended: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			return prisma.user.update({
				where: { id: input.userId },
				data: {
					...(input.role !== undefined && { role: input.role }),
					...(input.suspended !== undefined && { suspended: input.suspended }),
				},
				select: { id: true, role: true, suspended: true },
			});
		}),

	// -------------------------------------------------------------------------
	// Projects
	// -------------------------------------------------------------------------

	listProjects: adminProcedure.query(async () => {
		return prisma.project.findMany({
			select: {
				id: true,
				name: true,
				color: true,
				createdAt: true,
				_count: {
					select: { members: true, documents: true, codes: true, memos: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});
	}),

	// -------------------------------------------------------------------------
	// Support tickets
	// -------------------------------------------------------------------------

	listTickets: adminProcedure.query(async () => {
		return prisma.supportTicket.findMany({
			select: {
				id: true,
				subject: true,
				status: true,
				createdAt: true,
				updatedAt: true,
				user: { select: { id: true, name: true, email: true } },
				_count: { select: { messages: true } },
			},
			orderBy: { updatedAt: "desc" },
		});
	}),

	getTicket: adminProcedure
		.input(z.object({ ticketId: z.string() }))
		.query(async ({ input }) => {
			const ticket = await prisma.supportTicket.findUnique({
				where: { id: input.ticketId },
				select: {
					id: true,
					subject: true,
					description: true,
					status: true,
					createdAt: true,
					updatedAt: true,
					user: { select: { id: true, name: true, email: true } },
					messages: {
						select: {
							id: true,
							content: true,
							createdAt: true,
							user: { select: { id: true, name: true } },
						},
						orderBy: { createdAt: "asc" },
					},
				},
			});
			if (!ticket) return null;
			return ticket;
		}),

	updateTicketStatus: adminProcedure
		.input(
			z.object({
				ticketId: z.string(),
				status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
			}),
		)
		.mutation(async ({ input }) => {
			return prisma.supportTicket.update({
				where: { id: input.ticketId },
				data: { status: input.status },
				select: { id: true, status: true },
			});
		}),

	replyTicket: adminProcedure
		.input(
			z.object({
				ticketId: z.string(),
				content: z.string().min(1).max(5000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.ticketMessage.create({
				data: {
					ticketId: input.ticketId,
					userId: ctx.userId,
					content: input.content,
				},
				select: {
					id: true,
					content: true,
					createdAt: true,
					user: { select: { id: true, name: true } },
				},
			});
		}),
});
