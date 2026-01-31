// File: services/chatService.ts
import { apiClient } from "./api";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export interface Message {
  id: number;
  conversationId?: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface Conversation {
  id: number;
  user1Id: number;
  user1Name: string;
  user1Avatar?: string;
  user2Id: number;
  user2Name: string;
  user2Avatar?: string;
  otherUserId: number;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage?: string;
  lastMessageSenderId?: number;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

// WebSocket connection manager
class WebSocketManager {
  private stompClient: Client | null = null;
  private isConnected = false;

  /**
   * Kết nối tới WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected && this.stompClient) {
        resolve();
        return;
      }

      try {
        const socket = new SockJS(
          `${import.meta.env.VITE_API_BASE_URL}/ws-chat`,
        );
        this.stompClient = new Client({
          webSocketFactory: () => socket,
          onConnect: () => {
            this.isConnected = true;
            console.log("WebSocket connected");
            resolve();
          },
          onDisconnect: () => {
            this.isConnected = false;
            console.log("WebSocket disconnected");
          },
          onStompError: (frame) => {
            console.error("STOMP error:", frame.body);
            reject(new Error(`STOMP error: ${frame.body}`));
          },
        });

        this.stompClient.activate();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect khỏi WebSocket server
   */
  disconnect(): void {
    if (this.stompClient && this.isConnected) {
      this.stompClient
        .deactivate()
        .then(() => {
          this.isConnected = false;
          console.log("WebSocket disconnected");
        })
        .catch((err) => {
          console.error("Error disconnecting WebSocket:", err);
        });
    }
  }

  /**
   * Subscribe vào channel tin nhắn của một cuộc trò chuyện
   */
  subscribeToConversation(
    conversationId: number,
    callback: (message: Message) => void,
  ): () => void {
    if (!this.stompClient || !this.isConnected) {
      console.warn("WebSocket not connected");
      return () => {};
    }

    const subscription = this.stompClient.subscribe(
      `/topic/chat/conversation/${conversationId}`,
      (message) => {
        try {
          const payload = JSON.parse(message.body);

          // Kiểm tra xem đây có phải là DELETE_MESSAGE event không
          if (payload.type === "DELETE_MESSAGE") {
            callback({
              id: payload.messageId,
              senderId: 0,
              senderName: "",
              content: "",
              createdAt: "",
              isDeleted: true,
            });
          } else {
            // Đây là một tin nhắn bình thường
            callback(payload);
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      },
    );

    // Trả về unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  }

  /**
   * Gửi tin nhắn qua WebSocket
   */
  sendMessage(conversationId: number, content: string): void {
    if (!this.stompClient || !this.isConnected) {
      console.warn("WebSocket not connected");
      return;
    }

    this.stompClient.publish({
      destination: `/app/chat/${conversationId}`,
      body: JSON.stringify({ content }),
    });
  }

  /**
   * Kiểm tra xem WebSocket có kết nối không
   */
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}

const wsManager = new WebSocketManager();

class ChatService {
  /**
   * Khởi tạo hoặc lấy cuộc trò chuyện với một người dùng bằng email
   */
  async startConversation(userEmail: string): Promise<Conversation> {
    try {
      const response = await apiClient.post<any>(
        `/chat/start/${userEmail}`,
        {},
      );

      // Get the other user info from response
      const otherUser = response.user2;

      return {
        id: response.id,
        user1Id: response.user1_id,
        user1Name: response.user1.firstName + " " + response.user1.lastName,
        user1Avatar: response.user1.avatar,
        user2Id: response.user2_id,
        user2Name: response.user2.firstName + " " + response.user2.lastName,
        user2Avatar: response.user2.avatar,
        otherUserId: otherUser.id,
        otherUserName: otherUser.firstName + " " + otherUser.lastName,
        otherUserAvatar: otherUser.avatar,
        lastMessage: response.last_message,
        lastMessageAt: response.last_message_at,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
      };
    } catch (error) {
      console.error("Error starting conversation:", error);
      throw error;
    }
  }

  /**
   * Gửi tin nhắn qua REST API (sẽ broadcast qua WebSocket)
   */
  async sendMessage(conversationId: number, content: string): Promise<Message> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: Message;
      }>("/chat/send", {
        conversation_id: conversationId,
        content,
      });

      return response.message;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Gửi tin nhắn qua WebSocket (real-time)
   */
  sendMessageViaWebSocket(conversationId: number, content: string): void {
    wsManager.sendMessage(conversationId, content);
  }

  /**
   * Lấy danh sách tin nhắn của cuộc trò chuyện
   */
  async getMessages(
    conversationId: number,
    page: number = 0,
  ): Promise<Message[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        messages: Message[];
        count: number;
      }>(`/chat/messages/${conversationId}?page=${page}`);

      return response.messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách cuộc trò chuyện của người dùng
   */
  async getConversations(page: number = 0): Promise<Conversation[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        conversations: Conversation[];
        count: number;
      }>(`/chat/conversations?page=${page}`);

      return response.conversations;
    } catch (error) {
      console.error("Error getting conversations:", error);
      throw error;
    }
  }

  /**
   * Xóa tin nhắn
   */
  async deleteMessage(messageId: number): Promise<void> {
    try {
      await apiClient.delete(`/chat/message/${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  /**
   * Lưu trữ cuộc trò chuyện
   */
  async archiveConversation(conversationId: number): Promise<void> {
    try {
      await apiClient.put(`/chat/conversation/${conversationId}/archive`, {});
    } catch (error) {
      console.error("Error archiving conversation:", error);
      throw error;
    }
  }

  /**
   * Subscribe vào tin nhắn real-time của cuộc trò chuyện
   */
  subscribeToConversation(
    conversationId: number,
    callback: (message: Message) => void,
  ): () => void {
    return wsManager.subscribeToConversation(conversationId, callback);
  }

  /**
   * Kết nối WebSocket
   */
  async connectWebSocket(): Promise<void> {
    return wsManager.connect();
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    wsManager.disconnect();
  }

  /**
   * Kiểm tra WebSocket connection
   */
  isWebSocketConnected(): boolean {
    return wsManager.isWebSocketConnected();
  }
}

export default new ChatService();
