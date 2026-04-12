import { defineConfig } from "prisma/config";

// Load .env from project root so DATABASE_URL is available for Prisma CLI commands.
// This is needed because Prisma 7 does not auto-load .env when a custom --config is used.
try {
	process.loadEnvFile(".env");
} catch {
	// .env not present — rely on system environment variables (e.g. CI/production)
}

export default defineConfig({
	datasource: {
		url: process.env.DATABASE_URL,
	},
});
