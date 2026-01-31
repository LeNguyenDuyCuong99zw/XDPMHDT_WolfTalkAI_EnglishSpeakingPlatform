// File: profile/FindFriendsSection.tsx
import React, { useState, useEffect, useCallback } from "react";
import FriendSearch from "./components/FriendSearch";
import FriendsTab from "./components/FriendsTab";
import FriendRequestsTab from "./components/FriendRequestsTab";
import type { UserFriendDTO, FriendshipDTO } from "../services/friendshipAPI";
import { friendshipAPI } from "../services/friendshipAPI";
import "./FindFriendsSection.css";

const FindFriendsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"find" | "friends" | "requests">(
    "find",
  );

  // Search related states
  const [searchResults, setSearchResults] = useState<UserFriendDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState<UserFriendDTO[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(false);

  // Friends related states
  const [friends, setFriends] = useState<UserFriendDTO[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  // Requests related states
  const [pendingRequests, setPendingRequests] = useState<FriendshipDTO[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendshipDTO[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Load all users
  const loadAllUsers = useCallback(async () => {
    setIsSearching(true);
    try {
      console.log("[FindFriendsSection] Loading all users...");
      const users = await friendshipAPI.getAllUsers(0, 50);
      console.log("[FindFriendsSection] Users loaded:", users.length, users);
      setAllUsers(users);
      setShowAllUsers(true);
    } catch (error) {
      console.error("[FindFriendsSection] Error loading users:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Search function with debounce
  const handleSearch = useCallback(
    async (searchTerm: string, type: "all" | "lastName" | "email" = "all") => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        let results: UserFriendDTO[] = [];

        if (type === "lastName") {
          results = await friendshipAPI.searchByLastName(searchTerm);
        } else if (type === "email") {
          results = await friendshipAPI.searchByEmail(searchTerm);
        } else {
          results = await friendshipAPI.searchUsers(searchTerm);
        }

        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [],
  );

  // Load friends list
  const loadFriends = useCallback(async () => {
    setIsLoadingFriends(true);
    try {
      const friendsList = await friendshipAPI.getFriendsList();
      setFriends(friendsList);
    } catch (error) {
      console.error("Error loading friends:", error);
    } finally {
      setIsLoadingFriends(false);
    }
  }, []);

  // Load friend requests
  const loadRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    try {
      const [pending, sent] = await Promise.all([
        friendshipAPI.getPendingFriendRequests(),
        friendshipAPI.getSentFriendRequests(),
      ]);
      setPendingRequests(pending);
      setSentRequests(sent);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  // Load initial data when component mounts
  useEffect(() => {
    loadFriends();
    loadRequests();
    loadAllUsers();
  }, [loadFriends, loadRequests, loadAllUsers]);

  // Handle user selection from search - not used currently but can be expanded
  // const handleSelectUser = (user: UserFriendDTO) => {
  //   // Scroll to top to see the result
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const getTabLabel = (tabName: string) => {
    switch (tabName) {
      case "find":
        return "Tìm Bạn";
      case "friends":
        return `Bạn Bè (${friends.length})`;
      case "requests":
        return `Lời Mời (${pendingRequests.length})`;
      default:
        return tabName;
    }
  };

  return (
    <div className="find-friends-section">
      <div className="section-header">
        <h2>Kết Nối Bạn Bè</h2>
        <p>
          Tìm kiếm và kết bạn với những người dùng khác để học tập cùng nhau
        </p>
      </div>

      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === "find" ? "active" : ""}`}
          onClick={() => setActiveTab("find")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="M12 12L18 18" />
          </svg>
          {getTabLabel("find")}
        </button>

        <button
          className={`tab-button ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="7" cy="5" r="3" />
            <path d="M3 18C3 16 5 14 7 14C9 14 11 16 11 18" />
            <circle cx="15" cy="8" r="2.5" />
            <path d="M12 18C12 16.5 13 15 15 15C17 15 18 16.5 18 18" />
          </svg>
          {getTabLabel("friends")}
        </button>

        <button
          className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="10" cy="8" r="4" />
            <path d="M3 18C3 15 6 13 10 13C14 13 17 15 17 18" />
            <path d="M7 2L9 5L7 8" />
          </svg>
          {getTabLabel("requests")}
        </button>
      </div>

      <div className="tabs-content">
        {/* Find Friends Tab */}
        {activeTab === "find" && (
          <div className="tab-pane find-friends-pane">
            <FriendSearch
              searchResults={searchResults}
              isLoading={isSearching}
              allUsers={allUsers}
              onSelectUser={(user) => {
                handleSearch(
                  user.lastName || user.email,
                  user.lastName ? "lastName" : "email",
                );
              }}
              onFocus={() => {
                setShowAllUsers(true);
              }}
              onSearchTermChange={handleSearch}
            />

            <div className="search-tips">
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <span className="tip-text">
                  Nhấp vào nút "Tất cả/Họ/Email" để chuyển đổi loại tìm kiếm
                </span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🔍</span>
                <span className="tip-text">
                  Tìm kiếm theo họ hoặc email để tìm bạn bè dễ dàng hơn
                </span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🤝</span>
                <span className="tip-text">
                  Gửi lời mời kết bạn để bắt đầu giao tiếp
                </span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">👥</span>
                <span className="tip-text">
                  Xem danh sách bạn bè và lời mời kết bạn
                </span>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results-section">
                <h3>Kết Quả Tìm Kiếm</h3>
                <div className="results-grid">
                  {searchResults.map((user) => (
                    <div key={user.id} className="user-result-card">
                      <div className="user-result-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.firstName} />
                        ) : (
                          <div className="avatar-placeholder">
                            {(
                              user.firstName[0] + user.lastName[0]
                            ).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-result-info">
                        <div className="user-result-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="user-result-meta">
                          <span className="meta-item">{user.points} điểm</span>
                          <span className="meta-item">
                            🔥 {user.streak} ngày
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn-add-from-search"
                        onClick={async () => {
                          try {
                            await friendshipAPI.sendFriendRequest(user.id);
                            alert("Lời mời kết bạn đã được gửi!");
                            loadRequests();
                          } catch (error) {
                            alert("Lỗi khi gửi lời mời kết bạn");
                          }
                        }}
                      >
                        + Thêm
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showAllUsers && searchResults.length === 0 && (
              <div className="search-results-section all-users-section">
                <h3>Danh Sách Tất Cả Người Dùng</h3>
                <p className="section-subtitle">
                  Nhấp vào người dùng để gửi lời mời kết bạn
                </p>
                <div className="results-grid">
                  {allUsers.map((user) => (
                    <div key={user.id} className="user-result-card">
                      <div className="user-result-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.firstName} />
                        ) : (
                          <div className="avatar-placeholder">
                            {(
                              user.firstName[0] + user.lastName[0]
                            ).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-result-info">
                        <div className="user-result-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="user-result-meta">
                          <span className="meta-item">{user.points} điểm</span>
                          <span className="meta-item">
                            🔥 {user.streak} ngày
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn-add-from-search"
                        onClick={async () => {
                          try {
                            await friendshipAPI.sendFriendRequest(user.id);
                            alert("Lời mời kết bạn đã được gửi!");
                            loadRequests();
                          } catch (error) {
                            alert("Lỗi khi gửi lời mời kết bạn");
                          }
                        }}
                      >
                        + Thêm
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <FriendsTab
            friends={friends}
            isLoading={isLoadingFriends}
            onRefresh={loadFriends}
          />
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <FriendRequestsTab
            pendingRequests={pendingRequests}
            sentRequests={sentRequests}
            isLoading={isLoadingRequests}
            onRefresh={loadRequests}
          />
        )}
      </div>
    </div>
  );
};

export default FindFriendsSection;
