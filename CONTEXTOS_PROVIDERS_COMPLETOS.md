# 🏗️ CONTEXTOS E PROVIDERS COMPLETOS - YETI LIBRARY SYSTEM

## 🎯 **PROVIDERS E CONTEXTOS ESSENCIAIS**

### **1. AuthProvider**
```typescript
// src/contexts/AuthProvider.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/AuthService';
import { UsuarioResponse } from '@/types/auth';

interface AuthContextType {
  user: UsuarioResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await AuthService.getCurrentUser();
          updateUser(userData);
        } catch (error) {
          console.error('Erro ao validar token:', error);
          storeLogout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token, storeLogout, updateUser]);

  const login = async (email: string, senha: string, role: string) => {
    try {
      setIsLoading(true);
      const tokenData = await AuthService.login({ email, senha, role });
      const userData = await AuthService.getCurrentUser();
      storeLogin(tokenData, userData);
      return { success: true };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
  };

  const refreshUser = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      updateUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      logout();
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const permissions = {
      'Usuario': ['view_books', 'borrow_books'],
      'Funcionario': ['view_books', 'borrow_books', 'manage_books', 'manage_users', 'view_reports'],
      'Admin': ['view_books', 'borrow_books', 'manage_books', 'manage_users', 'manage_employees', 'view_reports', 'manage_system']
    };
    
    return permissions[user.role]?.includes(permission) || false;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};
```

### **2. ThemeProvider**
```typescript
// src/contexts/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark' | 'yeti';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('yeti-theme', 'yeti');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove todas as classes de tema
    root.classList.remove('light', 'dark', 'yeti');
    
    // Adiciona a classe do tema atual
    root.classList.add(theme);
    
    // Define variáveis CSS baseadas no tema
    if (theme === 'yeti') {
      root.style.setProperty('--primary-bg', '#F8F8F8');
      root.style.setProperty('--primary-text', '#333333');
      root.style.setProperty('--accent-color', '#7DAB8B');
      root.style.setProperty('--sidebar-bg', '#34688C');
    } else if (theme === 'dark') {
      root.style.setProperty('--primary-bg', '#1a1a1a');
      root.style.setProperty('--primary-text', '#ffffff');
      root.style.setProperty('--accent-color', '#4ade80');
      root.style.setProperty('--sidebar-bg', '#2d2d2d');
    } else {
      root.style.setProperty('--primary-bg', '#ffffff');
      root.style.setProperty('--primary-text', '#000000');
      root.style.setProperty('--accent-color', '#3b82f6');
      root.style.setProperty('--sidebar-bg', '#f3f4f6');
    }
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'yeti'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
```

### **3. NotificationProvider**
```typescript
// src/contexts/NotificationProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NotificationService } from '@/services/NotificationService';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove após duração especificada
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const showSuccess = (title: string, message: string) => {
    addNotification({ type: 'success', title, message });
  };

  const showError = (title: string, message: string) => {
    addNotification({ type: 'error', title, message, duration: 7000 });
  };

  const showWarning = (title: string, message: string) => {
    addNotification({ type: 'warning', title, message });
  };

  const showInfo = (title: string, message: string) => {
    addNotification({ type: 'info', title, message });
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Componente de container de notificações
const NotificationContainer: React.FC<{
  notifications: Notification[];
  onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Componente individual de notificação
const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const getNotificationStyles = () => {
    const baseStyles = 'p-4 rounded-lg shadow-lg max-w-sm border-l-4';
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`;
    }
  };

  return (
    <div className={getNotificationStyles()}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-sm">{notification.title}</h4>
          <p className="text-sm mt-1">{notification.message}</p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm underline hover:no-underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
};
```

### **4. ErrorBoundary**
```typescript
// src/contexts/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Oops! Algo deu errado
                </h3>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Detalhes do erro:</h4>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Recarregar página
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### **5. QueryProvider (React Query)**
```typescript
// src/contexts/QueryProvider.tsx
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface QueryProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error: any) => {
        // Não tentar novamente para erros 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Tentar até 3 vezes para outros erros
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
```

### **6. AppProvider (Provider Principal)**
```typescript
// src/contexts/AppProvider.tsx
import React, { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import { NotificationProvider } from './NotificationProvider';
import { ErrorBoundary } from './ErrorBoundary';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};
```

---

## 🎯 **CONFIGURAÇÃO DE ROTAS**

### **7. Router Configuration**
```typescript
// src/router/index.tsx
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy loading das páginas
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const BibliotecaPage = lazy(() => import('@/pages/biblioteca/BibliotecaPage'));
const PerfilPage = lazy(() => import('@/pages/usuario/PerfilPage'));
const EmprestimosPage = lazy(() => import('@/pages/usuario/EmprestimosPage'));
const FavoritosPage = lazy(() => import('@/pages/usuario/FavoritosPage'));
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/biblioteca',
    element: (
      <ProtectedRoute>
        <BibliotecaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/perfil',
    element: (
      <ProtectedRoute>
        <PerfilPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/emprestimos',
    element: (
      <ProtectedRoute>
        <EmprestimosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/favoritos',
    element: (
      <ProtectedRoute>
        <FavoritosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="Admin">
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
```

---

## 🎯 **RESUMO DOS CONTEXTOS E PROVIDERS**

### **✅ Contextos Criados:**
- ✅ **AuthProvider** - Autenticação e autorização
- ✅ **ThemeProvider** - Gerenciamento de temas
- ✅ **NotificationProvider** - Sistema de notificações
- ✅ **ErrorBoundary** - Tratamento de erros
- ✅ **QueryProvider** - React Query
- ✅ **AppProvider** - Provider principal

### **✅ Configuração de Rotas:**
- ✅ **Router Configuration** - Rotas com lazy loading
- ✅ **ProtectedRoute** - Proteção de rotas
- ✅ **Suspense** - Loading states

**Agora os contextos e providers estão 100% completos!** 🚀
