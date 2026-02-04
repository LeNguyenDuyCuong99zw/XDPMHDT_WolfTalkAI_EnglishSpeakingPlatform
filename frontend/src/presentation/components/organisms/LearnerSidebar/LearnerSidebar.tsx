import React from "react";
import { NavLink } from "react-router-dom";
import "./LearnerSidebar.css";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface LearnerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const learnerMenuItems: MenuItem[] = [
  {
    path: "/learner/dashboard",
    label: "Tổng quan",
    icon: <LayoutDashboard size={20} strokeWidth={2} />,
  },
  {
    path: "/learner/assessments",
    label: "Bài kiểm tra",
    icon: <BookOpen size={20} strokeWidth={2} />,
  },
  {
    path: "/learner/schedule",
    label: "Lịch học",
    icon: <Users size={20} strokeWidth={2} />,
  },
  {
    path: "/learner/achievements",
    label: "Thành tích",
    icon: <Receipt size={20} strokeWidth={2} />,
  },
  {
    path: "/learner/settings",
    label: "Cài đặt",
    icon: <ShieldCheck size={20} strokeWidth={2} />,
  },
];

export const LearnerSidebar: React.FC<LearnerSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="learner-sidebar-overlay" onClick={onClose}></div>}

      {/* Sidebar */}
      <aside className={`learner-sidebar ${isOpen ? "learner-sidebar--open" : ""}`}>
        {/* Logo */}
        <div className="learner-sidebar__logo">
          <span className="learner-sidebar__logo-icon">
            <Sparkles size={28} strokeWidth={2.5} />
          </span>
          <span className="learner-sidebar__logo-text">AESP Portal</span>
        </div>

        {/* Navigation */}
        <nav className="learner-sidebar__nav">
          {learnerMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `learner-sidebar__item ${isActive ? "learner-sidebar__item--active" : ""}`
              }
              onClick={onClose}
            >
              <span className="learner-sidebar__item-icon">{item.icon}</span>
              <span className="learner-sidebar__item-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="learner-sidebar__footer">
          <div className="learner-sidebar__role-badge">
            <Users size={16} strokeWidth={2.5} /> Học viên
          </div>
        </div>
      </aside>
    </>
  );
};
