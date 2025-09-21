# 🧪 Guia de Testes da API no Swagger

Este guia detalha como utilizar a interface do Swagger UI para testar todos os endpoints da API de forma eficiente, incluindo a configuração de autenticação JWT e exemplos completos de request/response.

## 🚀 Acessando o Swagger UI

Após iniciar a aplicação, abra seu navegador e acesse: `http://localhost:5072/swagger`

## 🔑 Configuração de Autenticação

### Passo 1: Obter Token JWT

1. **Expanda o endpoint `POST /api/Auth/login`**
2. Clique em "Try it out"
3. No campo "Request body", insira as credenciais:

**Request Body:**
```json
{
  "email": "admin@biblioteca.com",
  "senha": "123456"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImFkbWluQGJpYmxpb3RlY2EuY29tIiwicm9sZSI6IkFkbWluIiwianRpIjoiMTIzNDU2Nzg5MCIsIm5iZiI6MTc1ODQ4NTcwNiwiZXhwIjoxNzU4NTE0NTA2LCJpYXQiOjE3NTg0ODU3MDYsImlzcyI6IlByb2pldG8yMDI1QVBJIiwiYXVkIjoiUHJvamV0bzIwMjVBUEkifQ.abc123def456",
  "expiration": "2025-09-21T18:58:27.774Z",
  "tipo": "Bearer",
  "nome": "Administrador Sistema",
  "email": "admin@biblioteca.com",
  "role": "Admin"
}
```

### Passo 2: Configurar Token no Swagger

1. No topo da página do Swagger UI, clique no botão verde **"Authorize"**
2. No campo **"Value"**, digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**
4. Clique em **"Close"**

---

## 📚 Testando Endpoints por Categoria

### 🔐 Autenticação

#### POST /api/Auth/login
**Descrição**: Login de usuário ou funcionário

**Request Body:**
```json
{
  "email": "admin@biblioteca.com",
  "senha": "123456"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2025-09-21T18:58:27.774Z",
  "tipo": "Bearer",
  "nome": "Administrador Sistema",
  "email": "admin@biblioteca.com",
  "role": "Admin"
}
```

