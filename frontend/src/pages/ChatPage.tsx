import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import ChatWindow from "../components/chat/ChatWindow";
import type { Conversation } from "../services/chatService";
import chatService from "../services/chatService";

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Initialize WebSocket and load conversations
  useEffect(() => {
    // Get user ID from token or auth context
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Decode JWT to get user ID
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.sub || payload.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Connect WebSocket
    const connectWebSocket = async () => {
      try {
        await chatService.connectWebSocket();
        setWsConnected(true);
        console.log("✅ WebSocket connected");
      } catch (error) {
        console.error("❌ WebSocket connection failed:", error);
      }
    };

    connectWebSocket();
    loadConversations();

    // Cleanup: disconnect WebSocket when component unmounts
    return () => {
      chatService.disconnectWebSocket();
      setWsConnected(false);
    };
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const convs = await chatService.getConversations(0);
      setConversations(convs);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackFromChat = () => {
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!currentUserId) {
    return <div className="chat-page">Đang tải...</div>;
  }

  if (selectedConversation) {
    return (
      <div className="chat-page">
        <ChatWindow
          conversation={selectedConversation}
          currentUserId={currentUserId}
          onBack={handleBackFromChat}
        />
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="conversations-list">
        <div className="conversations-header">
          <h2>Tin nhắn</h2>
          <button className="new-chat-button" title="Tin nhắn mới">
            +
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="conversations-container">
          {isLoading ? (
            <div className="loading">Đang tải cuộc trò chuyện...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="empty-state">
              <p>Không có cuộc trò chuyện nào</p>
              <p className="hint">Hãy tìm bạn bè để bắt đầu chat</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="conversation-item"
                onClick={() => handleSelectConversation(conversation)}
              >
                {conversation.otherUserAvatar && (
                  <img
                    src={conversation.otherUserAvatar}
                    alt={conversation.otherUserName}
                    className="avatar"
                  />
                )}
                <div className="conversation-info">
                  <h3 className="user-name">{conversation.otherUserName}</h3>
                  <p className="last-message">
                    {conversation.lastMessageSenderId === currentUserId
                      ? "Bạn: "
                      : ""}
                    {conversation.lastMessage || "Không có tin nhắn"}
                  </p>
                </div>
                {conversation.lastMessageAt && (
                  <span className="timestamp">
                    {new Date(conversation.lastMessageAt).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
