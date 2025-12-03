import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Auth } from "@auth/core";
import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcryptjs";
import type { Session } from "@auth/core/types";

const prisma = new PrismaClient();

const authConfig: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

// Create Auth handler function
// Auth(request, config) returns a ResponseInternal which is compatible with Response
export async function handleAuth(req: any): Promise<any> {
  return await Auth(req, authConfig);
}

// Export auth config for reference
export { authConfig };

// Helper function to get session
export async function getSession(req: any): Promise<Session | null> {
  try {
    // Create a request-like object for Auth.js
    const authRequest = {
      headers: new Headers(),
      method: "GET",
      url: "/api/auth/session",
    };

    // Copy headers from Express request
    Object.keys(req.headers).forEach((key) => {
      const value = req.headers[key];
      if (value) {
        authRequest.headers.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    const response = await Auth(
      authRequest as any,
      {
        ...authConfig,
        action: "session",
      } as any
    );

    if (response && (response as any).ok) {
      const data = await (response as any).json();
      return data as Session;
    }
    return null;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}