#### POST /api/Auth/registrar
**Descrição**: Registro de novo usuário

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "senha": "123456",
  "telefone": "11987654321",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15T00:00:00Z"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "telefone": "11987654321",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15T00:00:00Z",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z"
}
```

---

### 📖 Livros

#### GET /api/Livro
**Descrição**: Listar todos os livros

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "subtitulo": "Romance",
    "isbn": "978-85-333-0227-3",
    "ano": 1899,
    "edicao": 1,
    "numeroPaginas": 256,
    "idioma": "Português",
    "genero": "Romance",
    "sinopse": "Romance de Machado de Assis...",
    "preco": 29.90,
    "capaUrl": "http://example.com/capa_dom_casmurro.jpg",
    "codigoBarras": "1234567890123",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:00:00Z",
    "idAutor": 1,
    "idEditora": 1,
    "totalExemplares": 2,
    "exemplaresDisponiveis": 1,
    "temExemplaresDisponiveis": true,
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

#### POST /api/Livro
**Descrição**: Criar novo livro

**Request Body:**
```json
{
  "titulo": "O Senhor dos Anéis",
  "subtitulo": "A Sociedade do Anel",
  "isbn": "978-85-333-0227-4",
  "ano": 1954,
  "edicao": 1,
  "numeroPaginas": 576,
  "idioma": "Português",
  "genero": "Fantasia",
  "sinopse": "Primeiro volume da trilogia épica...",
  "preco": 49.90,
  "capaUrl": "http://example.com/capa_aneis.jpg",
  "codigoBarras": "1234567890124",
  "idAutor": 1,
  "idEditora": 1
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "titulo": "O Senhor dos Anéis",
  "subtitulo": "A Sociedade do Anel",
  "isbn": "978-85-333-0227-4",
  "ano": 1954,
  "edicao": 1,
  "numeroPaginas": 576,
  "idioma": "Português",
  "genero": "Fantasia",
  "sinopse": "Primeiro volume da trilogia épica...",
  "preco": 49.90,
  "capaUrl": "http://example.com/capa_aneis.jpg",
  "codigoBarras": "1234567890124",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z",
  "idAutor": 1,
  "idEditora": 1,
  "totalExemplares": 0,
  "exemplaresDisponiveis": 0,
  "temExemplaresDisponiveis": false,
  "nomeAutor": "J.R.R. Tolkien",
  "nomeEditora": "Editora Martins Fontes"
}
```

#### GET /api/Livro/disponiveis
**Descrição**: Listar livros com exemplares disponíveis

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "subtitulo": "Romance",
    "isbn": "978-85-333-0227-3",
    "ano": 1899,
    "edicao": 1,
    "numeroPaginas": 256,
    "idioma": "Português",
    "genero": "Romance",
    "sinopse": "Romance de Machado de Assis...",
    "preco": 29.90,
    "capaUrl": "http://example.com/capa_dom_casmurro.jpg",
    "codigoBarras": "1234567890123",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:00:00Z",
    "idAutor": 1,
    "idEditora": 1,
    "totalExemplares": 2,
    "exemplaresDisponiveis": 1,
    "temExemplaresDisponiveis": true,
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 📚 Exemplares

#### GET /api/Exemplar
**Descrição**: Listar todos os exemplares

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "idLivro": 1,
    "numeroExemplar": "DC-001",
    "localizacao": "Estante A, Prateleira 1",
    "condicao": "Excelente",
    "disponivel": true,
    "ativo": true,
    "dataAquisicao": "2025-09-21T20:00:00Z",
    "valorAquisicao": 25.00,
    "fornecedor": "Distribuidora Livros Ltda",
    "observacoes": "Exemplar em perfeito estado",
    "dataCriacao": "2025-09-21T20:00:00Z",
    "tituloLivro": "Dom Casmurro",
    "isbn": "978-85-333-0227-3",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

#### POST /api/Exemplar
**Descrição**: Criar novo exemplar

**Request Body:**
```json
{
  "idLivro": 1,
  "numeroExemplar": "DC-002",
  "localizacao": "Estante A, Prateleira 2",
  "condicao": "Bom",
  "disponivel": true,
  "dataAquisicao": "2025-09-21T20:00:00Z",
  "valorAquisicao": 30.00,
  "fornecedor": "Distribuidora Livros Ltda",
  "observacoes": "Exemplar com pequenos sinais de uso"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "idLivro": 1,
  "numeroExemplar": "DC-002",
  "localizacao": "Estante A, Prateleira 2",
  "condicao": "Bom",
  "disponivel": true,
  "ativo": true,
  "dataAquisicao": "2025-09-21T20:00:00Z",
  "valorAquisicao": 30.00,
  "fornecedor": "Distribuidora Livros Ltda",
  "observacoes": "Exemplar com pequenos sinais de uso",
  "dataCriacao": "2025-09-21T20:30:00Z",
  "tituloLivro": "Dom Casmurro",
  "isbn": "978-85-333-0227-3",
  "nomeAutor": "Machado de Assis",
  "nomeEditora": "Editora Globo"
}
```

---

### 👥 Usuários

#### GET /api/Usuario
**Descrição**: Listar todos os usuários

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "telefone": "11987654321",
    "cpf": "12345678901",
    "dataNascimento": "1990-05-15T00:00:00Z",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:00:00Z"
  }
]
```

#### POST /api/Usuario
**Descrição**: Criar novo usuário

**Request Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria.santos@email.com",
  "senha": "123456",
  "telefone": "11999887766",
  "cpf": "98765432100",
  "dataNascimento": "1985-03-20T00:00:00Z"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "nome": "Maria Santos",
  "email": "maria.santos@email.com",
  "telefone": "11999887766",
  "cpf": "98765432100",
  "dataNascimento": "1985-03-20T00:00:00Z",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z"
}
```

---

### 👨‍💼 Funcionários

#### GET /api/Funcionario
**Descrição**: Listar todos os funcionários

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Administrador Sistema",
    "email": "admin@biblioteca.com",
    "telefone": "11999999999",
    "cargo": "Administrador",
    "salario": 5000.00,
    "dataAdmissao": "2024-01-01T00:00:00Z",
    "dataDemissao": null,
    "ativo": true,
    "dataCriacao": "2025-09-21T20:00:00Z"
  }
]
```

#### POST /api/Funcionario
**Descrição**: Criar novo funcionário

**Request Body:**
```json
{
  "nome": "Carlos Almeida",
  "email": "carlos.almeida@biblioteca.com",
  "senha": "123456",
  "telefone": "11988776655",
  "cargo": "Bibliotecário",
  "salario": 3500.00,
  "dataAdmissao": "2024-06-01T00:00:00Z",
  "dataDemissao": null
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "nome": "Carlos Almeida",
  "email": "carlos.almeida@biblioteca.com",
  "telefone": "11988776655",
  "cargo": "Bibliotecário",
  "salario": 3500.00,
  "dataAdmissao": "2024-06-01T00:00:00Z",
  "dataDemissao": null,
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z"
}
```

