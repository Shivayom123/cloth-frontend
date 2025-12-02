import { createContext, useContext, useState, useEffect } from "react";

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

export const useAuth = () => useContext(AuthContext);
