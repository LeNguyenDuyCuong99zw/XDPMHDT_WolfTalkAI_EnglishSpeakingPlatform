// File: profile/components/FriendSearch.tsx
import React, { useState } from "react";
import type { UserFriendDTO } from "../../services/friendshipAPI";
import { friendshipAPI } from "../../services/friendshipAPI";
import "./FriendSearch.css";

interface FriendSearchProps {
  onSelectUser: (user: UserFriendDTO) => void;
  isLoading?: boolean;
  searchResults: UserFriendDTO[];
  onFocus?: () => void;
  allUsers?: UserFriendDTO[];
  onSearchTermChange?: (
    term: string,
    type: "all" | "lastName" | "email",
  ) => void;
}

const FriendSearch: React.FC<FriendSearchProps> = ({
  onSelectUser,
  isLoading = false,
  searchResults,
  onFocus,
  allUsers = [],
  onSearchTermChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchType, setSearchType] = useState<"all" | "lastName" | "email">(
    "all",
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setShowResults(true);
    // Call parent's search function with new term and current search type
    onSearchTermChange?.(value, searchType);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowResults(true);
    onFocus?.();
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      if (!searchTerm.trim()) {
        setShowResults(false);
      }
    }, 200);
  };

  const handleUserClick = (user: UserFriendDTO) => {
    onSelectUser(user);
    setSearchTerm("");
    setShowResults(false);
  };

  const cycleSearchType = () => {
    const types: ("all" | "lastName" | "email")[] = [
      "all",
      "lastName",
      "email",
    ];
    const currentIndex = types.indexOf(searchType);
    const newType = types[(currentIndex + 1) % types.length];
    setSearchType(newType);
    // Call parent's search function with current term and new type
    onSearchTermChange?.(searchTerm, newType);
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case "lastName":
        return "Tìm kiếm theo họ...";
      case "email":
        return "Tìm kiếm theo email...";
      default:
        return "Tên hoặc email người dùng";
    }
  };

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "lastName":
        return "Họ";
      case "email":
        return "Email";
      default:
        return "Tất cả";
    }
  };

  return (
    <div className="friend-search">
      <div className="search-container">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="M12 12L18 18" stroke="currentColor" strokeWidth="2" />
        </svg>
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="search-input"
        />
        <button
          className="search-type-toggle"
          onClick={cycleSearchType}
          title="Nhấp để thay đổi loại tìm kiếm"
        >
          {getSearchTypeLabel()}
        </button>
        {searchTerm && (
          <button
            className="clear-button"
            onClick={() => {
              setSearchTerm("");
              setShowResults(false);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {showResults && (
        <div className="search-results">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tìm kiếm...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="results-list">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="result-item"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="result-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {(user.firstName[0] + user.lastName[0]).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="result-info">
                    <div className="result-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="result-stats">
                      <span className="stat">
                        <strong>{user.points}</strong> điểm
                      </span>
                      <span className="stat">
                        🔥 <strong>{user.streak}</strong> ngày
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : allUsers.length > 0 && (searchTerm.length === 0 || isFocused) ? (
            <div className="results-list">
              {allUsers.slice(0, 20).map((user) => (
                <div
                  key={user.id}
                  className="result-item"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="result-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {(user.firstName[0] + user.lastName[0]).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="result-info">
                    <div className="result-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="result-stats">
                      <span className="stat">
                        <strong>{user.points}</strong> điểm
                      </span>
                      <span className="stat">
                        🔥 <strong>{user.streak}</strong> ngày
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                opacity="0.5"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M15 24H33M24 15V33"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <p>Không tìm thấy người dùng</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendSearch;
