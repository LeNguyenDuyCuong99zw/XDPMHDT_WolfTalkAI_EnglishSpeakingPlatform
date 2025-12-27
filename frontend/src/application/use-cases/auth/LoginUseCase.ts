import { IHttpClient } from '../../ports/IHttpClient';
import { LoginDTO, LoginResponseDTO } from '../../dto/LoginDTO';
import { storageService } from '../../../infrastructure/services/StorageService';
import { UserDTO } from '../../dto/UserDTO';

const USE_MOCK_AUTH = true;

export class LoginUseCase {
  constructor(private httpClient: IHttpClient) {}

  async execute(credentials: LoginDTO): Promise<LoginResponseDTO> {
    this.validateCredentials(credentials);

    if (USE_MOCK_AUTH) {
      if (
        credentials.email === 'admin@aesp.com' &&
        credentials.password === '123456'
      ) {
        const mockUser: UserDTO = {
          id: '1',
          email: 'admin@aesp.com',
          fullName: 'Admin User',
          role: 'Admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockResponse: LoginResponseDTO = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: mockUser,
        };

        storageService.setAccessToken(mockResponse.accessToken);
        storageService.setRefreshToken(mockResponse.refreshToken);
        storageService.setUser(mockResponse.user);
        console.log('ADMIN LOGIN - User saved: ', mockResponse.user);

        return mockResponse;
      } else if (
        credentials.email === 'mentor@aesp.com' &&
        credentials.password === '123456'
      ) {
        const mockUser: UserDTO = {
          id: '2',
          email: 'mentor@aesp.com',
          fullName: 'Mentor User',
          role: 'Mentor',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockResponse: LoginResponseDTO = {
          accessToken: 'mock-access-token-mentor',
          refreshToken: 'mock-refresh-token-mentor',
          user: mockUser,
        };

        storageService.setAccessToken(mockResponse.accessToken);
        storageService.setRefreshToken(mockResponse.refreshToken);
        storageService.setUser(mockResponse.user);
        console.log('MENTOR LOGIN - User saved: ', mockResponse.user);
        return mockResponse;
      }

      throw new Error('Invalid email or password');
    }

    const response = await this.httpClient.post<LoginResponseDTO>(
      '/auth/login',
      credentials
    );

    storageService.setAccessToken(response.accessToken);
    storageService.setRefreshToken(response.refreshToken);
    storageService.setUser(response.user);

    return response;
  }

  private validateCredentials(credentials: LoginDTO): void {
    if (!credentials.email || !this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }

    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
