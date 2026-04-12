import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import "server-only";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL });
	const adapter = new PrismaPg(pool);
	return new PrismaClient({ adapter });
}

// Cache unconditionally — module cache handles deduplication in production,
// global cache prevents exhausting connection pool during hot-reload in dev.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
