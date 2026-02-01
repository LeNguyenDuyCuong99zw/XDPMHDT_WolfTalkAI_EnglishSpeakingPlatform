import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/wolftalk/logo_wolf.png";
import homeIcon from "../assets/icon/house.png";
import coursesIcon from "../assets/icon/project-management.png";
import rankingIcon from "../assets/icon/ranking.png";
import questsIcon from "../assets/icon/treasure-chest.png";
import userIcon from "../assets/icon/user.png";
import { apiClient } from "../services/api";

interface UserProfile {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string;
  createdAt?: string;
}

export type MenuItem = {
  id: string;
  label: string;
  icon?: string;
  onClick?: () => void;
};

const defaultItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "HỌC",
    icon: "home-icon",
  },
  {
    id: "alphabet",
    label: "CHỮ CÁI",
    icon: "あ",
  },
  {
    id: "plans",
    label: "CÁC KHÓA HỌC",
    icon: "courses-icon",
  },
  {
    id: "leaderboard",
    label: "BẢNG XẾP HẠNG",
    icon: "ranking-icon",
  },
  {
    id: "quests",
    label: "NHIỆM VỤ",
    icon: "quests-icon",
  },
  {
    id: "shop",
    label: "CỬA HÀNG",
    icon: "🛒",
  },
  {
    id: "profile",
    label: "HỒ SƠ",
    icon: "profile-icon",
  },
  {
    id: "more",
    label: "XEM THÊM",
    icon: "⋯",
  },
];

const Sidebar: React.FC<{ items?: MenuItem[] }> = ({
  items = defaultItems,
}) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await apiClient.get<UserProfile>("/me");
        setUser(response);
      } catch (err) {
        console.error("Could not fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  // Map id to route path
  const idToPath: Record<string, string> = {
    dashboard: "/dashboard",
    practice: "/practice",
    alphabet: "/alphabet",
    vocabulary: "/vocabulary",
    listening: "/listening",
    plans: user?.id ? `/packages/${user.id}` : "/packages/1",
    leaderboard: "/leaderboard",
    quests: "/quests",
    shop: "/shop",
    profile: "/profile",
    more: "/more",
  };

  const navigate = useNavigate();

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const getDisplayName = () => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email?.split("@")[0] || "User";
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
    } catch (e) {
      // ignore
    }
    // reload to make App re-evaluate auth state
    window.location.href = "/";
  };

  return (
    <aside className={`sidebar duolingo ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="brand">
          <div className="logo">
            <img src={logo} alt="WolfTalk" />
          </div>
          <div className="title">
            <strong>Wolftalk</strong>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((it) => {
          if (it.id === "more") {
            return (
              <div key={it.id} className="sidebar-dropdown-container">
                <button
                  className={`sidebar-item sidebar-dropdown-trigger ${
                    showDropdown ? "active" : ""
                  }`}
                  onClick={() => setShowDropdown(!showDropdown)}
                  title={it.label}
                >
                  <span className="icon" aria-hidden>
                    {it.icon}
                  </span>
                  <span className="label">{it.label}</span>
                </button>
                {showDropdown && (
                  <div className="sidebar-dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/settings")}
                    >
                      <span className="dropdown-icon">⚙️</span>
                      <span>CÀI ĐẶT</span>
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/help")}
                    >
                      <span className="dropdown-icon">❓</span>
                      <span>TRỢ GIÚP</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <span className="dropdown-icon">🚪</span>
                      <span>ĐĂNG XUẤT</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={it.id}
              to={idToPath[it.id] || "/"}
              className={`sidebar-item${
                location.pathname === idToPath[it.id] ? " active" : ""
              }`}
              aria-current={
                location.pathname === idToPath[it.id] ? "page" : undefined
              }
              title={it.label}
              style={{ textDecoration: "none" }}
            >
              <span className={`icon icon-${it.id}`} aria-hidden>
                {it.icon === "home-icon" ? (
                  <img
                    src={homeIcon}
                    alt="Home"
                    className="sidebar-icon-img icon-home"
                  />
                ) : it.icon === "courses-icon" ? (
                  <img
                    src={coursesIcon}
                    alt="Courses"
                    className="sidebar-icon-img icon-courses"
                  />
                ) : it.icon === "ranking-icon" ? (
                  <img
                    src={rankingIcon}
                    alt="Ranking"
                    className="sidebar-icon-img icon-ranking"
                  />
                ) : it.icon === "quests-icon" ? (
                  <img
                    src={questsIcon}
                    alt="Quests"
                    className="sidebar-icon-img icon-quests"
                  />
                ) : it.icon === "profile-icon" ? (
                  <img
                    src={userIcon}
                    alt="Profile"
                    className="sidebar-icon-img icon-profile"
                  />
                ) : it.icon === "🛒" ? (
                  <span className="icon-shop">{it.icon}</span>
                ) : it.icon === "あ" ? (
                  <span className="icon-alphabet">{it.icon}</span>
                ) : it.icon === "⋯" ? (
                  <span className="icon-more">{it.icon}</span>
                ) : (
                  it.icon
                )}
              </span>
              <span className="label">{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
