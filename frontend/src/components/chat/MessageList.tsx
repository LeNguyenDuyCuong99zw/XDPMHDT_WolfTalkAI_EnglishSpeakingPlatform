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
          } ${msg.isDeleted ? "deleted" : ""}`}
        >
          {msg.senderId !== currentUserId && msg.senderAvatar && (
            <img
              src={msg.senderAvatar}
              alt={msg.senderName}
              className="avatar"
            />
          )}
          <div className="message-content">
            <div className="sender-info">
              <span className="sender-name">{msg.senderName}</span>
              <span className="timestamp">
                {new Date(msg.createdAt).toLocaleTimeString("vi-VN")}
              </span>
            </div>
            <div className="message-text">
              {msg.isDeleted ? <em>Tin nhắn đã bị xóa</em> : msg.content}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
