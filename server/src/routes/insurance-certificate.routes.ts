import { Router } from "express";
import insuranceCertificateController from "../controllers/insurance-certificate.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.get("/", (req, res, next) =>
  insuranceCertificateController.getCertificates(req, res, next)
);
router.get("/:id", (req, res, next) =>
  insuranceCertificateController.getCertificateById(req, res, next)
);
router.post("/", (req, res, next) =>
  insuranceCertificateController.createCertificate(req, res, next)
);
router.put("/:id", (req, res, next) =>
  insuranceCertificateController.updateCertificate(req, res, next)
);
router.delete("/:id", (req, res, next) =>
  insuranceCertificateController.deleteCertificate(req, res, next)
);

export default router;
