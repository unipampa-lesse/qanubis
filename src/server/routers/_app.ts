import { createTRPCRouter } from "../trpc";
import { adminRouter } from "./admin";
import { bibtexRouter } from "./bibtex";
import { codeRouter } from "./code";
import { documentRouter } from "./document";
import { memberRouter } from "./member";
import { memoRouter } from "./memo";
import { notificationRouter } from "./notification";
import { projectRouter } from "./project";
import { quoteRouter } from "./quote";
import { reportRouter } from "./report";
import { supportRouter } from "./support";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	user: userRouter,
	project: projectRouter,
	member: memberRouter,
	document: documentRouter,
	bibtex: bibtexRouter,
	code: codeRouter,
	quote: quoteRouter,
	memo: memoRouter,
	report: reportRouter,
	admin: adminRouter,
	support: supportRouter,
	notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
