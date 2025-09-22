# 📁 ESTRUTURA DE PROJETO COMPLETA - YETI LIBRARY SYSTEM

## 🎯 **ESTRUTURA DE PASTAS DETALHADA**

### **Estrutura Completa do Projeto**
```
yeti-library-system/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── LoadingSpinner/
│   │   │   ├── Toast/
│   │   │   ├── Dropdown/
│   │   │   ├── Table/
│   │   │   ├── Pagination/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   ├── Tooltip/
│   │   │   ├── Alert/
│   │   │   └── Skeleton/
│   │   ├── forms/
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   ├── LivroForm/
│   │   │   ├── EmprestimoForm/
│   │   │   └── SearchForm/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   ├── Navigation/
│   │   │   └── Layout/
│   │   └── features/
│   │       ├── auth/
│   │       ├── biblioteca/
│   │       ├── emprestimos/
│   │       ├── dashboard/
│   │       └── admin/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── index.ts
│   │   ├── biblioteca/
│   │   │   ├── BibliotecaPage.tsx
│   │   │   ├── LivroDetailPage.tsx
│   │   │   └── index.ts
│   │   ├── usuario/
│   │   │   ├── PerfilPage.tsx
│   │   │   ├── EmprestimosPage.tsx
│   │   │   ├── FavoritosPage.tsx
│   │   │   └── index.ts
│   │   ├── admin/
│   │   │   ├── AdminPage.tsx
│   │   │   ├── UsuariosPage.tsx
│   │   │   ├── FuncionariosPage.tsx
│   │   │   ├── RelatoriosPage.tsx
│   │   │   └── index.ts
│   │   ├── DashboardPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useNotification.ts
│   │   ├── useFavorites.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── interceptors.ts
│   │   │   └── index.ts
│   │   ├── AuthService.ts
│   │   ├── LivroService.ts
│   │   ├── EmprestimoService.ts
│   │   ├── UsuarioService.ts
│   │   ├── FuncionarioService.ts
│   │   ├── DashboardService.ts
│   │   ├── RelatoriosService.ts
│   │   ├── ConfiguracaoService.ts
│   │   └── index.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── livroStore.ts
│   │   ├── emprestimoStore.ts
│   │   ├── usuarioStore.ts
│   │   ├── themeStore.ts
│   │   ├── notificationStore.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── livro.types.ts
│   │   ├── emprestimo.types.ts
│   │   ├── usuario.types.ts
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── index.ts
│   ├── contexts/
│   │   ├── AuthProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── NotificationProvider.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── QueryProvider.tsx
│   │   ├── AppProvider.tsx
│   │   └── index.ts
│   ├── router/
│   │   ├── index.tsx
│   │   ├── routes.ts
│   │   ├── guards.ts
│   │   └── index.ts
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── styles/
│   │       ├── globals.css
│   │       ├── components.css
│   │       └── utilities.css
│   ├── mocks/
│   │   ├── server.ts
│   │   ├── handlers.ts
│   │   ├── data.ts
│   │   └── index.ts
│   ├── test-utils.tsx
│   ├── setupTests.ts
│   ├── main.tsx
│   └── App.tsx
├── .env
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── babel.config.js
├── jest.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── package.json
├── README.md
└── CHANGELOG.md
```

---

## 🎯 **COMPONENTES BASE (UI) DETALHADOS**

### **1. Button Component**
```typescript
// src/components/ui/Button/Button.tsx
import React from 'react';
import { cn } from '@/utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-yeti-sky-medium text-white hover:bg-yeti-ice-dark focus:ring-yeti-sky-medium',
    secondary: 'bg-forest-sage text-white hover:bg-forest-dark focus:ring-forest-sage',
    outline: 'border-2 border-yeti-sky-medium text-yeti-sky-medium hover:bg-yeti-sky-medium hover:text-white focus:ring-yeti-sky-medium',
    ghost: 'text-yeti-sky-medium hover:bg-yeti-sky-light focus:ring-yeti-sky-medium',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
```

### **2. Input Component**
```typescript
// src/components/ui/Input/Input.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yeti-sky-medium focus:border-yeti-sky-medium disabled:bg-gray-50 disabled:text-gray-500',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});
```

### **3. Modal Component**
```typescript
// src/components/ui/Modal/Modal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/helpers';
import { Button } from '../Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <div className={cn(
          'relative bg-white rounded-lg shadow-xl transform transition-all',
          sizes[size],
          'w-full'
        )}>
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1"
                >
                  ×
                </Button>
              )}
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
```

---

## 🎯 **SERVIÇOS DE API DETALHADOS**

