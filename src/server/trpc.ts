import type { ProjectRole } from "@prisma/client";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { initTRPC, TRPCError } from "@trpc/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { cache } from "react";
import superjson from "superjson";
import { ZodError } from "zod";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

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
				secret: env.NEXTAUTH_SECRET,
			});
			userId = token?.sub ?? null;
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

const tracer = trace.getTracer("qanubis/trpc");

const tracingMiddleware = t.middleware(async ({ path, type, next }) => {
	return tracer.startActiveSpan(`trpc.${type}.${path}`, async (span) => {
		try {
			const result = await next();
			if (!result.ok) {
				span.setStatus({ code: SpanStatusCode.ERROR });
			}
			return result;
		} catch (err) {
			span.setStatus({ code: SpanStatusCode.ERROR });
			span.recordException(err as Error);
			throw err;
		} finally {
			span.end();
		}
	});
});

export const publicProcedure = t.procedure.use(tracingMiddleware);

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({ ctx: { ...ctx, userId: ctx.userId } });
});

/**
 * Resolves the `projectId` from `input.projectId` and attaches the caller's
 * membership to the context. Throws UNAUTHORIZED / FORBIDDEN / NOT_FOUND as
 * appropriate. Downstream procedures receive `ctx.projectId` and `ctx.member`.
 */
function makeProjectMiddleware(allowedRoles: ProjectRole[]) {
	return protectedProcedure
		.input((input: unknown) => {
			if (
				typeof input !== "object" ||
				input === null ||
				typeof (input as Record<string, unknown>).projectId !== "string"
			) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "projectId is required",
				});
			}
			return input as { projectId: string } & Record<string, unknown>;
		})
		.use(async ({ ctx, input, next }) => {
			const member = await prisma.projectMember.findUnique({
				where: {
					projectId_userId: { projectId: input.projectId, userId: ctx.userId },
				},
			});
			if (!member) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Not a project member",
				});
			}
			if (!allowedRoles.includes(member.role)) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Insufficient role",
				});
			}
			return next({ ctx: { ...ctx, projectId: input.projectId, member } });
		});
}

/** Any project member (OWNER, COLLABORATOR, VIEWER) */
export const projectProcedure = makeProjectMiddleware([
	"OWNER",
	"COLLABORATOR",
	"VIEWER",
]);

/** Owner or Collaborator — can create/edit resources */
export const collaboratorProcedure = makeProjectMiddleware([
	"OWNER",
	"COLLABORATOR",
]);

/** Owner only — destructive or admin-level actions */
export const ownerProcedure = makeProjectMiddleware(["OWNER"]);

/**
 * Site-admin procedure — requires UserRole.ADMIN.
 * Fetches the user record to verify role; throws FORBIDDEN otherwise.
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	const user = await prisma.user.findUnique({
		where: { id: ctx.userId },
		select: { role: true },
	});
	if (!user || user.role !== "ADMIN") {
		throw new TRPCError({ code: "FORBIDDEN" });
	}
	return next({ ctx: { ...ctx, userId: ctx.userId } });
});
