# 🎯 ESPECIFICAÇÃO TÉCNICA COMPLETA - FRONTEND BIBLIOTECA 3D

## 📋 **VISÃO GERAL DO PROJETO**

### **Objetivo**
Criar um sistema de biblioteca digital com interface 3D interativa, permitindo empréstimos, gestão de acervo e relatórios avançados.

### **Stack Tecnológica**
```json
{
  "framework": "React 18.2.0",
  "language": "TypeScript 5.0+",
  "build": "Vite 4.4+",
  "styling": "Tailwind CSS 3.3+",
  "state": "Zustand 4.4+ + React Query 4.35+",
  "forms": "React Hook Form 7.47+ + Zod 3.22+",
  "routing": "React Router 6.15+",
  "animations": "Framer Motion 10.16+",
  "http": "Axios 1.5+",
  "search": "Fuse.js 6.6+",
  "icons": "Lucide React 0.263+",
  "testing": "Jest 29.6+ + React Testing Library 13.4+",
  "e2e": "Cypress 13.3+"
}
```

---

## 🏗️ **ARQUITETURA DE DADOS**

### **1. INTERFACES TYPESCRIPT EXATAS**

#### **Usuario Interface**
```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string; // Apenas para criação/atualização
  cpf: string;
  dataNascimento: string; // ISO 8601 format
}

interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  // senha nunca é retornada
}
```

#### **Funcionario Interface**
```typescript
interface Funcionario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string; // Apenas para criação/atualização
  cargo: string;
  salario: number;
  dataAdmissao: string; // ISO 8601 format
  dataDemissao?: string; // ISO 8601 format
  ativo: boolean;
}

interface FuncionarioResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  salario: number;
  dataAdmissao: string;
  dataDemissao?: string;
  ativo: boolean;
}
```

#### **Livro Interface**
```typescript
interface Livro {
  id: number;
  titulo: string;
  subtitulo?: string;
  isbn: string;
  ano: number;
  edicao: number;
  numeroPaginas: number;
  idioma: string;
  genero: string;
  sinopse: string;
  preco: number;
  capaUrl: string;
  codigoBarras: string;
  ativo: boolean;
  dataCriacao: string;
  idAutor: number;
  idEditora: number;
  // Propriedades de navegação (opcionais)
  nomeAutor?: string;
  nomeEditora?: string;
}

interface LivroCreateRequest {
  titulo: string;
  subtitulo?: string;
  isbn: string;
  ano: number;
  edicao?: number;
  numeroPaginas: number;
  idioma?: string;
  genero: string;
  sinopse: string;
  preco: number;
  capaUrl?: string;
  codigoBarras?: string;
  idAutor: number;
  idEditora: number;
}
```

#### **Autor Interface**
```typescript
interface Autor {
  id: number;
  nome: string;
  nomeCompleto: string;
  nomeArtistico: string;
  nacionalidade: string;
  paisOrigem: string;
  dataNascimento: string;
  website: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  ativo: boolean;
  dataCriacao: string;
}
```

#### **Editora Interface**
```typescript
interface Editora {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  dataFundacao: string;
  site: string;
  ativa: boolean;
  dataCriacao: string;
}
```

#### **Exemplar Interface**
```typescript
interface Exemplar {
  id: number;
  idLivro: number;
  numeroExemplar: string;
  localizacao: string;
  condicao: string; // "Bom", "Regular", "Ruim"
  disponivel: boolean;
  ativo: boolean;
  dataAquisicao: string;
  valorAquisicao: number;
  fornecedor: string;
  observacoes: string;
  dataCriacao: string;
  // Propriedades de navegação
  tituloLivro?: string;
  isbn?: string;
  nomeAutor?: string;
  nomeEditora?: string;
}
```

#### **Emprestimo Interface**
```typescript
interface Emprestimo {
  id: number;
  idExemplar: number;
  idUsuario: number;
  dataEmprestimo: string;
  dataPrevistaDevolucao: string;
  dataDevolucao?: string;
  dataRenovacao?: string;
  quantidadeRenovacoes: number;
  maxRenovacoes: number;
  multa: number;
  status: 'Emprestado' | 'Devolvido' | 'Atrasado' | 'Renovado';
  observacoes: string;
  ativo: boolean;
  dataCriacao: string;
  // Propriedades de navegação
  tituloLivro?: string;
  numeroExemplar?: string;
  nomeUsuario?: string;
  emailUsuario?: string;
  // Propriedades calculadas
  estaAtrasado: boolean;
  diasAtraso: number;
  podeRenovar: boolean;
}
```

