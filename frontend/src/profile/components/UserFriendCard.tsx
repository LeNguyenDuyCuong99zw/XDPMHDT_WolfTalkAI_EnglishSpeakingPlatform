// File: profile/components/UserFriendCard.tsx
import React, { useState } from "react";
import type { UserFriendDTO } from "../../services/friendshipAPI";
import { friendshipAPI } from "../../services/friendshipAPI";
import "./UserFriendCard.css";

interface UserFriendCardProps {
  user: UserFriendDTO;
  actionType?: "add" | "remove" | "none";
  onAction?: (userId: number, action: string) => void;
  isLoading?: boolean;
}

const UserFriendCard: React.FC<UserFriendCardProps> = ({
  user,
  actionType = "add",
  onAction,
  isLoading = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddFriend = async () => {
    setIsProcessing(true);
    try {
      await friendshipAPI.sendFriendRequest(user.id);
      if (onAction) onAction(user.id, "add");
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFriend = async () => {
    setIsProcessing(true);
    try {
      await friendshipAPI.unfriend(user.id);
      if (onAction) onAction(user.id, "remove");
    } catch (error) {
      console.error("Error removing friend:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBlockUser = async () => {
    setIsProcessing(true);
    try {
      await friendshipAPI.blockUser(user.id);
      if (onAction) onAction(user.id, "block");
    } catch (error) {
      console.error("Error blocking user:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="user-friend-card">
      <div className="card-content">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.firstName} />
          ) : (
            <div className="avatar-placeholder">
              {(user.firstName[0] + user.lastName[0]).toUpperCase()}
            </div>
          )}
          {user.lastActiveDate && <div className="online-indicator"></div>}
        </div>

        <div className="user-info">
          <div className="user-name">
            {user.firstName} {user.lastName}
          </div>
          <div className="user-email">{user.email}</div>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Điểm:</span>
              <span className="stat-value">{user.points}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Streak:</span>
              <span className="stat-value">🔥 {user.streak}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ngôn ngữ:</span>
              <span className="stat-value">{user.learningLanguage}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-actions">
        {actionType === "add" ? (
          <button
            className="btn-add-friend"
            onClick={handleAddFriend}
            disabled={isProcessing || isLoading}
          >
            {isProcessing ? "Đang gửi..." : "Thêm bạn"}
          </button>
        ) : (
          <>
            <button
              className="btn-remove-friend"
              onClick={handleRemoveFriend}
              disabled={isProcessing || isLoading}
            >
              {isProcessing ? "..." : "Hủy"}
            </button>
            <button
              className="btn-block-user"
              onClick={handleBlockUser}
              disabled={isProcessing || isLoading}
              title="Chặn người dùng"
            >
              🚫
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserFriendCard;
