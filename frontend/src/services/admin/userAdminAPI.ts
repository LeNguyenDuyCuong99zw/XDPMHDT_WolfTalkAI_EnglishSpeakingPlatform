/**
 * Admin User Management API Service
 * Handles all API calls for user management
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
}

interface UpdateUserStatusRequest {
  isEnabled: boolean;
}

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  roles?: string;
  avatar?: string;
  isEnabled?: boolean;
}

interface ResetPasswordRequest {
  newPassword: string;
}

interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roles?: string;
  learningLanguage?: string;
  isEnabled?: boolean;
}

class UserAdminAPI {
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON:", contentType);
      return {} as T;
    }

    const text = await response.text();
    if (!text) {
      console.warn("Response body is empty");
      return {} as T;
    }

    return JSON.parse(text);
  }

  /**
   * Get all users (non-paginated)
   */
  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: this.getHeaders(),
      });
      const result = (await this.handleResponse(response)) as any;
      return result.data || [];
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  /**
   * Get users with pagination
   */
  async getUsersPaginated(params: PaginationParams) {
    try {
      const page = params.page || 0;
      const size = params.size || 10;
      const url = new URL(`${API_BASE_URL}/admin/users/page`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("size", size.toString());

      console.log("Fetching from:", url.toString());
      console.log("Headers:", this.getHeaders());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      const result = (await this.handleResponse(response)) as any;

      console.log("Parsed result:", result);

      return {
        items: result.data || [],
        page: result.currentPage || page,
        size: size,
        total: result.totalElements || 0,
        totalPages: result.totalPages || 0,
      };
    } catch (error) {
      console.error("Error fetching paginated users:", error);
      throw error;
    }
  }

  /**
   * Get user detail by ID
   */
  async getUserDetail(userId: string | number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });
      const result = (await this.handleResponse(response)) as any;
      return result.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Search users by email
   */
  async searchUserByEmail(email: string) {
    try {
      const url = new URL(`${API_BASE_URL}/admin/users/search`);
      url.searchParams.append("email", email);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      });
      const result = (await this.handleResponse(response)) as any;
      return result.data;
    } catch (error) {
      console.error("Error searching user by email:", error);
      throw error;
    }
  }

  /**
   * Update user status (activate/deactivate)
   */
  async updateUserStatus(userId: string | number, isEnabled: boolean) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify({ isEnabled } as UpdateUserStatusRequest),
        },
      );
      const result = (await this.handleResponse(response)) as any;
      return result.data;
    } catch (error) {
      console.error(`Error updating user ${userId} status:`, error);
      throw error;
    }
  }

  /**
   * Update user information
   */
  async updateUser(userId: string | number, data: UpdateUserRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      const result = (await this.handleResponse(response)) as any;
      return result.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string | number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });
      await this.handleResponse(response);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(userId: string | number, newPassword: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/reset-password`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ newPassword } as ResetPasswordRequest),
        },
      );
      const result = (await this.handleResponse(response)) as any;
      return result.data;
    } catch (error) {
      console.error(`Error resetting password for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      const result = (await this.handleResponse(response)) as any;
      return result.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Activate user (helper method)
   */
  async activateUser(userId: string | number) {
    return this.updateUserStatus(userId, true);
  }

  /**
   * Deactivate user (helper method)
   */
  async deactivateUser(userId: string | number) {
    return this.updateUserStatus(userId, false);
  }
}

export const userAdminAPI = new UserAdminAPI();
