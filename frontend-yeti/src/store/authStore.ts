import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../types';
import { AuthService } from '../services';

interface AuthStore extends AuthState {
  login: (email: string, senha: string, tipoUsuario: 'Usuario' | 'Funcionario') => Promise<void>;
  register: (nome: string, email: string, senha: string, confirmarSenha: string, tipoUsuario: 'Usuario' | 'Funcionario') => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, senha: string, tipoUsuario: 'Usuario' | 'Funcionario') => {
        set({ isLoading: true, error: null });

        try {
          const { user, token } = await AuthService.login({ email, senha, tipoUsuario });

          AuthService.storeAuthData(user, token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Erro ao fazer login',
          });
          throw error;
        }
      },

      register: async (nome: string, email: string, senha: string, confirmarSenha: string, tipoUsuario: 'Usuario' | 'Funcionario') => {
        set({ isLoading: true, error: null });

        try {
          const { user, token } = await AuthService.register({ nome, email, senha, confirmarSenha, tipoUsuario });

          AuthService.storeAuthData(user, token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Erro ao criar conta',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await AuthService.logout();
        } catch (error) {
          // Ignore logout errors
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: () => {
        const user = AuthService.getStoredUser();
        const token = AuthService.getStoredToken();

        if (user && token) {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      },
    }),
    {
      name: 'yeti-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
