// File: profile/components/FriendRequestsTab.tsx
import React, { useState } from "react";
import type { FriendshipDTO } from "../../services/friendshipAPI";
import { friendshipAPI } from "../../services/friendshipAPI";
import "./FriendRequestsTab.css";

interface FriendRequestsTabProps {
  pendingRequests: FriendshipDTO[];
  sentRequests: FriendshipDTO[];
  isLoading: boolean;
  onRefresh: () => void;
}

const FriendRequestsTab: React.FC<FriendRequestsTabProps> = ({
  pendingRequests,
  sentRequests,
  isLoading,
  onRefresh,
}) => {
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"received" | "sent">(
    "received",
  );

  const handleAcceptRequest = async (friendshipId: number) => {
    setProcessingId(friendshipId);
    try {
      await friendshipAPI.acceptFriendRequest(friendshipId);
      onRefresh();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Không thể chấp nhận lời mời");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (friendshipId: number) => {
    setProcessingId(friendshipId);
    try {
      await friendshipAPI.rejectFriendRequest(friendshipId);
      onRefresh();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      alert("Không thể từ chối lời mời");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelRequest = async (friendshipId: number) => {
    setProcessingId(friendshipId);
    try {
      await friendshipAPI.rejectFriendRequest(friendshipId);
      onRefresh();
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      alert("Không thể hủy lời mời");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="friend-requests-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friend-requests-tab">
      <div className="subtab-buttons">
        <button
          className={`subtab-btn ${activeSubTab === "received" ? "active" : ""}`}
          onClick={() => setActiveSubTab("received")}
        >
          Lời mời ({pendingRequests.length})
        </button>
        <button
          className={`subtab-btn ${activeSubTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveSubTab("sent")}
        >
          Đã gửi ({sentRequests.length})
        </button>
      </div>

      <div className="subtab-content">
        {activeSubTab === "received" ? (
          <div className="requests-list">
            {pendingRequests.length === 0 ? (
              <div className="empty-state">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  opacity="0.3"
                >
                  <path
                    d="M32 8C18.7 8 8 18.7 8 32C8 45.3 18.7 56 32 56C45.3 56 56 45.3 56 32"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 32L30 42L44 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Không có lời mời kết bạn</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="request-item">
                  <div className="requester-info">
                    <div className="requester-avatar">
                      {request.requesterAvatar ? (
                        <img
                          src={request.requesterAvatar}
                          alt={request.requesterName}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {request.requesterName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="requester-details">
                      <div className="requester-name">
                        {request.requesterName}
                      </div>
                      <div className="request-date">
                        {new Date(request.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button
                      className="btn-accept"
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? "..." : "✓ Chấp nhận"}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? "..." : "✕ Từ chối"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="requests-list">
            {sentRequests.length === 0 ? (
              <div className="empty-state">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  opacity="0.3"
                >
                  <path
                    d="M32 8C18.7 8 8 18.7 8 32C8 45.3 18.7 56 32 56C45.3 56 56 45.3 56 32"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M32 20V44M20 32H44"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p>Bạn chưa gửi lời mời nào</p>
              </div>
            ) : (
              sentRequests.map((request) => (
                <div key={request.id} className="request-item">
                  <div className="requester-info">
                    <div className="requester-avatar">
                      {request.receiverAvatar ? (
                        <img
                          src={request.receiverAvatar}
                          alt={request.receiverName}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {request.receiverName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="requester-details">
                      <div className="requester-name">
                        {request.receiverName}
                      </div>
                      <div className="request-date">
                        Đang chờ -{" "}
                        {new Date(request.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelRequest(request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? "..." : "✕ Hủy"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequestsTab;
