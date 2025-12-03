-- CreateTable
CREATE TABLE "InsuranceCertificate" (
    "id" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "insuredParty" TEXT NOT NULL,
    "insuranceCompany" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceCertificate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InsuranceCertificate" ADD CONSTRAINT "InsuranceCertificate_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
