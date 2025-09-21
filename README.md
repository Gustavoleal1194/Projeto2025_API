# 📚 Sistema de Gerenciamento de Biblioteca - API REST

[![.NET](https://img.shields.io/badge/.NET-8.0-blue.svg)](https://dotnet.microsoft.com/download/dotnet/8.0)
[![Entity Framework Core](https://img.shields.io/badge/Entity%20Framework%20Core-8.0-green.svg)](https://docs.microsoft.com/en-us/ef/core/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-red.svg)](https://www.microsoft.com/en-us/sql-server)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-purple.svg)](https://swagger.io/)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Entidades do Sistema](#entidades-do-sistema)
- [Sistema de Autenticação](#sistema-de-autenticação)
- [Endpoints da API](#endpoints-da-api)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Executar](#como-executar)
- [Documentação da API](#documentação-da-api)
- [Exemplos de Uso](#exemplos-de-uso)
- [Segurança](#segurança)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

Sistema completo de gerenciamento de biblioteca desenvolvido em .NET 8 com arquitetura em camadas (Clean Architecture). O projeto oferece uma API REST robusta e segura para gerenciar livros, autores, editoras, usuários, funcionários e empréstimos, com sistema de autenticação JWT e funcionalidades avançadas de busca e filtros.

### ✨ Principais Funcionalidades

- **🔐 Sistema de Autenticação JWT**: Login seguro para usuários e funcionários
- **📖 Gestão Completa de Livros**: Cadastro, edição, busca por gênero, autor, editora
- **👤 Gestão de Usuários**: Cadastro e busca de usuários com autenticação
- **👨‍💼 Gestão de Funcionários**: Sistema completo de funcionários com controle de acesso
- **📚 Sistema de Empréstimos**: Controle completo de empréstimos com status e renovações
- **🔍 Busca Avançada**: Filtros específicos para cada entidade
- **🛡️ Segurança Robusta**: Hash de senhas, validação de tokens, controle de acesso por roles
- **📊 Validação de Dados**: Validações robustas em todas as operações
- **📖 Documentação Automática**: Swagger/OpenAPI integrado

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Controllers)                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   AuthController│  │  Business       │  │   Swagger   │ │
│  │                 │  │  Controllers    │  │   UI        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   AuthService   │  │  Business       │  │  Password   │ │
│  │                 │  │  Services       │  │  Hash       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Interface Layer                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   IAuthService  │  │  IRepositories  │  │  IServices  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Repositories  │  │   Entity        │  │   Migrations│ │
│  │                 │  │   Framework     │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Entities     │  │      DTOs       │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                    Interface Layer                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  IRepositories  │  │   IServices     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 🔧 Camadas do Sistema

1. **Domain Layer**: Entidades de negócio e DTOs
2. **Interface Layer**: Contratos e interfaces dos repositórios e serviços
3. **Service Layer**: Lógica de negócio e regras de aplicação
4. **Infrastructure Layer**: Acesso a dados, repositórios e Entity Framework
5. **API Layer**: Controllers e endpoints REST

## 🛠️ Tecnologias Utilizadas

### Backend
- **.NET 8.0** - Framework principal
- **ASP.NET Core Web API** - Criação da API REST
- **Entity Framework Core 8.0** - ORM para acesso a dados
- **SQL Server** - Banco de dados relacional
- **JWT Bearer Authentication** - Autenticação e autorização
- **AutoMapper** - Mapeamento entre entidades e DTOs
- **Swagger/OpenAPI** - Documentação automática da API

### Padrões e Práticas
- **Clean Architecture** - Arquitetura limpa
- **Repository Pattern** - Padrão repositório
- **Dependency Injection** - Injeção de dependência
- **DTO Pattern** - Data Transfer Objects
- **Async/Await** - Programação assíncrona
- **JWT Authentication** - Autenticação baseada em tokens

## 📁 Estrutura do Projeto

```
Projeto2025_API/
├── 📁 Dominio/                          # Camada de Domínio
│   ├── 📁 Entidades/                    # Entidades de negócio
│   │   ├── Autor.cs
│   │   ├── Editora.cs
│   │   ├── Emprestimo.cs
│   │   ├── Funcionario.cs
│   │   ├── Livro.cs
│   │   └── Usuario.cs
│   └── 📁 Dtos/                         # Data Transfer Objects
│       ├── AutorDTO.cs
│       ├── EditoraDTO.cs
│       ├── EmprestimoDTO.cs
│       ├── FuncionarioDTO.cs
│       ├── LivroDTO.cs
│       ├── UsuarioDTO.cs
│       ├── LoginDTO.cs
│       └── TokenDTO.cs
├── 📁 Interface/                        # Camada de Interface
│   ├── 📁 Repositorio/                  # Interfaces dos repositórios
│   │   ├── IBaseRepository.cs
│   │   ├── IAutorRepositorio.cs
│   │   ├── IEditoraRepositorio.cs
│   │   ├── IEmprestimoRepositorio.cs
│   │   ├── IFuncionarioRepositorio.cs
│   │   ├── ILivroRepositorio.cs
│   │   └── IUsuarioRepositorio.cs
│   └── 📁 Service/                      # Interfaces dos serviços
│       ├── IAuthService.cs
│       ├── IAutorService.cs
│       ├── IEditoraService.cs
│       ├── IEmprestimoService.cs
│       ├── IFuncionarioService.cs
│       ├── ILivroService.cs
│       └── IUsuarioService.cs
├── 📁 Service/                          # Camada de Serviço
│   ├── AuthService.cs
│   ├── PasswordHashService.cs
│   ├── AutorService.cs
│   ├── EditoraService.cs
│   ├── EmprestimoService.cs
│   ├── FuncionarioService.cs
│   ├── LivroService.cs
│   └── UsuarioService.cs
├── 📁 InfraEstrutura/                   # Camada de Infraestrutura
│   ├── 📁 Data/                         # Contexto do Entity Framework
│   │   ├── EmpresaContexto.cs
│   │   └── ContextoEmpresaFactory.cs
│   ├── 📁 Repositorio/                  # Implementação dos repositórios
│   │   ├── BaseRepository.cs
│   │   ├── AutorRepositorio.cs
│   │   ├── EditoraRepositorio.cs
│   │   ├── EmprestimoRepositorio.cs
│   │   ├── FuncionarioRepositorio.cs
│   │   ├── LivroRepositorio.cs
│   │   └── UsuarioRepositorio.cs
│   └── 📁 Migrations/                   # Migrações do banco de dados
├── 📁 Projeto2020_API/                  # Camada da API
│   ├── 📁 Controllers/                  # Controllers da API
│   │   ├── AuthController.cs
│   │   ├── AutorController.cs
│   │   ├── EditoraController.cs
│   │   ├── EmprestimoController.cs
│   │   ├── FuncionarioController.cs
│   │   ├── LivroController.cs
│   │   └── UsuarioController.cs
│   ├── 📁 Mapping/                      # Configuração do AutoMapper
│   │   └── MappingProfile.cs
│   ├── Program.cs                       # Configuração da aplicação
│   ├── appsettings.json                 # Configurações da aplicação
│   └── appsettings.Development.json     # Configurações de desenvolvimento
└── Projeto2025_API.sln                 # Solution file
```

## 📊 Entidades do Sistema

### 📖 Livro
**Propriedades Principais:**
- **Identificação**: ID, Título, Subtítulo, ISBN, Código de Barras
- **Informações**: Ano, Edição, Número de Páginas, Idioma, Gênero, Sinopse
- **Comercial**: Preço, Quantidade em Estoque, Quantidade Disponível
- **Exemplar**: Número do Exemplar, Localização, Condição, Observações
- **Aquisição**: Data de Aquisição, Valor de Aquisição, Fornecedor
- **Controle**: Disponível, Ativo, Data de Criação
- **Relacionamentos**: Pertence a um Autor e uma Editora

### 👤 Autor
**Propriedades Principais:**
- **Identificação**: ID, Nome, Nome Completo, Nome Artístico
- **Localização**: Nacionalidade, País de Origem, Endereço, Cidade, Estado, CEP, País
- **Contato**: Website, Email, Telefone
- **Pessoal**: Data de Nascimento
- **Controle**: Ativo, Data de Criação
- **Relacionamentos**: Pode ter vários Livros

### 🏢 Editora
**Propriedades Principais:**
- **Identificação**: ID, Nome, CNPJ
- **Localização**: Endereço, Cidade, Estado, CEP, País
- **Contato**: Email, Telefone, Site
- **Institucional**: Data de Fundação
- **Controle**: Ativa, Data de Criação
- **Relacionamentos**: Pode ter vários Livros

### 👥 Usuario
**Propriedades Principais:**
- **Identificação**: ID, Nome, Email, CPF
- **Contato**: Telefone
- **Pessoal**: Data de Nascimento
- **Segurança**: Senha (hasheada)
- **Relacionamentos**: Pode ter vários Empréstimos

### 👨‍💼 Funcionario
**Propriedades Principais:**
- **Identificação**: ID, Nome, Email
- **Contato**: Telefone
- **Profissional**: Cargo, Salário, Data de Admissão, Data de Demissão
- **Segurança**: Senha (hasheada)
- **Controle**: Ativo
- **Relacionamentos**: Funcionários do sistema

### 📚 Emprestimo
**Propriedades Principais:**
- **Identificação**: ID
- **Datas**: Data de Empréstimo, Data Prevista de Devolução, Data de Devolução, Data de Renovação
- **Controle**: Status, Quantidade de Renovações, Máximo de Renovações, Multa
- **Observações**: Observações, Data de Criação, Status Ativo
- **Relacionamentos**: Pertence a um Usuario e um Livro

## 🔐 Sistema de Autenticação

### Tipos de Usuários
- **👥 Usuários**: Acesso limitado aos endpoints de usuário
- **👨‍💼 Funcionários**: Acesso completo a todos os endpoints

### Funcionalidades de Segurança
- **JWT Tokens**: Autenticação baseada em tokens com expiração de 8 horas
- **Hash de Senhas**: Senhas protegidas com SHA256 + Salt
- **Controle de Acesso**: Autorização baseada em roles
- **Validação de Tokens**: Verificação automática de assinatura e expiração

### Endpoints de Autenticação
- `POST /api/auth/login` - Login de usuários e funcionários
- `POST /api/auth/registrar` - Registro de usuários
- `POST /api/auth/registrar-funcionario` - Registro de funcionários (apenas funcionários)
- `POST /api/auth/validar-token` - Validação de token
- `GET /api/auth/me` - Informações do usuário atual

## 🚀 Endpoints da API

### 🔐 Autenticação

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

#### Registrar Usuário
```http
POST /api/auth/registrar
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "telefone": "11999999999",
  "cpf": "12345678901",
  "dataNascimento": "1990-01-01T00:00:00Z"
}
```

#### Registrar Funcionário (Apenas Funcionários)
```http
POST /api/auth/registrar-funcionario
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Maria Santos",
  "email": "maria@biblioteca.com",
  "senha": "123456",
  "telefone": "11999999999",
  "cargo": "Bibliotecária",
  "salario": 3500.00,
  "dataAdmissao": "2025-01-01T00:00:00Z"
}
```

### 📖 Livro Endpoints

#### Endpoints Básicos
- `GET /api/Livro` - Lista todos os livros
- `GET /api/Livro/{id}` - Busca livro por ID
- `POST /api/Livro` - Cria novo livro
- `PUT /api/Livro` - Atualiza livro
- `DELETE /api/Livro/{id}` - Remove livro

#### Endpoints Específicos
- `GET /api/Livro/disponiveis` - Livros disponíveis para empréstimo
- `GET /api/Livro/por-genero/{genero}` - Livros por gênero
- `GET /api/Livro/por-autor/{idAutor}` - Livros por autor
- `GET /api/Livro/por-editora/{idEditora}` - Livros por editora
- `GET /api/Livro/buscar/{termo}` - Busca livros por termo
- `GET /api/Livro/em-estoque` - Livros em estoque

### 👤 Autor Endpoints

#### Endpoints Básicos
- `GET /api/Autor` - Lista todos os autores
- `GET /api/Autor/{id}` - Busca autor por ID
- `POST /api/Autor` - Cria novo autor
- `PUT /api/Autor` - Atualiza autor
- `DELETE /api/Autor/{id}` - Remove autor

#### Endpoints Específicos
- `GET /api/Autor/por-nacionalidade/{nacionalidade}` - Autores por nacionalidade
- `GET /api/Autor/buscar/{termo}` - Busca autores por termo
- `GET /api/Autor/com-livros` - Autores que possuem livros

### 🏢 Editora Endpoints

#### Endpoints Básicos
- `GET /api/Editora` - Lista todas as editoras
- `GET /api/Editora/{id}` - Busca editora por ID
- `POST /api/Editora` - Cria nova editora
- `PUT /api/Editora` - Atualiza editora
- `DELETE /api/Editora/{id}` - Remove editora

#### Endpoints Específicos
- `GET /api/Editora/ativas` - Editoras ativas
- `GET /api/Editora/por-cidade/{cidade}` - Editoras por cidade
- `GET /api/Editora/por-estado/{estado}` - Editoras por estado
- `GET /api/Editora/buscar/{termo}` - Busca editoras por termo

### 👥 Usuario Endpoints

#### Endpoints Básicos
- `GET /api/Usuario` - Lista todos os usuários
- `GET /api/Usuario/{id}` - Busca usuário por ID
- `POST /api/Usuario` - Cria novo usuário
- `PUT /api/Usuario` - Atualiza usuário
- `DELETE /api/Usuario/{id}` - Remove usuário

#### Endpoints Específicos
- `GET /api/Usuario/por-nome/{nome}` - Usuários por nome
- `GET /api/Usuario/por-cpf/{cpf}` - Usuário por CPF

### 👨‍💼 Funcionario Endpoints (Apenas Funcionários)

#### Endpoints Básicos
- `GET /api/Funcionario` - Lista todos os funcionários
- `GET /api/Funcionario/{id}` - Busca funcionário por ID
- `POST /api/Funcionario` - Cria novo funcionário
- `PUT /api/Funcionario` - Atualiza funcionário
- `DELETE /api/Funcionario/{id}` - Remove funcionário

#### Endpoints Específicos
- `GET /api/Funcionario/por-cargo/{cargo}` - Funcionários por cargo
- `GET /api/Funcionario/ativos` - Funcionários ativos
- `GET /api/Funcionario/inativos` - Funcionários inativos
- `GET /api/Funcionario/por-email/{email}` - Funcionário por email

### 📚 Emprestimo Endpoints

#### Endpoints Básicos
- `GET /api/Emprestimo` - Lista todos os empréstimos
- `GET /api/Emprestimo/{id}` - Busca empréstimo por ID
- `POST /api/Emprestimo` - Cria novo empréstimo
- `PUT /api/Emprestimo` - Atualiza empréstimo
- `DELETE /api/Emprestimo/{id}` - Remove empréstimo

#### Endpoints Específicos
- `GET /api/Emprestimo/por-usuario/{idUsuario}` - Empréstimos por usuário
- `GET /api/Emprestimo/por-livro/{idLivro}` - Empréstimos por livro
- `GET /api/Emprestimo/ativos` - Empréstimos ativos
- `GET /api/Emprestimo/vencidos` - Empréstimos vencidos
- `GET /api/Emprestimo/por-status/{status}` - Empréstimos por status

## ⚙️ Instalação e Configuração

### Pré-requisitos

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server 2019+](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) ou [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone o Repositório

```bash
git clone https://github.com/Gustavoleal1194/Projeto2025_API.git
cd Projeto2025_API
```

### 2. Configuração do Banco de Dados

1. Abra o SQL Server Management Studio
2. Crie um novo banco de dados chamado `dbBiblioteca`
3. Atualize a connection string no arquivo `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=dbBiblioteca;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "MinhaChaveSecretaSuperSeguraParaJWT2025!@#",
    "Issuer": "Projeto2025API",
    "Audience": "Projeto2025API"
  }
}
```

### 3. Restauração de Pacotes

```bash
dotnet restore
```

### 4. Aplicação das Migrações

```bash
cd Projeto2020_API
dotnet ef database update
```

## 🚀 Como Executar

### 1. Executar a Aplicação

```bash
cd Projeto2020_API
dotnet run
```

### 2. Acessar a API

- **API Base URL**: `http://localhost:5072`
- **Swagger UI**: `http://localhost:5072/swagger`

### 3. Executar em Modo de Desenvolvimento

```bash
dotnet run --environment Development
```

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI:

1. Execute a aplicação
2. Acesse `http://localhost:5072/swagger`
3. Explore todos os endpoints disponíveis
4. Teste as operações diretamente na interface

## 💡 Exemplos de Uso

### 1. Fluxo Completo de Autenticação

#### Registrar um Usuário
```bash
curl -X POST "http://localhost:5072/api/auth/registrar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456",
    "telefone": "11999999999",
    "cpf": "12345678901",
    "dataNascimento": "1990-01-01T00:00:00Z"
  }'
```

#### Fazer Login
```bash
curl -X POST "http://localhost:5072/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

#### Usar o Token para Acessar Endpoints
```bash
curl -X GET "http://localhost:5072/api/livro" \
  -H "Authorization: Bearer <seu_token_aqui>"
```

### 2. Gestão de Livros

#### Criar um Autor
```http
POST /api/Autor
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Machado de Assis",
  "nomeCompleto": "Joaquim Maria Machado de Assis",
  "nomeArtistico": "Machado de Assis",
  "nacionalidade": "Brasileira",
  "paisOrigem": "Brasil",
  "dataNascimento": "1839-06-21",
  "website": "https://machadodeassis.com.br",
  "email": "contato@machadodeassis.com.br",
  "telefone": "(21) 99999-7777",
  "endereco": "Rua Cosme Velho, 18",
  "cidade": "Rio de Janeiro",
  "estado": "Rio de Janeiro",
  "cep": "22241-090",
  "pais": "Brasil"
}
```

#### Criar uma Editora
```http
POST /api/Editora
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Editora Globo",
  "cnpj": "12345678000195",
  "email": "contato@editoraglobo.com.br",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "pais": "Brasil",
  "site": "https://www.editoraglobo.com.br",
  "dataFundacao": "1950-01-01"
}
```

#### Criar um Livro
```http
POST /api/Livro
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Dom Casmurro",
  "subtitulo": "Romance",
  "isbn": "9788535911234",
  "idAutor": 1,
  "idEditora": 1,
  "genero": "Romance",
  "ano": 1899,
  "numeroPaginas": 256,
  "sinopse": "Romance clássico da literatura brasileira",
  "preco": 29.90,
  "quantidadeEstoque": 10,
  "quantidadeDisponivel": 10,
  "idioma": "Português",
  "edicao": 1
}
```

### 3. Gestão de Empréstimos

#### Criar um Empréstimo
```http
POST /api/Emprestimo
Authorization: Bearer <token>
Content-Type: application/json

{
  "idUsuario": 1,
  "idLivro": 1,
  "dataEmprestimo": "2024-09-20",
  "dataPrevistaDevolucao": "2024-10-04",
  "status": "Emprestado",
  "maxRenovacoes": 2,
  "observacoes": "Empréstimo regular"
}
```

### 4. Buscas Específicas

#### Buscar Livros por Gênero
```http
GET /api/Livro/por-genero/Romance
Authorization: Bearer <token>
```

#### Buscar Usuários por Nome
```http
GET /api/Usuario/por-nome/João
Authorization: Bearer <token>
```

#### Buscar Empréstimos Ativos
```http
GET /api/Emprestimo/ativos
Authorization: Bearer <token>
```

## 🛡️ Segurança

### Autenticação JWT
- **Tokens**: Válidos por 8 horas
- **Algoritmo**: HMAC SHA256
- **Claims**: Nome, Email, Role, JTI
- **Validação**: Assinatura, emissor, audiência e expiração

### Hash de Senhas
- **Algoritmo**: SHA256 + Salt
- **Salt**: "Projeto2025_Salt_Key"
- **Aplicação**: Automática nos endpoints de registro

### Controle de Acesso
- **Usuários**: Acesso limitado aos endpoints de usuário
- **Funcionários**: Acesso completo a todos os endpoints
- **Proteção**: Todos os endpoints principais requerem autenticação

### Validações
- **Campos Obrigatórios**: Validação automática de modelos
- **Tipos de Dados**: Validação de tipos e formatos
- **Unicidade**: Email único para usuários e funcionários
- **Integridade**: Relacionamentos entre entidades

## 🧪 Testes

### Testes Manuais via Swagger

1. Acesse `http://localhost:5072/swagger`
2. Selecione um endpoint
3. Clique em "Try it out"
4. Preencha os parâmetros necessários
5. Execute a requisição

### Testes via cURL

```bash
# Teste de login
curl -X POST "http://localhost:5072/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@email.com", "senha": "123456"}'

# Teste de listagem de livros
curl -X GET "http://localhost:5072/api/livro" \
  -H "Authorization: Bearer <token>"
```

### Testes via PowerShell

```powershell
# Teste de criação de autor
$body = @{
    nome = "Teste Autor"
    nacionalidade = "Brasileira"
    dataNascimento = "1990-01-01"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5072/api/Autor" -Method POST -Body $body -ContentType "application/json" -Headers @{"Authorization" = "Bearer <token>"}
```

## 🔧 Configurações Avançadas

### Configuração de Logs
Os logs são salvos automaticamente na pasta `logs/` com formato:
- Nome do arquivo: `api-YYYYMMDD.txt`
- Rotação diária automática

### Configuração de CORS
Para permitir requisições de outros domínios, configure no `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

### Configuração de Validação
O sistema utiliza validação automática de modelos com:
- Validação de campos obrigatórios
- Validação de tipos de dados
- Validação de formatos (email, data, etc.)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use PascalCase para classes e métodos
- Use camelCase para propriedades e variáveis
- Documente métodos públicos com XML comments
- Mantenha a arquitetura em camadas
- Escreva testes unitários para novas funcionalidades

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma [Issue](https://github.com/Gustavoleal1194/Projeto2025_API/issues)
- Entre em contato via email: [seu-email@exemplo.com]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido por [Gustavo Leal](https://github.com/Gustavoleal1194)**