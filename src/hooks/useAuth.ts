import { useState, useEffect } from "react";
import { User } from "@/types/messenger";

const KEY = "cipher_user";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const login = (u: User) => {
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return { user, loading, login, logout };
};
