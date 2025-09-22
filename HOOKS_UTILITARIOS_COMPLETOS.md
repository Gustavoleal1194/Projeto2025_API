# 🪝 HOOKS E UTILITÁRIOS COMPLETOS - YETI LIBRARY SYSTEM

## 🎯 **HOOKS PERSONALIZADOS**

### **1. useAuth Hook**
```typescript
import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/AuthService';
import { LoginFormData, UsuarioResponse } from '@/types/auth';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();

  const signIn = useCallback(async (data: LoginFormData) => {
    try {
      const tokenData = await AuthService.login(data);
      const userData = await AuthService.getCurrentUser();
      login(tokenData, userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    }
  }, [login]);

  const signOut = useCallback(() => {
    logout();
  }, [logout]);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      updateUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return { success: false, error: error.message };
    }
  }, [updateUser]);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    
    const permissions = {
      'Usuario': ['view_books', 'borrow_books'],
      'Funcionario': ['view_books', 'borrow_books', 'manage_books', 'manage_users', 'view_reports'],
      'Admin': ['view_books', 'borrow_books', 'manage_books', 'manage_users', 'manage_employees', 'view_reports', 'manage_system']
    };
    
    return permissions[user.role]?.includes(permission) || false;
  }, [user]);

  return {
    user,
    token,
    isAuthenticated,
    signIn,
    signOut,
    refreshUser,
    hasPermission
  };
};
```

### **2. useApi Hook**
```typescript
import { useState, useCallback } from 'react';
import api from '@/services/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options?: UseApiOptions
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiCall();
      options?.onSuccess?.(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido';
      setError(errorMessage);
      options?.onError?.(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async <T>(url: string, options?: UseApiOptions) => {
    return request<T>(() => api.get(url).then(res => res.data), options);
  }, [request]);

  const post = useCallback(async <T>(url: string, data: any, options?: UseApiOptions) => {
    return request<T>(() => api.post(url, data).then(res => res.data), options);
  }, [request]);

  const put = useCallback(async <T>(url: string, data: any, options?: UseApiOptions) => {
    return request<T>(() => api.put(url, data).then(res => res.data), options);
  }, [request]);

  const del = useCallback(async <T>(url: string, options?: UseApiOptions) => {
    return request<T>(() => api.delete(url).then(res => res.data), options);
  }, [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del
  };
};
```

### **3. useLocalStorage Hook**
```typescript
import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao remover localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};
```

### **4. useDebounce Hook**
```typescript
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### **5. useNotification Hook**
```typescript
import { useCallback } from 'react';
import { NotificationService } from '@/services/NotificationService';

