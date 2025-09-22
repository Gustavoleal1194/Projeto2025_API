# 🔌 SERVIÇOS DE API COMPLETOS - YETI LIBRARY SYSTEM

## 🎯 **CONFIGURAÇÃO BASE DA API**

### **1. Cliente Axios Base**
```typescript
// src/services/api/client.ts
import axios from 'axios';
import { constants } from '@/utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5072',
  timeout: constants.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentar renovar o token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, {
            refreshToken
          });
          
          const { token } = response.data;
          localStorage.setItem('auth_token', token);
          
          // Repetir a requisição original
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar ao renovar, redirecionar para login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### **2. Interceptors de Logging**
```typescript
// src/services/api/interceptors.ts
import api from './client';

// Request logging
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers
      });
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response logging
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error(`❌ API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    return Promise.reject(error);
  }
);
```

---

## 🔐 **SERVIÇOS DE AUTENTICAÇÃO**

### **3. AuthService Completo**
```typescript
// src/services/AuthService.ts
import api from './api/client';
import { LoginFormData, RegisterFormData, TokenResponse, UsuarioResponse } from '@/types/auth';

export class AuthService {
  static async login(data: LoginFormData): Promise<TokenResponse> {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  }

  static async register(data: RegisterFormData): Promise<UsuarioResponse> {
    const response = await api.post('/api/auth/registrar', data);
    return response.data;
  }

  static async registerEmployee(data: RegisterFormData): Promise<UsuarioResponse> {
    const response = await api.post('/api/auth/registrar-funcionario', data);
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

  static async refreshToken(): Promise<TokenResponse> {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/api/auth/change-password', {
      currentPassword,
      newPassword
    });
  }

  static async resetPassword(email: string): Promise<void> {
    await api.post('/api/auth/reset-password', { email });
  }

  static async confirmResetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/confirm-reset-password', {
      token,
      newPassword
    });
  }
}
```

---

## 📚 **SERVIÇOS DE LIVROS**

### **4. LivroService Completo**
```typescript
// src/services/LivroService.ts
import api from './api/client';
import { Livro, LivroCreate, LivroUpdate, LivroFilters, Exemplar } from '@/types/livro';

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

  static async getLivrosByCategoria(categoria: string): Promise<Livro[]> {
    const response = await api.get(`/api/livro/categoria/${categoria}`);
    return response.data;
  }

  static async getLivrosByAutor(autor: string): Promise<Livro[]> {
    const response = await api.get(`/api/livro/autor/${autor}`);
    return response.data;
  }

  static async getExemplares(livroId: number): Promise<Exemplar[]> {
    const response = await api.get(`/api/livro/${livroId}/exemplares`);
    return response.data;
  }

  static async createExemplar(livroId: number, data: { codigo: string; localizacao: string }): Promise<Exemplar> {
    const response = await api.post(`/api/livro/${livroId}/exemplares`, data);
    return response.data;
  }

  static async updateExemplar(exemplarId: number, data: { codigo?: string; localizacao?: string; status?: string }): Promise<Exemplar> {
    const response = await api.put(`/api/exemplar/${exemplarId}`, data);
    return response.data;
  }

  static async deleteExemplar(exemplarId: number): Promise<void> {
    await api.delete(`/api/exemplar/${exemplarId}`);
  }

  static async getEstatisticas(): Promise<{
    totalLivros: number;
    livrosDisponiveis: number;
    livrosEmprestados: number;
    livrosReservados: number;
    livrosIndisponiveis: number;
  }> {
    const response = await api.get('/api/livro/estatisticas');
    return response.data;
  }
}
```

---

## 👥 **SERVIÇOS DE USUÁRIOS**

### **5. UsuarioService Completo**
```typescript
// src/services/UsuarioService.ts
import api from './api/client';
import { Usuario, UsuarioCreate, UsuarioUpdate, UsuarioFilters } from '@/types/usuario';

export class UsuarioService {
  static async getUsuarios(filters?: UsuarioFilters): Promise<Usuario[]> {
    const response = await api.get('/api/usuario', { params: filters });
    return response.data;
  }

  static async getUsuarioById(id: number): Promise<Usuario> {
    const response = await api.get(`/api/usuario/${id}`);
    return response.data;
  }

  static async createUsuario(data: UsuarioCreate): Promise<Usuario> {
    const response = await api.post('/api/usuario', data);
    return response.data;
  }

  static async updateUsuario(id: number, data: UsuarioUpdate): Promise<Usuario> {
    const response = await api.put(`/api/usuario/${id}`, data);
    return response.data;
  }

  static async deleteUsuario(id: number): Promise<void> {
    await api.delete(`/api/usuario/${id}`);
  }

  static async ativarUsuario(id: number): Promise<void> {
    await api.put(`/api/usuario/${id}/ativar`);
  }

  static async desativarUsuario(id: number): Promise<void> {
    await api.put(`/api/usuario/${id}/desativar`);
  }

  static async getEmprestimosUsuario(id: number): Promise<any[]> {
    const response = await api.get(`/api/usuario/${id}/emprestimos`);
    return response.data;
  }

  static async getHistoricoUsuario(id: number): Promise<any[]> {
    const response = await api.get(`/api/usuario/${id}/historico`);
    return response.data;
  }

  static async getEstatisticasUsuario(id: number): Promise<{
    totalEmprestimos: number;
    emprestimosAtivos: number;
    emprestimosAtrasados: number;
    totalMultas: number;
  }> {
    const response = await api.get(`/api/usuario/${id}/estatisticas`);
    return response.data;
  }
}
```

---

## 👨‍💼 **SERVIÇOS DE FUNCIONÁRIOS**

### **6. FuncionarioService Completo**
```typescript
// src/services/FuncionarioService.ts
import api from './api/client';
import { Funcionario, FuncionarioCreate, FuncionarioUpdate, FuncionarioFilters } from '@/types/funcionario';

export class FuncionarioService {
  static async getFuncionarios(filters?: FuncionarioFilters): Promise<Funcionario[]> {
    const response = await api.get('/api/funcionario', { params: filters });
    return response.data;
  }

  static async getFuncionarioById(id: number): Promise<Funcionario> {
    const response = await api.get(`/api/funcionario/${id}`);
    return response.data;
  }

  static async createFuncionario(data: FuncionarioCreate): Promise<Funcionario> {
    const response = await api.post('/api/funcionario', data);
    return response.data;
  }

  static async updateFuncionario(id: number, data: FuncionarioUpdate): Promise<Funcionario> {
    const response = await api.put(`/api/funcionario/${id}`, data);
    return response.data;
  }

  static async deleteFuncionario(id: number): Promise<void> {
    await api.delete(`/api/funcionario/${id}`);
  }

  static async ativarFuncionario(id: number): Promise<void> {
    await api.put(`/api/funcionario/${id}/ativar`);
  }

  static async desativarFuncionario(id: number): Promise<void> {
    await api.put(`/api/funcionario/${id}/desativar`);
  }

  static async changeRole(id: number, role: string): Promise<void> {
    await api.put(`/api/funcionario/${id}/role`, { role });
  }

  static async getEstatisticasFuncionario(id: number): Promise<{
    totalEmprestimosProcessados: number;
    totalUsuariosAtendidos: number;
    totalLivrosCadastrados: number;
    totalRelatoriosGerados: number;
  }> {
    const response = await api.get(`/api/funcionario/${id}/estatisticas`);
    return response.data;
  }
}
```

---

## 📖 **SERVIÇOS DE EMPRÉSTIMOS**

### **7. EmprestimoService Completo**
```typescript
// src/services/EmprestimoService.ts
import api from './api/client';
import { Emprestimo, EmprestimoCreate, EmprestimoUpdate, EmprestimoFilters } from '@/types/emprestimo';

export class EmprestimoService {
  static async getEmprestimos(filters?: EmprestimoFilters): Promise<Emprestimo[]> {
    const response = await api.get('/api/emprestimo', { params: filters });
    return response.data;
  }

  static async getEmprestimoById(id: number): Promise<Emprestimo> {
    const response = await api.get(`/api/emprestimo/${id}`);
    return response.data;
  }

  static async createEmprestimo(data: EmprestimoCreate): Promise<Emprestimo> {
    const response = await api.post('/api/emprestimo', data);
    return response.data;
  }

  static async updateEmprestimo(id: number, data: EmprestimoUpdate): Promise<Emprestimo> {
    const response = await api.put(`/api/emprestimo/${id}`, data);
    return response.data;
  }

  static async deleteEmprestimo(id: number): Promise<void> {
    await api.delete(`/api/emprestimo/${id}`);
  }

  static async devolverLivro(id: number): Promise<Emprestimo> {
    const response = await api.put(`/api/emprestimo/${id}/devolver`);
    return response.data;
  }

  static async renovarEmprestimo(id: number): Promise<Emprestimo> {
    const response = await api.put(`/api/emprestimo/${id}/renovar`);
    return response.data;
  }

  static async getEmprestimosAtivos(): Promise<Emprestimo[]> {
    const response = await api.get('/api/emprestimo/ativos');
    return response.data;
  }

  static async getEmprestimosAtrasados(): Promise<Emprestimo[]> {
    const response = await api.get('/api/emprestimo/atrasados');
    return response.data;
  }

  static async getEmprestimosPorUsuario(usuarioId: number): Promise<Emprestimo[]> {
    const response = await api.get(`/api/emprestimo/usuario/${usuarioId}`);
    return response.data;
  }

  static async getEmprestimosPorLivro(livroId: number): Promise<Emprestimo[]> {
    const response = await api.get(`/api/emprestimo/livro/${livroId}`);
    return response.data;
  }

  static async calcularMulta(id: number): Promise<{ multa: number; diasAtraso: number }> {
    const response = await api.get(`/api/emprestimo/${id}/multa`);
    return response.data;
  }

  static async pagarMulta(id: number, valor: number): Promise<void> {
    await api.post(`/api/emprestimo/${id}/pagar-multa`, { valor });
  }

  static async getEstatisticas(): Promise<{
    totalEmprestimos: number;
    emprestimosAtivos: number;
    emprestimosAtrasados: number;
    totalMultas: number;
    mediaDiasEmprestimo: number;
  }> {
    const response = await api.get('/api/emprestimo/estatisticas');
    return response.data;
  }
}
```

---

## 📊 **SERVIÇOS DE DASHBOARD**

### **8. DashboardService Completo**
```typescript
// src/services/DashboardService.ts
import api from './api/client';

export class DashboardService {
  static async getEstatisticasGerais(): Promise<{
    totalLivros: number;
    totalUsuarios: number;
    totalFuncionarios: number;
    totalEmprestimos: number;
    livrosDisponiveis: number;
    livrosEmprestados: number;
    emprestimosAtrasados: number;
    totalMultas: number;
  }> {
    const response = await api.get('/api/dashboard/estatisticas');
    return response.data;
  }

  static async getEmprestimosPorMes(ano: number): Promise<{
    mes: string;
    total: number;
  }[]> {
    const response = await api.get('/api/dashboard/emprestimos-por-mes', {
      params: { ano }
    });
    return response.data;
  }

  static async getLivrosMaisEmprestados(limit: number = 10): Promise<{
    livro: {
      id: number;
      titulo: string;
      autor: string;
    };
    totalEmprestimos: number;
  }[]> {
    const response = await api.get('/api/dashboard/livros-mais-emprestados', {
      params: { limit }
    });
    return response.data;
  }

  static async getUsuariosMaisAtivos(limit: number = 10): Promise<{
    usuario: {
      id: number;
      nome: string;
      email: string;
    };
    totalEmprestimos: number;
  }[]> {
    const response = await api.get('/api/dashboard/usuarios-mais-ativos', {
      params: { limit }
    });
    return response.data;
  }

  static async getCategoriasMaisPopulares(limit: number = 10): Promise<{
    categoria: string;
    totalLivros: number;
    totalEmprestimos: number;
  }[]> {
    const response = await api.get('/api/dashboard/categorias-mais-populares', {
      params: { limit }
    });
    return response.data;
  }

  static async getAtividadeRecente(limit: number = 20): Promise<{
    id: number;
    tipo: string;
    descricao: string;
    data: string;
    usuario: string;
  }[]> {
    const response = await api.get('/api/dashboard/atividade-recente', {
      params: { limit }
    });
    return response.data;
  }
}
```

---

## 📈 **SERVIÇOS DE RELATÓRIOS**

### **9. RelatoriosService Completo**
```typescript
// src/services/RelatoriosService.ts
import api from './api/client';

export class RelatoriosService {
  static async getEmprestimosPorPeriodo(dataInicio: string, dataFim: string): Promise<{
    data: string;
    total: number;
  }[]> {
    const response = await api.get('/api/relatorios/emprestimos-por-periodo', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  }

  static async getLivrosMaisEmprestados(dataInicio: string, dataFim: string): Promise<{
    livro: string;
    autor: string;
    totalEmprestimos: number;
  }[]> {
    const response = await api.get('/api/relatorios/livros-mais-emprestados', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  }

  static async getUsuariosMaisAtivos(dataInicio: string, dataFim: string): Promise<{
    usuario: string;
    email: string;
    totalEmprestimos: number;
  }[]> {
    const response = await api.get('/api/relatorios/usuarios-mais-ativos', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  }

  static async getEmprestimosAtrasados(dataInicio: string, dataFim: string): Promise<{
    id: number;
    livro: string;
    usuario: string;
    dataEmprestimo: string;
    diasAtraso: number;
    multa: number;
  }[]> {
    const response = await api.get('/api/relatorios/emprestimos-atrasados', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  }

  static async getEstatisticasCategoria(dataInicio: string, dataFim: string): Promise<{
    categoria: string;
    totalLivros: number;
    totalEmprestimos: number;
    percentual: number;
  }[]> {
    const response = await api.get('/api/relatorios/estatisticas-categoria', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  }

  static async exportarRelatorio(tipo: string, formato: 'pdf' | 'excel' | 'csv', dataInicio: string, dataFim: string): Promise<Blob> {
    const response = await api.get(`/api/relatorios/exportar/${tipo}`, {
      params: { formato, dataInicio, dataFim },
      responseType: 'blob'
    });
    return response.data;
  }
}
```

---

## ⚙️ **SERVIÇOS DE CONFIGURAÇÃO**

### **10. ConfiguracaoService Completo**
```typescript
// src/services/ConfiguracaoService.ts
import api from './api/client';

export class ConfiguracaoService {
  static async getConfiguracoes(): Promise<{
    diasEmprestimo: number;
    maxRenovacoes: number;
    multaPorDia: number;
    horarioFuncionamento: string;
    emailNotificacoes: boolean;
    smsNotificacoes: boolean;
  }> {
    const response = await api.get('/api/configuracao');
    return response.data;
  }

  static async updateConfiguracoes(data: {
    diasEmprestimo?: number;
    maxRenovacoes?: number;
    multaPorDia?: number;
    horarioFuncionamento?: string;
    emailNotificacoes?: boolean;
    smsNotificacoes?: boolean;
  }): Promise<void> {
    await api.put('/api/configuracao', data);
  }

  static async getConfiguracaoEmail(): Promise<{
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  }> {
    const response = await api.get('/api/configuracao/email');
    return response.data;
  }

  static async updateConfiguracaoEmail(data: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  }): Promise<void> {
    await api.put('/api/configuracao/email', data);
  }

  static async testarEmail(): Promise<void> {
    await api.post('/api/configuracao/email/testar');
  }

  static async getBackup(): Promise<Blob> {
    const response = await api.get('/api/configuracao/backup', {
      responseType: 'blob'
    });
    return response.data;
  }

  static async restaurarBackup(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/api/configuracao/restaurar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}
```

---

## 🎯 **RESUMO DOS SERVIÇOS DE API**

### **✅ Serviços Criados:**
- ✅ **AuthService** - Autenticação completa
- ✅ **LivroService** - Gestão de livros e exemplares
- ✅ **UsuarioService** - Gestão de usuários
- ✅ **FuncionarioService** - Gestão de funcionários
- ✅ **EmprestimoService** - Gestão de empréstimos
- ✅ **DashboardService** - Estatísticas e dashboard
- ✅ **RelatoriosService** - Relatórios e exportação
- ✅ **ConfiguracaoService** - Configurações do sistema

### **✅ Funcionalidades Implementadas:**
- ✅ **CRUD completo** para todas as entidades
- ✅ **Busca e filtros** avançados
- ✅ **Estatísticas** e métricas
- ✅ **Relatórios** e exportação
- ✅ **Configurações** do sistema
- ✅ **Interceptors** de logging e erro
- ✅ **Refresh token** automático
- ✅ **Tratamento de erros** centralizado

**Agora os serviços de API estão 100% completos!** 🚀
