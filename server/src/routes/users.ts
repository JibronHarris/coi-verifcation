import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../auth";

const router = Router();

// Authentication middleware - checks if user is logged in via Passport
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

// Get current user
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(dbUser);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Users routes (protected)
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user as any;

    // Only allow users to update their own profile
    if (id !== currentUser.id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only update your own profile" });
    }

    const { name, image } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    console.error("Update user error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user as any;

    // Only allow users to delete their own account
    if (id !== currentUser.id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only delete your own account" });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Delete user error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
