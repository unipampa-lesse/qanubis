import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
	/** Unread notification count for the badge. */
	unreadCount: protectedProcedure.query(async ({ ctx }) => {
		return prisma.notification.count({
			where: { userId: ctx.userId, read: false },
		});
	}),

	/** Recent notifications for the dropdown. */
	list: protectedProcedure
		.input(z.object({ limit: z.number().int().min(1).max(50).default(20) }).optional())
		.query(async ({ ctx, input }) => {
			return prisma.notification.findMany({
				where: { userId: ctx.userId },
				orderBy: { createdAt: "desc" },
				take: input?.limit ?? 20,
				select: {
					id: true,
					type: true,
					title: true,
					body: true,
					link: true,
					read: true,
					createdAt: true,
				},
			});
		}),

	/** Mark a single notification as read. */
	markRead: protectedProcedure
		.input(z.object({ notificationId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await prisma.notification.updateMany({
				where: { id: input.notificationId, userId: ctx.userId },
				data: { read: true },
			});
			return { success: true };
		}),

	/** Mark all notifications as read. */
	markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
		await prisma.notification.updateMany({
			where: { userId: ctx.userId, read: false },
			data: { read: true },
		});
		return { success: true };
	}),
});
