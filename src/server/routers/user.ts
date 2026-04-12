import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	/** Returns the currently authenticated user's profile (role, name, email). */
	me: protectedProcedure.query(async ({ ctx }) => {
		return prisma.user.findUnique({
			where: { id: ctx.userId },
			select: { id: true, name: true, email: true, role: true },
		});
	}),

	/** Update the current user's display name. */
	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.user.update({
				where: { id: ctx.userId },
				data: { name: input.name },
				select: { id: true, name: true, email: true, role: true },
			});
		}),

	/** Change password — requires the current password for verification. */
	changePassword: protectedProcedure
		.input(
			z.object({
				currentPassword: z.string().min(1),
				newPassword: z.string().min(8),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await prisma.user.findUnique({
				where: { id: ctx.userId },
				select: { password: true },
			});
			if (!user?.password) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "no_password",
				});
			}
			const valid = await bcrypt.compare(input.currentPassword, user.password);
			if (!valid) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "wrong_password",
				});
			}
			const hash = await bcrypt.hash(input.newPassword, 12);
			await prisma.user.update({
				where: { id: ctx.userId },
				data: { password: hash },
			});
			return { success: true };
		}),

	register: publicProcedure
		.input(
			z.object({
				firstName: z.string().min(1),
				lastName: z.string().min(1),
				email: z.string().email(),
				password: z.string().min(8),
			}),
		)
		.mutation(async ({ input }) => {
			const existing = await prisma.user.findUnique({
				where: { email: input.email },
				select: { id: true },
			});
			if (existing) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "email_taken",
				});
			}

			const hash = await bcrypt.hash(input.password, 12);
			await prisma.user.create({
				data: {
					name: `${input.firstName} ${input.lastName}`.trim(),
					email: input.email,
					password: hash,
					// Auto-verify for now — email verification can be added in a future phase
					emailVerified: new Date(),
				},
			});

			return { success: true };
		}),
});
