import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { AuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const DEFAULT_MAX_AGE = 24 * 60 * 60; // 1 day

export const authOptions: AuthOptions = {
	// PrismaAdapter persists OAuth accounts and verification tokens.
	// JWT strategy is kept (sessions are not stored in DB), but Account
	// and VerificationToken tables are populated via the adapter.
	adapter: PrismaAdapter(prisma),
	providers: [
		// OAuth providers are only registered when credentials are configured.
		...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
			? [
					GoogleProvider({
						clientId: process.env.GOOGLE_CLIENT_ID,
						clientSecret: process.env.GOOGLE_CLIENT_SECRET,
					}),
				]
			: []),
		...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
			? [
					GithubProvider({
						clientId: env.GITHUB_CLIENT_ID,
						clientSecret: env.GITHUB_CLIENT_SECRET,
					}),
				]
			: []),
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				rememberMe: { label: "Remember me", type: "text" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
					select: {
						id: true,
						name: true,
						email: true,
						password: true,
						emailVerified: true,
						suspended: true,
					},
				});

				if (!user?.password) return null;
				if (user.suspended) return null;
				if (!user.emailVerified) return null;

				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password,
				);
				if (!passwordMatch) return null;

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					rememberMe: credentials.rememberMe === "true",
				} as {
					id: string;
					name: string | null;
					email: string;
					rememberMe: boolean;
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
		// Cookie maxAge is set to the longest possible duration.
		// The JWT token's own `exp` field controls the effective session length
		// (shorter for non-remember-me logins set in the jwt callback below).
		maxAge: REMEMBER_ME_MAX_AGE,
	},
	pages: {
		signIn: "/signin",
	},
	callbacks: {
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user) {
				session.user.id = token.sub;
			}
			return session;
		},
		async jwt({ token, user }) {
			// On first sign-in, persist the DB user id and set expiry.
			if (user) {
				token.sub = user.id;
				const rememberMe =
					(user as { rememberMe?: boolean }).rememberMe ?? false;
				token.exp =
					Math.floor(Date.now() / 1000) +
					(rememberMe ? REMEMBER_ME_MAX_AGE : DEFAULT_MAX_AGE);
				token.checkedAt = Math.floor(Date.now() / 1000);
				return token;
			}

			// Re-verify user status every 5 minutes to catch suspensions mid-session.
			const now = Math.floor(Date.now() / 1000);
			const checkedAt = (token.checkedAt as number | undefined) ?? 0;
			if (now - checkedAt > 5 * 60) {
				const dbUser = await prisma.user.findUnique({
					where: { id: token.sub },
					select: { suspended: true, emailVerified: true },
				});
				if (!dbUser || dbUser.suspended || !dbUser.emailVerified) {
					return { ...token, exp: 0 };
				}
				token.checkedAt = now;
			}

			return token;
		},
	},
};
