import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { passport, prisma } from "./auth";
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

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.AUTH_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "lax",
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Register route
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
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

// Signin route
app.post("/api/auth/signin", (req: Request, res: Response, next) => {
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
      return res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    });
  })(req, res, next);
});

// Get current session
app.get("/api/auth/session", (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as any;
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }
  return res.json({ user: null });
});

// Signout route
app.post("/api/auth/signout", (req: Request, res: Response) => {
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
