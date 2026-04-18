import "server-only";
import { z } from "zod";

const envSchema = z.object({
	// Database
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

	// NextAuth
	NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
	NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

	// Google OAuth — optional
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),

	// GitHub OAuth — optional
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),

	// Storage
	STORAGE_PROVIDER: z.enum(["s3"]).default("s3"),
	STORAGE_ENDPOINT: z.string().min(1, "STORAGE_ENDPOINT is required"),
	STORAGE_REGION: z.string().default("us-east-1"),
	STORAGE_ACCESS_KEY: z.string().min(1, "STORAGE_ACCESS_KEY is required"),
	STORAGE_SECRET_KEY: z.string().min(1, "STORAGE_SECRET_KEY is required"),
	STORAGE_BUCKET: z.string().min(1, "STORAGE_BUCKET is required"),

	// Email
	EMAIL_PROVIDER: z.enum(["nodemailer"]).default("nodemailer"),
	SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
	SMTP_PORT: z.coerce.number().default(1025),
	SMTP_USER: z.string().optional(),
	SMTP_PASS: z.string().optional(),
	SMTP_FROM: z.string().default("QAnubis <noreply@qanubis.app>"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
	const formatted = result.error.issues
		.map((i) => `  • ${i.path.join(".")}: ${i.message}`)
		.join("\n");
	throw new Error(`Invalid environment variables:\n${formatted}`);
}

export const env = result.data;
