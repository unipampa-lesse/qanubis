import { withAuth } from "next-auth/middleware";

export default withAuth({
	pages: {
		signIn: "/api/auth/signin",
	},
});

export const config = {
	matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
