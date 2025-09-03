"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth-token";

interface UserPayload {
  id: string;
  email: string;
}

interface AuthContextType {
  signIn: (token: string) => void;
  signOut: () => void;
  token: string | null;
  user: UserPayload | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadAuthData() {
      const storedToken = Cookies.get(TOKEN_KEY);
      if (storedToken) {
        try {
          const decodedUser = jwtDecode<UserPayload>(storedToken);
          setToken(storedToken);
          setUser(decodedUser);
        } catch (error) {
          console.error("Failed to decode token:", error);
          Cookies.remove(TOKEN_KEY);
        }
      }
      setIsLoading(false);
    }

    loadAuthData();
  }, []);

  const signIn = (newToken: string) => {
    try {
      const decodedUser = jwtDecode<UserPayload>(newToken);
      setToken(newToken);
      setUser(decodedUser);
      Cookies.set(TOKEN_KEY, newToken, { expires: 7, secure: true });
    } catch (error) {
      console.error("Failed to decode new token on sign-in:", error);
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    Cookies.remove(TOKEN_KEY);
  };

  const value = {
    signIn,
    signOut,
    token,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
