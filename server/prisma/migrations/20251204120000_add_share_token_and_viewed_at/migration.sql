-- AlterTable
ALTER TABLE "InsuranceCertificate" ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "viewedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceCertificate_shareToken_key" ON "InsuranceCertificate"("shareToken");