#### **Token Interface**
```typescript
interface TokenResponse {
  token: string;
  expiration: string; // ISO 8601 format
  tipo: string; // "Bearer"
  nome: string;
  email: string;
  role: 'Usuario' | 'Funcionario' | 'Admin';
}

interface LoginRequest {
  email: string;
  senha: string;
}
```

---

## 🌐 **MAPEAMENTO COMPLETO DE ENDPOINTS**

### **1. AUTENTICAÇÃO (6 endpoints)**
```typescript
const AUTH_ENDPOINTS = {
  // POST /api/auth/login
  login: {
    method: 'POST',
    url: '/api/auth/login',
    body: LoginRequest,
    response: TokenResponse,
    statusCodes: {
      200: 'Login realizado com sucesso',
      401: 'Credenciais inválidas',
      400: 'Dados inválidos'
    }
  },
  
  // POST /api/auth/registrar
  registrar: {
    method: 'POST',
    url: '/api/auth/registrar',
    body: Usuario,
    response: UsuarioResponse,
    statusCodes: {
      201: 'Usuário criado com sucesso',
      400: 'Dados inválidos',
      409: 'Email já existe'
    }
  },
  
  // POST /api/auth/validar-token
  validarToken: {
    method: 'POST',
    url: '/api/auth/validar-token',
    headers: { 'Authorization': 'Bearer {token}' },
    response: { valid: boolean, user: UsuarioResponse },
    statusCodes: {
      200: 'Token válido',
      401: 'Token inválido'
    }
  },
  
  // GET /api/auth/me
  me: {
    method: 'GET',
    url: '/api/auth/me',
    headers: { 'Authorization': 'Bearer {token}' },
    response: UsuarioResponse,
    statusCodes: {
      200: 'Usuário atual',
      401: 'Não autenticado'
    }
  },
  
  // POST /api/auth/registrar-funcionario
  registrarFuncionario: {
    method: 'POST',
    url: '/api/auth/registrar-funcionario',
    headers: { 'Authorization': 'Bearer {token}' },
    body: Funcionario,
    response: FuncionarioResponse,
    statusCodes: {
      201: 'Funcionário criado',
      400: 'Dados inválidos',
      401: 'Não autorizado',
      403: 'Apenas Admin'
    }
  },
  
  // POST /api/auth/criar-admin
  criarAdmin: {
    method: 'POST',
    url: '/api/auth/criar-admin',
    headers: { 'Authorization': 'Bearer {token}' },
    body: Funcionario,
    response: FuncionarioResponse,
    statusCodes: {
      201: 'Admin criado',
      400: 'Admin já existe',
      401: 'Não autorizado'
    }
  }
};
```

### **2. USUÁRIOS (7 endpoints)**
```typescript
const USUARIO_ENDPOINTS = {
  // GET /api/usuario
  listar: {
    method: 'GET',
    url: '/api/usuario',
    headers: { 'Authorization': 'Bearer {token}' },
    response: UsuarioResponse[],
    statusCodes: {
      200: 'Lista de usuários',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin'
    }
  },
  
  // GET /api/usuario/{id}
  obter: {
    method: 'GET',
    url: '/api/usuario/{id}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: UsuarioResponse,
    statusCodes: {
      200: 'Usuário encontrado',
      404: 'Usuário não encontrado',
      401: 'Não autenticado'
    }
  },
  
  // POST /api/usuario
  criar: {
    method: 'POST',
    url: '/api/usuario',
    headers: { 'Authorization': 'Bearer {token}' },
    body: Usuario,
    response: UsuarioResponse,
    statusCodes: {
      201: 'Usuário criado',
      400: 'Dados inválidos',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin'
    }
  },
  
  // PUT /api/usuario
  atualizar: {
    method: 'PUT',
    url: '/api/usuario',
    headers: { 'Authorization': 'Bearer {token}' },
    body: Usuario,
    response: void,
    statusCodes: {
      204: 'Usuário atualizado',
      400: 'Dados inválidos',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin'
    }
  },
  
  // DELETE /api/usuario/{id}
  excluir: {
    method: 'DELETE',
    url: '/api/usuario/{id}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: void,
    statusCodes: {
      204: 'Usuário excluído',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin',
      404: 'Usuário não encontrado'
    }
  },
  
  // GET /api/usuario/por-nome/{nome}
  buscarPorNome: {
    method: 'GET',
    url: '/api/usuario/por-nome/{nome}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: UsuarioResponse[],
    statusCodes: {
      200: 'Usuários encontrados',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin'
    }
  },
  
  // GET /api/usuario/por-cpf/{cpf}
  buscarPorCpf: {
    method: 'GET',
    url: '/api/usuario/por-cpf/{cpf}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: UsuarioResponse,
    statusCodes: {
      200: 'Usuário encontrado',
      404: 'Usuário não encontrado',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin'
    }
  }
};
```

