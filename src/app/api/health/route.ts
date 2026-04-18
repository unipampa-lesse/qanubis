import { prisma } from "@/lib/prisma";
import { getEmailProvider } from "@/providers/email";
import { getStorageProvider } from "@/providers/storage";

type ProbeStatus = "ok" | "degraded";

async function probeDb(): Promise<ProbeStatus> {
	try {
		await prisma.$queryRaw`SELECT 1`;
		// Clean up expired verification tokens on every health check tick.
		await prisma.verificationToken.deleteMany({ where: { expires: { lt: new Date() } } });
		return "ok";
	} catch {
		return "degraded";
	}
}

async function probeStorage(): Promise<ProbeStatus> {
	try {
		await getStorageProvider().ping();
		return "ok";
	} catch {
		return "degraded";
	}
}

async function probeEmail(): Promise<ProbeStatus> {
	try {
		await getEmailProvider().ping();
		return "ok";
	} catch {
		return "degraded";
	}
}

/**
 * GET /api/health
 *
 * Returns 200 when all dependencies are reachable, 503 if any are down.
 * Also cleans up expired VerificationToken rows on each tick.
 */
export async function GET() {
	const [db, storage, email] = await Promise.all([
		probeDb(),
		probeStorage(),
		probeEmail(),
	]);

	const allOk = db === "ok" && storage === "ok" && email === "ok";

	return Response.json(
		{ status: allOk ? "ok" : "degraded", db, storage, email },
		{ status: allOk ? 200 : 503 },
	);
}
