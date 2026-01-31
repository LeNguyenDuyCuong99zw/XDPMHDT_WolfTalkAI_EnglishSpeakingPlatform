// Ví dụ cách sử dụng ChatService mới với WebSocket

import { useEffect, useState, useRef } from "react";
import chatService, { Message, Conversation } from "../services/chatService";

interface ChatPageProps {
  userId: number;
  otherUserId: number;
}

export default function ChatPageExample({
  userId,
  otherUserId,
}: ChatPageProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Khởi tạo WebSocket connection khi component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Kết nối WebSocket
        await chatService.connectWebSocket();
        console.log("✅ WebSocket connected");

        // Bắt đầu cuộc trò chuyện với user
        const conv = await chatService.startConversation(otherUserId);
        setConversation(conv);
        console.log("✅ Conversation started:", conv.id);

        // Lấy tin nhắn cũ từ database
        const initialMessages = await chatService.getMessages(conv.id, 0);
        setMessages(initialMessages);
        console.log("✅ Initial messages loaded:", initialMessages.length);

        // Subscribe vào tin nhắn real-time
        const unsubscribe = chatService.subscribeToConversation(
          conv.id,
          (message: Message) => {
            console.log("📨 New message from WebSocket:", message);

            if (message.isDeleted) {
              // Xóa tin nhắn khỏi UI
              setMessages((prev) => prev.filter((m) => m.id !== message.id));
            } else {
              // Thêm tin nhắn mới vào UI
              setMessages((prev) => [...prev, message]);
            }
          },
        );

        unsubscribeRef.current = unsubscribe;
      } catch (error) {
        console.error("❌ Error initializing chat:", error);
      }
    };

    initializeChat();

    // Cleanup khi component unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        console.log("✅ Unsubscribed from WebSocket");
      }
      chatService.disconnectWebSocket();
      console.log("✅ WebSocket disconnected");
    };
  }, [otherUserId]);

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversation) return;

    setIsLoading(true);
    try {
      // Gửi qua REST API (lưu vào database)
      const message = await chatService.sendMessage(
        conversation.id,
        otherUserId,
        inputValue,
      );

      console.log("✅ Message sent and saved to database:", message.id);

      // ChatService tự động broadcast qua WebSocket
      // nên message sẽ được nhận lại qua subscription

      setInputValue("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa tin nhắn
  const handleDeleteMessage = async (messageId: number) => {
    try {
      await chatService.deleteMessage(messageId);
      console.log("✅ Message deleted:", messageId);
      // UI sẽ tự update qua WebSocket subscription
    } catch (error) {
      console.error("❌ Error deleting message:", error);
    }
  };

  if (!conversation) {
    return <div className="chat-loading">Loading conversation...</div>;
  }

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <img
          src={conversation.otherUserAvatar}
          alt={conversation.otherUserName}
          className="avatar"
        />
        <div>
          <h2>{conversation.otherUserName}</h2>
          <p className="status">
            {chatService.isWebSocketConnected() ? "🟢 Online" : "🔴 Offline"}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="messages-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.senderId === userId ? "sent" : "received"
            }`}
          >
            {msg.senderId !== userId && (
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="avatar"
              />
            )}
            <div className="message-content">
              <p className="sender-name">{msg.senderName}</p>
              <p className="text">{msg.content}</p>
              <span className="timestamp">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
              {msg.senderId === userId && (
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="delete-btn"
                  title="Delete message"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="message-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !isLoading) {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Status Indicator */}
      <div className="connection-status">
        <span
          className={`indicator ${chatService.isWebSocketConnected() ? "connected" : "disconnected"}`}
        ></span>
        {chatService.isWebSocketConnected() ? "Connected" : "Disconnected"}
      </div>
    </div>
  );
}

/**
 * CSS ví dụ (thêm vào ChatPage.css)
 */
/*
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
}

.chat-header .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.status {
  font-size: 12px;
  color: #666;
  margin: 4px 0 0 0;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 8px;
}

.message.sent {
  justify-content: flex-end;
}

.message.sent .message-content {
  background-color: #007bff;
  color: white;
}

.message.received .message-content {
  background-color: #e0e0e0;
}

.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  word-wrap: break-word;
}

.sender-name {
  font-size: 12px;
  font-weight: bold;
  margin: 0 0 4px 0;
}

.message-content .text {
  margin: 0;
  font-size: 14px;
}

.timestamp {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0 4px;
  font-size: 12px;
}

.delete-btn:hover {
  color: #ff6b6b;
}

.message-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
}

.message-input input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.message-input button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.message-input button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 12px;
  color: #666;
  border-top: 1px solid #e0e0e0;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.indicator.connected {
  background-color: #4caf50;
}

.indicator.disconnected {
  background-color: #f44336;
}
*/
