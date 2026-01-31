import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Conversation, Message } from "../../services/chatService";
import chatService from "../../services/chatService";

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: number;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [conversation.id]);

  // Subscribe to WebSocket real-time updates
  useEffect(() => {
    const subscribeToMessages = () => {
      const unsubscribe = chatService.subscribeToConversation(
        conversation.id,
        (message: Message) => {
          console.log("📨 New message from WebSocket:", message);

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
      return unsubscribe;
    };

    // Only subscribe if WebSocket is connected
    if (chatService.isWebSocketConnected()) {
      subscribeToMessages();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [conversation.id]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const msgs = await chatService.getMessages(conversation.id, 0);
      setMessages(msgs);
      setPage(1);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    setIsLoadingMore(true);
    try {
      const msgs = await chatService.getMessages(conversation.id, page);
      setMessages((prev) => [...msgs, ...prev]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      await chatService.sendMessage(conversation.id, content);
      // Message will be received via WebSocket subscription
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  return (
    <div className="chat-window">
      <ChatHeader conversation={conversation} onBack={onBack} />
      {isLoadingMore && (
        <div className="load-more-button-container">
          <button
            className="load-more-button"
            onClick={loadMoreMessages}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Đang tải..." : "Tải tin nhắn cũ hơn"}
          </button>
        </div>
      )}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
      />
      <MessageInput onSendMessage={handleSendMessage} isLoading={false} />
    </div>
  );
};

export default ChatWindow;
