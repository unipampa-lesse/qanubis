import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { logger } from "@/lib/logger";
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/trpc";

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createTRPCContext({ req }),
		onError: ({ error, path }) => {
			if (error.code === "INTERNAL_SERVER_ERROR") {
				logger.error({ err: error, path }, "tRPC internal error");
			}
		},
	});

export { handler as GET, handler as POST };
