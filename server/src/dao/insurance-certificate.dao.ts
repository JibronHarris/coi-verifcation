import prisma from "../config/database";
import {
  InsuranceCertificateResponseDto,
  CreateInsuranceCertificateDto,
  UpdateInsuranceCertificateDto,
} from "../types/insurance-certificate.types";

class InsuranceCertificateDao {
  /**
   * Get or create a default account for a user
   * This is needed because InsuranceCertificate requires an accountId
   */
  private async getOrCreateUserAccount(userId: string): Promise<string> {
    // Try to find an existing account for the user
    const existingAccount = await prisma.account.findFirst({
      where: { userId },
    });

    if (existingAccount) {
      return existingAccount.id;
    }

    // Create a default account for email/password users
    const newAccount = await prisma.account.create({
      data: {
        userId,
        type: "credentials",
        provider: "credentials",
        providerAccountId: userId, // Use userId as providerAccountId for credentials
      },
    });

    return newAccount.id;
  }

  async findById(id: string): Promise<InsuranceCertificateResponseDto | null> {
    return prisma.insuranceCertificate.findFirst({
      where: {
        id,
        deletedAt: null, // Only return non-deleted certificates
      },
      select: {
        id: true,
        certificateNumber: true,
        insuredParty: true,
        insuranceCompany: true,
        effectiveDate: true,
        expirationDate: true,
        status: true,
        accountId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByAccountId(
    accountId: string
  ): Promise<InsuranceCertificateResponseDto[]> {
    return prisma.insuranceCertificate.findMany({
      where: {
        accountId,
        deletedAt: null, // Only return non-deleted certificates
      },
      select: {
        id: true,
        certificateNumber: true,
        insuredParty: true,
        insuranceCompany: true,
        effectiveDate: true,
        expirationDate: true,
        status: true,
        accountId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    userId: string,
    data: CreateInsuranceCertificateDto
  ): Promise<InsuranceCertificateResponseDto> {
    // Get or create account for user
    const accountId = await this.getOrCreateUserAccount(userId);

    // Determine status based on dates
    const effectiveDate = new Date(data.effectiveDate);
    const expirationDate = new Date(data.expirationDate);
    const now = new Date();

    let status = "pending";
    if (now >= effectiveDate && now <= expirationDate) {
      status = "active";
    } else if (now > expirationDate) {
      status = "expired";
    }

    return prisma.insuranceCertificate.create({
      data: {
        certificateNumber: data.certificateNumber,
        insuredParty: data.insuredParty,
        insuranceCompany: data.insuranceCompany,
        effectiveDate,
        expirationDate,
        status,
        accountId,
      },
      select: {
        id: true,
        certificateNumber: true,
        insuredParty: true,
        insuranceCompany: true,
        effectiveDate: true,
        expirationDate: true,
        status: true,
        accountId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    id: string,
    data: UpdateInsuranceCertificateDto
  ): Promise<InsuranceCertificateResponseDto> {
    // Get existing certificate to recalculate status
    const existing = await prisma.insuranceCertificate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Insurance certificate not found");
    }

    if (existing.deletedAt) {
      throw new Error("Cannot update a deleted certificate");
    }

    const updateData: any = {};
    if (data.certificateNumber !== undefined) {
      updateData.certificateNumber = data.certificateNumber;
    }
    if (data.insuredParty !== undefined) {
      updateData.insuredParty = data.insuredParty;
    }
    if (data.insuranceCompany !== undefined) {
      updateData.insuranceCompany = data.insuranceCompany;
    }
    if (data.effectiveDate !== undefined) {
      updateData.effectiveDate = new Date(data.effectiveDate);
    }
    if (data.expirationDate !== undefined) {
      updateData.expirationDate = new Date(data.expirationDate);
    }

    // Recalculate status if dates changed
    if (data.effectiveDate !== undefined || data.expirationDate !== undefined) {
      const effectiveDate = updateData.effectiveDate || existing.effectiveDate;
      const expirationDate =
        updateData.expirationDate || existing.expirationDate;
      const now = new Date();

      if (now >= effectiveDate && now <= expirationDate) {
        updateData.status = "active";
      } else if (now > expirationDate) {
        updateData.status = "expired";
      } else {
        updateData.status = "pending";
      }
    }

    return prisma.insuranceCertificate.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        certificateNumber: true,
        insuredParty: true,
        insuranceCompany: true,
        effectiveDate: true,
        expirationDate: true,
        status: true,
        accountId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    // Soft delete: set deletedAt timestamp instead of actually deleting
    await prisma.insuranceCertificate.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findByAccountIdAndId(
    accountId: string,
    id: string
  ): Promise<InsuranceCertificateResponseDto | null> {
    return prisma.insuranceCertificate.findFirst({
      where: {
        id,
        accountId,
        deletedAt: null, // Only return non-deleted certificates
      },
      select: {
        id: true,
        certificateNumber: true,
        insuredParty: true,
        insuranceCompany: true,
        effectiveDate: true,
        expirationDate: true,
        status: true,
        accountId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export default new InsuranceCertificateDao();
