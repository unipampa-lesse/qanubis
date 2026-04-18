import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import "server-only";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		// In serverless (Vercel) many function instances share the same DB.
		// Keep the per-instance pool small to avoid exhausting max_connections.
		max: process.env.NODE_ENV === "production" ? 2 : 10,
		idleTimeoutMillis: 30_000,
		connectionTimeoutMillis: 5_000,
	});
	const adapter = new PrismaPg(pool);
	return new PrismaClient({ adapter });
}

// Cache unconditionally — module cache handles deduplication in production,
// global cache prevents exhausting connection pool during hot-reload in dev.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
