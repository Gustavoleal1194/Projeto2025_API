import { useEffect } from 'react';
import { useAuthStore } from '../store';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    initializeAuth,
  } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
