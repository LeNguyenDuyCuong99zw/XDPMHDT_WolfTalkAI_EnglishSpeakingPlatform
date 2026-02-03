import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Receipt,
  ShieldCheck,
  MessageCircle,
  UserCircle,
  ClipboardList,
  MessageSquare,
  BookOpen,
  Sparkles,
  Video,
} from "lucide-react";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: "ADMIN" | "MENTOR" | "USER";
}

const adminMenuItems: MenuItem[] = [
  {
    path: "/admin/dashboard",
    label: "Tổng quan",
    icon: <LayoutDashboard size={20} strokeWidth={2} />,
  },
  {
    path: "/admin/users",
    label: "Người dùng",
    icon: <Users size={20} strokeWidth={2} />,
  },
  {
    path: "/admin/mentors",
    label: "Giảng viên",
    icon: <GraduationCap size={20} strokeWidth={2} />,
  },
  {
    path: "/admin/plans",
    label: "Gói đăng ký",
    icon: <CreditCard size={20} strokeWidth={2} />,
  },
  {
    path: "/admin/transactions",
    label: "Giao dịch",
    icon: <Receipt size={20} strokeWidth={2} />,
  },
  {
    path: "/admin/moderation",
    label: "Kiểm duyệt",
    icon: <ShieldCheck size={20} strokeWidth={2} />,
  },
  {
    path: "/admin/support",
    label: "Hỗ trợ",
    icon: <MessageCircle size={20} strokeWidth={2} />,
  },

  {
    path: "/admin/policys",
    label: "Chính sách",
    icon: <ShieldCheck size={20} strokeWidth={2} />,
  },
];
// Mentor
const mentorMenuItems: MenuItem[] = [
  {
    path: "/mentor/dashboard",
    label: "Tổng quan",
    icon: <LayoutDashboard size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/learners",
    label: "Học viên",
    icon: <UserCircle size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/assessment",
    label: "Đánh giá",
    icon: <ClipboardList size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/feedback",
    label: "Phản hồi",
    icon: <MessageSquare size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/materials",
    label: "Tài liệu",
    icon: <BookOpen size={20} strokeWidth={2} />,
  },

  {
    path: "/mentor/sharedexperience",
    label: "Kinh nghiệm chia sẻ",
    icon: <Sparkles size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/conversationpractice",
    label: "Luyện hội thoại",
    icon: <MessageCircle size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/livesession",
    label: "Buổi học trực tiếp",
    icon: <Video size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/progresstracking",
    label: "Theo dõi tiến độ",
    icon: <CreditCard size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/pronunciationanalysis",
    label: "Phân tích phát âm",
    icon: <Receipt size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/vocabularymanagement",
    label: "Quản lý từ vựng",
    icon: <ShieldCheck size={20} strokeWidth={2} />,
  },
  {
    path: "/mentor/vocabularymanagement",
    label: "Quản lý từ vựng",
    icon: <ShieldCheck size={20} strokeWidth={2} />,
  },
];

// Learner
const learnerMenuItems: MenuItem[] = [
  {
    path: "/learner/dashboard",
    label: "Tổng quan",
    icon: <LayoutDashboard size={20} strokeWidth={2} />,
  },
  {
    path: "/learner/courses",
    label: "Khóa học của tôi",
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
    icon: <Receipt size={20} strokeWidth={2} />, // Using Receipt as temporary icon for achievements
  },
  {
    path: "/learner/settings",
    label: "Cài đặt",
    icon: <ShieldCheck size={20} strokeWidth={2} />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, role }) => {
  let menuItems = adminMenuItems;
  if (role === "MENTOR") {
    menuItems = mentorMenuItems;
  } else if (role === "USER") {
    menuItems = learnerMenuItems;
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Logo */}
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">
            <Sparkles size={28} strokeWidth={2.5} />
          </span>
          <span className="sidebar__logo-text">AESP Portal</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
              }
              onClick={onClose}
            >
              <span className="sidebar__item-icon">{item.icon}</span>
              <span className="sidebar__item-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <div className="sidebar__role-badge">
            {role === "ADMIN" ? (
              <>
                <ShieldCheck size={16} strokeWidth={2.5} /> Quản trị viên
              </>
            ) : role === "MENTOR" ? (
              <>
                <GraduationCap size={16} strokeWidth={2.5} /> Giảng viên
              </>
            ) : (
              <>
                <Users size={16} strokeWidth={2.5} /> Học viên
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
