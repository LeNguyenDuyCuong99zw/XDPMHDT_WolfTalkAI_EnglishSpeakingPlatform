import React from "react";
import "./ChatHeader.css";
import type { Conversation } from "../../services/chatService";

interface ChatHeaderProps {
  conversation: Conversation | null;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack }) => {
  if (!conversation) {
    return (
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          ← Trở lại
        </button>
      </div>
    );
  }

  return (
    <div className="chat-header">
      <button className="back-button" onClick={onBack}>
        ← Trở lại
      </button>
      <div className="header-info">
        {conversation.otherUserAvatar && (
          <img
            src={conversation.otherUserAvatar}
            alt={conversation.otherUserName}
            className="avatar"
          />
        )}
        <div className="user-info">
          <h2 className="user-name">{conversation.otherUserName}</h2>
          <p className="status">Online</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="action-button" title="Gọi thoại">
          📞
        </button>
        <button className="action-button" title="Tùy chọn">
          ⋮
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
