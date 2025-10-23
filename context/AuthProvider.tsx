"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type UserContext = {
  customerId?: string;
  shopperId?: string;
  email?: string;
  schoolId?: string;
  isAuthenticated: boolean;
};

const AuthContext = createContext<UserContext>({ isAuthenticated: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserContext>({ isAuthenticated: false });

  useEffect(() => {
    function getCookieValue(name: string): string | null {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    }

    // Get user info from cookies
    const customerId = getCookieValue('customer_id');
    const shopperId = getCookieValue('shopper_id');
    const email = getCookieValue('user_email');
    const schoolId = getCookieValue('school_id');

    setUser({
      customerId: customerId || undefined,
      shopperId: shopperId || undefined,
      email: email || undefined,
      schoolId: schoolId || undefined,
      isAuthenticated: !!(customerId && shopperId),
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