---

### ✍️ Autores

#### GET /api/Autor
**Descrição**: Listar todos os autores

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Machado de Assis",
    "nomeCompleto": "Joaquim Maria Machado de Assis",
    "nomeArtistico": "Machado de Assis",
    "dataNascimento": "1839-06-21T00:00:00Z",
    "nacionalidade": "Brasileira",
    "pais": "Brasil",
    "paisOrigem": "Brasil",
    "email": "machado@classicos.com",
    "telefone": "11999999999",
    "website": "https://machadodeassis.com",
    "endereco": "Rua das Flores, 123",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "cep": "20000-000",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:00:00Z"
  }
]
```

#### POST /api/Autor
**Descrição**: Criar novo autor

**Request Body:**
```json
{
  "nome": "J.R.R. Tolkien",
  "nomeCompleto": "John Ronald Reuel Tolkien",
  "nomeArtistico": "J.R.R. Tolkien",
  "dataNascimento": "1892-01-03T00:00:00Z",
  "nacionalidade": "Britânica",
  "pais": "Reino Unido",
  "paisOrigem": "África do Sul",
  "email": "tolkien@middleearth.com",
  "telefone": "11988887777",
  "website": "https://tolkienestate.com",
  "endereco": "Oxford, Inglaterra",
  "cidade": "Oxford",
  "estado": "Oxfordshire",
  "cep": "OX1 1AA"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "nome": "J.R.R. Tolkien",
  "nomeCompleto": "John Ronald Reuel Tolkien",
  "nomeArtistico": "J.R.R. Tolkien",
  "dataNascimento": "1892-01-03T00:00:00Z",
  "nacionalidade": "Britânica",
  "pais": "Reino Unido",
  "paisOrigem": "África do Sul",
  "email": "tolkien@middleearth.com",
  "telefone": "11988887777",
  "website": "https://tolkienestate.com",
  "endereco": "Oxford, Inglaterra",
  "cidade": "Oxford",
  "estado": "Oxfordshire",
  "cep": "OX1 1AA",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z"
}
```

---

### 🏢 Editoras

#### GET /api/Editora
**Descrição**: Listar todas as editoras

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Editora Globo",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@editoraglobo.com.br",
    "telefone": "1133334444",
    "endereco": "Av. Paulista, 1000",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01310-100",
    "pais": "Brasil",
    "site": "https://editoraglobo.com.br",
    "dataFundacao": "1950-01-01T00:00:00Z",
    "ativa": true,
    "dataCriacao": "2025-09-21T20:00:00Z"
  }
]
```

#### POST /api/Editora
**Descrição**: Criar nova editora

**Request Body:**
```json
{
  "nome": "Editora Martins Fontes",
  "cnpj": "98.765.432/0001-10",
  "email": "contato@martinsfontes.com.br",
  "telefone": "1122223333",
  "endereco": "Rua Consolação, 2000",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01302-000",
  "pais": "Brasil",
  "site": "https://martinsfontes.com.br",
  "dataFundacao": "1980-05-15T00:00:00Z"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "nome": "Editora Martins Fontes",
  "cnpj": "98.765.432/0001-10",
  "email": "contato@martinsfontes.com.br",
  "telefone": "1122223333",
  "endereco": "Rua Consolação, 2000",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01302-000",
  "pais": "Brasil",
  "site": "https://martinsfontes.com.br",
  "dataFundacao": "1980-05-15T00:00:00Z",
  "ativa": true,
  "dataCriacao": "2025-09-21T20:30:00Z"
}
```

---

### 📋 Empréstimos

