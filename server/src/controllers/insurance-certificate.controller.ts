import { Request, Response, NextFunction } from "express";
import insuranceCertificateService from "../services/insurance-certificate.service";
import { AuthUserDto } from "../types/auth.types";
import {
  CreateInsuranceCertificateDto,
  UpdateInsuranceCertificateDto,
} from "../types/insurance-certificate.types";

class InsuranceCertificateController {
  async getCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUserDto;
      const certificates =
        await insuranceCertificateService.getCertificatesByUserId(user.id);
      res.json(certificates);
    } catch (error) {
      console.error("Get certificates error:", error);
      res.status(500).json({ error: "Failed to fetch certificates" });
    }
  }

  async getCertificateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const certificate = await insuranceCertificateService.getCertificateById(
        id
      );

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      // Check if user owns this certificate
      const user = req.user as AuthUserDto;
      const canAccess =
        await insuranceCertificateService.canUserModifyCertificate(user.id, id);
      if (!canAccess) {
        return res.status(403).json({
          error: "Forbidden: You can only access your own certificates",
        });
      }

      res.json(certificate);
    } catch (error) {
      console.error("Get certificate error:", error);
      res.status(500).json({ error: "Failed to fetch certificate" });
    }
  }

  async createCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUserDto;
      const data: CreateInsuranceCertificateDto = req.body;

      // Validate required fields
      if (
        !data.certificateNumber ||
        !data.insuredParty ||
        !data.insuranceCompany ||
        !data.effectiveDate ||
        !data.expirationDate
      ) {
        return res.status(400).json({
          error:
            "Missing required fields: certificateNumber, insuredParty, insuranceCompany, effectiveDate, expirationDate",
        });
      }

      // Validate dates
      const effectiveDate = new Date(data.effectiveDate);
      const expirationDate = new Date(data.expirationDate);

      if (isNaN(effectiveDate.getTime()) || isNaN(expirationDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      if (expirationDate <= effectiveDate) {
        return res.status(400).json({
          error: "Expiration date must be after effective date",
        });
      }

      const certificate = await insuranceCertificateService.createCertificate(
        user.id,
        data
      );
      res.status(201).json(certificate);
    } catch (error: any) {
      console.error("Create certificate error:", error);
      res.status(500).json({ error: "Failed to create certificate" });
    }
  }

  async updateCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user as AuthUserDto;
      const data: UpdateInsuranceCertificateDto = req.body;

      // Validate dates if provided
      if (data.effectiveDate || data.expirationDate) {
        // Get existing certificate to validate dates
        const existing = await insuranceCertificateService.getCertificateById(
          id
        );
        if (!existing) {
          return res.status(404).json({ error: "Certificate not found" });
        }

        const effectiveDate = data.effectiveDate
          ? new Date(data.effectiveDate)
          : existing.effectiveDate;
        const expirationDate = data.expirationDate
          ? new Date(data.expirationDate)
          : existing.expirationDate;

        if (isNaN(effectiveDate.getTime()) || isNaN(expirationDate.getTime())) {
          return res.status(400).json({ error: "Invalid date format" });
        }

        if (expirationDate <= effectiveDate) {
          return res.status(400).json({
            error: "Expiration date must be after effective date",
          });
        }
      }

      const certificate = await insuranceCertificateService.updateCertificate(
        id,
        user.id,
        data
      );
      res.json(certificate);
    } catch (error: any) {
      console.error("Update certificate error:", error);
      if (error.message === "Insurance certificate not found") {
        return res.status(404).json({ error: "Certificate not found" });
      }
      if (error.message.includes("Forbidden")) {
        return res.status(403).json({ error: error.message });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Certificate not found" });
      }
      res.status(500).json({ error: "Failed to update certificate" });
    }
  }

  async deleteCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user as AuthUserDto;

      await insuranceCertificateService.deleteCertificate(id, user.id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Delete certificate error:", error);
      if (error.message === "Insurance certificate not found") {
        return res.status(404).json({ error: "Certificate not found" });
      }
      if (error.message.includes("Forbidden")) {
        return res.status(403).json({ error: error.message });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Certificate not found" });
      }
      res.status(500).json({ error: "Failed to delete certificate" });
    }
  }
}

export default new InsuranceCertificateController();
