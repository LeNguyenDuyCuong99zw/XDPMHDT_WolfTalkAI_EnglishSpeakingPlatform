// src/presentation/components/templates/LearnerLayout/LearnerLayout.tsx
import React, { useState } from "react";
import { LearnerSidebar } from "../../organisms/LearnerSidebar/LearnerSidebar";
import { Header } from "../../organisms/Header/Header";
import { useAuth } from "../../../contexts/AuthContext";
import "./LearnerLayout.css";

interface LearnerLayoutProps {
  children: React.ReactNode;
}

export const LearnerLayout: React.FC<LearnerLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth(); // Assuming 'user' might be needed later for specific layout logic

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="learner-layout">
      <LearnerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="learner-layout__content">
        <Header onMenuClick={toggleSidebar} />

        <main className="learner-layout__main">{children}</main>
      </div>
    </div>
  );
};