#### GET /api/Emprestimo
**Descrição**: Listar todos os empréstimos

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "idExemplar": 1,
    "idUsuario": 1,
    "dataEmprestimo": "2025-09-21T20:30:00Z",
    "dataPrevistaDevolucao": "2025-10-05T20:30:00Z",
    "dataDevolucao": null,
    "dataRenovacao": null,
    "quantidadeRenovacoes": 0,
    "maxRenovacoes": 3,
    "multa": 0.00,
    "status": "Emprestado",
    "observacoes": "Empréstimo de teste",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z",
    "tituloLivro": "Dom Casmurro",
    "numeroExemplar": "DC-001",
    "nomeUsuario": "João Silva",
    "emailUsuario": "joao.silva@email.com",
    "estaAtrasado": false,
    "diasAtraso": 0,
    "podeRenovar": true
  }
]
```

#### POST /api/Emprestimo
**Descrição**: Criar novo empréstimo

**Request Body:**
```json
{
  "idExemplar": 1,
  "idUsuario": 1,
  "dataEmprestimo": "2025-09-21T20:30:00Z",
  "dataPrevistaDevolucao": "2025-10-05T20:30:00Z",
  "maxRenovacoes": 3,
  "observacoes": "Empréstimo para pesquisa acadêmica"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "idExemplar": 1,
  "idUsuario": 1,
  "dataEmprestimo": "2025-09-21T20:30:00Z",
  "dataPrevistaDevolucao": "2025-10-05T20:30:00Z",
  "dataDevolucao": null,
  "dataRenovacao": null,
  "quantidadeRenovacoes": 0,
  "maxRenovacoes": 3,
  "multa": 0.00,
  "status": "Emprestado",
  "observacoes": "Empréstimo para pesquisa acadêmica",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z",
  "tituloLivro": "Dom Casmurro",
  "numeroExemplar": "DC-001",
  "nomeUsuario": "João Silva",
  "emailUsuario": "joao.silva@email.com",
  "estaAtrasado": false,
  "diasAtraso": 0,
  "podeRenovar": true
}
```

#### POST /api/Emprestimo/{id}/devolver
**Descrição**: Devolver empréstimo

**Parâmetros**: `id` = 1

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "idExemplar": 1,
  "idUsuario": 1,
  "dataEmprestimo": "2025-09-21T20:30:00Z",
  "dataPrevistaDevolucao": "2025-10-05T20:30:00Z",
  "dataDevolucao": "2025-09-25T15:30:00Z",
  "dataRenovacao": null,
  "quantidadeRenovacoes": 0,
  "maxRenovacoes": 3,
  "multa": 0.00,
  "status": "Devolvido",
  "observacoes": "Empréstimo de teste",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z",
  "tituloLivro": "Dom Casmurro",
  "numeroExemplar": "DC-001",
  "nomeUsuario": "João Silva",
  "emailUsuario": "joao.silva@email.com",
  "estaAtrasado": false,
  "diasAtraso": 0,
  "podeRenovar": false
}
```

---

## ⚠️ Códigos de Resposta e Solução de Problemas

### ✅ Sucesso
- **200 OK**: Operação realizada com sucesso
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Operação realizada sem retorno de conteúdo

### ❌ Erros Comuns

#### 400 Bad Request
**Causa**: Dados inválidos no JSON ou parâmetros incorretos
**Solução**: Verifique se o JSON está bem formatado e todos os campos obrigatórios estão preenchidos

**Exemplo de Resposta:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "0HMQ5VQKJQ7C8:00000001",
  "errors": {
    "Email": ["O campo Email é obrigatório."],
    "Senha": ["O campo Senha é obrigatório."]
  }
}
```

#### 401 Unauthorized
**Causa**: Token JWT inválido ou expirado
**Solução**: Faça login novamente para obter um novo token

**Exemplo de Resposta:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
  "title": "Unauthorized",
  "status": 401,
  "traceId": "0HMQ5VQKJQ7C8:00000002"
}
```

#### 403 Forbidden
**Causa**: Token válido mas sem permissão para a operação
**Solução**: Use um token de usuário com role "Admin" ou "Funcionario"

#### 404 Not Found
**Causa**: Recurso não encontrado (ID inexistente)
**Solução**: Verifique se o ID existe no banco de dados

#### 500 Internal Server Error
**Causa**: Erro interno do servidor
**Solução**: Verifique os logs da aplicação para mais detalhes

**Exemplo de Resposta:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  "title": "An error occurred while processing your request.",
  "status": 500,
  "traceId": "0HMQ5VQKJQ7C8:00000003"
}
```

---

## 💡 Dicas Importantes

1. **Sempre configure a autenticação** antes de testar endpoints protegidos
2. **Use IDs existentes** para operações GET, PUT e DELETE
3. **Verifique os relacionamentos** - para criar um Livro, você precisa de um Autor e Editora existentes
4. **O token expira em 8 horas** - faça login novamente se necessário
5. **Para endpoints de busca**, use termos que existem no banco de dados
6. **Campos obrigatórios** devem sempre ser preenchidos nos requests

---

Este guia deve cobrir todos os cenários de teste da API usando o Swagger UI! 🚀
