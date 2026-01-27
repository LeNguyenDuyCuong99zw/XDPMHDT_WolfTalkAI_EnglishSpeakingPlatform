import React, { useState } from "react";
import "./MessageInput.css";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(content);
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Nhập tin nhắn..."
        disabled={isLoading || isSending}
        className="message-input"
        rows={3}
      />
      <button
        type="submit"
        disabled={!content.trim() || isLoading || isSending}
        className="send-button"
      >
        {isSending ? "Đang gửi..." : "Gửi"}
      </button>
    </form>
  );
};

export default MessageInput;
