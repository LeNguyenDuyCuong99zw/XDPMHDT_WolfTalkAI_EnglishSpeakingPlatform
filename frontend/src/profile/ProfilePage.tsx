import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { apiClient } from "../services/api";
import { friendshipAPI } from "../services/friendshipAPI";
import type { UserFriendDTO, FriendshipDTO } from "../services/friendshipAPI";
import FindFriendsModal from "./components/FindFriendsModal";
import FriendsTab from "./components/FriendsTab";
import FriendRequestsTab from "./components/FriendRequestsTab";

interface UserProfile {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string;
  createdAt?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);

  // Friends and requests states
  const [friends, setFriends] = useState<UserFriendDTO[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendshipDTO[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendshipDTO[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<UserProfile>("/me");
        setUser(response);
      } catch (err) {
        console.error("Could not fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Load friends and requests
  const loadFriendsAndRequests = useCallback(async () => {
    setIsLoadingFriends(true);
    try {
      const [friendsList, pending, sent] = await Promise.all([
        friendshipAPI.getFriendsList(),
        friendshipAPI.getPendingFriendRequests(),
        friendshipAPI.getSentFriendRequests(),
      ]);
      setFriends(friendsList);
      setPendingRequests(pending);
      setSentRequests(sent);
    } catch (error) {
      console.error("Error loading friends data:", error);
    } finally {
      setIsLoadingFriends(false);
    }
  }, []);

  // Load friends on component mount
  useEffect(() => {
    loadFriendsAndRequests();
  }, [loadFriendsAndRequests]);

  const getUsername = () => {
    return user.email?.split("@")[0] || "user";
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const months = [
      "Tháng Một",
      "Tháng Hai",
      "Tháng Ba",
      "Tháng Tư",
      "Tháng Năm",
      "Tháng Sáu",
      "Tháng Bảy",
      "Tháng Tám",
      "Tháng Chín",
      "Tháng Mười",
      "Tháng Mười Một",
      "Tháng Mười Hai",
    ];
    return `Đã tham gia ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="duolingo-dashboard">
        <div className="learning-path-container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="duolingo-dashboard">
      {/* Main Content Area */}
      <div className="learning-path-container">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            <div className="avatar-placeholder-new">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path
                  d="M40 40L40 20M40 40L20 40M40 40L60 40"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <button className="avatar-edit-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          </div>

          <div className="profile-header-info">
            <h1 className="profile-display-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-username">{getUsername()}</p>
            <p className="profile-join-date">
              {formatJoinDate(user.createdAt)}
            </p>

            <div className="profile-follow-stats">
              <button className="follow-stat-btn">
                <span className="follow-link">Bạn bè</span>{" "}
                <strong>{friends.length}</strong>
              </button>
              <button className="follow-stat-btn">
                <strong>{pendingRequests.length}</strong>{" "}
                <span className="follow-link">Lời mời kết bạn</span>
              </button>
            </div>

            <div className="profile-country-flag">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect width='60' height='30' fill='%23b22234'/%3E%3Cpath d='M0,3.46h60M0,6.92h60M0,10.38h60M0,13.84h60M0,17.3h60M0,20.76h60M0,24.22h60M0,27.68h60' stroke='%23fff' stroke-width='3.46'/%3E%3Crect width='24' height='17.3' fill='%233c3b6e'/%3E%3C/svg%3E"
                alt="US Flag"
                width="40"
              />
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="profile-statistics">
          <div className="section-header-with-action">
            <h2 className="section-title">Thống kê</h2>
            <button
              className="btn-settings"
              onClick={() => navigate("/profile/settings")}
            >
              ⚙️ Cài Đặt Hồ Sơ
            </button>
          </div>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon flame">🔥</div>
              <div className="stat-info">
                <div className="stat-value">0</div>
                <div className="stat-label">Ngày streak</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon gem">⚡</div>
              <div className="stat-info">
                <div className="stat-value">0</div>
                <div className="stat-label">Tổng điểm KN</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon shield">🛡️</div>
              <div className="stat-info">
                <div className="stat-value">Chưa có xếp hạng</div>
                <div className="stat-label">Giải đấu hiện tại</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon trophy">🏆</div>
              <div className="stat-info">
                <div className="stat-value">0</div>
                <div className="stat-label">Số lần đạt top 3</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="profile-achievements">
          <div className="achievements-header">
            <h2 className="section-title">Thành tích</h2>
            <a href="#" className="view-all-link">
              XEM TẤT CẢ
            </a>
          </div>
          <div className="achievements-placeholder">
            <p>Chưa có thành tích nào</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        {/* Stats Header */}
        <div className="stats-header">
          <div className="stat-item">
            <div className="stat-icon flag">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect width='60' height='30' fill='%23b22234'/%3E%3Cpath d='M0,3.46h60M0,6.92h60M0,10.38h60M0,13.84h60M0,17.3h60M0,20.76h60M0,24.22h60M0,27.68h60' stroke='%23fff' stroke-width='3.46'/%3E%3Crect width='24' height='17.3' fill='%233c3b6e'/%3E%3C/svg%3E"
                alt="US Flag"
                width="32"
              />
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon flame">🔥</div>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon gem">💎</div>
            <span className="stat-value">500</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon heart">❤️</div>
            <span className="stat-value">5</span>
          </div>
        </div>

        {/* Follow Tabs */}
        <div className="profile-tabs-sidebar">
          <button
            className={`profile-tab-sidebar ${
              activeTab === "friends" ? "active" : ""
            }`}
            onClick={() => setActiveTab("friends")}
          >
            BẠN BÈ
          </button>
          <button
            className={`profile-tab-sidebar ${
              activeTab === "requests" ? "active" : ""
            }`}
            onClick={() => setActiveTab("requests")}
          >
            LỜI MỜI
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-tab-content-sidebar">
          {activeTab === "friends" ? (
            <FriendsTab
              friends={friends}
              isLoading={isLoadingFriends}
              onRefresh={loadFriendsAndRequests}
            />
          ) : (
            <FriendRequestsTab
              pendingRequests={pendingRequests}
              sentRequests={sentRequests}
              isLoading={isLoadingFriends}
              onRefresh={loadFriendsAndRequests}
            />
          )}
        </div>

        {/* Add Friends Card */}
        <div className="side-card">
          <h3>Thêm bạn bè</h3>
          <div
            className="friend-option"
            onClick={() => setIsFriendsModalOpen(true)}
          >
            <div className="friend-icon search">🔍</div>
            <div className="friend-info">
              <div className="friend-title">Tìm bạn bè</div>
            </div>
            <button className="friend-action-btn">›</button>
          </div>
          <div className="friend-option">
            <div className="friend-icon duolingo-green">🦉</div>
            <div className="friend-info">
              <div className="friend-title">Mời bạn bè</div>
            </div>
            <button className="friend-action-btn">›</button>
          </div>
        </div>

        {/* Find Friends Modal */}
        <FindFriendsModal
          isOpen={isFriendsModalOpen}
          onClose={() => setIsFriendsModalOpen(false)}
        />

        {/* Footer Links */}
        <div className="footer-links">
          <a href="#">GIỚI THIỆU</a>
          <a href="#">CỬA HÀNG</a>
          <a href="#">TÍNH HIỆU QUẢ</a>
          <a href="#">CÔNG VIỆC</a>
          <a href="#">NHÀ ĐẦU TƯ</a>
          <a href="#">ĐIỀU KHOẢN</a>
          <a href="#">BẢO MẬT</a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
