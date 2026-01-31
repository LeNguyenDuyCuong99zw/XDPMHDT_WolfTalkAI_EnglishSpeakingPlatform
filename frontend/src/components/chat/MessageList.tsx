import React, { useEffect, useRef } from "react";
import "./MessageList.css";
import type { Message } from "../../services/chatService";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return <div className="message-list loading">Đang tải tin nhắn...</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <p>Không có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((msg, idx) => (
        <div
          key={`${msg.id}-${idx}`}
          className={`message ${
            msg.senderId === currentUserId ? "sent" : "received"
          } ${msg.isDeleted ? "deleted" : ""} ${msg.id < 0 ? "pending" : ""}`}
        >
          {msg.senderAvatar && (
            <img
              src={msg.senderAvatar}
              alt={msg.senderName}
              className="avatar"
              title={msg.senderName}
            />
          )}
          <div className="message-content">
            {msg.senderId !== currentUserId && (
              <div className="sender-info">
                <span className="sender-name">{msg.senderName}</span>
                <span className="timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
            <div className="message-text">
              {msg.isDeleted ? <em>Tin nhắn đã bị xóa</em> : msg.content}
              {msg.id < 0 && <span className="sending">. . .</span>}
            </div>
            {msg.senderId === currentUserId && (
              <span className="timestamp">
                {msg.id < 0
                  ? "Đang gửi..."
                  : new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
