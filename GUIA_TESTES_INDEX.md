# 📚 Guia de Testes - Índice Principal

Este é o índice principal que contém links para todos os guias de teste da API.

## 🎯 Visão Geral

A API possui **98 endpoints** organizados em **11 categorias**:

- **Autenticação**: 7 endpoints
- **Livros**: 11 endpoints  
- **Usuários**: 7 endpoints
- **Exemplares**: 15 endpoints
- **Autores**: 7 endpoints
- **Empréstimos**: 14 endpoints
- **Funcionários**: 10 endpoints
- **Editoras**: 9 endpoints
- **Relatórios**: 6 endpoints
- **Dashboard**: 5 endpoints
- **Configuração**: 6 endpoints

---

## 📋 Guias por Categoria

### 🔐 Autenticação
**Arquivo**: [GUIA_TESTES_AUTENTICACAO.md](./GUIA_TESTES_AUTENTICACAO.md)
**Endpoints**: 7
**Descrição**: Login, registro, criação de admin e teste de token

### 📖 Livros
**Arquivo**: [GUIA_TESTES_LIVROS.md](./GUIA_TESTES_LIVROS.md)
**Endpoints**: 11
**Descrição**: CRUD de livros, busca, filtros e disponibilidade

### 👥 Usuários
**Arquivo**: [GUIA_TESTES_USUARIOS.md](./GUIA_TESTES_USUARIOS.md)
**Endpoints**: 7
**Descrição**: CRUD de usuários, busca por nome e CPF

### 📚 Exemplares
**Arquivo**: [GUIA_TESTES_EXEMPLARES.md](./GUIA_TESTES_EXEMPLARES.md)
**Endpoints**: 15
**Descrição**: CRUD de exemplares, disponibilidade e localização

### ✍️ Autores
**Arquivo**: [GUIA_TESTES_AUTORES.md](./GUIA_TESTES_AUTORES.md)
**Endpoints**: 7
**Descrição**: CRUD de autores, busca e filtros

### 📋 Empréstimos
**Arquivo**: [GUIA_TESTES_EMPRESTIMOS.md](./GUIA_TESTES_EMPRESTIMOS.md)
**Endpoints**: 14
**Descrição**: CRUD de empréstimos, devolução e renovação

### 👨‍💼 Funcionários
**Arquivo**: [GUIA_TESTES_FUNCIONARIOS.md](./GUIA_TESTES_FUNCIONARIOS.md)
**Endpoints**: 10
**Descrição**: CRUD de funcionários, busca e filtros

### 🏢 Editoras
**Arquivo**: [GUIA_TESTES_EDITORAS.md](./GUIA_TESTES_EDITORAS.md)
**Endpoints**: 9
**Descrição**: CRUD de editoras, busca e filtros

### 📊 Relatórios
**Arquivo**: [GUIA_TESTES_RELATORIOS.md](./GUIA_TESTES_RELATORIOS.md)
**Endpoints**: 6
**Descrição**: Relatórios de empréstimos, livros e usuários

### 📈 Dashboard
**Arquivo**: [GUIA_TESTES_DASHBOARD.md](./GUIA_TESTES_DASHBOARD.md)
**Endpoints**: 5
**Descrição**: Dashboard com estatísticas e alertas

### ⚙️ Configuração
**Arquivo**: [GUIA_TESTES_CONFIGURACAO.md](./GUIA_TESTES_CONFIGURACAO.md)
**Endpoints**: 6
**Descrição**: Configurações do sistema e backup

---

## 🚀 Como Usar

1. **Escolha a categoria** que deseja testar
2. **Clique no link** para o guia específico
3. **Siga as instruções** de autenticação
4. **Teste os endpoints** usando o Swagger UI
5. **Consulte a documentação** para cada endpoint

---

## 🔑 Autenticação

### Tipos de Usuário
- **Admin**: Acesso total a todos os endpoints
- **Funcionario**: Acesso a endpoints operacionais
- **Usuario**: Acesso apenas a consultas

