"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type UserContext = {
  customerId?: string;
  shopperId?: string;
  email?: string;
  isAuthenticated: boolean;
};

const AuthContext = createContext<UserContext>({ isAuthenticated: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserContext>({ isAuthenticated: false });

  useEffect(() => {
    async function fetchDecoded() {
      try {
        const res = await fetch("/api/user-info");
        const data = await res.json();
        setUser({
          customerId: data.customerId,
          shopperId: data.shopperId,
          email: data.email,
          isAuthenticated: !!data.customerId,
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUser({ isAuthenticated: false });
      }
    }
    fetchDecoded();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
