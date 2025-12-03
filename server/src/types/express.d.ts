import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string | null;
      name: string | null;
      createdAt: Date;
    }
  }
}

export {};
