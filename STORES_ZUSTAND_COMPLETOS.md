# 🏪 STORES ZUSTAND COMPLETOS - YETI LIBRARY SYSTEM

## 🎯 **CONFIGURAÇÃO BASE DO ZUSTAND**

### **1. Store Base**
```typescript
// src/store/baseStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface BaseState {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const createBaseStore = <T extends BaseState>(
  name: string,
  initialState: Omit<T, keyof BaseState>
) => {
  return create<T>()(
    devtools(
      (set, get) => ({
        loading: false,
        error: null,
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        ...initialState,
      }),
      { name }
    )
  );
};
```

---

## 🔐 **STORE DE AUTENTICAÇÃO**

### **2. AuthStore Completo**
```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { UsuarioResponse, TokenResponse } from '@/types/auth';

interface AuthState {
  user: UsuarioResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (tokenData: TokenResponse, userData: UsuarioResponse) => void;
  logout: () => void;
  updateUser: (userData: UsuarioResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        
        login: (tokenData, userData) => set({
          token: tokenData.token,
          user: userData,
          isAuthenticated: true,
          error: null
        }),
        
        logout: () => set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null
        }),
        
        updateUser: (userData) => set({ user: userData }),
        
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null })
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    { name: 'auth-store' }
  )
);
```

---

## 📚 **STORE DE LIVROS**

### **3. LivroStore Completo**
```typescript
// src/store/livroStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Livro, LivroFilters, Exemplar } from '@/types/livro';
import { LivroService } from '@/services/LivroService';

interface LivroState {
  livros: Livro[];
  livroSelecionado: Livro | null;
  exemplares: Exemplar[];
  filtros: LivroFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  
  // Actions
  setLivros: (livros: Livro[]) => void;
  setLivroSelecionado: (livro: Livro | null) => void;
  setExemplares: (exemplares: Exemplar[]) => void;
  setFiltros: (filtros: LivroFilters) => void;
  setPagination: (pagination: Partial<LivroState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Async actions
  fetchLivros: () => Promise<void>;
  fetchLivroById: (id: number) => Promise<void>;
  createLivro: (data: any) => Promise<void>;
  updateLivro: (id: number, data: any) => Promise<void>;
  deleteLivro: (id: number) => Promise<void>;
  searchLivros: (query: string) => Promise<void>;
  fetchExemplares: (livroId: number) => Promise<void>;
}

export const useLivroStore = create<LivroState>()(
  devtools(
    (set, get) => ({
      livros: [],
      livroSelecionado: null,
      exemplares: [],
      filtros: {},
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      },
      loading: false,
      error: null,
      
      setLivros: (livros) => set({ livros }),
      setLivroSelecionado: (livro) => set({ livroSelecionado: livro }),
      setExemplares: (exemplares) => set({ exemplares }),
      setFiltros: (filtros) => set({ filtros }),
      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
      })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      fetchLivros: async () => {
        const { filtros, pagination } = get();
        set({ loading: true, error: null });
        
        try {
          const response = await LivroService.getLivros({
            ...filtros,
            page: pagination.page,
            pageSize: pagination.pageSize
          });
          
          set({ livros: response, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchLivroById: async (id) => {
        set({ loading: true, error: null });
        
        try {
          const livro = await LivroService.getLivroById(id);
          set({ livroSelecionado: livro, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      createLivro: async (data) => {
        set({ loading: true, error: null });
        
        try {
          await LivroService.createLivro(data);
          await get().fetchLivros();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      updateLivro: async (id, data) => {
        set({ loading: true, error: null });
        
        try {
          await LivroService.updateLivro(id, data);
          await get().fetchLivros();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      deleteLivro: async (id) => {
        set({ loading: true, error: null });
        
        try {
          await LivroService.deleteLivro(id);
          await get().fetchLivros();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      searchLivros: async (query) => {
        set({ loading: true, error: null });
        
        try {
          const livros = await LivroService.searchLivros(query);
          set({ livros, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchExemplares: async (livroId) => {
        set({ loading: true, error: null });
        
        try {
          const exemplares = await LivroService.getExemplares(livroId);
          set({ exemplares, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      }
    }),
    { name: 'livro-store' }
  )
);
```

---

## 📖 **STORE DE EMPRÉSTIMOS**

