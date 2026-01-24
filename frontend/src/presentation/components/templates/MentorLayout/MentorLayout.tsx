// src/presentation/components/templates/MentorLayout/MentorLayout.tsx
import React, { useState } from "react";
import { Sidebar } from "../../organisms/Sidebar/Sidebar";
import { Header } from "../../organisms/Header/Header";
import { useAuth } from "../../../contexts/AuthContext";
import "./MentorLayout.css";

interface MentorLayoutProps {
  children: React.ReactNode;
}

export const MentorLayout: React.FC<MentorLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="mentor-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role="MENTOR"
      />

      <div className="mentor-layout__content">
        <Header onMenuClick={toggleSidebar} />

        <main className="mentor-layout__main">{children}</main>
      </div>
    </div>
  );
};
