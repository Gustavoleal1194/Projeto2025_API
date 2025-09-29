# 🎨 Yeti Library System - Frontend React

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-cyan.svg)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-75%25%20Complete-orange.svg)](https://github.com/Gustavoleal1194/Projeto2025_API)

## 🎯 Visão Geral

Frontend moderno do **Yeti Library System** desenvolvido com React 18, TypeScript e Vite. Interface interativa com tema Yeti personalizado, validação em tempo real e integração completa com API backend.

### ✨ Status do Frontend
- **Páginas:** 17 implementadas (100% funcionais)
- **Componentes:** 15+ implementados
- **Validações:** 100% sincronizadas com backend
- **Integração API:** 100% funcional
- **Design:** 100% responsivo e acessível

## 🚀 Tecnologias

### **Core Framework**
- **React 18.2.0** - Framework de interface
- **TypeScript 5.0.2** - Tipagem estática
- **Vite 4.4.5** - Build tool e dev server

### **Styling e UI**
- **Tailwind CSS 3.3.0** - Framework CSS utilitário
- **Framer Motion 10.16.4** - Animações avançadas
- **Lucide React** - Ícones SVG

### **Roteamento e Estado**
- **React Router DOM 6.8.1** - Roteamento SPA
- **Zustand 4.3.6** - Gerenciamento de estado
- **React Query 4.24.6** - Cache e sincronização

### **HTTP e Validação**
- **Axios 1.6.0** - Cliente HTTP
- **Validators centralizados** - Validação em tempo real
- **React Hook Form** - Gerenciamento de formulários

### **Desenvolvimento**
- **ESLint + Prettier** - Qualidade de código
- **TypeScript strict** - Tipagem rigorosa
- **Hot Module Replacement** - Desenvolvimento rápido

## 📁 Estrutura do Projeto

```
frontend-yeti/src/
├── components/                 # Componentes reutilizáveis
│   ├── Layout/                # Layouts responsivos
│   ├── Icons/                 # Ícones SVG personalizados
│   ├── NotificationModal/     # Sistema de notificações
│   └── ProtectedRoute/        # Proteção de rotas
├── pages/                     # Páginas da aplicação
│   ├── LoginPage.tsx          # Login interativo com Yeti
│   ├── Dashboard.tsx          # Dashboard administrativo
│   ├── UsuarioDashboard.tsx   # Dashboard do usuário
│   ├── GerenciarUsuarios.tsx  # CRUD usuários
│   ├── GerenciarLivros.tsx    # CRUD livros
│   ├── GerenciarExemplares.tsx # CRUD exemplares
│   ├── GerenciarFuncionarios.tsx # CRUD funcionários
│   ├── GerenciarAutores.tsx   # CRUD autores
│   ├── GerenciarEditoras.tsx  # CRUD editoras
│   ├── GerenciarEmprestimos.tsx # CRUD empréstimos
│   ├── GerenciarRelatorios.tsx # Relatórios
│   ├── Configuracoes.tsx      # Configurações
│   ├── ExplorarLivros.tsx     # Catálogo de livros
│   ├── MeusLivros.tsx         # Livros do usuário
│   ├── MeusEmprestimos.tsx    # Empréstimos do usuário
│   ├── Favoritos.tsx          # Favoritos
│   └── MeuPerfil.tsx          # Perfil do usuário
├── services/                  # Serviços de API
│   ├── authService.ts         # Autenticação
│   ├── usuarioService.ts      # Serviço usuários
│   ├── funcionarioService.ts  # Serviço funcionários
│   ├── livroService.ts        # Serviço livros
│   ├── exemplarService.ts     # Serviço exemplares
│   ├── emprestimoService.ts   # Serviço empréstimos
│   ├── autorService.ts        # Serviço autores
│   ├── editoraService.ts      # Serviço editoras
│   ├── dashboardService.ts    # Serviço dashboard
│   └── meusLivrosService.ts   # Serviço meus livros
├── validators/                # Validações centralizadas
│   ├── UsuarioValidator.ts    # Validação usuários
│   ├── FuncionarioValidator.ts # Validação funcionários
│   ├── LivroValidator.ts      # Validação livros
│   ├── ExemplarValidator.ts   # Validação exemplares
│   ├── EmprestimoValidator.ts # Validação empréstimos
│   ├── AutorValidator.ts      # Validação autores
│   └── EditoraValidator.ts    # Validação editoras
├── types/                     # Tipos TypeScript
│   └── entities.ts            # Interfaces e tipos
├── hooks/                     # Hooks personalizados
│   └── useNotifications.ts    # Hook notificações
├── contexts/                  # Contextos React
│   └── NotificationContext.tsx # Contexto notificações
└── constants/                 # Constantes e configurações
    └── entities.ts            # Rotas e constantes
```

## 🎨 Funcionalidades Implementadas

### **🔐 Sistema de Autenticação**
- **Login interativo** com animações do Yeti
- **Sistema de roles** (Admin, Funcionario, Usuario)
- **Proteção de rotas** baseada em permissões
- **JWT token** com refresh automático
- **Logout seguro** com limpeza de dados

### **📊 Dashboards**
- **Dashboard administrativo** com estatísticas em tempo real
- **Dashboard do usuário** personalizado
- **Gráficos interativos** com Charts.js
- **Alertas do sistema** em tempo real

### **📚 Gestão de Entidades**
- **CRUD completo** para todas as entidades
- **Validação em tempo real** com feedback visual
- **Busca e filtros** avançados
- **Paginação** inteligente
- **Notificações** de sucesso/erro

### **🎯 Validações Sincronizadas**
- **7 Validators** espelhando regras do backend
- **Validação em tempo real** ao digitar
- **Feedback visual** com bordas vermelhas
- **Validação HTML5** nativa
- **Mensagens consistentes** com backend

### **🎨 Interface e UX**
- **Design responsivo** mobile-first
- **Tema Yeti** personalizado
- **Animações suaves** com Framer Motion
- **Sistema de notificações** integrado
- **Acessibilidade** com ARIA labels

## ⚙️ Instalação e Execução

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Backend API rodando (porta 5072)

### **1. Instalar dependências**
```bash
npm install
```

### **2. Configurar variáveis de ambiente**
```bash
# Criar arquivo .env.local
VITE_API_BASE_URL=http://localhost:5072
VITE_APP_NAME=Yeti Library System
```

### **3. Executar em desenvolvimento**
```bash
npm run dev
# Aplicação rodando em: http://localhost:5173
```

### **4. Build para produção**
```bash
npm run build
# Arquivos gerados em: dist/
```

### **5. Preview da build**
```bash
npm run preview
# Preview rodando em: http://localhost:4173
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Lint do código
npm run lint:fix     # Corrigir problemas de lint

# Testes (quando implementados)
npm run test         # Executar testes
npm run test:coverage # Cobertura de testes
npm run test:e2e     # Testes E2E
```

## 🎯 Páginas Implementadas

### **🔐 Autenticação**
- **LoginPage** - Login interativo com animações Yeti

### **👑 Administração**
- **Dashboard** - Dashboard administrativo completo
- **GerenciarUsuarios** - CRUD de usuários
- **GerenciarFuncionarios** - CRUD de funcionários
- **GerenciarLivros** - CRUD de livros
- **GerenciarExemplares** - CRUD de exemplares
- **GerenciarAutores** - CRUD de autores
- **GerenciarEditoras** - CRUD de editoras
- **GerenciarEmprestimos** - CRUD de empréstimos
- **GerenciarRelatorios** - Relatórios administrativos
- **Configuracoes** - Configurações do sistema

### **👤 Usuário**
- **UsuarioDashboard** - Dashboard do usuário
- **ExplorarLivros** - Catálogo de livros
- **MeusLivros** - Livros emprestados
- **MeusEmprestimos** - Histórico de empréstimos
- **Favoritos** - Sistema de favoritos
- **MeuPerfil** - Perfil do usuário

## 🔒 Validações Implementadas

### **✅ Validators Centralizados**
- **UsuarioValidator** - Validação de usuários
- **FuncionarioValidator** - Validação de funcionários
- **LivroValidator** - Validação de livros
- **ExemplarValidator** - Validação de exemplares
- **EmprestimoValidator** - Validação de empréstimos
- **AutorValidator** - Validação de autores
- **EditoraValidator** - Validação de editoras

### **🎯 Características**
- **Validação em tempo real** - Campos validados ao digitar
- **Feedback visual** - Bordas vermelhas e mensagens
- **Validação HTML5** - Atributos required, maxLength, type
- **Consistência** - Mesmas regras do backend FluentValidation
- **UX otimizada** - Mensagens claras e específicas

## 🎨 Tema e Design

### **🎨 Paleta de Cores Yeti**
- **Primária:** Azul Yeti (#3B82F6)
- **Secundária:** Verde Yeti (#10B981)
- **Acento:** Laranja Yeti (#F59E0B)
- **Neutros:** Cinza Yeti (#6B7280)

### **🎭 Animações**
- **Framer Motion** - Animações suaves
- **Transições** - Hover e focus states
- **Loading** - Estados de carregamento
- **Yeti** - Animações interativas do mascote

### **📱 Responsividade**
- **Mobile-first** - Design responsivo
- **Breakpoints** - sm, md, lg, xl, 2xl
- **Touch-friendly** - Botões e inputs otimizados
- **Acessibilidade** - ARIA labels e navegação por teclado

## 🚀 Próximos Passos

### **🔧 Melhorias Técnicas**
- [ ] **Testes automatizados** - Jest + Testing Library
- [ ] **PWA** - Progressive Web App
- [ ] **Offline** - Funcionalidade offline básica
- [ ] **Performance** - Otimizações e lazy loading

### **🎨 Melhorias de UX**
- [ ] **Temas** - Sistema de temas (claro/escuro)
- [ ] **Notificações push** - Notificações em tempo real
- [ ] **Upload de imagens** - Capas de livros e avatars
- [ ] **Busca avançada** - Filtros complexos

## 📚 Documentação

- **[Mapeamento Completo](../MAPEAMENTO_COMPLETO_STATUS_PROJETO.md)** - Status detalhado do projeto
- **[Tema Yeti](../TEMA_YETI_LIBRARY_SYSTEM.md)** - Especificação do tema visual
- **[Configuração de Ambiente](../CONFIGURACAO_AMBIENTE_COMPLETA.md)** - Setup completo
- **[Hooks Utilitários](../HOOKS_UTILITARIOS_COMPLETOS.md)** - Hooks personalizados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!** ⭐
