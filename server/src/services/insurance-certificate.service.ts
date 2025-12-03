import prisma from "../config/database";
import insuranceCertificateDao from "../dao/insurance-certificate.dao";
import {
  InsuranceCertificateResponseDto,
  CreateInsuranceCertificateDto,
  UpdateInsuranceCertificateDto,
} from "../types/insurance-certificate.types";

class InsuranceCertificateService {
  async getCertificateById(
    id: string
  ): Promise<InsuranceCertificateResponseDto | null> {
    return insuranceCertificateDao.findById(id);
  }

  async getCertificatesByUserId(
    userId: string
  ): Promise<InsuranceCertificateResponseDto[]> {
    // Get user's account(s)
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    if (accounts.length === 0) {
      return [];
    }

    // Get all certificates for all user accounts
    const allCertificates: InsuranceCertificateResponseDto[] = [];
    for (const account of accounts) {
      const certificates = await insuranceCertificateDao.findByAccountId(
        account.id
      );
      allCertificates.push(...certificates);
    }

    return allCertificates;
  }

  async createCertificate(
    userId: string,
    data: CreateInsuranceCertificateDto
  ): Promise<InsuranceCertificateResponseDto> {
    return insuranceCertificateDao.create(userId, data);
  }

  async updateCertificate(
    id: string,
    userId: string,
    data: UpdateInsuranceCertificateDto
  ): Promise<InsuranceCertificateResponseDto> {
    // Check if certificate exists and belongs to user
    const certificate = await insuranceCertificateDao.findById(id);
    if (!certificate) {
      throw new Error("Insurance certificate not found");
    }

    // Verify ownership
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = accounts.map((a) => a.id);
    if (!accountIds.includes(certificate.accountId)) {
      throw new Error("Forbidden: You can only update your own certificates");
    }

    return insuranceCertificateDao.update(id, data);
  }

  async deleteCertificate(id: string, userId: string): Promise<void> {
    // Check if certificate exists and belongs to user
    const certificate = await insuranceCertificateDao.findById(id);
    if (!certificate) {
      throw new Error("Insurance certificate not found");
    }

    // Verify ownership
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = accounts.map((a) => a.id);
    if (!accountIds.includes(certificate.accountId)) {
      throw new Error("Forbidden: You can only delete your own certificates");
    }

    await insuranceCertificateDao.delete(id);
  }

  async canUserModifyCertificate(
    userId: string,
    certificateId: string
  ): Promise<boolean> {
    const certificate = await insuranceCertificateDao.findById(certificateId);
    if (!certificate) {
      return false;
    }

    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = accounts.map((a) => a.id);
    return accountIds.includes(certificate.accountId);
  }
}

export default new InsuranceCertificateService();
