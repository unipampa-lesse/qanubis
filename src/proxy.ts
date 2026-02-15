import { withAuth } from "next-auth/middleware";

export default withAuth({
	pages: {
		signIn: "/signin",
		signOut: "/signout",
		error: "/error-503",
	},
});

export const config = {
	matcher: [
		"/((?!api|_next|static|favicon.ico|sign*|reset-password|two-step-verification|error-500|error-503|maintenance|coming-soon|success|dashboard*|$).*)",
	],
};