### **4. EmprestimoStore Completo**
```typescript
// src/store/emprestimoStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Emprestimo, EmprestimoFilters } from '@/types/emprestimo';
import { EmprestimoService } from '@/services/EmprestimoService';

interface EmprestimoState {
  emprestimos: Emprestimo[];
  emprestimoSelecionado: Emprestimo | null;
  emprestimosAtivos: Emprestimo[];
  emprestimosAtrasados: Emprestimo[];
  filtros: EmprestimoFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  
  // Actions
  setEmprestimos: (emprestimos: Emprestimo[]) => void;
  setEmprestimoSelecionado: (emprestimo: Emprestimo | null) => void;
  setEmprestimosAtivos: (emprestimos: Emprestimo[]) => void;
  setEmprestimosAtrasados: (emprestimos: Emprestimo[]) => void;
  setFiltros: (filtros: EmprestimoFilters) => void;
  setPagination: (pagination: Partial<EmprestimoState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Async actions
  fetchEmprestimos: () => Promise<void>;
  fetchEmprestimoById: (id: number) => Promise<void>;
  createEmprestimo: (data: any) => Promise<void>;
  updateEmprestimo: (id: number, data: any) => Promise<void>;
  deleteEmprestimo: (id: number) => Promise<void>;
  devolverLivro: (id: number) => Promise<void>;
  renovarEmprestimo: (id: number) => Promise<void>;
  fetchEmprestimosAtivos: () => Promise<void>;
  fetchEmprestimosAtrasados: () => Promise<void>;
  calcularMulta: (id: number) => Promise<{ multa: number; diasAtraso: number }>;
  pagarMulta: (id: number, valor: number) => Promise<void>;
}

export const useEmprestimoStore = create<EmprestimoState>()(
  devtools(
    (set, get) => ({
      emprestimos: [],
      emprestimoSelecionado: null,
      emprestimosAtivos: [],
      emprestimosAtrasados: [],
      filtros: {},
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      },
      loading: false,
      error: null,
      
      setEmprestimos: (emprestimos) => set({ emprestimos }),
      setEmprestimoSelecionado: (emprestimo) => set({ emprestimoSelecionado: emprestimo }),
      setEmprestimosAtivos: (emprestimos) => set({ emprestimosAtivos: emprestimos }),
      setEmprestimosAtrasados: (emprestimos) => set({ emprestimosAtrasados: emprestimos }),
      setFiltros: (filtros) => set({ filtros }),
      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
      })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      fetchEmprestimos: async () => {
        const { filtros, pagination } = get();
        set({ loading: true, error: null });
        
        try {
          const response = await EmprestimoService.getEmprestimos({
            ...filtros,
            page: pagination.page,
            pageSize: pagination.pageSize
          });
          
          set({ emprestimos: response, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchEmprestimoById: async (id) => {
        set({ loading: true, error: null });
        
        try {
          const emprestimo = await EmprestimoService.getEmprestimoById(id);
          set({ emprestimoSelecionado: emprestimo, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      createEmprestimo: async (data) => {
        set({ loading: true, error: null });
        
        try {
          await EmprestimoService.createEmprestimo(data);
          await get().fetchEmprestimos();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      updateEmprestimo: async (id, data) => {
        set({ loading: true, error: null });
        
        try {
          await EmprestimoService.updateEmprestimo(id, data);
          await get().fetchEmprestimos();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      deleteEmprestimo: async (id) => {
        set({ loading: true, error: null });
        
        try {
          await EmprestimoService.deleteEmprestimo(id);
          await get().fetchEmprestimos();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      devolverLivro: async (id) => {
        set({ loading: true, error: null });
        
        try {
          await EmprestimoService.devolverLivro(id);
          await get().fetchEmprestimos();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      renovarEmprestimo: async (id) => {
        set({ loading: true, error: null });
        
        try {
          await EmprestimoService.renovarEmprestimo(id);
          await get().fetchEmprestimos();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchEmprestimosAtivos: async () => {
        set({ loading: true, error: null });
        
        try {
          const emprestimos = await EmprestimoService.getEmprestimosAtivos();
          set({ emprestimosAtivos: emprestimos, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchEmprestimosAtrasados: async () => {
        set({ loading: true, error: null });
        
        try {
          const emprestimos = await EmprestimoService.getEmprestimosAtrasados();
          set({ emprestimosAtrasados: emprestimos, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      calcularMulta: async (id) => {
        set({ loading: true, error: null });
        
        try {
          const result = await EmprestimoService.calcularMulta(id);
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      pagarMulta: async (id, valor) => {
        set({ loading: true, error: null });
        
        try {
          await EmprestimoService.pagarMulta(id, valor);
          await get().fetchEmprestimos();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      }
    }),
    { name: 'emprestimo-store' }
  )
);
```

---

## 👥 **STORE DE USUÁRIOS**

