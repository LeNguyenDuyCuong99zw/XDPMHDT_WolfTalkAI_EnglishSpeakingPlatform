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
            // Add new message or replace temp message
            setMessages((prev) => {
              // Check if message already exists (by real message id, not temp id)
              const messageExists = prev.some(
                (m) => m.id === message.id && m.id > 0,
              );

              if (messageExists) {
                return prev;
              }

              // If this is from server (real id > 0), check for temp message from same sender with same content
              if (message.id > 0) {
                const tempMessageIndex = prev.findIndex(
                  (m) =>
                    m.senderId === message.senderId &&
                    m.content === message.content &&
                    m.id < 0,
                );

                if (tempMessageIndex !== -1) {
                  // Replace temp message with real one
                  const updated = [...prev];
                  updated[tempMessageIndex] = message;
                  return updated;
                }
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
    // Add message optimistically to UI immediately
    const tempMessage: Message = {
      id: Date.now(),
      conversationId: conversation.id,
      senderId: currentUserId,
      senderName: "Bạn",
      senderAvatar: "",
      content: content,
      createdAt: new Date().toISOString(),
      isDeleted: false,
    };

    // Show message immediately
    setMessages((prev) => [...prev, tempMessage]);

    try {
      await chatService.sendMessage(conversation.id, content);
      // Message will be received via WebSocket subscription
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the temp message if sending failed
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
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
