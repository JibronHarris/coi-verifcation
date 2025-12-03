import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
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

  const signIn = async (email, password) => {
    try {
      await apiService.signIn(email, password);
      await checkSession();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Sign in failed" };
    }
  };

  const signOut = async () => {
    try {
      await apiService.signOut();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Sign out failed" };
    }
  };

  const register = async (email, password, name) => {
    try {
      await apiService.register(email, password, name);
      // Auto sign in after registration
      const signInResult = await signIn(email, password);
      return signInResult;
    } catch (error) {
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const value = {
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
