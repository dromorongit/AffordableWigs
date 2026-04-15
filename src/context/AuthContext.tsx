"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses?: Array<{
    fullName: string;
    phone: string;
    deliveryAddress: string;
    cityOrTown: string;
    regionOrArea: string;
    isDefault: boolean;
  }>;
}

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customer on mount
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setCustomer(data.user);
        }
      } catch (error) {
        console.error("[AuthContext] Failed to fetch customer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message };
      }

      if (data.user) {
        setCustomer(data.user);
        return { success: true };
      }

      return { success: false, message: "Login failed" };
    } catch (error) {
      console.error("[AuthContext] Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message };
      }

      if (data.user) {
        setCustomer(data.user);
        return { success: true };
      }

      return { success: false, message: "Registration failed" };
    } catch (error) {
      console.error("[AuthContext] Register error:", error);
      return { success: false, message: "An error occurred during registration" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCustomer(null);
      router.push("/");
    } catch (error) {
      console.error("[AuthContext] Logout error:", error);
    }
  };

  const refreshCustomer = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      
      if (data.authenticated && data.user) {
        setCustomer(data.user);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error("[AuthContext] Failed to refresh customer:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        register,
        logout,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}