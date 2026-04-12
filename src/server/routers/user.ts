import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
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
