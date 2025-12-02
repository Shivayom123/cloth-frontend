// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("firstName");
    if (storedName) setFirstName(storedName);
  }, []);

  return (
    <AuthContext.Provider value={{ firstName, setFirstName }}>
      {children}
    </AuthContext.Provider>
  );
};

// convenience hook
export const useAuth = () => useContext(AuthContext);
