import React, { useState } from "react";
import { Sidebar } from "../../organisms/Sidebar/Sidebar";
import { Header } from "../../organisms/Header/Header";
import { useAuth } from "../../../contexts/AuthContext";
import "./AdminLayout.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role={(user?.role?.toUpperCase() as "ADMIN" | "MENTOR") || "ADMIN"}
      />

      <div className="admin-layout__content">
        <Header onMenuClick={toggleSidebar} />

        <main className="admin-layout__main">{children}</main>
      </div>
    </div>
  );
};
