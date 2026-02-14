import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
export const appRouter = createTRPCRouter({
	hello: publicProcedure
		.input(
			z.object({
				text: z.string(),
			}),
		)
		.query((opts) => {
			return {
				greeting: `hello ${opts.input.text}`,
			};
		}),
	serverTime: publicProcedure.query(() => {
		return { now: new Date() };
	}),
	me: protectedProcedure.query(({ ctx }) => {
		return { userId: ctx.userId };
	}),
});

export type AppRouter = typeof appRouter;
