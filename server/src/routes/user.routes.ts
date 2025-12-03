import { Router } from "express";
import userController from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.get("/me", (req, res, next) =>
  userController.getCurrentUser(req, res, next)
);
router.get("/", (req, res, next) => userController.getAllUsers(req, res, next));
router.get("/:id", (req, res, next) =>
  userController.getUserById(req, res, next)
);
router.put("/:id", (req, res, next) =>
  userController.updateUser(req, res, next)
);
router.delete("/:id", (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export default router;
