<<<<<<< HEAD
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { storageService } from '../../infrastructure/services/StorageService'; // Correctly points to the file I made/verified
import { apiClient } from '../../services/api'; // Assuming this exists

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
>>>>>>> cc38da3 (sửa database , login , thêm thời gian thực dashboard)

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

<<<<<<< HEAD
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
=======
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = storageService.getAccessToken();
    if (token) {
      try {
        // Optional: Verify token with backend or fetch user profile
        // const profile = await apiClient.get('/auth/me');
        // setUser(profile);

        // For now, if we have a token, we assume logged in. 
        // We can decode JWT here if we want user info immediately.
        // Let's at least set a placeholder user if we don't fetch.
        // Or try to fetch profile.
        setUser({ email: 'user@example.com' }); // Placeholder until we fetch real profile
      } catch (e) {
        console.error(e);
        // storageService.removeAccessToken();
        // setUser(null);
      }
    } else {
      setUser(null);
    }
>>>>>>> cc38da3 (sửa database , login , thêm thời gian thực dashboard)
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

<<<<<<< HEAD
  const login = async (credentials: any): Promise<any> => {
    try {
      console.log("AuthContext: Attempting login with", credentials);

      // Call backend API
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      console.log("AuthContext: Login successful", data);

      // Store token & user info
      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }

      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("AuthContext: Login failed with error", error);
=======
  const login = async (credentials: LoginDTO): Promise<UserDTO> => {
    try {
      // If login with credentials
      const res: any = await apiClient.post('/auth/login', credentials);
      if (res.token) {
        storageService.setAccessToken(res.token);
        await checkAuth();
        return { email: credentials.email || '' };
      }
      throw new Error('No token returned');
    } catch (error) {
      console.error('AuthContext: Login failed with error', error);
>>>>>>> cc38da3 (sửa database , login , thêm thời gian thực dashboard)
      throw error;
    }
  };

  const logout = (): void => {
<<<<<<< HEAD
=======
    storageService.removeAccessToken();
    storageService.removeUser();
>>>>>>> cc38da3 (sửa database , login , thêm thời gian thực dashboard)
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth
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
