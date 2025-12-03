import { Request, Response, NextFunction } from "express";
import passport from "../config/passport";
import authService from "../services/auth.service";
import {
  RegisterDto,
  AuthUserDto,
  RegisterResponseDto,
  AuthResponseDto,
} from "../types/auth.types";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name }: RegisterDto = req.body;

      // Validation
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await authService.register({ email, password, name });

      const response: RegisterResponseDto = {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message === "User already exists") {
        return res.status(400).json({ error: "User already exists" });
      }
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Authentication error" });
      }
      if (!user) {
        return res
          .status(401)
          .json({ error: info?.message || "Invalid email or password" });
      }

      // Log the user in (creates session)
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create session" });
        }

        // Return user data
        const response: AuthResponseDto = {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
        return res.json(response);
      });
    })(req, res, next);
  }

  async getSession(req: Request, res: Response) {
    if (req.user) {
      const user = req.user as AuthUserDto;
      const response: AuthResponseDto = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
      return res.json(response);
    }
    return res.json({ user: null });
  }

  async signOut(req: Request, res: Response) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to sign out" });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to destroy session" });
        }
        res.clearCookie("connect.sid");
        return res.json({ message: "Signed out successfully" });
      });
    });
  }
}

export default new AuthController();
