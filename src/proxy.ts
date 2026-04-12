import { withAuth } from "next-auth/middleware";

/**
 * Proxy (Next.js 16 equivalent of middleware).
 * Protects all /dashboard and /invite routes — redirects to /signin if unauthenticated.
 * The callbackUrl is automatically appended by withAuth so the user lands back
 * on the intended page after signing in.
 */
export default withAuth({
	pages: {
		signIn: "/signin",
	},
});

export const config = {
	matcher: ["/dashboard/:path*", "/invite/:path*"],
};
