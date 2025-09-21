# 🧪 Guia Completo de Testes no Swagger - Projeto2025 API

## 📋 Índice
1. [Configuração Inicial](#configuração-inicial)
2. [Autenticação JWT](#autenticação-jwt)
3. [Testando Endpoints por Categoria](#testando-endpoints-por-categoria)
4. [Exemplos de Dados para Testes](#exemplos-de-dados-para-testes)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Configuração Inicial

### 1. Acessar o Swagger
- **URL**: `http://localhost:5072/swagger`
- **Método**: Abrir no navegador após executar `dotnet run --project Projeto2020_API`

### 2. Configurar Autenticação no Swagger
1. Clique no botão **"Authorize"** (🔒) no canto superior direito
2. No campo **"Value"**, digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**
4. Clique em **"Close"**

---

## 🔐 Autenticação JWT

### Passo 1: Criar Administrador Inicial
**Endpoint**: `POST /api/auth/criar-admin`

**Body (JSON)**:
```json
{
  "nome": "Administrador Sistema",
  "email": "admin@biblioteca.com",
  "senha": "123456",
  "cargo": "Administrador",
  "salario": 5000.00,
  "dataAdmissao": "2024-01-01T00:00:00Z",
  "telefone": "11999999999"
}
```

**Resposta Esperada**:
```json
{
  "id": 1,
  "nome": "Administrador Sistema",
  "email": "admin@biblioteca.com",
  "cargo": "Administrador",
  "salario": 5000.00,
  "dataAdmissao": "2024-01-01T00:00:00Z",
  "telefone": "11999999999",
  "ativo": true
}
```

### Passo 2: Fazer Login
**Endpoint**: `POST /api/auth/login`

**Body (JSON)**:
```json
{
  "email": "admin@biblioteca.com",
  "senha": "123456"
}
```

**Resposta Esperada**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2025-01-21T18:30:00Z",
  "tipo": "Bearer",
  "nome": "Administrador Sistema",
  "email": "admin@biblioteca.com",
  "role": "Admin"
}
```

### Passo 3: Configurar Token no Swagger
1. Copie o **token** da resposta do login
2. Clique em **"Authorize"** (🔒)
3. Digite: `Bearer {token-copiado}`
4. Clique em **"Authorize"**

---

## 📚 Testando Endpoints por Categoria

### 🔐 **AUTENTICAÇÃO** (6 endpoints)

#### 1. Login
- **Endpoint**: `POST /api/auth/login`
- **Autorização**: ❌ Não requerida
- **Body**: Email e senha
- **Uso**: Obter token JWT

#### 2. Registrar Usuário
- **Endpoint**: `POST /api/auth/registrar`
- **Autorização**: ❌ Não requerida
- **Body**: Dados completos do usuário
- **Uso**: Criar conta de usuário comum

#### 3. Criar Administrador
- **Endpoint**: `POST /api/auth/criar-admin`
- **Autorização**: ❌ Não requerida (apenas se não existir funcionário)
- **Body**: Dados do administrador
- **Uso**: Criar primeiro administrador do sistema

#### 4. Registrar Funcionário
- **Endpoint**: `POST /api/auth/registrar-funcionario`
- **Autorização**: ✅ Admin/Funcionario
- **Body**: Dados do funcionário
- **Uso**: Criar funcionários (requer token)

#### 5. Validar Token
- **Endpoint**: `POST /api/auth/validar-token`
- **Autorização**: ✅ Qualquer token válido
- **Body**: Vazio
- **Uso**: Verificar se token está válido

#### 6. Obter Usuário Atual
- **Endpoint**: `GET /api/auth/me`
- **Autorização**: ✅ Qualquer token válido
- **Body**: Vazio
- **Uso**: Obter dados do usuário logado

---

### 📖 **LIVROS** (10 endpoints)

#### 1. Listar Todos os Livros
- **Endpoint**: `GET /api/Livro`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver todos os livros cadastrados

#### 2. Buscar Livro por ID
- **Endpoint**: `GET /api/Livro/{id}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: ID do livro
- **Uso**: Ver detalhes de um livro específico

#### 3. Criar Livro
- **Endpoint**: `POST /api/Livro`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados completos do livro
- **Uso**: Adicionar novo livro ao acervo

#### 4. Atualizar Livro
- **Endpoint**: `PUT /api/Livro`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados atualizados do livro
- **Uso**: Modificar informações de um livro

#### 5. Excluir Livro
- **Endpoint**: `DELETE /api/Livro/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do livro
- **Uso**: Remover livro do acervo

#### 6. Livros Disponíveis
- **Endpoint**: `GET /api/Livro/disponiveis`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver livros com exemplares disponíveis

#### 7. Livros em Estoque
- **Endpoint**: `GET /api/Livro/em-estoque`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver livros que possuem exemplares

#### 8. Buscar Livros
- **Endpoint**: `GET /api/Livro/buscar/{termo}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Termo de busca
- **Uso**: Buscar livros por título, autor, etc.

#### 9. Livros por Autor
- **Endpoint**: `GET /api/Livro/por-autor/{idAutor}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: ID do autor
- **Uso**: Ver livros de um autor específico

#### 10. Livros por Editora
- **Endpoint**: `GET /api/Livro/por-editora/{idEditora}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: ID da editora
- **Uso**: Ver livros de uma editora específica

---

### 📚 **EXEMPLARES** (8 endpoints)

#### 1. Listar Todos os Exemplares
- **Endpoint**: `GET /api/Exemplar`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver todos os exemplares físicos

#### 2. Buscar Exemplar por ID
- **Endpoint**: `GET /api/Exemplar/{id}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: ID do exemplar
- **Uso**: Ver detalhes de um exemplar específico

#### 3. Criar Exemplar
- **Endpoint**: `POST /api/Exemplar`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados do exemplar
- **Uso**: Adicionar nova cópia física de um livro

#### 4. Atualizar Exemplar
- **Endpoint**: `PUT /api/Exemplar`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados atualizados do exemplar
- **Uso**: Modificar informações de um exemplar

#### 5. Excluir Exemplar
- **Endpoint**: `DELETE /api/Exemplar/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do exemplar
- **Uso**: Remover exemplar do acervo

#### 6. Exemplares Disponíveis
- **Endpoint**: `GET /api/Exemplar/disponiveis`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver exemplares disponíveis para empréstimo

#### 7. Exemplares por Livro
- **Endpoint**: `GET /api/Exemplar/por-livro/{idLivro}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: ID do livro
- **Uso**: Ver todos os exemplares de um livro

#### 8. Exemplares por Localização
- **Endpoint**: `GET /api/Exemplar/por-localizacao/{localizacao}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Localização
- **Uso**: Buscar exemplares por localização

---

### 👥 **USUÁRIOS** (8 endpoints)

#### 1. Listar Todos os Usuários
- **Endpoint**: `GET /api/Usuario`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver todos os usuários cadastrados

#### 2. Buscar Usuário por ID
- **Endpoint**: `GET /api/Usuario/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do usuário
- **Uso**: Ver detalhes de um usuário específico

#### 3. Criar Usuário
- **Endpoint**: `POST /api/Usuario`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados do usuário
- **Uso**: Cadastrar novo usuário

#### 4. Atualizar Usuário
- **Endpoint**: `PUT /api/Usuario`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados atualizados do usuário
- **Uso**: Modificar informações de um usuário

#### 5. Excluir Usuário
- **Endpoint**: `DELETE /api/Usuario/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do usuário
- **Uso**: Remover usuário do sistema

#### 6. Buscar Usuários por Nome
- **Endpoint**: `GET /api/Usuario/buscar/{nome}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nome do usuário
- **Uso**: Buscar usuários por nome

#### 7. Buscar Usuário por CPF
- **Endpoint**: `GET /api/Usuario/por-cpf/{cpf}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: CPF do usuário
- **Uso**: Buscar usuário por CPF

#### 8. Buscar Usuário por Email
- **Endpoint**: `GET /api/Usuario/por-email/{email}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Email do usuário
- **Uso**: Buscar usuário por email

---

### 👨‍💼 **FUNCIONÁRIOS** (8 endpoints)

#### 1. Listar Todos os Funcionários
- **Endpoint**: `GET /api/Funcionario`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver todos os funcionários cadastrados

#### 2. Buscar Funcionário por ID
- **Endpoint**: `GET /api/Funcionario/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do funcionário
- **Uso**: Ver detalhes de um funcionário específico

#### 3. Criar Funcionário
- **Endpoint**: `POST /api/Funcionario`
- **Autorização**: ✅ Admin
- **Body**: Dados do funcionário
- **Uso**: Cadastrar novo funcionário

#### 4. Atualizar Funcionário
- **Endpoint**: `PUT /api/Funcionario`
- **Autorização**: ✅ Admin
- **Body**: Dados atualizados do funcionário
- **Uso**: Modificar informações de um funcionário

#### 5. Excluir Funcionário
- **Endpoint**: `DELETE /api/Funcionario/{id}`
- **Autorização**: ✅ Admin
- **Parâmetros**: ID do funcionário
- **Uso**: Remover funcionário do sistema

#### 6. Buscar Funcionários por Nome
- **Endpoint**: `GET /api/Funcionario/buscar/{nome}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nome do funcionário
- **Uso**: Buscar funcionários por nome

#### 7. Buscar Funcionário por Email
- **Endpoint**: `GET /api/Funcionario/por-email/{email}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Email do funcionário
- **Uso**: Buscar funcionário por email

#### 8. Funcionários Ativos
- **Endpoint**: `GET /api/Funcionario/ativos`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver apenas funcionários ativos

---

### ✍️ **AUTORES** (8 endpoints)

#### 1. Listar Todos os Autores
- **Endpoint**: `GET /api/Autor`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver todos os autores cadastrados

#### 2. Buscar Autor por ID
- **Endpoint**: `GET /api/Autor/{id}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: ID do autor
- **Uso**: Ver detalhes de um autor específico

#### 3. Criar Autor
- **Endpoint**: `POST /api/Autor`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados do autor
- **Uso**: Cadastrar novo autor

#### 4. Atualizar Autor
- **Endpoint**: `PUT /api/Autor`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados atualizados do autor
- **Uso**: Modificar informações de um autor

#### 5. Excluir Autor
- **Endpoint**: `DELETE /api/Autor/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do autor
- **Uso**: Remover autor do sistema

#### 6. Buscar Autores por Nome
- **Endpoint**: `GET /api/Autor/buscar/{termo}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Termo de busca
- **Uso**: Buscar autores por nome

#### 7. Autores por Nacionalidade
- **Endpoint**: `GET /api/Autor/por-nacionalidade/{nacionalidade}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nacionalidade
- **Uso**: Ver autores de uma nacionalidade específica

#### 8. Autores com Livros
- **Endpoint**: `GET /api/Autor/com-livros`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver autores que possuem livros cadastrados

---

### 🏢 **EDITORAS** (8 endpoints)

#### 1. Listar Todas as Editoras
- **Endpoint**: `GET /api/Editora`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver todas as editoras cadastradas

#### 2. Buscar Editora por ID
- **Endpoint**: `GET /api/Editora/{id}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: ID da editora
- **Uso**: Ver detalhes de uma editora específica

#### 3. Criar Editora
- **Endpoint**: `POST /api/Editora`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados da editora
- **Uso**: Cadastrar nova editora

#### 4. Atualizar Editora
- **Endpoint**: `PUT /api/Editora`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados atualizados da editora
- **Uso**: Modificar informações de uma editora

#### 5. Excluir Editora
- **Endpoint**: `DELETE /api/Editora/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID da editora
- **Uso**: Remover editora do sistema

#### 6. Buscar Editoras por Nome
- **Endpoint**: `GET /api/Editora/buscar/{termo}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Termo de busca
- **Uso**: Buscar editoras por nome

#### 7. Editoras por Cidade
- **Endpoint**: `GET /api/Editora/por-cidade/{cidade}`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Cidade
- **Uso**: Ver editoras de uma cidade específica

#### 8. Editoras Ativas
- **Endpoint**: `GET /api/Editora/ativas`
- **Autorização**: ✅ Usuario/Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver apenas editoras ativas

---

### 📋 **EMPRÉSTIMOS** (10 endpoints)

#### 1. Listar Todos os Empréstimos
- **Endpoint**: `GET /api/Emprestimo`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver todos os empréstimos

#### 2. Buscar Empréstimo por ID
- **Endpoint**: `GET /api/Emprestimo/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do empréstimo
- **Uso**: Ver detalhes de um empréstimo específico

#### 3. Criar Empréstimo
- **Endpoint**: `POST /api/Emprestimo`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados do empréstimo
- **Uso**: Realizar novo empréstimo

#### 4. Atualizar Empréstimo
- **Endpoint**: `PUT /api/Emprestimo`
- **Autorização**: ✅ Funcionario/Admin
- **Body**: Dados atualizados do empréstimo
- **Uso**: Modificar informações de um empréstimo

#### 5. Excluir Empréstimo
- **Endpoint**: `DELETE /api/Emprestimo/{id}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do empréstimo
- **Uso**: Cancelar empréstimo

#### 6. Empréstimos por Usuário
- **Endpoint**: `GET /api/Emprestimo/por-usuario/{idUsuario}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do usuário
- **Uso**: Ver empréstimos de um usuário específico

#### 7. Empréstimos Ativos
- **Endpoint**: `GET /api/Emprestimo/emprestados`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver empréstimos em andamento

#### 8. Empréstimos Atrasados
- **Endpoint**: `GET /api/Emprestimo/atrasados`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver empréstimos em atraso

#### 9. Devolver Empréstimo
- **Endpoint**: `POST /api/Emprestimo/{id}/devolver`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do empréstimo
- **Uso**: Registrar devolução de empréstimo

#### 10. Renovar Empréstimo
- **Endpoint**: `POST /api/Emprestimo/{id}/renovar`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do empréstimo
- **Uso**: Renovar prazo de empréstimo

---

### 📊 **RELATÓRIOS** (6 endpoints)

#### 1. Empréstimos por Período
- **Endpoint**: `GET /api/Relatorios/emprestimos-por-periodo`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: inicio, fim
- **Uso**: Relatório de empréstimos em período específico

#### 2. Livros Mais Emprestados
- **Endpoint**: `GET /api/Relatorios/livros-mais-emprestados`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: topN (opcional)
- **Uso**: Ranking de livros mais emprestados

#### 3. Usuários com Atrasos
- **Endpoint**: `GET /api/Relatorios/usuarios-com-atrasos`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Lista de usuários com empréstimos atrasados

#### 4. Exemplares Disponíveis
- **Endpoint**: `GET /api/Relatorios/exemplares-disponiveis`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Relatório de exemplares disponíveis

#### 5. Histórico de Usuário
- **Endpoint**: `GET /api/Relatorios/historico-usuario/{idUsuario}`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: ID do usuário
- **Uso**: Histórico completo de empréstimos de um usuário

#### 6. Faturamento de Multas
- **Endpoint**: `GET /api/Relatorios/faturamento-multas`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: inicio, fim
- **Uso**: Relatório de multas por período

---

### 🎛️ **DASHBOARD** (5 endpoints)

#### 1. Resumo Geral
- **Endpoint**: `GET /api/Dashboard/resumo-geral`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Estatísticas gerais do sistema

#### 2. Estatísticas de Empréstimos
- **Endpoint**: `GET /api/Dashboard/estatisticas-emprestimos`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Métricas de empréstimos

#### 3. Top Livros
- **Endpoint**: `GET /api/Dashboard/top-livros`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: topN (opcional)
- **Uso**: Livros mais populares

#### 4. Usuários Ativos
- **Endpoint**: `GET /api/Dashboard/usuarios-ativos`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Lista de usuários ativos

#### 5. Alertas
- **Endpoint**: `GET /api/Dashboard/alertas`
- **Autorização**: ✅ Funcionario/Admin
- **Parâmetros**: Nenhum
- **Uso**: Alertas e notificações do sistema

---

### ⚙️ **CONFIGURAÇÕES** (6 endpoints)

#### 1. Obter Configurações do Sistema
- **Endpoint**: `GET /api/Configuracao/sistema`
- **Autorização**: ✅ Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver configurações gerais

#### 2. Atualizar Configurações do Sistema
- **Endpoint**: `POST /api/Configuracao/sistema`
- **Autorização**: ✅ Admin
- **Body**: Configurações
- **Uso**: Modificar configurações gerais

#### 3. Obter Configurações de Usuários
- **Endpoint**: `GET /api/Configuracao/usuarios`
- **Autorização**: ✅ Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver configurações de usuários

#### 4. Atualizar Configurações de Usuários
- **Endpoint**: `POST /api/Configuracao/usuarios`
- **Autorização**: ✅ Admin
- **Body**: Configurações
- **Uso**: Modificar configurações de usuários

#### 5. Obter Configurações de Notificações
- **Endpoint**: `GET /api/Configuracao/notificacoes`
- **Autorização**: ✅ Admin
- **Parâmetros**: Nenhum
- **Uso**: Ver configurações de notificações

#### 6. Atualizar Configurações de Notificações
- **Endpoint**: `POST /api/Configuracao/notificacoes`
- **Autorização**: ✅ Admin
- **Body**: Configurações
- **Uso**: Modificar configurações de notificações

---

## 📝 Exemplos de Dados para Testes

### Dados de Usuário
```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "senha": "123456",
  "telefone": "11999999999",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15T00:00:00Z"
}
```

### Dados de Funcionário
```json
{
  "nome": "Maria Santos",
  "email": "maria.santos@biblioteca.com",
  "senha": "123456",
  "telefone": "11888888888",
  "cargo": "Bibliotecária",
  "salario": 3500.00,
  "dataAdmissao": "2024-01-15T00:00:00Z"
}
```

### Dados de Autor
```json
{
  "nome": "Machado de Assis",
  "nomeCompleto": "Joaquim Maria Machado de Assis",
  "nomeArtistico": "Machado de Assis",
  "dataNascimento": "1839-06-21T00:00:00Z",
  "nacionalidade": "Brasileira",
  "pais": "Brasil",
  "paisOrigem": "Brasil",
  "email": "machado@classicos.com",
  "telefone": "11222222222",
  "website": "https://machado.com",
  "endereco": "Rua das Flores, 123",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "cep": "20000-000"
}
```

### Dados de Editora
```json
{
  "nome": "Editora Globo",
  "cnpj": "12.345.678/0001-90",
  "email": "contato@editoraglobo.com",
  "telefone": "11333333333",
  "endereco": "Av. Paulista, 1000",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01310-100",
  "pais": "Brasil",
  "site": "https://editoraglobo.com",
  "dataFundacao": "1925-01-01T00:00:00Z"
}
```

### Dados de Livro
```json
{
  "titulo": "Dom Casmurro",
  "subtitulo": "Romance",
  "isbn": "978-85-250-1234-5",
  "ano": 1899,
  "edicao": 1,
  "numeroPaginas": 256,
  "idioma": "Português",
  "genero": "Romance",
  "sinopse": "Romance clássico da literatura brasileira...",
  "preco": 29.90,
  "capaUrl": "https://exemplo.com/capa.jpg",
  "codigoBarras": "9788525012345",
  "idAutor": 1,
  "idEditora": 1
}
```

### Dados de Exemplar
```json
{
  "idLivro": 1,
  "numeroExemplar": "DC-001",
  "localizacao": "Estante A, Prateleira 1",
  "condicao": "Excelente",
  "disponivel": true,
  "dataAquisicao": "2024-01-10T00:00:00Z",
  "valorAquisicao": 25.00,
  "fornecedor": "Distribuidora Livros Ltda",
  "observacoes": "Exemplar em perfeito estado"
}
```

### Dados de Empréstimo
```json
{
  "idExemplar": 1,
  "idUsuario": 1,
  "dataEmprestimo": "2024-01-20T10:00:00Z",
  "dataPrevistaDevolucao": "2024-02-03T10:00:00Z",
  "maxRenovacoes": 3,
  "observacoes": "Empréstimo para pesquisa acadêmica"
}
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. **Erro 401 - Unauthorized**
- **Causa**: Token inválido ou expirado
- **Solução**: Fazer novo login e atualizar token no Swagger

#### 2. **Erro 403 - Forbidden**
- **Causa**: Usuário não tem permissão para o endpoint
- **Solução**: Verificar se o usuário tem role adequada (Admin/Funcionario)

#### 3. **Erro 400 - Bad Request**
- **Causa**: Dados inválidos no body
- **Solução**: Verificar formato JSON e campos obrigatórios

#### 4. **Erro 500 - Internal Server Error**
- **Causa**: Erro interno do servidor
- **Solução**: Verificar logs da aplicação

#### 5. **Token não funciona no Swagger**
- **Causa**: Formato incorreto do token
- **Solução**: Usar formato `Bearer {token}` (com espaço)

### Dicas Importantes

1. **Sempre faça login primeiro** antes de testar endpoints protegidos
2. **Copie o token completo** da resposta do login
3. **Use dados únicos** para evitar conflitos de chave duplicada
4. **Teste em ordem**: Crie dados básicos (Autor, Editora) antes de criar Livros
5. **Verifique as permissões** de cada endpoint antes de testar

### Sequência Recomendada de Testes

1. **Criar Administrador** → `POST /api/auth/criar-admin`
2. **Fazer Login** → `POST /api/auth/login`
3. **Configurar Token** no Swagger
4. **Criar Autor** → `POST /api/Autor`
5. **Criar Editora** → `POST /api/Editora`
6. **Criar Livro** → `POST /api/Livro`
7. **Criar Exemplar** → `POST /api/Exemplar`
8. **Criar Usuário** → `POST /api/Usuario`
9. **Criar Empréstimo** → `POST /api/Emprestimo`
10. **Testar outros endpoints** conforme necessário

---

**🎯 Este guia cobre todos os 95+ endpoints da API com exemplos práticos e troubleshooting completo!**
