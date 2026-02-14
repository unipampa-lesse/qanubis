import { withAuth } from "next-auth/middleware";

export default withAuth({
	pages: {
		signIn: "/api/auth/signin",
	},
});

export const config = {
	matcher: [
		// Protege todas as rotas exceto /login e /
		"/((?!api|_next|static|favicon.ico|login$|$).*)",
	],
};
