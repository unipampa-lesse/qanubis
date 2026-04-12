import { prisma } from "@/lib/prisma";

/**
 * Health check endpoint for load balancers, Docker health checks, and monitoring.
 *
 * GET /api/health
 * Returns 200 when the app and database are reachable.
 * Returns 503 when a dependency is down.
 */
export async function GET() {
	try {
		await prisma.$queryRaw`SELECT 1`;
		return Response.json({ status: "ok", db: "ok" });
	} catch (error) {
		return Response.json(
			{
				status: "error",
				db: "unreachable",
				message: error instanceof Error ? error.message : "unknown error",
			},
			{ status: 503 },
		);
	}
}
