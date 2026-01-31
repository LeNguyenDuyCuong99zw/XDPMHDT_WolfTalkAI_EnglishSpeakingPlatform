const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Giải mã JWT token để lấy email (subject)
 */
export function getEmailFromToken(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded.sub || null; // 'sub' chứa email
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
      credentials: "omit", // "omit" | "same-origin" | "include" - set to "include" for cross-origin credentials
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      const error: any = new Error(
        errorData.message || `API Error: ${response.statusText}`,
      );
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      credentials: "omit", // "omit" | "same-origin" | "include"
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      const error: any = new Error(
        errorData.message || `API Error: ${response.statusText}`,
      );
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      const error: any = new Error(
        errorData.message || `API Error: ${response.statusText}`,
      );
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      const error: any = new Error(
        errorData.message || `API Error: ${response.statusText}`,
      );
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      const error: any = new Error(
        errorData.message || `API Error: ${response.statusText}`,
      );
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    return response.json();
  },
};
