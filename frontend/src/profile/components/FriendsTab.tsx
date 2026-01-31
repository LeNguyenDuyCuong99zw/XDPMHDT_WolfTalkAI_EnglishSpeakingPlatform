// File: profile/components/FriendsTab.tsx
import React, { useState } from "react";
import type { UserFriendDTO } from "../../services/friendshipAPI";
import { friendshipAPI } from "../../services/friendshipAPI";
import FloatingChatWindow from "../../components/chat/FloatingChatWindow";
import "./FriendsTab.css";

interface FriendsTabProps {
  friends: UserFriendDTO[];
  isLoading: boolean;
  onRefresh: () => void;
}

const FriendsTab: React.FC<FriendsTabProps> = ({
  friends,
  isLoading,
  onRefresh,
}) => {
  const [removingFriendId, setRemovingFriendId] = useState<number | null>(null);
  const [activeChatFriends, setActiveChatFriends] = useState<
    Map<number, UserFriendDTO>
  >(new Map());

  const handleRemoveFriend = async (friendId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa bạn bè này?")) return;

    setRemovingFriendId(friendId);
    try {
      await friendshipAPI.unfriend(friendId);
      onRefresh();
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Không thể xóa bạn bè");
    } finally {
      setRemovingFriendId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="friends-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải danh sách bạn bè...</p>
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="friends-tab">
        <div className="empty-state">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            opacity="0.3"
          >
            <circle
              cx="40"
              cy="25"
              r="15"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M25 50C25 40 32 35 40 35C48 35 55 40 55 50"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="60"
              cy="60"
              r="15"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <h3>Chưa có bạn bè</h3>
          <p>Tìm kiếm và thêm bạn bè để bắt đầu học tập cùng nhau!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-tab">
      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <div className="friend-avatar">
              {friend.avatar ? (
                <img src={friend.avatar} alt={friend.firstName} />
              ) : (
                <div className="avatar-placeholder">
                  {(friend.firstName[0] + friend.lastName[0]).toUpperCase()}
                </div>
              )}
            </div>

            <div className="friend-content">
              <div className="friend-name">
                {friend.firstName} {friend.lastName}
              </div>
              <div className="friend-meta">
                <span className="friend-points">
                  Điểm: <strong>{friend.points}</strong>
                </span>
                <span className="friend-streak">
                  Streak: 🔥 <strong>{friend.streak}</strong>
                </span>
              </div>
            </div>

            <div className="friend-actions">
              <button
                className="btn-chat-friend"
                onClick={() => {
                  const newMap = new Map(activeChatFriends);
                  if (newMap.has(friend.id)) {
                    newMap.delete(friend.id);
                  } else {
                    newMap.set(friend.id, friend);
                  }
                  setActiveChatFriends(newMap);
                }}
                title={
                  activeChatFriends.has(friend.id)
                    ? "Đóng chat"
                    : "Chat với bạn bè"
                }
              >
                {activeChatFriends.has(friend.id) ? "💬✕" : "💬"}
              </button>
              <button
                className="btn-remove-friend"
                onClick={() => handleRemoveFriend(friend.id)}
                disabled={removingFriendId === friend.id}
                title="Xóa bạn bè"
              >
                {removingFriendId === friend.id ? "..." : "✕"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {Array.from(activeChatFriends.values()).map((friend) => (
        <FloatingChatWindow
          key={friend.id}
          friend={{
            id: friend.id,
            email: friend.email,
            firstName: friend.firstName,
            lastName: friend.lastName,
            avatar: friend.avatar,
          }}
          currentUserId={parseInt(localStorage.getItem("userId") || "0")}
          onClose={() => {
            const newMap = new Map(activeChatFriends);
            newMap.delete(friend.id);
            setActiveChatFriends(newMap);
          }}
        />
      ))}
    </div>
  );
};

export default FriendsTab;
