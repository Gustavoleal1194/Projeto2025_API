# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-09-21

### 🎉 Lançamento Inicial

#### ✨ Adicionado
- **Sistema de Autenticação JWT**
  - Login de usuários e funcionários
  - Sistema de roles (Admin, Funcionario, Usuario)
  - Criação automática de administrador inicial
  - Hash seguro de senhas com SHA256

- **Gestão Completa de Livros**
  - CRUD completo de livros
  - Busca por título, gênero, autor e editora
  - Controle de disponibilidade e estoque
  - Gestão de exemplares físicos
  - Propriedades calculadas (TotalExemplares, ExemplaresDisponiveis)

- **Sistema de Exemplares**
  - Controle individual de cada cópia física
  - Localização e condição dos exemplares
  - Status de disponibilidade em tempo real
  - Histórico de aquisições

- **Gestão de Usuários e Funcionários**
  - Cadastro e gerenciamento de usuários
  - Sistema de funcionários com diferentes cargos
  - Validação de dados únicos (CPF, email)
  - Controle de ativação/desativação

- **Sistema de Empréstimos**
  - Empréstimo e devolução de exemplares
  - Renovação de empréstimos
  - Controle de prazos e multas
  - Histórico completo de empréstimos
  - Status automático de atraso

- **Gestão de Autores e Editoras**
  - CRUD completo de autores
  - CRUD completo de editoras
  - Busca e filtros avançados
  - Validação de dados únicos

- **Sistema de Relatórios**
  - Relatórios de empréstimos por período
  - Livros mais emprestados
  - Usuários com atrasos
  - Exemplares disponíveis
  - Histórico de usuários
  - Faturamento de multas

- **Dashboard Administrativo**
  - Resumo geral do sistema
  - Estatísticas de empréstimos
  - Top livros mais populares
  - Usuários ativos
  - Sistema de alertas

- **Configurações do Sistema**
  - Configurações gerais da biblioteca
  - Configurações de usuários
  - Configurações de notificações
  - Parâmetros de empréstimo e multas

#### 🏗️ Arquitetura
- **Domain-Driven Design (DDD)**
  - Separação clara de responsabilidades
  - Entidades de domínio bem definidas
  - Interfaces para desacoplamento

- **Repository Pattern**
  - Abstração da camada de dados
  - Facilita testes e manutenção
  - Reutilização de código

- **Service Layer Pattern**
  - Lógica de negócio centralizada
  - Validações e regras de negócio
  - Orquestração de operações

- **DTO Pattern**
  - Transferência segura de dados
  - Mapeamento automático com AutoMapper
  - Validação de entrada

#### 🔧 Tecnologias
- **.NET 8.0** - Framework principal
- **ASP.NET Core Web API** - API REST
- **Entity Framework Core** - ORM
- **SQL Server** - Banco de dados
- **JWT Bearer** - Autenticação
- **AutoMapper** - Mapeamento de objetos
- **Swagger/OpenAPI** - Documentação da API

#### 📊 Endpoints Implementados
- **85+ endpoints funcionais**
  - 3 endpoints de autenticação
  - 10 endpoints de livros
  - 8 endpoints de exemplares
  - 14 endpoints de empréstimos
  - 8 endpoints de usuários
  - 8 endpoints de funcionários
  - 8 endpoints de autores
  - 9 endpoints de editoras
  - 6 endpoints de relatórios
  - 5 endpoints de dashboard
  - 6 endpoints de configurações

#### 🔒 Segurança
- **Autenticação JWT** com roles
- **Validação de chaves únicas** (CPF, email, CNPJ)
- **Hash seguro de senhas** com salt
- **Controle de acesso** baseado em roles
- **Validação de dados** de entrada

#### 🧪 Qualidade
- **100% dos endpoints testados**
- **Validações de negócio** implementadas
- **Tratamento de erros** global
- **Logs estruturados** com Serilog
- **Health checks** para monitoramento

#### 📈 Performance
- **Queries otimizadas** com Include/ThenInclude
- **Índices de banco** para melhor performance
- **Paginação** em endpoints de listagem
- **Cache** de configurações

#### 🚀 Deploy
- **Docker** support
- **Docker Compose** para desenvolvimento
- **Azure App Service** ready
- **Health checks** para monitoramento

#### 📚 Documentação
- **README.md** completo
- **Documentação técnica** detalhada
- **Guia de testes no Swagger** completo
- **Swagger/OpenAPI** integrado
- **Exemplos de uso** para todos os endpoints

### 🔧 Configuração Inicial
- String de conexão configurada para LocalDB
- Migrations do banco de dados
- Configuração JWT com chave secreta
- Swagger configurado com autenticação
- CORS configurado para desenvolvimento

### 🐛 Correções
- Nenhuma correção (versão inicial)

### ⚠️ Breaking Changes
- Nenhuma (versão inicial)

---

## 📋 Próximas Versões

### [1.1.0] - Planejado
- [ ] Sistema de notificações por email
- [ ] Upload de imagens para capas de livros
- [ ] API de busca avançada com Elasticsearch
- [ ] Sistema de backup automático
- [ ] Métricas de performance em tempo real

### [1.2.0] - Planejado
- [ ] Interface web administrativa
- [ ] App mobile para usuários
- [ ] Sistema de QR Code para exemplares
- [ ] Integração com sistemas de pagamento
- [ ] Relatórios em PDF/Excel

### [2.0.0] - Planejado
- [ ] Microserviços architecture
- [ ] Event Sourcing
- [ ] CQRS pattern
- [ ] Kubernetes deployment
- [ ] Multi-tenancy support

---

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **GitHub Issues**: [Criar uma issue](https://github.com/Gustavoleal1194/Projeto2025_API/issues)
- **Email**: guuh.leal@hotmail.com
- **Documentação**: [Swagger UI](https://localhost:5072/swagger)

---

## 🙏 Agradecimentos

- Comunidade .NET
- Entity Framework Core Team
- Swagger/OpenAPI Community
- Todos os contribuidores do projeto
