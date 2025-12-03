import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService } from "../services/api";
import type { User } from "../types/user.types";
import type { AuthResult } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<AuthResult>;
  checkSession: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async (): Promise<void> => {
    try {
      const session = await apiService.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      await apiService.signIn(email, password);
      await checkSession();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign in failed",
      };
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    try {
      await apiService.signOut();
      setUser(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign out failed",
      };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> => {
    try {
      await apiService.register(email, password, name);
      // Auto sign in after registration
      const signInResult = await signIn(email, password);
      return signInResult;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    register,
    checkSession,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
