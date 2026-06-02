CREATE TABLE "ReportSavedQuery" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportSavedQuery_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReportSavedQuery_projectId_createdAt_idx"
ON "ReportSavedQuery"("projectId", "createdAt" DESC);

CREATE INDEX "ReportSavedQuery_createdById_createdAt_idx"
ON "ReportSavedQuery"("createdById", "createdAt" DESC);

ALTER TABLE "ReportSavedQuery"
ADD CONSTRAINT "ReportSavedQuery_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReportSavedQuery"
ADD CONSTRAINT "ReportSavedQuery_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
