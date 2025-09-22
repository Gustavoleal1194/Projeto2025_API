# 🧪 CONFIGURAÇÃO DE TESTES COMPLETA - YETI LIBRARY SYSTEM

## 🎯 **CONFIGURAÇÃO INICIAL DE TESTES**

### **1. setupTests.ts**
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Estabelecer handlers de API para todos os testes
beforeAll(() => server.listen());

// Resetar handlers após cada teste
afterEach(() => server.resetHandlers());

// Limpar após todos os testes
afterAll(() => server.close());

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock do ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
```

### **2. jest.config.js (Completo)**
```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/assets/(.*)$': '<rootDir>/src/assets/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@tanstack|zustand))',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/setupTests.ts',
    '!src/mocks/**/*',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
};
```

### **3. babel.config.js**
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
};
```

---

## 🎭 **MOCKS E DADOS DE TESTE**

### **4. Mock Server (MSW)**
```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### **5. Mock Handlers**
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5072';

export const handlers = [
  // Auth endpoints
  rest.post(`${API_BASE_URL}/api/auth/login`, (req, res, ctx) => {
    const { email, senha } = req.body as any;
    
    if (email === 'admin@biblioteca.com' && senha === '123456') {
      return res(
        ctx.json({
          token: 'mock-admin-token',
          expiresIn: 3600,
          user: {
            id: 1,
            email: 'admin@biblioteca.com',
            role: 'Admin',
            nome: 'Administrador'
          }
        })
      );
    }
    
    if (email === 'teste@teste.com' && senha === '123456') {
      return res(
        ctx.json({
          token: 'mock-user-token',
          expiresIn: 3600,
          user: {
            id: 2,
            email: 'teste@teste.com',
            role: 'Usuario',
            nome: 'Usuário Teste'
          }
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ message: 'Email ou senha inválidos' })
    );
  }),

  rest.get(`${API_BASE_URL}/api/auth/me`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader === 'Bearer mock-admin-token') {
      return res(
        ctx.json({
          id: 1,
          email: 'admin@biblioteca.com',
          role: 'Admin',
          nome: 'Administrador'
        })
      );
    }
    
    if (authHeader === 'Bearer mock-user-token') {
      return res(
        ctx.json({
          id: 2,
          email: 'teste@teste.com',
          role: 'Usuario',
          nome: 'Usuário Teste'
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ message: 'Token inválido' })
    );
  }),

  // Livros endpoints
  rest.get(`${API_BASE_URL}/api/livro`, (req, res, ctx) => {
    const mockLivros = [
      {
        id: 1,
        titulo: 'React: A Biblioteca Completa',
        autor: 'João Silva',
        editora: 'Editora Tech',
        isbn: '978-1234567890',
        anoPublicacao: 2023,
        categoria: 'Tecnologia',
        status: 'disponivel',
        exemplares: [
          {
            id: 1,
            codigo: 'EX001',
            status: 'disponivel',
            localizacao: 'Estante A-1'
          }
        ]
      },
      {
        id: 2,
        titulo: 'TypeScript Avançado',
        autor: 'Maria Santos',
        editora: 'Editora Code',
        isbn: '978-0987654321',
        anoPublicacao: 2023,
        categoria: 'Programação',
        status: 'disponivel',
        exemplares: [
          {
            id: 2,
            codigo: 'EX002',
            status: 'emprestado',
            localizacao: 'Estante B-2'
          }
        ]
      }
    ];
    
    return res(ctx.json(mockLivros));
  }),

  rest.get(`${API_BASE_URL}/api/livro/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const mockLivro = {
      id: parseInt(id as string),
      titulo: 'React: A Biblioteca Completa',
      autor: 'João Silva',
      editora: 'Editora Tech',
      isbn: '978-1234567890',
      anoPublicacao: 2023,
      categoria: 'Tecnologia',
      status: 'disponivel',
      exemplares: [
        {
          id: 1,
          codigo: 'EX001',
          status: 'disponivel',
          localizacao: 'Estante A-1'
        }
      ]
    };
    
    return res(ctx.json(mockLivro));
  }),

  rest.post(`${API_BASE_URL}/api/livro`, (req, res, ctx) => {
    const novoLivro = req.body as any;
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        ...novoLivro,
        status: 'disponivel'
      })
    );
  }),

  rest.put(`${API_BASE_URL}/api/livro/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const livroAtualizado = req.body as any;
    return res(
      ctx.json({
        id: parseInt(id as string),
        ...livroAtualizado
      })
    );
  }),

  rest.delete(`${API_BASE_URL}/api/livro/:id`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  // Empréstimos endpoints
  rest.get(`${API_BASE_URL}/api/emprestimo`, (req, res, ctx) => {
    const mockEmprestimos = [
      {
        id: 1,
        livro: {
          id: 1,
          titulo: 'React: A Biblioteca Completa',
          autor: 'João Silva'
        },
        usuario: {
          id: 2,
          nome: 'Usuário Teste',
          email: 'teste@teste.com'
        },
        dataEmprestimo: '2023-09-01T10:00:00Z',
        dataDevolucaoPrevista: '2023-09-15T10:00:00Z',
        dataDevolucao: null,
        status: 'emprestado',
        renovacoes: 0
      }
    ];
    
    return res(ctx.json(mockEmprestimos));
  }),

  rest.post(`${API_BASE_URL}/api/emprestimo`, (req, res, ctx) => {
    const novoEmprestimo = req.body as any;
    return res(
      ctx.status(201),
      ctx.json({
        id: 2,
        ...novoEmprestimo,
        status: 'emprestado',
        dataEmprestimo: new Date().toISOString(),
        dataDevolucaoPrevista: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      })
    );
  }),

  // Dashboard endpoints
  rest.get(`${API_BASE_URL}/api/dashboard/estatisticas`, (req, res, ctx) => {
    return res(
      ctx.json({
        totalLivros: 150,
        totalUsuarios: 45,
        totalEmprestimos: 23,
        livrosDisponiveis: 127,
        livrosEmprestados: 23,
        emprestimosAtrasados: 3
      })
    );
  }),

  // Relatórios endpoints
  rest.get(`${API_BASE_URL}/api/relatorios/emprestimos-por-periodo`, (req, res, ctx) => {
    return res(
      ctx.json([
        { mes: 'Janeiro', total: 15 },
        { mes: 'Fevereiro', total: 23 },
        { mes: 'Março', total: 18 },
        { mes: 'Abril', total: 31 },
        { mes: 'Maio', total: 27 },
        { mes: 'Junho', total: 35 }
      ])
    );
  }),
];
```

### **6. Mock Data**
```typescript
// src/mocks/data.ts
export const mockUsers = [
  {
    id: 1,
    email: 'admin@biblioteca.com',
    nome: 'Administrador',
    role: 'Admin',
    ativo: true,
    dataCriacao: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    email: 'teste@teste.com',
    nome: 'Usuário Teste',
    role: 'Usuario',
    ativo: true,
    dataCriacao: '2023-01-15T00:00:00Z'
  }
];

export const mockBooks = [
  {
    id: 1,
    titulo: 'React: A Biblioteca Completa',
    autor: 'João Silva',
    editora: 'Editora Tech',
    isbn: '978-1234567890',
    anoPublicacao: 2023,
    categoria: 'Tecnologia',
    status: 'disponivel',
    exemplares: [
      {
        id: 1,
        codigo: 'EX001',
        status: 'disponivel',
        localizacao: 'Estante A-1'
      }
    ]
  },
  {
    id: 2,
    titulo: 'TypeScript Avançado',
    autor: 'Maria Santos',
    editora: 'Editora Code',
    isbn: '978-0987654321',
    anoPublicacao: 2023,
    categoria: 'Programação',
    status: 'disponivel',
    exemplares: [
      {
        id: 2,
        codigo: 'EX002',
        status: 'emprestado',
        localizacao: 'Estante B-2'
      }
    ]
  }
];

export const mockLoans = [
  {
    id: 1,
    livro: {
      id: 1,
      titulo: 'React: A Biblioteca Completa',
      autor: 'João Silva'
    },
    usuario: {
      id: 2,
      nome: 'Usuário Teste',
      email: 'teste@teste.com'
    },
    dataEmprestimo: '2023-09-01T10:00:00Z',
    dataDevolucaoPrevista: '2023-09-15T10:00:00Z',
    dataDevolucao: null,
    status: 'emprestado',
    renovacoes: 0
  }
];
```

---

## 🧪 **UTILITÁRIOS DE TESTE**

### **7. Test Utils**
```typescript
// src/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/contexts/AppProvider';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          {children}
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### **8. Custom Hooks Test Utils**
```typescript
// src/hooks/__tests__/test-utils.ts
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppProvider';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          {children}
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export const renderHookWithProviders = <T,>(hook: () => T) => {
  return renderHook(hook, { wrapper: createWrapper() });
};
```

---

## 📝 **EXEMPLOS DE TESTES**

### **9. Teste de Componente**
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@/test-utils';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-yeti-sky-medium');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### **10. Teste de Hook**
```typescript
// src/hooks/__tests__/useAuth.test.ts
import { renderHookWithProviders } from './test-utils';
import { useAuth } from '../useAuth';
import { server } from '@/mocks/server';
import { rest } from 'msw';

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHookWithProviders(() => useAuth());
    
    const loginResult = await result.current.signIn({
      email: 'admin@biblioteca.com',
      senha: '123456',
      role: 'Admin'
    });
    
    expect(loginResult.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('admin@biblioteca.com');
  });

  it('should handle login error', async () => {
    server.use(
      rest.post('*/api/auth/login', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
      })
    );

    const { result } = renderHookWithProviders(() => useAuth());
    
    const loginResult = await result.current.signIn({
      email: 'wrong@email.com',
      senha: 'wrongpassword',
      role: 'Usuario'
    });
    
    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Invalid credentials');
  });
});
```

### **11. Teste de Página**
```typescript
// src/pages/__tests__/LoginPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { LoginPage } from '../auth/LoginPage';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@biblioteca.com' }
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/login realizado com sucesso/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for invalid data', async () => {
    render(<LoginPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🎯 **SCRIPTS DE TESTE**

### **12. Scripts no package.json**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:update": "jest --updateSnapshot",
    "test:debug": "jest --runInBand --no-cache"
  }
}
```

---

## 🎯 **RESUMO DA CONFIGURAÇÃO DE TESTES**

### **✅ Configuração Completa:**
- ✅ **Jest** configurado com TypeScript
- ✅ **Testing Library** configurado
- ✅ **MSW** para mock de API
- ✅ **Test Utils** personalizados
- ✅ **Mock Data** completo
- ✅ **Exemplos de testes** para componentes, hooks e páginas
- ✅ **Scripts** de teste configurados

### **✅ Cobertura de Testes:**
- ✅ **Componentes** - Renderização e interações
- ✅ **Hooks** - Lógica de estado e efeitos
- ✅ **Páginas** - Fluxos completos
- ✅ **API** - Mock de endpoints
- ✅ **Contextos** - Providers e estado global

**Agora a configuração de testes está 100% completa!** 🚀