### **5. UsuarioStore Completo**
```typescript
// src/store/usuarioStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Usuario, UsuarioFilters } from '@/types/usuario';
import { UsuarioService } from '@/services/UsuarioService';

interface UsuarioState {
  usuarios: Usuario[];
  usuarioSelecionado: Usuario | null;
  filtros: UsuarioFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  
  // Actions
  setUsuarios: (usuarios: Usuario[]) => void;
  setUsuarioSelecionado: (usuario: Usuario | null) => void;
  setFiltros: (filtros: UsuarioFilters) => void;
  setPagination: (pagination: Partial<UsuarioState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Async actions
  fetchUsuarios: () => Promise<void>;
  fetchUsuarioById: (id: number) => Promise<void>;
  createUsuario: (data: any) => Promise<void>;
  updateUsuario: (id: number, data: any) => Promise<void>;
  deleteUsuario: (id: number) => Promise<void>;
  ativarUsuario: (id: number) => Promise<void>;
  desativarUsuario: (id: number) => Promise<void>;
}

export const useUsuarioStore = create<UsuarioState>()(
  devtools(
    (set, get) => ({
      usuarios: [],
      usuarioSelecionado: null,
      filtros: {},
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      },
      loading: false,
      error: null,
      
      setUsuarios: (usuarios) => set({ usuarios }),
      setUsuarioSelecionado: (usuario) => set({ usuarioSelecionado: usuario }),
      setFiltros: (filtros) => set({ filtros }),
      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
      })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      fetchUsuarios: async () => {
        const { filtros, pagination } = get();
        set({ loading: true, error: null });
        
        try {
          const response = await UsuarioService.getUsuarios({
            ...filtros,
            page: pagination.page,
            pageSize: pagination.pageSize
          });
          
          set({ usuarios: response, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchUsuarioById: async (id) => {
        set({ loading: true, error: null });
        
        try {
          const usuario = await UsuarioService.getUsuarioById(id);
          set({ usuarioSelecionado: usuario, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      createUsuario: async (data) => {
        set({ loading: true, error: null });
        
        try {
          await UsuarioService.createUsuario(data);
          await get().fetchUsuarios();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      updateUsuario: async (id, data) => {
        set({ loading: true, error: null });
        
        try {
          await UsuarioService.updateUsuario(id, data);
          await get().fetchUsuarios();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      deleteUsuario: async (id) => {
        set({ loading: true, error: null });
        
        try {
          await UsuarioService.deleteUsuario(id);
          await get().fetchUsuarios();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      ativarUsuario: async (id) => {
        set({ loading: true, error: null });
        
        try {
          await UsuarioService.ativarUsuario(id);
          await get().fetchUsuarios();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      desativarUsuario: async (id) => {
        set({ loading: true, error: null });
        
        try {
          await UsuarioService.desativarUsuario(id);
          await get().fetchUsuarios();
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      }
    }),
    { name: 'usuario-store' }
  )
);
```

---

## 🎨 **STORE DE TEMA**

### **6. ThemeStore Completo**
```typescript
// src/store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'yeti';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isYeti: boolean;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'yeti',
        isDark: false,
        isYeti: true,
        
        setTheme: (theme) => set((state) => ({
          theme,
          isDark: theme === 'dark',
          isYeti: theme === 'yeti'
        })),
        
        toggleTheme: () => {
          const { theme } = get();
          const themes: Theme[] = ['light', 'dark', 'yeti'];
          const currentIndex = themes.indexOf(theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          const nextTheme = themes[nextIndex];
          
          set({
            theme: nextTheme,
            isDark: nextTheme === 'dark',
            isYeti: nextTheme === 'yeti'
          });
        }
      }),
      {
        name: 'theme-storage',
        partialize: (state) => ({ theme: state.theme })
      }
    ),
    { name: 'theme-store' }
  )
);
```

---

## 🔔 **STORE DE NOTIFICAÇÕES**

### **7. NotificationStore Completo**
```typescript
// src/store/notificationStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now();
        const newNotification = { ...notification, id, timestamp };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
        
        // Auto remove após duração especificada
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      
      clearAllNotifications: () => {
        set({ notifications: [] });
      },
      
      showSuccess: (title, message) => {
        get().addNotification({
          type: 'success',
          title,
          message
        });
      },
      
      showError: (title, message) => {
        get().addNotification({
          type: 'error',
          title,
          message,
          duration: 7000
        });
      },
      
      showWarning: (title, message) => {
        get().addNotification({
          type: 'warning',
          title,
          message
        });
      },
      
      showInfo: (title, message) => {
        get().addNotification({
          type: 'info',
          title,
          message
        });
      }
    }),
    { name: 'notification-store' }
  )
);
```

---

## 📊 **STORE DE DASHBOARD**

