import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logo from '../assets/logo.png';
import dashboard from '../assets/dashboard.png';
import profileIcon from '../assets/profile.png';
import coursesIcon from '../assets/courses.png';
import progressIcon from '../assets/progress.png';
import certificatesIcon from '../assets/certificates.png';
import quizzesIcon from '../assets/quizzes.jpg';
import messagesIcon from '../assets/messages.jpg';

export type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

const defaultItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <img src={dashboard} alt="Dashboard" /> },
  { id: "my-courses", label: "Khóa Học Của Tôi", icon: <img src={coursesIcon} alt="Khóa Học" /> },
  { id: "progress", label: "Tiến Độ Học Tập", icon: <img src={progressIcon} alt="Tiến Độ" /> },
  { id: "certificates", label: "Chứng Chỉ", icon: <img src={certificatesIcon} alt="Chứng Chỉ" /> },
  { id: "quizzes", label: "Bài Quiz", icon: <img src={quizzesIcon} alt="Quiz" /> },
  { id: "messages", label: "Nhắn Tin", icon: <img src={messagesIcon} alt="Nhắn Tin" /> },
  { id: "profile", label: "Hồ Sơ Cá Nhân", icon: <img src={profileIcon} alt="Hồ Sơ" /> }
];

const Sidebar: React.FC<{ items?: MenuItem[] }> = ({ items = defaultItems }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Map id to route path
  const idToPath: Record<string, string> = {
    dashboard: "/dashboard",
    "my-courses": "/my-courses",
    progress: "/progress",
    certificates: "/certificates",
    quizzes: "/quizzes",
    messages: "/messages",
    profile: "/profile",
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}> 
      <div className="sidebar-top">
        <div className="brand">
          <div className="logo">
            <img src={logo} alt="WolfTalk" />
          </div>
          <div className="title">
            <strong>WolfTalk</strong>
          </div>
        </div>


      </div>

      <nav className="sidebar-nav">
        {items.map((it) => (
          <Link
            key={it.id}
            to={idToPath[it.id] || "/"}
            className={`sidebar-item${location.pathname === idToPath[it.id] ? " active" : ""}`}
            aria-current={location.pathname === idToPath[it.id] ? "page" : undefined}
            title={it.label}
            style={{ textDecoration: 'none' }}
          >
            <span className="icon" aria-hidden>
              {it.icon}
            </span>
            <span className="label">{it.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout moved to topbar - removed from sidebar */}
    </aside>
  );
};

export default Sidebar;
