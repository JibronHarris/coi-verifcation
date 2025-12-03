import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { handleAuth } from "./auth";
import bcrypt from "bcryptjs";
import userRoutes from "./routes/users";

// Load environment variables based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";
require("dotenv").config({ path: envFile });
console.log(
  `Environment: ${
    process.env.NODE_ENV || "development"
  }, Loading config from: ${envFile}`
);

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Auth.js handler middleware - handles all /api/auth/* routes
app.all("/api/auth/*", async (req: Request, res: Response) => {
  try {
    // Create a request-like object for Auth.js
    const authRequest = {
      headers: new Headers(),
      method: req.method,
      url: req.url,
      body: req.body,
      query: req.query,
    };

    // Copy headers from Express request
    Object.keys(req.headers).forEach((key) => {
      const value = req.headers[key];
      if (value) {
        authRequest.headers.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    const response = await handleAuth(authRequest as any);

    // Set headers from response
    if (response && response.headers) {
      response.headers.forEach((value: string, key: string) => {
        res.setHeader(key, value);
      });
    }

    // Set status and send response
    const status = response?.status || 200;
    res.status(status);

    if (response) {
      const text = await response.text();
      if (text) {
        res.send(text);
      } else {
        res.end();
      }
    } else {
      res.end();
    }
  } catch (error) {
    console.error("Auth handler error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
});

// Register route (creates user with hashed password)
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

// User routes
app.use("/api/user", userRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
