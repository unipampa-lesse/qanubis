-- Improve AuditEvent filtering performance for common UI combinations.
CREATE INDEX "AuditEvent_projectId_action_createdAt_idx"
ON "AuditEvent"("projectId", "action", "createdAt" DESC);

CREATE INDEX "AuditEvent_projectId_entityType_createdAt_idx"
ON "AuditEvent"("projectId", "entityType", "createdAt" DESC);

CREATE INDEX "AuditEvent_projectId_actorId_createdAt_idx"
ON "AuditEvent"("projectId", "actorId", "createdAt" DESC);
