# 🏢 Guia de Testes - Editoras

Este guia documenta todos os **9 endpoints de editoras** da API.

## 📋 Lista de Endpoints

1. **GET /api/Editora** - Listar todas as editoras
2. **GET /api/Editora/{id}** - Obter editora por ID
3. **POST /api/Editora** - Criar nova editora
4. **PUT /api/Editora** - Atualizar editora
5. **DELETE /api/Editora/{id}** - Excluir editora
6. **GET /api/Editora/ativas** - Listar editoras ativas
7. **GET /api/Editora/por-cidade/{cidade}** - Listar editoras por cidade
8. **GET /api/Editora/por-estado/{estado}** - Listar editoras por estado
9. **GET /api/Editora/buscar/{termo}** - Buscar editoras por termo

---

## 🔑 Autenticação

**Todos os endpoints de editoras requerem autenticação JWT.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Editora
**Descrição**: Listar todas as editoras
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Editora Globo",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@globo.com",
    "telefone": "11999999999",
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

---

### 2. GET /api/Editora/{id}
**Descrição**: Obter editora por ID
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID da editora

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "nome": "Editora Globo",
  "cnpj": "12.345.678/0001-90",
  "email": "contato@globo.com",
  "telefone": "11999999999",
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
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Editora não encontrada"
}
```

---

### 3. POST /api/Editora
**Descrição**: Criar nova editora
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "nome": "Editora Martins Fontes",
  "cnpj": "98.765.432/0001-10",
  "email": "contato@martinsfontes.com.br",
  "telefone": "11988888888",
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
  "telefone": "11988888888",
  "endereco": "Rua Consolação, 2000",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01302-000",
  "pais": "Brasil",
  "site": "https://martinsfontes.com.br",
  "dataFundacao": "1980-05-15T00:00:00Z",
  "ativa": true,
  "dataCriacao": "2025-09-21T21:00:00Z"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existe uma editora com este CNPJ"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existe uma editora com este email"
}
```

---

### 4. PUT /api/Editora
**Descrição**: Atualizar editora
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "id": 1,
  "nome": "Editora Globo Ltda",
  "cnpj": "12.345.678/0001-90",
  "email": "contato@editoraglobo.com.br",
  "telefone": "11999999999",
  "endereco": "Av. Paulista, 1000",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01310-100",
  "pais": "Brasil",
  "site": "https://editoraglobo.com.br",
  "dataFundacao": "1950-01-01T00:00:00Z"
}
```

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

---

### 5. DELETE /api/Editora/{id}
**Descrição**: Excluir editora
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID da editora

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Editora não encontrada"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Não é possível excluir editora com livros cadastrados"
}
```

---

### 6. GET /api/Editora/ativas
**Descrição**: Listar editoras ativas
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Editora Globo",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@globo.com",
    "telefone": "11999999999",
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

---

### 7. GET /api/Editora/por-cidade/{cidade}
**Descrição**: Listar editoras por cidade
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `cidade` (string): Cidade da editora

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Editora Globo",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  },
  {
    "id": 2,
    "nome": "Editora Martins Fontes",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
]
```

---

### 8. GET /api/Editora/por-estado/{estado}
**Descrição**: Listar editoras por estado
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `estado` (string): Estado da editora

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Editora Globo",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  },
  {
    "id": 2,
    "nome": "Editora Martins Fontes",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
]
```

---

### 9. GET /api/Editora/buscar/{termo}
**Descrição**: Buscar editoras por termo
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `termo` (string): Termo de busca

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Editora Globo",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  }
]
```

---

## 🚨 Troubleshooting

### Problemas Comuns e Soluções

#### 401 Unauthorized
**Causa**: Token JWT inválido ou expirado
**Solução**: Faça login novamente para obter um novo token

#### 404 Not Found
**Causa**: Editora não encontrada
**Solução**: Verifique se o ID existe no banco de dados

#### 400 Bad Request - CNPJ duplicado
**Causa**: Já existe uma editora com este CNPJ
**Solução**: Use um CNPJ diferente

#### 400 Bad Request - Email duplicado
**Causa**: Já existe uma editora com este email
**Solução**: Use um email diferente

#### 400 Bad Request - Editora com livros
**Causa**: Tentativa de excluir editora com livros cadastrados
**Solução**: Primeiro exclua ou transfira os livros da editora

---

## 💡 Dicas Importantes

1. **CNPJ e email devem ser únicos** no sistema
2. **Campos obrigatórios**: nome, email, telefone, endereco, cidade, estado, cep, pais, dataFundacao
3. **CNPJ é opcional** (pode ser null)
4. **Data de fundação** não pode ser futura
5. **Para excluir editora**, ela não pode ter livros cadastrados
6. **Busca por termo** procura em nome, cidade e estado
7. **Filtros por cidade/estado** são exatos (case-sensitive)

---

## 📝 Validações

### Campos Obrigatórios
- `nome`: String, máximo 150 caracteres
- `email`: String, formato de email válido, máximo 100 caracteres
- `telefone`: String, máximo 20 caracteres
- `endereco`: String, máximo 300 caracteres
- `cidade`: String, máximo 100 caracteres
- `estado`: String, máximo 50 caracteres
- `cep`: String, máximo 10 caracteres
- `pais`: String, máximo 50 caracteres
- `dataFundacao`: DateTime, data válida

### Campos Opcionais
- `cnpj`: String, máximo 18 caracteres
- `site`: String, máximo 200 caracteres

### Validações de Negócio
- CNPJ deve ser único no sistema (se fornecido)
- Email deve ser único no sistema
- Data de fundação não pode ser futura
- Editora não pode ser excluída se tiver livros cadastrados

---

**Total de endpoints documentados: 9/9** ✅
