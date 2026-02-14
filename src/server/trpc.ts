import { initTRPC, TRPCError } from "@trpc/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { cache } from "react";
import superjson from "superjson";
import { ZodError } from "zod";

type HeadersLike = {
	get(name: string): string | null;
};

export type TRPCContext = {
	userId: string | null;
	headers: HeadersLike;
};

const transformer = {
	serialize: superjson.serialize,
	deserialize: superjson.deserialize,
};

export const createTRPCContext = cache(
	async (opts?: {
		req?: Request | NextRequest;
		headers?: HeadersLike;
	}): Promise<TRPCContext> => {
		const headers = opts?.headers ?? opts?.req?.headers ?? new Headers();
		let userId: string | null = null;
		if (opts?.req) {
			const token = await getToken({
				req: opts.req as NextRequest,
				secret: process.env.NEXTAUTH_SECRET,
			});
			userId = token?.sub ?? null;
		} else {
			userId = headers.get("x-user-id");
		}
		return { userId, headers };
	},
);

const t = initTRPC.context<TRPCContext>().create({
	transformer,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			...ctx,
			userId: ctx.userId,
		},
	});
});
