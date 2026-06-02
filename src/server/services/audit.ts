import type { Prisma } from "@prisma/client";
import type { AuditAction, AuditEntityType } from "@/lib/audit/catalog";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const log = logger.child({ module: "audit-service" });

export type AuditEventInput = {
	projectId: string;
	actorId?: string | null;
	action: AuditAction;
	entityType: AuditEntityType;
	entityId?: string | null;
	summary?: string;
	details?: Prisma.InputJsonValue;
};

export async function recordAuditEvent(input: AuditEventInput): Promise<void> {
	await prisma.auditEvent.create({
		data: {
			projectId: input.projectId,
			actorId: input.actorId ?? null,
			action: input.action,
			entityType: input.entityType,
			entityId: input.entityId ?? null,
			summary: input.summary,
			details: input.details,
		},
	});
}

export async function recordAuditEventSafe(
	input: AuditEventInput,
): Promise<void> {
	try {
		await recordAuditEvent(input);
	} catch (err) {
		log.warn({ err, input }, "Failed to persist audit event");
	}
}
