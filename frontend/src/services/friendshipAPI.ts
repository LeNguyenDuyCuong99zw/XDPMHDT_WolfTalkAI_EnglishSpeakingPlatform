// File: services/friendshipAPI.ts
import { apiClient } from "./api";

export interface FriendshipDTO {
  id: number;
  requesterId: number;
  requesterName: string;
  requesterAvatar: string;
  receiverId: number;
  receiverName: string;
  receiverAvatar: string;
  status: "PENDING" | "ACCEPTED" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
}

export interface UserFriendDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  learningLanguage: string;
  points: number;
  streak: number;
  lastActiveDate: string;
}

export interface FriendRequestDTO {
  receiverId: number;
}

export const friendshipAPI = {
  // Gửi lời mời kết bạn
  async sendFriendRequest(receiverId: number): Promise<FriendshipDTO> {
    return apiClient.post<FriendshipDTO>("/v1/friendships/request", {
      receiverId,
    });
  },

  // Chấp nhận lời mời kết bạn
  async acceptFriendRequest(friendshipId: number): Promise<FriendshipDTO> {
    return apiClient.post<FriendshipDTO>(
      `/v1/friendships/${friendshipId}/accept`,
      {},
    );
  },

  // Từ chối lời mời kết bạn
  async rejectFriendRequest(
    friendshipId: number,
  ): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `/v1/friendships/${friendshipId}/reject`,
      {},
    );
  },

  // Hủy kết bạn
  async unfriend(friendId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `/v1/friendships/${friendId}/unfriend`,
      {},
    );
  },

  // Chặn người dùng
  async blockUser(userId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `/v1/friendships/${userId}/block`,
      {},
    );
  },

  // Bỏ chặn người dùng
  async unblockUser(userId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `/v1/friendships/${userId}/unblock`,
      {},
    );
  },

  // Lấy danh sách lời mời đang chờ
  async getPendingFriendRequests(): Promise<FriendshipDTO[]> {
    return apiClient.get<FriendshipDTO[]>("/v1/friendships/pending-requests");
  },

  // Lấy danh sách lời mời đã gửi
  async getSentFriendRequests(): Promise<FriendshipDTO[]> {
    return apiClient.get<FriendshipDTO[]>("/v1/friendships/sent-requests");
  },

  // Lấy danh sách bạn bè
  async getFriendsList(): Promise<UserFriendDTO[]> {
    return apiClient.get<UserFriendDTO[]>("/v1/friendships/friends");
  },

  // Kiểm tra xem hai user đã kết bạn chưa
  async checkFriendship(userId: number): Promise<{ areFriends: boolean }> {
    return apiClient.get<{ areFriends: boolean }>(
      `/v1/friendships/check/${userId}`,
    );
  },

  // Đếm số bạn bè
  async countFriends(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>("/v1/friendships/count");
  },

  // Tìm kiếm người dùng
  async searchUsers(query: string): Promise<UserFriendDTO[]> {
    return apiClient.get<UserFriendDTO[]>(
      `/v1/friendships/search?q=${encodeURIComponent(query)}`,
    );
  },

  // Tìm kiếm người dùng theo last_name
  async searchByLastName(lastName: string): Promise<UserFriendDTO[]> {
    return apiClient.get<UserFriendDTO[]>(
      `/v1/friendships/search-by-last-name?lastName=${encodeURIComponent(lastName)}`,
    );
  },

  // Tìm kiếm người dùng theo email
  async searchByEmail(email: string): Promise<UserFriendDTO[]> {
    return apiClient.get<UserFriendDTO[]>(
      `/v1/friendships/search-by-email?email=${encodeURIComponent(email)}`,
    );
  },

  // Lấy danh sách tất cả users (phân trang)
  async getAllUsers(
    page: number = 0,
    size: number = 20,
  ): Promise<UserFriendDTO[]> {
    return apiClient.get<UserFriendDTO[]>(
      `/v1/friendships/all-users?page=${page}&size=${size}`,
    );
  },
};