### **8. DashboardStore Completo**
```typescript
// src/store/dashboardStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DashboardService } from '@/services/DashboardService';

interface DashboardState {
  estatisticas: {
    totalLivros: number;
    totalUsuarios: number;
    totalFuncionarios: number;
    totalEmprestimos: number;
    livrosDisponiveis: number;
    livrosEmprestados: number;
    emprestimosAtrasados: number;
    totalMultas: number;
  } | null;
  emprestimosPorMes: Array<{ mes: string; total: number }>;
  livrosMaisEmprestados: Array<{
    livro: { id: number; titulo: string; autor: string };
    totalEmprestimos: number;
  }>;
  usuariosMaisAtivos: Array<{
    usuario: { id: number; nome: string; email: string };
    totalEmprestimos: number;
  }>;
  categoriasMaisPopulares: Array<{
    categoria: string;
    totalLivros: number;
    totalEmprestimos: number;
  }>;
  atividadeRecente: Array<{
    id: number;
    tipo: string;
    descricao: string;
    data: string;
    usuario: string;
  }>;
  loading: boolean;
  error: string | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Async actions
  fetchEstatisticas: () => Promise<void>;
  fetchEmprestimosPorMes: (ano: number) => Promise<void>;
  fetchLivrosMaisEmprestados: (limit?: number) => Promise<void>;
  fetchUsuariosMaisAtivos: (limit?: number) => Promise<void>;
  fetchCategoriasMaisPopulares: (limit?: number) => Promise<void>;
  fetchAtividadeRecente: (limit?: number) => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      estatisticas: null,
      emprestimosPorMes: [],
      livrosMaisEmprestados: [],
      usuariosMaisAtivos: [],
      categoriasMaisPopulares: [],
      atividadeRecente: [],
      loading: false,
      error: null,
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      fetchEstatisticas: async () => {
        set({ loading: true, error: null });
        
        try {
          const estatisticas = await DashboardService.getEstatisticasGerais();
          set({ estatisticas, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchEmprestimosPorMes: async (ano) => {
        set({ loading: true, error: null });
        
        try {
          const emprestimosPorMes = await DashboardService.getEmprestimosPorMes(ano);
          set({ emprestimosPorMes, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchLivrosMaisEmprestados: async (limit = 10) => {
        set({ loading: true, error: null });
        
        try {
          const livrosMaisEmprestados = await DashboardService.getLivrosMaisEmprestados(limit);
          set({ livrosMaisEmprestados, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchUsuariosMaisAtivos: async (limit = 10) => {
        set({ loading: true, error: null });
        
        try {
          const usuariosMaisAtivos = await DashboardService.getUsuariosMaisAtivos(limit);
          set({ usuariosMaisAtivos, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchCategoriasMaisPopulares: async (limit = 10) => {
        set({ loading: true, error: null });
        
        try {
          const categoriasMaisPopulares = await DashboardService.getCategoriasMaisPopulares(limit);
          set({ categoriasMaisPopulares, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      fetchAtividadeRecente: async (limit = 20) => {
        set({ loading: true, error: null });
        
        try {
          const atividadeRecente = await DashboardService.getAtividadeRecente(limit);
          set({ atividadeRecente, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      refreshDashboard: async () => {
        const { fetchEstatisticas, fetchEmprestimosPorMes, fetchLivrosMaisEmprestados, fetchUsuariosMaisAtivos, fetchCategoriasMaisPopulares, fetchAtividadeRecente } = get();
        
        await Promise.all([
          fetchEstatisticas(),
          fetchEmprestimosPorMes(new Date().getFullYear()),
          fetchLivrosMaisEmprestados(),
          fetchUsuariosMaisAtivos(),
          fetchCategoriasMaisPopulares(),
          fetchAtividadeRecente()
        ]);
      }
    }),
    { name: 'dashboard-store' }
  )
);
```

---

## 🎯 **RESUMO DOS STORES ZUSTAND**

### **✅ Stores Criados:**
- ✅ **AuthStore** - Autenticação e usuário
- ✅ **LivroStore** - Gestão de livros
- ✅ **EmprestimoStore** - Gestão de empréstimos
- ✅ **UsuarioStore** - Gestão de usuários
- ✅ **ThemeStore** - Tema da aplicação
- ✅ **NotificationStore** - Notificações
- ✅ **DashboardStore** - Dashboard e estatísticas

### **✅ Funcionalidades Implementadas:**
- ✅ **Estado global** para todas as entidades
- ✅ **Persistência** de dados importantes
- ✅ **Loading states** e error handling
- ✅ **Pagination** e filtros
- ✅ **CRUD operations** completas
- ✅ **DevTools** integration
- ✅ **TypeScript** completo

**Agora os stores Zustand estão 100% completos!** 🚀
