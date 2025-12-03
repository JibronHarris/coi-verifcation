import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", (req, res, next) =>
  authController.register(req, res, next)
);
router.post("/signin", (req, res, next) =>
  authController.signIn(req, res, next)
);
router.get("/session", (req, res) => authController.getSession(req, res));
router.post("/signout", (req, res) => authController.signOut(req, res));

export default router;
