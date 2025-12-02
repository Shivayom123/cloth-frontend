import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";       // <-- FIXES App is not defined
import { AuthProvider } from "./AuthContext"; // <-- Make sure file exists

const root = ReactDOM.createRoot(document.getElementById("root")); // <-- Fixes root not defined

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
