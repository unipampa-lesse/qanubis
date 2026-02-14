import "server-only"; // <-- ensure this file cannot be imported from the client
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";
import { createCallerFactory, createTRPCContext } from "./trpc";

export const getQueryClient = cache(makeQueryClient);
const createContext = cache(async () =>
	createTRPCContext({ headers: await headers() }),
);
const caller = createCallerFactory(appRouter)(createContext);
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
	caller,
	getQueryClient,
);
