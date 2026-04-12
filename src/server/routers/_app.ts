import { createTRPCRouter } from "../trpc";
import { documentRouter } from "./document";
import { memberRouter } from "./member";
import { projectRouter } from "./project";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	user: userRouter,
	project: projectRouter,
	member: memberRouter,
	document: documentRouter,
});

export type AppRouter = typeof appRouter;
