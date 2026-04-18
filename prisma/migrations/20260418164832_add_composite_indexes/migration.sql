-- DropIndex
DROP INDEX "Quote_documentId_idx";

-- CreateIndex
CREATE INDEX "Quote_documentId_page_createdAt_idx" ON "Quote"("documentId", "page", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteCode_codeId_idx" ON "QuoteCode"("codeId");
