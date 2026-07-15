import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

// Handles auth state for all three roles: user, seller, admin.
// Only one role is "active" at a time, matching the token stored in localStorage.
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("bookstore_token");
    const role = localStorage.getItem("bookstore_role");
    const profile = localStorage.getItem("bookstore_profile");
    if (token && role && profile) {
      return { token, role, profile: JSON.parse(profile) };
    }
    return { token: null, role: null, profile: null };
  });

  const login = useCallback((token, role, profile) => {
    localStorage.setItem("bookstore_token", token);
    localStorage.setItem("bookstore_role", role);
    localStorage.setItem("bookstore_profile", JSON.stringify(profile));
    setAuth({ token, role, profile });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("bookstore_token");
    localStorage.removeItem("bookstore_role");
    localStorage.removeItem("bookstore_profile");
    setAuth({ token: null, role: null, profile: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
