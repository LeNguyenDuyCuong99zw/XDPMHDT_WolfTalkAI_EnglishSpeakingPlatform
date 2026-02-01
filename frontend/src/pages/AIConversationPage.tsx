import React, { useState, useRef, useEffect } from 'react';
import aiLearningService from '../services/aiLearningService';
import AIProviderSelector from '../components/AIProviderSelector';
import { AIProvider, ConversationResponse } from '../types/aiLearning';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string;
}

const AIConversationPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<AIProvider>('auto');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [context, setContext] = useState('casual conversation');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await aiLearningService.generateConversation(
        {
          message: input,
          context,
          difficulty,
        },
        provider
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get response. Please try again.');
      console.error('Conversation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-conversation-page">
      <div className="page-header">
        <h1>💬 AI Conversation</h1>
        <p>Practice English conversation with AI</p>
      </div>

      <div className="settings-bar">
        <AIProviderSelector value={provider} onChange={setProvider} />
        
        <div className="setting-group">
          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="setting-select"
          >
            <option value="beginner">🟢 Beginner</option>
            <option value="intermediate">🟡 Intermediate</option>
            <option value="advanced">🔴 Advanced</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Context:</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., casual, business, academic"
            className="setting-input"
          />
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Start a conversation!</h3>
              <p>Type a message below to begin practicing English with AI</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                {message.suggestions && (
                  <div className="message-suggestions">
                    <strong>💡 Alternative expressions:</strong>
                    <div className="suggestions-text">{message.suggestions}</div>
                  </div>
                )}
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send)"
            className="message-input"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="send-button"
          >
            {loading ? '⏳' : '📤'} Send
          </button>
        </div>
      </div>

      <style>{`
        .ai-conversation-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          height: calc(100vh - 48px);
          display: flex;
          flex-direction: column;
        }

        .page-header {
          margin-bottom: 16px;
        }

        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .page-header p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .settings-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .setting-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .setting-group label {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .setting-select,
        .setting-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .setting-input {
          width: 200px;
        }

        .chat-container {
          flex: 1;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          margin: 0 0 8px 0;
          color: #6b7280;
        }

        .empty-state p {
          font-size: 14px;
          margin: 0;
        }

        .message {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .message-content {
          max-width: 70%;
        }

        .message.user .message-content {
          align-items: flex-end;
        }

        .message-text {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
        }

        .message.user .message-text {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.assistant .message-text {
          background: #f3f4f6;
          color: #111827;
          border-bottom-left-radius: 4px;
        }

        .message-suggestions {
          margin-top: 8px;
          padding: 12px;
          background: #f0f9ff;
          border-left: 3px solid #3b82f6;
          border-radius: 6px;
          font-size: 13px;
        }

        .suggestions-text {
          margin-top: 4px;
          color: #374151;
        }

        .message-time {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .error-banner {
          padding: 12px 24px;
          background: #fef2f2;
          border-top: 1px solid #fecaca;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-area {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
        }

        .message-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: none;
        }

        .message-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .send-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AIConversationPage;
