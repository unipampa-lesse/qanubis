import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/providers/storage";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
	/** Platform-wide stats shown on the admin dashboard. */
	stats: adminProcedure.query(async () => {
		const [users, projects, documents, quotes, tickets] = await Promise.all([
			prisma.user.count(),
			prisma.project.count(),
			prisma.document.count(),
			prisma.quote.count(),
			prisma.supportTicket.count({
				where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
			}),
		]);
		return { users, projects, documents, quotes, tickets };
	}),

	// -------------------------------------------------------------------------
	// Users
	// -------------------------------------------------------------------------

	listUsers: adminProcedure
		.input(
			z
				.object({
					limit: z.number().int().min(1).max(100).default(30),
					cursor: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const limit = input?.limit ?? 30;
			const items = await prisma.user.findMany({
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
				orderBy: [{ createdAt: "asc" }, { id: "asc" }],
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

	listProjects: adminProcedure
		.input(
			z
				.object({
					limit: z.number().int().min(1).max(100).default(30),
					cursor: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const limit = input?.limit ?? 30;
			const [projects, storageSums] = await Promise.all([
				prisma.project.findMany({
					select: {
						id: true,
						name: true,
						color: true,
						createdAt: true,
						_count: {
							select: {
								members: true,
								documents: true,
								codes: true,
								memos: true,
							},
						},
					},
					orderBy: [{ createdAt: "desc" }, { id: "desc" }],
					take: limit + 1,
					...(input?.cursor
						? {
								cursor: { id: input.cursor },
								skip: 1,
							}
						: {}),
				}),
				prisma.document.groupBy({
					by: ["projectId"],
					_sum: { fileSize: true },
				}),
			]);

			const storageMap = new Map(
				storageSums.map((s) => [s.projectId, s._sum.fileSize ?? 0]),
			);
			const hasMore = projects.length > limit;
			const page = hasMore ? projects.slice(0, -1) : projects;
			const nextCursor = hasMore ? page[page.length - 1]?.id : null;

			return {
				items: page.map((p) => ({
					...p,
					storageBytes: storageMap.get(p.id) ?? 0,
				})),
				nextCursor,
			};
		}),

	/** Admin-level project deletion. Removes all documents from storage. */
	deleteProject: adminProcedure
		.input(z.object({ projectId: z.string() }))
		.mutation(async ({ input }) => {
			// Delete document files from storage before removing the DB record.
			const documents = await prisma.document.findMany({
				where: { projectId: input.projectId },
				select: { storageKey: true },
			});

			const storage = getStorageProvider();
			await Promise.allSettled(
				documents.flatMap((d) =>
					d.storageKey ? [storage.delete(d.storageKey)] : [],
				),
			);

			// Cascade deletes handle all related records.
			await prisma.project.delete({
				where: { id: input.projectId },
			});

			return { success: true };
		}),

	// -------------------------------------------------------------------------
	// Support tickets
	// -------------------------------------------------------------------------

	listTickets: adminProcedure
		.input(
			z
				.object({
					limit: z.number().int().min(1).max(100).default(30),
					cursor: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const limit = input?.limit ?? 30;
			const items = await prisma.supportTicket.findMany({
				select: {
					id: true,
					subject: true,
					status: true,
					createdAt: true,
					updatedAt: true,
					user: { select: { id: true, name: true, email: true } },
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
