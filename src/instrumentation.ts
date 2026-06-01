import { PrismaInstrumentation } from "@prisma/instrumentation";
import { registerOTel } from "@vercel/otel";

// Runs once in the Node.js runtime before the server starts.
// Edge Runtime is not used, so the guard here is a safety net only.
export function register() {
	if (process.env.NEXT_RUNTIME !== "nodejs") return;

	registerOTel({
		serviceName: process.env.OTEL_SERVICE_NAME ?? "qanubis",
		// Adds Prisma query spans (SQL statement included only when opted in).
		instrumentations: [new PrismaInstrumentation()],
	});
}