export const useNotification = () => {
  const showSuccess = useCallback((message: string) => {
    NotificationService.success('Sucesso', message);
  }, []);

  const showError = useCallback((message: string) => {
    NotificationService.error('Erro', message);
  }, []);

  const showWarning = useCallback((message: string) => {
    NotificationService.warning('Atenção', message);
  }, []);

  const showInfo = useCallback((message: string) => {
    NotificationService.info('Informação', message);
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
```

### **6. useFavorites Hook**
```typescript
import { useState, useEffect, useCallback } from 'react';
import { FavoritosService } from '@/services/FavoritosService';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setFavorites(FavoritosService.getFavoritos());
  }, []);

  const addFavorite = useCallback((livroId: number) => {
    FavoritosService.adicionarFavorito(livroId);
    setFavorites(prev => [...prev, livroId]);
  }, []);

  const removeFavorite = useCallback((livroId: number) => {
    FavoritosService.removerFavorito(livroId);
    setFavorites(prev => prev.filter(id => id !== livroId));
  }, []);

  const toggleFavorite = useCallback((livroId: number) => {
    const isFavorite = favorites.includes(livroId);
    if (isFavorite) {
      removeFavorite(livroId);
    } else {
      addFavorite(livroId);
    }
    return !isFavorite;
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((livroId: number) => {
    return favorites.includes(livroId);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
};
```

---

## 🛠️ **UTILITÁRIOS COMPLETOS**

### **1. Formatters**
```typescript
// src/utils/formatters.ts
export const formatters = {
  // Formatação de data
  formatDate: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  },

  formatDateTime: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleString('pt-BR');
  },

  formatDateRelative: (date: string | Date): string => {
    const d = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
    return `${Math.floor(diffInDays / 30)} meses atrás`;
  },

  // Formatação de texto
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  truncate: (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  },

  // Formatação de números
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  formatNumber: (value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value);
  },

  // Formatação de CPF/CNPJ
  formatCPF: (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  formatCNPJ: (cnpj: string): string => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  },

  // Formatação de telefone
  formatPhone: (phone: string): string => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  },

  // Formatação de status
  formatStatus: (status: string): string => {
    const statusMap: Record<string, string> = {
      'disponivel': 'Disponível',
      'emprestado': 'Emprestado',
      'reservado': 'Reservado',
      'indisponivel': 'Indisponível',
      'ativo': 'Ativo',
      'inativo': 'Inativo'
    };
    return statusMap[status.toLowerCase()] || status;
  }
};
```

### **2. Validators**
```typescript
// src/utils/validators.ts
export const validators = {
  // Validação de email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validação de CPF
  isValidCPF: (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

    return true;
  },

  // Validação de CNPJ
  isValidCNPJ: (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

    let sum = 0;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false;

    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false;

    return true;
  },

  // Validação de senha
  isValidPassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos 1 letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos 1 letra minúscula');
    }
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos 1 número');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Validação de telefone
  isValidPhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11 && /^\d{11}$/.test(cleanPhone);
  }
};
```

### **3. Constants**
```typescript
// src/utils/constants.ts
export const constants = {
  // API
  API_TIMEOUT: 10000,
  API_RETRY_ATTEMPTS: 3,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Search
  SEARCH_DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  
  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Empréstimos
  DEFAULT_LOAN_DAYS: 14,
  MAX_RENEWALS: 3,
  FINE_PER_DAY: 1.0,
  
  // Roles
  ROLES: {
    USUARIO: 'Usuario',
    FUNCIONARIO: 'Funcionario',
    ADMIN: 'Admin'
  } as const,
  
  // Permissions
  PERMISSIONS: {
    VIEW_BOOKS: 'view_books',
    BORROW_BOOKS: 'borrow_books',
    MANAGE_BOOKS: 'manage_books',
    MANAGE_USERS: 'manage_users',
    MANAGE_EMPLOYEES: 'manage_employees',
    VIEW_REPORTS: 'view_reports',
    MANAGE_SYSTEM: 'manage_system'
  } as const,
  
  // Status
  BOOK_STATUS: {
    DISPONIVEL: 'disponivel',
    EMPRESTADO: 'emprestado',
    RESERVADO: 'reservado',
    INDISPONIVEL: 'indisponivel'
  } as const,
  
  LOAN_STATUS: {
    EMPRESTADO: 'emprestado',
    DEVOLVIDO: 'devolvido',
    ATRASADO: 'atrasado',
    RENOVADO: 'renovado'
  } as const,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    FAVORITES: 'favorites',
    THEME: 'theme',
    LANGUAGE: 'language'
  } as const,
  
  // Routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    BIBLIOTECA: '/biblioteca',
    PERFIL: '/perfil',
    EMPRESTIMOS: '/emprestimos',
    FAVORITOS: '/favoritos',
    ADMIN: '/admin'
  } as const
};
```

### **4. Helpers**
```typescript
// src/utils/helpers.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para clipboard:', error);
    return false;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Erro desconhecido';
};
```

---

## 🎯 **RESUMO DOS HOOKS E UTILITÁRIOS**

### **✅ Hooks Criados:**
- ✅ **useAuth** - Autenticação completa
- ✅ **useApi** - Requisições HTTP
- ✅ **useLocalStorage** - Persistência local
- ✅ **useDebounce** - Debounce para busca
- ✅ **useNotification** - Sistema de notificações
- ✅ **useFavorites** - Gerenciamento de favoritos

### **✅ Utilitários Criados:**
- ✅ **formatters** - Formatação de dados
- ✅ **validators** - Validações de formulário
- ✅ **constants** - Constantes da aplicação
- ✅ **helpers** - Funções auxiliares

**Agora os hooks e utilitários estão 100% completos!** 🚀
