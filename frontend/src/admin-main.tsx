import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./presentation/contexts/AuthContext";
import { AdminApp } from "./AdminApp";
import "./index.css";

const adminRoot = document.getElementById("admin-root");
if (!adminRoot) {
  throw new Error("admin-root not found");
}

ReactDOM.createRoot(adminRoot).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
