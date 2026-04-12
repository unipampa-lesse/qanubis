-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "mimeType" TEXT NOT NULL DEFAULT 'application/pdf';

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#fbbf24';
