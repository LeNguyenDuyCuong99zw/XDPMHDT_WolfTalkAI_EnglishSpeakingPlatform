import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { storageService } from "../../infrastructure/services/StorageService"; // Correctly points to the file I made/verified
import { apiClient } from "../../services/api"; // Assuming this exists

export interface UserDTO {
  id?: string;
  email: string;
  name?: string;
  picture?: string;
  role?: string;
  [key: string]: any;
}

export interface LoginDTO {
  email?: string;
  password?: string;
  token?: string;
  provider?: string;
}

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = storageService.getAccessToken();
    if (token) {
      try {
<<<<<<< HEAD
        // Nếu là bypass token, lấy user từ localStorage (đã có role)
        const userFromStorage = storageService.getUser();
        if (userFromStorage && (token === 'bypass-token-admin' || token === 'bypass-token-mentor')) {
          setUser(userFromStorage);
        } else {
          // Optional: Verify token with backend or fetch user profile
          // const profile = await apiClient.get('/auth/me');
          // setUser(profile);
          setUser({ email: 'user@example.com' }); // Placeholder until we fetch real profile
        }
=======
        // Optional: Verify token with backend or fetch user profile
        // const profile = await apiClient.get('/auth/me');
        // setUser(profile);

        // For now, if we have a token, we assume logged in.
        // We can decode JWT here if we want user info immediately.
        // Let's at least set a placeholder user if we don't fetch.
        // Or try to fetch profile.
        setUser({ email: "user@example.com" }); // Placeholder until we fetch real profile
>>>>>>> 94e84d9fe7549095ff0f8caa70e511619dc5a451
      } catch (e) {
        console.error(e);
        // storageService.removeAccessToken();
        // setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginDTO): Promise<UserDTO> => {
    // BYPASS: Nếu email là 'admin@bypass' hoặc 'mentor@bypass', trả về user tương ứng, không gọi API
    if (credentials.email === 'admin@bypass') {
      const fakeUser = { email: 'admin@bypass', role: 'ADMIN', name: 'Bypass Admin' };
      setUser(fakeUser);
      storageService.setUser(fakeUser);
      storageService.setAccessToken('bypass-token-admin');
      // Đảm bảo trả về đúng role để LoginPage chuyển hướng về /admin/dashboard
      return fakeUser;
    }
    if (credentials.email === 'mentor@bypass') {
      const fakeUser = { email: 'mentor@bypass', role: 'MENTOR', name: 'Bypass Mentor' };
      setUser(fakeUser);
      storageService.setUser(fakeUser);
      storageService.setAccessToken('bypass-token-mentor');
      // Đảm bảo trả về đúng role để LoginPage chuyển hướng về /mentor/learners
      return fakeUser;
    }
    try {
      // If login with credentials
      const res: any = await apiClient.post("/auth/login", credentials);
      if (res.token) {
        storageService.setAccessToken(res.token);

        // Extract user data from response
        const userData = res.user || { email: credentials.email || "" };

        // Set user with role information
        setUser({
          id: userData.id,
          email: userData.email,
          name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });

        // Return user with role for navigation
        return {
          email: userData.email,
          role: userData.role,
          id: userData.id,
          name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        };
      }
      throw new Error("No token returned");
    } catch (error) {
      console.error("AuthContext: Login failed with error", error);
      throw error;
    }
  };

  const logout = (): void => {
    storageService.removeAccessToken();
    storageService.removeUser();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