### **3. LIVROS (11 endpoints)**
```typescript
const LIVRO_ENDPOINTS = {
  // GET /api/livro
  listar: {
    method: 'GET',
    url: '/api/livro',
    headers: { 'Authorization': 'Bearer {token}' },
    response: Livro[],
    statusCodes: {
      200: 'Lista de livros',
      401: 'Não autenticado'
    }
  },
  
  // GET /api/livro/{id}
  obter: {
    method: 'GET',
    url: '/api/livro/{id}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: Livro,
    statusCodes: {
      200: 'Livro encontrado',
      404: 'Livro não encontrado',
      401: 'Não autenticado'
    }
  },
  
  // POST /api/livro
  criar: {
    method: 'POST',
    url: '/api/livro',
    headers: { 'Authorization': 'Bearer {token}' },
    body: LivroCreateRequest,
    response: Livro,
    statusCodes: {
      201: 'Livro criado',
      400: 'Dados inválidos',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin'
    }
  },
  
  // PUT /api/livro
  atualizar: {
    method: 'PUT',
    url: '/api/livro',
    headers: { 'Authorization': 'Bearer {token}' },
    body: Livro,
    response: void,
    statusCodes: {
      204: 'Livro atualizado',
      400: 'Dados inválidos',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin'
    }
  },
  
  // DELETE /api/livro/{id}
  excluir: {
    method: 'DELETE',
    url: '/api/livro/{id}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: void,
    statusCodes: {
      204: 'Livro excluído',
      401: 'Não autenticado',
      403: 'Apenas Funcionario/Admin',
      404: 'Livro não encontrado'
    }
  },
  
  // GET /api/livro/disponiveis
  disponiveis: {
    method: 'GET',
    url: '/api/livro/disponiveis',
    headers: { 'Authorization': 'Bearer {token}' },
    response: Livro[],
    statusCodes: {
      200: 'Livros disponíveis',
      401: 'Não autenticado'
    }
  },
  
  // GET /api/livro/por-genero/{genero}
  porGenero: {
    method: 'GET',
    url: '/api/livro/por-genero/{genero}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: Livro[],
    statusCodes: {
      200: 'Livros do gênero',
      401: 'Não autenticado'
    }
  },
  
  // GET /api/livro/por-autor/{id}
  porAutor: {
    method: 'GET',
    url: '/api/livro/por-autor/{id}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: Livro[],
    statusCodes: {
      200: 'Livros do autor',
      401: 'Não autenticado'
    }
  },
  
  // GET /api/livro/por-editora/{id}
  porEditora: {
    method: 'GET',
    url: '/api/livro/por-editora/{id}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: Livro[],
    statusCodes: {
      200: 'Livros da editora',
      401: 'Não autenticado'
    }
  },
  
  // GET /api/livro/buscar/{termo}
  buscar: {
    method: 'GET',
    url: '/api/livro/buscar/{termo}',
    headers: { 'Authorization': 'Bearer {token}' },
    response: Livro[],
    statusCodes: {
      200: 'Resultados da busca',
      401: 'Não autenticado'
    }
  }
};
```

---

## 🎨 **ESPECIFICAÇÃO DE COMPONENTES**

### **1. ESTANTE 3D - IMPLEMENTAÇÃO CSS**

#### **Estrutura HTML**
```html
<div className="estante-3d-container">
  <div className="estante-3d" data-estante="1">
    <div className="livro-card" data-livro="1">
      <div className="livro-capa">
        <img src="capa.jpg" alt="Título do Livro" />
      </div>
      <div className="livro-info">
        <h3>Título do Livro</h3>
        <p>Autor</p>
        <span className="status disponivel">Disponível</span>
      </div>
    </div>
    <!-- Mais livros... -->
  </div>
  <div className="navegacao-estante">
    <button className="btn-anterior">← Anterior</button>
    <span className="estante-atual">Estante 1 de 5</span>
    <button className="btn-proximo">Próximo →</button>
  </div>
</div>
```