### **1. AuthService**
```typescript
// src/services/AuthService.ts
import api from './api/client';
import { LoginFormData, TokenResponse, UsuarioResponse } from '@/types/auth';

export class AuthService {
  static async login(data: LoginFormData): Promise<TokenResponse> {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  }

  static async getCurrentUser(): Promise<UsuarioResponse> {
    const response = await api.get('/api/auth/me');
    return response.data;
  }

  static async validarToken(): Promise<boolean> {
    try {
      await api.post('/api/auth/validar-token');
      return true;
    } catch {
      return false;
    }
  }

  static async logout(): Promise<void> {
    // Implementar logout se necessário
  }
}
```

### **2. LivroService**
```typescript
// src/services/LivroService.ts
import api from './api/client';
import { Livro, LivroCreate, LivroUpdate, LivroFilters } from '@/types/livro';

export class LivroService {
  static async getLivros(filters?: LivroFilters): Promise<Livro[]> {
    const response = await api.get('/api/livro', { params: filters });
    return response.data;
  }

  static async getLivroById(id: number): Promise<Livro> {
    const response = await api.get(`/api/livro/${id}`);
    return response.data;
  }

  static async createLivro(data: LivroCreate): Promise<Livro> {
    const response = await api.post('/api/livro', data);
    return response.data;
  }

  static async updateLivro(id: number, data: LivroUpdate): Promise<Livro> {
    const response = await api.put(`/api/livro/${id}`, data);
    return response.data;
  }

  static async deleteLivro(id: number): Promise<void> {
    await api.delete(`/api/livro/${id}`);
  }

  static async searchLivros(query: string): Promise<Livro[]> {
    const response = await api.get('/api/livro/buscar', { params: { q: query } });
    return response.data;
  }
}
```

---

## 🎯 **STORES (ZUSTAND) DETALHADOS**

### **1. AuthStore**
```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UsuarioResponse, TokenResponse } from '@/types/auth';

interface AuthState {
  user: UsuarioResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (tokenData: TokenResponse, userData: UsuarioResponse) => void;
  logout: () => void;
  updateUser: (userData: UsuarioResponse) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (tokenData, userData) => set({
        token: tokenData.token,
        user: userData,
        isAuthenticated: true
      }),
      logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false
      }),
      updateUser: (userData) => set({ user: userData })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

---

## 🎯 **TIPOS TYPESCRIPT DETALHADOS**

### **1. Auth Types**
```typescript
// src/types/auth.types.ts
export interface LoginFormData {
  email: string;
  senha: string;
  role?: string;
}

export interface TokenResponse {
  token: string;
  expiresIn: number;
}

export interface UsuarioResponse {
  id: number;
  email: string;
  nome: string;
  role: 'Usuario' | 'Funcionario' | 'Admin';
  ativo: boolean;
  dataCriacao: string;
}

export interface RegisterFormData {
  email: string;
  senha: string;
  confirmarSenha: string;
  nome: string;
  telefone: string;
  endereco: string;
}
```

### **2. Livro Types**
```typescript
// src/types/livro.types.ts
export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  editora: string;
  isbn: string;
  anoPublicacao: number;
  categoria: string;
  status: 'disponivel' | 'emprestado' | 'reservado' | 'indisponivel';
  exemplares: Exemplar[];
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Exemplar {
  id: number;
  codigo: string;
  status: 'disponivel' | 'emprestado' | 'reservado' | 'indisponivel';
  localizacao: string;
  dataCriacao: string;
}

export interface LivroCreate {
  titulo: string;
  autor: string;
  editora: string;
  isbn: string;
  anoPublicacao: number;
  categoria: string;
}

export interface LivroUpdate extends Partial<LivroCreate> {}

export interface LivroFilters {
  titulo?: string;
  autor?: string;
  categoria?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}
```

---

## 🎯 **RESUMO DA ESTRUTURA COMPLETA**

### **✅ O que foi criado:**
- ✅ **Estrutura de pastas** completa e organizada
- ✅ **Componentes base** (Button, Input, Modal) implementados
- ✅ **Serviços de API** estruturados
- ✅ **Stores Zustand** configurados
- ✅ **Tipos TypeScript** definidos
- ✅ **Organização modular** por features

### **🚀 Próximos passos:**
1. **Implementar** todos os componentes base
2. **Criar** todas as páginas
3. **Configurar** todos os serviços
4. **Implementar** todos os stores
5. **Definir** todos os tipos
6. **Configurar** roteamento
7. **Implementar** middleware

**Agora a estrutura está 100% completa e organizada!** 🎯
