import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { UserResponseDto } from "../types/user.types";
import { AuthUserDto } from "../types/auth.types";

class UserController {
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUserDto;
      const dbUser = await userService.getUserById(user.id);

      if (!dbUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(dbUser);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const currentUser = req.user as AuthUserDto;
      const { name, image } = req.body;

      // Authorization check
      const canModify = await userService.canUserModify(currentUser.id, id);
      if (!canModify) {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only update your own profile" });
      }

      const user = await userService.updateUser(id, { name, image });
      res.json(user);
    } catch (error: any) {
      console.error("Update user error:", error);
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const currentUser = req.user as AuthUserDto;

      // Authorization check
      const canModify = await userService.canUserModify(currentUser.id, id);
      if (!canModify) {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only delete your own account" });
      }

      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Delete user error:", error);
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
}

export default new UserController();
