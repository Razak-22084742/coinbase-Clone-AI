// context/AuthContext.jsx — Global authentication state
//
// Provides login/logout functions and the current user to every component
// without having to pass props manually through every level.

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user: null when logged out, or { _id, name, email, token } when logged in
  const [user, setUser] = useState(null);

  // loading: true while we check localStorage on first page load (prevents flash-redirect)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  /**
   * login — called after a successful /api/login or /api/register response.
   * Stores token (for Bearer fallback) and user data in localStorage.
   */
  const login = (userData) => {
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * logout — clears localStorage AND calls the backend to expire the HTTP-only cookie.
   * Both must happen: localStorage holds user data, the cookie holds the JWT.
   */
  const logout = async () => {
    try {
      await api.get("/logout"); // clears the HTTP-only cookie server-side
    } catch {
      // Ignore network errors — clear local state regardless
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
