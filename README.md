# 📚 Sistema de Gerenciamento de Biblioteca - API REST

[![.NET](https://img.shields.io/badge/.NET-8.0-blue.svg)](https://dotnet.microsoft.com/download/dotnet/8.0)
[![Entity Framework Core](https://img.shields.io/badge/Entity%20Framework%20Core-8.0-green.svg)](https://docs.microsoft.com/en-us/ef/core/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-red.svg)](https://www.microsoft.com/en-us/sql-server)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-orange.svg)](https://swagger.io/)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Entidades do Sistema](#entidades-do-sistema)
- [Endpoints da API](#endpoints-da-api)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Executar](#como-executar)
- [Documentação da API](#documentação-da-api)
- [Exemplos de Uso](#exemplos-de-uso)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

Sistema completo de gerenciamento de biblioteca desenvolvido em .NET 8 com arquitetura em camadas (Clean Architecture). O projeto oferece uma API REST robusta para gerenciar livros, autores, editoras, usuários, funcionários e empréstimos, com funcionalidades avançadas de busca e filtros.

### ✨ Principais Funcionalidades

- **Gestão Completa de Livros**: Cadastro, edição, busca por gênero, autor, editora
- **Sistema de Empréstimos**: Controle de empréstimos com status e renovações
- **Gestão de Usuários**: Cadastro e busca de usuários com autenticação por senha
- **Gestão de Funcionários**: Sistema completo de funcionários com autenticação por senha
- **Sistema de Autenticação**: Campos de senha obrigatórios para Usuários e Funcionários
- **Busca Avançada**: Filtros específicos para cada entidade
- **Validação de Dados**: Validações robustas em todas as operações
- **Documentação Automática**: Swagger/OpenAPI integrado

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Controllers)                  │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│                    Interface Layer                          │
├─────────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Repositories  │  │   Entity        │  │   Migrations│ │
│  │                 │  │   Framework     │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │    Entities     │  │      DTOs       │  │  Interfaces │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 🔧 Camadas do Sistema

1. **Domain Layer**: Entidades de negócio, DTOs e interfaces
2. **Interface Layer**: Contratos e interfaces dos serviços
3. **Service Layer**: Lógica de negócio e regras de aplicação
4. **Infrastructure Layer**: Acesso a dados, repositórios e Entity Framework
5. **API Layer**: Controllers e endpoints REST

## 🛠️ Tecnologias Utilizadas

### Backend
- **.NET 8.0** - Framework principal
- **ASP.NET Core Web API** - Criação da API REST
- **Entity Framework Core 8.0** - ORM para acesso a dados
- **SQL Server** - Banco de dados relacional
- **AutoMapper** - Mapeamento entre entidades e DTOs
- **Swagger/OpenAPI** - Documentação automática da API

### Padrões e Práticas
- **Clean Architecture** - Arquitetura limpa
- **Repository Pattern** - Padrão repositório
- **Dependency Injection** - Injeção de dependência
- **DTO Pattern** - Data Transfer Objects
- **Async/Await** - Programação assíncrona

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
│       └── UsuarioDTO.cs
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
│       ├── IAutorService.cs
│       ├── IEditoraService.cs
│       ├── IEmprestimoService.cs
│       ├── IFuncionarioService.cs
│       ├── ILivroService.cs
│       └── IUsuarioService.cs
├── 📁 Service/                          # Camada de Serviço
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
│   │   ├── AutorController.cs
│   │   ├── EditoraController.cs
│   │   ├── EmprestimoController.cs
│   │   ├── FuncionarioController.cs
│   │   ├── LivroController.cs
│   │   └── UsuarioController.cs
│   ├── 📁 Mapping/                      # Configuração do AutoMapper
│   │   └── MappingProfile.cs
│   ├── Program.cs                       # Configuração da aplicação
│   └── appsettings.json                 # Configurações da aplicação
└── Projeto2025_API.sln                 # Solution file
```

## 📊 Entidades do Sistema

### 📖 Livro
- **Propriedades**: ID, Título, Subtítulo, ISBN, Autor, Editora, Gênero, Ano, Páginas, Sinopse, Preço, Quantidade em Estoque, Quantidade Disponível, Código de Barras, Número do Exemplar, Condição, Localização, Observações do Exemplar, Data de Aquisição, Valor de Aquisição, Fornecedor, Edição, Idioma, Capa URL
- **Relacionamentos**: Pertence a um Autor e uma Editora

### 👤 Autor
- **Propriedades**: ID, Nome, Nome Completo, Nome Artístico, Nacionalidade, País de Origem, Data de Nascimento, Website, Email, Telefone, Endereço, Cidade, Estado, CEP, País, Status Ativo, Data de Criação
- **Relacionamentos**: Pode ter vários Livros

### 🏢 Editora
- **Propriedades**: ID, Nome, CNPJ, Email, Telefone, Endereço, Cidade, Estado, CEP, País, Site, Data de Fundação, Data de Criação, Status Ativo
- **Relacionamentos**: Pode ter vários Livros

### 👥 Usuario
- **Propriedades**: ID, Nome, Email, Telefone, Senha, CPF, Data de Nascimento
- **Relacionamentos**: Pode ter vários Empréstimos
- **Segurança**: Campo senha obrigatório para autenticação

### 👨‍💼 Funcionario
- **Propriedades**: ID, Nome, Email, Telefone, Senha, Cargo, Salário, Data de Admissão, Data de Demissão, Status Ativo
- **Relacionamentos**: Funcionários do sistema
- **Segurança**: Campo senha obrigatório para autenticação

### 📚 Emprestimo
- **Propriedades**: ID, Usuario, Livro, Data de Empréstimo, Data Prevista de Devolução, Data de Devolução, Data de Renovação, Status, Quantidade de Renovações, Máximo de Renovações, Multa, Observações, Data de Criação, Status Ativo
- **Relacionamentos**: Pertence a um Usuario e um Livro

## 🚀 Endpoints da API

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

### 👨‍💼 Funcionario Endpoints

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
    "DefaultConnection": "Server=localhost;Database=dbBiblioteca;Trusted_Connection=true;TrustServerCertificate=true;"
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

### Criar um Autor

```http
POST /api/Autor
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
  "pais": "Brasil",
  "ativo": true
}
```

### Criar uma Editora

```http
POST /api/Editora
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

### Criar um Livro

```http
POST /api/Livro
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
  "edicao": "1ª Edição"
}
```

### Criar um Usuário

```http
POST /api/Usuario
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "telefone": "(11) 99999-8888",
  "senha": "minhasenha123",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15"
}
```

### Buscar Usuário por CPF

```http
GET /api/Usuario/por-cpf/12345678901
```

**Resposta:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "telefone": "(11) 99999-8888",
  "senha": "minhasenha123",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15T00:00:00"
}
```

### Criar um Funcionário

```http
POST /api/Funcionario
Content-Type: application/json

{
  "nome": "Maria Santos",
  "email": "maria.santos@biblioteca.com",
  "telefone": "(11) 99999-7777",
  "senha": "senhafuncionario123",
  "cargo": "Bibliotecária",
  "salario": 3500.00,
  "dataAdmissao": "2024-01-15"
}
```

### Criar um Empréstimo

```http
POST /api/Emprestimo
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

### Buscar Livros por Gênero

```http
GET /api/Livro/por-genero/Romance
```

### Buscar Usuários por Nome

```http
GET /api/Usuario/por-nome/João
```

### Buscar Empréstimos Ativos

```http
GET /api/Emprestimo/ativos
```

## 🧪 Testes

### Testes Manuais via Swagger

1. Acesse `http://localhost:5072/swagger`
2. Selecione um endpoint
3. Clique em "Try it out"
4. Preencha os parâmetros necessários
5. Execute a requisição

### Testes via PowerShell

```powershell
# Teste de criação de autor
$body = @{
    nome = "Teste Autor"
    nacionalidade = "Brasileira"
    dataNascimento = "1990-01-01"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5072/api/Autor" -Method POST -Body $body -ContentType "application/json"
```

### Testes via cURL

```bash
# Listar todos os livros
curl -X GET "http://localhost:5072/api/Livro" -H "accept: application/json"

# Buscar livros disponíveis
curl -X GET "http://localhost:5072/api/Livro/disponiveis" -H "accept: application/json"
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

## 📝 Changelog

### v1.0.0 (2024-09-20)
- ✨ Implementação inicial do sistema
- 📚 Gestão completa de livros, autores, editoras
- 👥 Sistema de usuários e funcionários
- 📖 Sistema de empréstimos
- 🔍 Endpoints de busca avançada
- 📖 Documentação Swagger completa
- 🏗️ Arquitetura Clean Architecture
- 🗄️ Migrações do Entity Framework

## 🐛 Problemas Conhecidos

- **DELETE de Autor com Livros**: Não é possível deletar um autor que possui livros associados (comportamento esperado por integridade referencial)
- **Caracteres Especiais**: Evite usar acentos em testes via JSON para evitar problemas de codificação

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma [Issue](https://github.com/Gustavoleal1194/Projeto2025_API/issues)
- Entre em contato via email: [seu-email@exemplo.com]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📝 Changelog

### v1.4.0 - Novo Endpoint GET por CPF para Usuario (2025-09-20)

#### ✨ Novas Funcionalidades
- **Endpoint GET por CPF**: Adicionado `GET /api/Usuario/por-cpf/{cpf}` para busca de usuário por CPF
- **Busca Eficiente**: Implementação otimizada com `FirstOrDefaultAsync` para busca única
- **Validação Robusta**: Retorna 404 Not Found para CPF inexistente

#### 🔧 Melhorias
- **Interface IUsuarioRepositorio**: Adicionado método `GetByCpfAsync(string cpf)`
- **UsuarioRepositorio**: Implementação do método de busca por CPF
- **IUsuarioService**: Adicionado método `GetByCpfAsync(string cpf)`
- **UsuarioService**: Implementação com mapeamento AutoMapper
- **UsuarioController**: Novo endpoint com validação de retorno
- **Documentação Atualizada**: README com exemplo de uso do novo endpoint

#### 🧪 Testes
- **CPF Existente**: Testado com CPF válido - retorna dados do usuário
- **CPF Inexistente**: Testado com CPF inválido - retorna 404 Not Found
- **Compatibilidade**: Endpoints existentes continuam funcionando normalmente

### v1.3.0 - Enriquecimento de Entidades e Otimização (2025-09-20)

#### ✨ Novas Funcionalidades
- **Autor Enriquecido**: Adicionadas propriedades essenciais para Autor (Nome Completo, Nome Artístico, País de Origem, Website, Email, Telefone, Endereço completo)
- **Usuario Aprimorado**: Adicionados CPF e Data de Nascimento para identificação única
- **Estrutura Otimizada**: Removidas propriedades desnecessárias do Autor (DataFalecimento, Biografia, GeneroLiterario, FormacaoAcademica, Premios)

#### 🔧 Melhorias
- **Entidade Autor**: Agora com 16 propriedades essenciais para sistema de biblioteca
- **Entidade Usuario**: CPF com validação única e Data de Nascimento obrigatória
- **Migrações Aplicadas**: `EnrichAutorAndUsuarioFinal` e `RemoveUnnecessaryAutorProperties`
- **Validações Robustas**: Índices únicos com filtros para CPF e Email
- **Documentação Atualizada**: README com exemplos completos das novas estruturas

#### 🗄️ Banco de Dados
- **Migração EnrichAutorAndUsuarioFinal**: Adicionadas novas colunas para Autor e Usuario
- **Migração RemoveUnnecessaryAutorProperties**: Removidas colunas desnecessárias do Autor
- **Índices Otimizados**: CPF com filtro para valores vazios, mantendo unicidade

### v1.2.0 - Adição de Campos de Senha (2025-09-20)

#### ✨ Novas Funcionalidades
- **Sistema de Autenticação**: Adicionados campos de senha obrigatórios para Usuários e Funcionários
- **Validação de Segurança**: Campos de senha com validação de tamanho máximo (255 caracteres)
- **Migração de Banco**: Criada migração `AddPasswordFields` para adicionar campos no banco de dados
- **Atualização de Dados**: Todos os registros existentes foram atualizados com senhas padrão

#### 🔧 Melhorias
- **DTOs Atualizados**: UsuarioDTO e FuncionarioDTO agora incluem campo senha
- **Entidades Atualizadas**: Usuario e Funcionario com campo senha obrigatório
- **Contexto de Banco**: Configurações de validação para campos de senha
- **Documentação**: README atualizado com exemplos de uso incluindo senhas

#### 🛡️ Segurança
- **Campos Obrigatórios**: Senha é obrigatória para criação de Usuários e Funcionários
- **Validação de Tamanho**: Senhas limitadas a 255 caracteres
- **Índices Únicos**: Mantidos índices únicos em email para Usuários e Funcionários

---

## 🎯 Próximos Passos

- [ ] Implementar sistema de login e JWT tokens
- [ ] Adicionar testes unitários automatizados
- [ ] Implementar cache com Redis
- [ ] Adicionar logging estruturado com Serilog
- [ ] Implementar paginação nos endpoints de listagem
- [ ] Adicionar documentação de API com XML comments
- [ ] Implementar rate limiting
- [ ] Adicionar métricas e monitoramento
- [ ] Implementar hash de senhas com BCrypt

---

**Desenvolvido por [Gustavo Leal](https://github.com/Gustavoleal1194)**