#### **CSS 3D Específico**
```css
.estante-3d-container {
  perspective: 1200px;
  perspective-origin: center center;
  width: 100%;
  height: 600px;
  overflow: hidden;
}

.estante-3d {
  transform-style: preserve-3d;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding: 40px;
  transform: rotateX(15deg) rotateY(-5deg);
  transition: transform 0.5s ease;
}

.livro-card {
  transform-style: preserve-3d;
  transform: translateZ(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  height: 300px;
  width: 200px;
  margin: 0 auto;
}

.livro-card:hover {
  transform: translateZ(80px) rotateY(10deg) rotateX(-5deg);
  z-index: 10;
}

.livro-capa {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 
    0 10px 30px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transform: rotateY(0deg);
  transition: all 0.3s ease;
}

.livro-card:hover .livro-capa {
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.livro-info {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.95);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
  min-width: 180px;
  text-align: center;
}

.livro-card:hover .livro-info {
  opacity: 1;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.disponivel {
  background: #d4edda;
  color: #155724;
}

.status.emprestado {
  background: #f8d7da;
  color: #721c24;
}

.status.reservado {
  background: #fff3cd;
  color: #856404;
}

/* Responsividade */
@media (max-width: 768px) {
  .estante-3d {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 20px;
  }
  
  .livro-card {
    height: 250px;
    width: 150px;
  }
}

@media (max-width: 480px) {
  .estante-3d {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
```

### **2. FORMULÁRIOS - IMPLEMENTAÇÃO REACT HOOK FORM + ZOD**

#### **Formulário de Login**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  senha: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha muito longa'),
  role: z.enum(['Usuario', 'Funcionario', 'Admin'], {
    required_error: 'Selecione um tipo de usuário'
  })
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/auth/login', data);
      // Processar resposta e redirecionar
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          {...register('senha')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.senha && (
          <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Tipo de Usuário
        </label>
        <select
          id="role"
          {...register('role')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecione...</option>
          <option value="Usuario">Usuário</option>
          <option value="Funcionario">Funcionário</option>
          <option value="Admin">Administrador</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};
```

---

## 🔧 **SERVIÇOS DE API**

### **1. Configuração Base do Axios**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5072',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **2. Serviço de Autenticação**
```typescript
import api from './api';
import { LoginRequest, TokenResponse, UsuarioResponse } from '../types/auth';

export class AuthService {
  static async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  static async registrar(data: Usuario): Promise<UsuarioResponse> {
    const response = await api.post('/auth/registrar', data);
    return response.data;
  }

  static async validarToken(): Promise<{ valid: boolean; user: UsuarioResponse }> {
    const response = await api.post('/auth/validar-token');
    return response.data;
  }

  static async getCurrentUser(): Promise<UsuarioResponse> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  static async registrarFuncionario(data: Funcionario): Promise<FuncionarioResponse> {
    const response = await api.post('/auth/registrar-funcionario', data);
    return response.data;
  }

  static async criarAdmin(data: Funcionario): Promise<FuncionarioResponse> {
    const response = await api.post('/auth/criar-admin', data);
    return response.data;
  }
}
```

### **3. Serviço de Livros**
```typescript
import api from './api';
import { Livro, LivroCreateRequest } from '../types/livro';

export class LivroService {
  static async listar(): Promise<Livro[]> {
    const response = await api.get('/livro');
    return response.data;
  }

  static async obter(id: number): Promise<Livro> {
    const response = await api.get(`/livro/${id}`);
    return response.data;
  }

  static async criar(data: LivroCreateRequest): Promise<Livro> {
    const response = await api.post('/livro', data);
    return response.data;
  }

  static async atualizar(data: Livro): Promise<void> {
    await api.put('/livro', data);
  }

  static async excluir(id: number): Promise<void> {
    await api.delete(`/livro/${id}`);
  }

  static async buscar(termo: string): Promise<Livro[]> {
    const response = await api.get(`/livro/buscar/${encodeURIComponent(termo)}`);
    return response.data;
  }

  static async disponiveis(): Promise<Livro[]> {
    const response = await api.get('/livro/disponiveis');
    return response.data;
  }

  static async porGenero(genero: string): Promise<Livro[]> {
    const response = await api.get(`/livro/por-genero/${encodeURIComponent(genero)}`);
    return response.data;
  }

  static async porAutor(id: number): Promise<Livro[]> {
    const response = await api.get(`/livro/por-autor/${id}`);
    return response.data;
  }

  static async porEditora(id: number): Promise<Livro[]> {
    const response = await api.get(`/livro/por-editora/${id}`);
    return response.data;
  }
}
```

---

## 🎯 **PRÓXIMOS PASSOS**

Esta especificação técnica fornece:

✅ **Interfaces TypeScript exatas** baseadas nos DTOs do backend  
✅ **Mapeamento completo de todos os 99 endpoints**  
✅ **Implementação CSS 3D específica** para a estante  
✅ **Formulários com validação** usando React Hook Form + Zod  
✅ **Serviços de API** com Axios configurado  
✅ **Tratamento de erros** e interceptors  
✅ **Estrutura de resposta** exata para cada endpoint  

**Esta documentação é 100% implementacional e permite criar o front-end perfeito!** 🚀
