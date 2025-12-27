import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '../../application/use-cases/auth/LogoutUseCase';
import { httpClient } from '../../infrastructure/http/AxiosHttpClient';
import { storageService } from '../../infrastructure/services/StorageService';
import { LoginDTO, UserDTO } from '../../application/dto/LoginDTO';

interface AuthContextType {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDTO) => Promise<UserDTO>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize use cases
const loginUseCase = new LoginUseCase(httpClient);
const logoutUseCase = new LogoutUseCase();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedUser = storageService.getUser();
    console.log('Authcontext - User from storage:', savedUser);
    const token = storageService.getAccessToken();
    
    if (savedUser && token) {
      setUser(savedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginDTO): Promise<UserDTO> => {
  try {
    console.log('AuthContext: Attempting login with', credentials);
    const response = await loginUseCase.execute(credentials);
    console.log('AuthContext: Login successful, user =', response.user);
    setUser(response.user);
    return response.user;
  } catch (error) {
    console.error('AuthContext: Login failed with error', error);
    throw error;
  }
};

  const logout = (): void => {
    logoutUseCase.execute();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