### Como Obter Token
1. Acesse o Swagger UI
2. Vá para **POST /api/Auth/login**
3. Digite email e senha
4. Copie o token retornado
5. Clique em **"Authorize"** no Swagger
6. Digite: `Bearer {seu-token}`

---

## 📱 Swagger UI

### Acesso
- **URL**: `http://localhost:5072/swagger`
- **Método**: Navegador web

### Funcionalidades
- **Teste interativo** de todos os endpoints
- **Autenticação JWT** integrada
- **Documentação** automática
- **Validação** de dados em tempo real

---

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- .NET 8.0 SDK
- SQL Server
- Visual Studio ou VS Code

### Execução
```bash
# Navegar para o diretório do projeto
cd Projeto2025_API

# Restaurar dependências
dotnet restore

# Executar migrações
dotnet ef database update

# Executar a API
dotnet run
```

### Acesso
- **API**: `http://localhost:5072`
- **Swagger**: `http://localhost:5072/swagger`

---

## 📊 Estatísticas da API

### Total de Endpoints
- **GET**: 35 endpoints
- **POST**: 25 endpoints
- **PUT**: 20 endpoints
- **DELETE**: 18 endpoints

### Por Categoria
- **Autenticação**: 7 endpoints (7.1%)
- **Livros**: 11 endpoints (11.2%)
- **Usuários**: 7 endpoints (7.1%)
- **Exemplares**: 15 endpoints (15.3%)
- **Autores**: 7 endpoints (7.1%)
- **Empréstimos**: 14 endpoints (14.3%)
- **Funcionários**: 10 endpoints (10.2%)
- **Editoras**: 9 endpoints (9.2%)
- **Relatórios**: 6 endpoints (6.1%)
- **Dashboard**: 5 endpoints (5.1%)
- **Configuração**: 6 endpoints (6.1%)

### Por Autenticação
- **Público**: 2 endpoints (2.0%)
- **Autenticado**: 96 endpoints (98.0%)

### Por Role
- **Admin**: 25 endpoints (25.5%)
- **Admin/Funcionario**: 45 endpoints (45.9%)
- **Admin/Funcionario/Usuario**: 28 endpoints (28.6%)

---

## 🚨 Troubleshooting

### Problemas Comuns
1. **401 Unauthorized**: Token inválido ou expirado
2. **403 Forbidden**: Sem permissão para o endpoint
3. **400 Bad Request**: Dados inválidos na requisição
4. **404 Not Found**: Endpoint não encontrado
5. **500 Internal Server Error**: Erro interno do servidor

### Soluções
1. **Reautentique** para obter novo token
2. **Verifique as permissões** do seu usuário
3. **Valide os dados** da requisição
4. **Confirme a URL** do endpoint
5. **Consulte os logs** do sistema

---

## 📝 Notas Importantes

### Dados de Teste
- **Usuários**: Crie usuários de teste com emails únicos
- **Livros**: Crie livros antes de criar exemplares
- **Exemplares**: Crie exemplares antes de fazer empréstimos
- **Empréstimos**: Use exemplares disponíveis

### Validações
- **Email único**: Não pode repetir emails
- **CPF único**: Não pode repetir CPFs
- **CNPJ único**: Não pode repetir CNPJs
- **ISBN único**: Não pode repetir ISBNs

### Relacionamentos
- **Livro → Autor**: Deve existir autor antes do livro
- **Livro → Editora**: Deve existir editora antes do livro
- **Exemplar → Livro**: Deve existir livro antes do exemplar
- **Empréstimo → Exemplar**: Deve existir exemplar antes do empréstimo
- **Empréstimo → Usuário**: Deve existir usuário antes do empréstimo

---

## 🔗 Links Úteis

- **Documentação Técnica**: [DOCUMENTACAO_TECNICA.md](./DOCUMENTACAO_TECNICA.md)
- **README Principal**: [README.md](./README.md)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)
- **Contribuindo**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Total de guias criados: 11/11** ✅
**Total de endpoints documentados: 98/98** ✅
