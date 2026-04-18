-- CreateTable
CREATE TABLE "CodeComment" (
    "id" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeComment_codeId_idx" ON "CodeComment"("codeId");

-- CreateIndex
CREATE INDEX "CodeComment_userId_idx" ON "CodeComment"("userId");

-- AddForeignKey
ALTER TABLE "CodeComment" ADD CONSTRAINT "CodeComment_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeComment" ADD CONSTRAINT "CodeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
