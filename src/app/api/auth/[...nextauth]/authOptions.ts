import type { AuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
};
