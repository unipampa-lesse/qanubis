-- CreateIndex
CREATE INDEX "Code_projectId_idx" ON "Code"("projectId");

-- CreateIndex
CREATE INDEX "Code_parentId_idx" ON "Code"("parentId");

-- CreateIndex
CREATE INDEX "Document_projectId_idx" ON "Document"("projectId");

-- CreateIndex
CREATE INDEX "Memo_projectId_idx" ON "Memo"("projectId");

-- CreateIndex
CREATE INDEX "Memo_createdById_idx" ON "Memo"("createdById");

-- CreateIndex
CREATE INDEX "ProjectInvite_projectId_idx" ON "ProjectInvite"("projectId");
