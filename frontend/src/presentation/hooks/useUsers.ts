import { useState, useEffect } from "react";
import { userAdminAPI } from "../../services/admin/userAdminAPI";

interface UserListDTO {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string;
  isEnabled: boolean;
  hasCompletedPlacementTest: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationState {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

interface UseUsersReturn {
  users: any[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchUsers: (page?: number, search?: string) => Promise<void>;
  activateUser: (userId: string | number) => Promise<void>;
  deactivateUser: (userId: string | number) => Promise<void>;
  createUser: (data: any) => Promise<void>;
  updateUser: (userId: string | number, data: any) => Promise<void>;
  deleteUser: (userId: string | number) => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const transformUserData = (user: UserListDTO) => ({
    id: user.id.toString(),
    fullName:
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
    email: user.email,
    role: user.roles?.includes("ADMIN")
      ? "Admin"
      : user.roles?.includes("MENTOR")
        ? "Mentor"
        : "Learner",
    status: user.isEnabled ? "active" : "inactive",
    hasCompletedPlacementTest: user.hasCompletedPlacementTest,
    avatar: undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });

  const fetchUsers = async (page: number = 0, search: string = "") => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (search) {
        // Search by email
        const user = await userAdminAPI.searchUserByEmail(search);
        response = {
          items: [user],
          page: 0,
          size: 1,
          total: 1,
          totalPages: 1,
        };
      } else {
        // Get paginated users
        response = await userAdminAPI.getUsersPaginated({
          page,
          size: pagination.size,
        });
      }

      const transformedUsers = response.items
        .map(transformUserData)
        // Filter out Admin and Mentor users, only show Learner users
        .filter((user) => user.role === "Learner");

      setUsers(transformedUsers);
      setPagination({
        page: response.page,
        size: response.size,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch users";
      setError(errorMessage);
      console.error("Error in fetchUsers:", err);
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (userId: string | number) => {
    try {
      await userAdminAPI.activateUser(userId);
      await fetchUsers(pagination.page, searchQuery);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to activate user";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deactivateUser = async (userId: string | number) => {
    try {
      await userAdminAPI.deactivateUser(userId);
      await fetchUsers(pagination.page, searchQuery);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to deactivate user";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createUser = async (data: any) => {
    try {
      setLoading(true);
      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles || "ROLE_USER",
        learningLanguage: data.learningLanguage || "en",
        isEnabled: data.isEnabled !== undefined ? data.isEnabled : true,
      };
      await userAdminAPI.createUser(userData);
      await fetchUsers(0, "");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string | number, data: any) => {
    try {
      setLoading(true);
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles,
        avatar: data.avatar,
        isEnabled: data.isEnabled,
      };
      await userAdminAPI.updateUser(userId, updateData);
      await fetchUsers(pagination.page, searchQuery);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string | number) => {
    try {
      setLoading(true);
      await userAdminAPI.deleteUser(userId);
      await fetchUsers(pagination.page, searchQuery);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0, searchQuery);
  }, [searchQuery]);

  return {
    users,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    fetchUsers,
    activateUser,
    deactivateUser,
    createUser,
    updateUser,
    deleteUser,
  };
};
