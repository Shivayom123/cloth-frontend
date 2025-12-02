// src/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem("firstName");
    const token = localStorage.getItem("token");
    return token ? { firstName: name, token } : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("firstName", user.firstName || "");
      localStorage.setItem("token", user.token || "");
    } else {
      localStorage.removeItem("firstName");
      localStorage.removeItem("token");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
