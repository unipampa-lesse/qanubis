-- Make storageKey nullable (bib-only documents have no PDF yet)
ALTER TABLE "Document" ALTER COLUMN "storageKey" DROP NOT NULL;

-- Add bibliographic metadata fields
ALTER TABLE "Document" ADD COLUMN "source"    TEXT         NOT NULL DEFAULT 'upload';
ALTER TABLE "Document" ADD COLUMN "citeKey"   TEXT;
ALTER TABLE "Document" ADD COLUMN "entryType" TEXT;
ALTER TABLE "Document" ADD COLUMN "authors"   TEXT[]       NOT NULL DEFAULT '{}';
ALTER TABLE "Document" ADD COLUMN "year"      INTEGER;
ALTER TABLE "Document" ADD COLUMN "doi"       TEXT;
ALTER TABLE "Document" ADD COLUMN "abstract"  TEXT;
ALTER TABLE "Document" ADD COLUMN "journal"   TEXT;
ALTER TABLE "Document" ADD COLUMN "volume"    TEXT;
ALTER TABLE "Document" ADD COLUMN "issue"     TEXT;
ALTER TABLE "Document" ADD COLUMN "pages"     TEXT;
ALTER TABLE "Document" ADD COLUMN "publisher" TEXT;
ALTER TABLE "Document" ADD COLUMN "bibUrl"    TEXT;
ALTER TABLE "Document" ADD COLUMN "enriched"  BOOLEAN      NOT NULL DEFAULT false;

-- Deduplicate by DOI within a project (NULLs are distinct in PostgreSQL)
CREATE UNIQUE INDEX "Document_projectId_doi_key" ON "Document"("projectId", "doi");
