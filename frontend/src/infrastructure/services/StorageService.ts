// Removed import of missing file
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

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

class StorageService {
    getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    setAccessToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    removeAccessToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    }

    getUser(): UserDTO | null {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user from storage', e);
            return null;
        }
    }

    setUser(user: UserDTO): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    removeUser(): void {
        localStorage.removeItem(USER_KEY);
    }

    clear(): void {
        localStorage.clear();
    }
}

export const storageService = new StorageService();
