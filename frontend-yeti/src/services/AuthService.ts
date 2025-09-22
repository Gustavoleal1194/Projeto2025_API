import { apiClient } from './api/client';
import type { LoginRequest, RegisterRequest, User } from '../types';

export class AuthService {
    static async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
        try {
            const response = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);

            if (!response.success) {
                throw new Error(response.message || 'Erro ao fazer login');
            }

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao conectar com o servidor');
        }
    }

    static async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
        try {
            const response = await apiClient.post<{ user: User; token: string }>('/auth/register', userData);

            if (!response.success) {
                throw new Error(response.message || 'Erro ao criar conta');
            }

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao conectar com o servidor');
        }
    }

    static async refreshToken(): Promise<string> {
        try {
            const refreshToken = localStorage.getItem('yeti_refresh_token');
            if (!refreshToken) {
                throw new Error('Refresh token não encontrado');
            }

            const response = await apiClient.post<{ token: string }>('/auth/refresh', {
                refreshToken
            });

            if (!response.success) {
                throw new Error(response.message || 'Erro ao renovar token');
            }

            return response.data.token;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao renovar token');
        }
    }

    static async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Ignore logout errors
        } finally {
            localStorage.removeItem('yeti_token');
            localStorage.removeItem('yeti_refresh_token');
            localStorage.removeItem('yeti_user');
        }
    }

    static getStoredUser(): User | null {
        try {
            const userStr = localStorage.getItem('yeti_user');
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    }

    static getStoredToken(): string | null {
        return localStorage.getItem('yeti_token');
    }

    static storeAuthData(user: User, token: string): void {
        localStorage.setItem('yeti_user', JSON.stringify(user));
        localStorage.setItem('yeti_token', token);
    }
}
