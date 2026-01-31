import React, { useState, useEffect, useRef } from "react";
import "./FloatingChatWindow.css";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Conversation, Message } from "../../services/chatService";
import chatService from "../../services/chatService";

interface FloatingChatWindowProps {
  friend: {
    id: number;
    email?: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  currentUserId: number;
  onClose: () => void;
}

const FloatingChatWindow: React.FC<FloatingChatWindowProps> = ({
  friend,
  currentUserId,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    startOrLoadConversation();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const startOrLoadConversation = async () => {
    try {
      setIsLoading(true);

      // Lấy email từ JWT token hoặc từ prop
      const friendEmail = friend.email;
      if (!friendEmail) {
        console.error("Friend email is not available");
        return;
      }

      const conv = await chatService.startConversation(friendEmail);
      setConversation(conv);

      // Load initial messages
      const msgs = await chatService.getMessages(conv.id, 0);
      setMessages(msgs);

      // Subscribe to real-time updates via WebSocket
      const unsubscribe = chatService.subscribeToConversation(
        conv.id,
        (message: Message) => {
          console.log("📨 New message in floating window:", message);

          if (message.isDeleted) {
            // Remove deleted message
            setMessages((prev) => prev.filter((m) => m.id !== message.id));
          } else {
            // Add new message
            setMessages((prev) => {
              // Check if message already exists to avoid duplicates
              if (prev.some((m) => m.id === message.id)) {
                return prev;
              }
              return [...prev, message];
            });
          }
        },
      );

      unsubscribeRef.current = unsubscribe;
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversation) return;

    try {
      // Gửi tin nhắn - backend sẽ lấy sender email từ JWT
      await chatService.sendMessage(conversation.id, content);
      // Message will be received via WebSocket subscription
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!conversation) {
    return null;
  }

  return (
    <div className={`floating-chat-window ${isMinimized ? "minimized" : ""}`}>
      <div
        className="floating-chat-header"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="floating-chat-title">
          {friend.firstName} {friend.lastName}
        </div>
        <div className="floating-chat-actions">
          <button
            className="minimize-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            title={isMinimized ? "Phục hồi" : "Thu nhỏ"}
          >
            {isMinimized ? "□" : "−"}
          </button>
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Đóng"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="floating-chat-messages">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="floating-chat-input">
            <MessageInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChatWindow;
