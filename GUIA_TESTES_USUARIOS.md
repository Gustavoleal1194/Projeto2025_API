# 👥 Guia de Testes - Usuários

Este guia documenta todos os **7 endpoints de usuários** da API.

## 📋 Lista de Endpoints

1. **GET /api/Usuario** - Listar todos os usuários
2. **GET /api/Usuario/{id}** - Obter usuário por ID
3. **POST /api/Usuario** - Criar novo usuário
4. **PUT /api/Usuario** - Atualizar usuário
5. **DELETE /api/Usuario/{id}** - Excluir usuário
6. **GET /api/Usuario/por-nome/{nome}** - Buscar usuários por nome
7. **GET /api/Usuario/por-cpf/{cpf}** - Buscar usuário por CPF

---

## 🔑 Autenticação

**Todos os endpoints de usuários requerem autenticação JWT.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Usuario
**Descrição**: Listar todos os usuários
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11987654321",
    "cpf": "12345678901",
    "dataNascimento": "1990-05-15T00:00:00Z",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:00:00Z"
  },
  {
    "id": 2,
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "telefone": "11999887766",
    "cpf": "98765432100",
    "dataNascimento": "1985-08-20T00:00:00Z",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z"
  }
]
```

---

### 2. GET /api/Usuario/{id}
**Descrição**: Obter usuário por ID
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do usuário

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11987654321",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15T00:00:00Z",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:00:00Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Usuário não encontrado"
}
```

---

### 3. POST /api/Usuario
**Descrição**: Criar novo usuário
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "nome": "Pedro Oliveira",
  "email": "pedro@email.com",
  "senha": "123456",
  "telefone": "11988776655",
  "cpf": "11122233344",
  "dataNascimento": "1992-03-10T00:00:00Z"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 3,
  "nome": "Pedro Oliveira",
  "email": "pedro@email.com",
  "telefone": "11988776655",
  "cpf": "11122233344",
  "dataNascimento": "1992-03-10T00:00:00Z",
  "ativo": true,
  "dataCriacao": "2025-09-21T21:00:00Z"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existe um usuário com este email"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existe um usuário com este CPF"
}
```

---

### 4. PUT /api/Usuario
**Descrição**: Atualizar usuário
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "id": 1,
  "nome": "João Silva Santos",
  "email": "joao.silva@email.com",
  "telefone": "11987654321",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15T00:00:00Z"
}
```

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existe um usuário com este email"
}
```

---

### 5. DELETE /api/Usuario/{id}
**Descrição**: Excluir usuário
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do usuário

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Usuário não encontrado"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Não é possível excluir usuário com empréstimos ativos"
}
```

---

### 6. GET /api/Usuario/por-nome/{nome}
**Descrição**: Buscar usuários por nome
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `nome` (string): Nome do usuário (busca parcial)

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11987654321",
    "cpf": "12345678901",
    "dataNascimento": "1990-05-15T00:00:00Z",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:00:00Z"
  }
]
```

---

### 7. GET /api/Usuario/por-cpf/{cpf}
**Descrição**: Buscar usuário por CPF
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `cpf` (string): CPF do usuário

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11987654321",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15T00:00:00Z",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:00:00Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Usuário não encontrado"
}
```

---

## 🚨 Troubleshooting

### Problemas Comuns e Soluções

#### 401 Unauthorized
**Causa**: Token JWT inválido ou expirado
**Solução**: Faça login novamente para obter um novo token

#### 404 Not Found
**Causa**: Usuário não encontrado
**Solução**: Verifique se o ID existe no banco de dados

#### 400 Bad Request - Email duplicado
**Causa**: Já existe um usuário com este email
**Solução**: Use um email diferente

#### 400 Bad Request - CPF duplicado
**Causa**: Já existe um usuário com este CPF
**Solução**: Use um CPF diferente

#### 400 Bad Request - Usuário com empréstimos
**Causa**: Tentativa de excluir usuário com empréstimos ativos
**Solução**: Primeiro devolva todos os empréstimos do usuário

---

## 💡 Dicas Importantes

1. **Email e CPF devem ser únicos** no sistema
2. **Campos obrigatórios**: nome, email, senha, telefone, cpf, dataNascimento
3. **CPF deve ter 11 dígitos** (apenas números)
4. **Email deve ter formato válido**
5. **Data de nascimento** deve ser uma data válida
6. **Para excluir usuário**, ele não pode ter empréstimos ativos
7. **Busca por nome** é parcial (encontra nomes que contenham o termo)

---

## 📝 Validações

### Campos Obrigatórios
- `nome`: String, máximo 150 caracteres
- `email`: String, formato de email válido, máximo 100 caracteres
- `senha`: String, será criptografada automaticamente
- `telefone`: String, máximo 20 caracteres
- `cpf`: String, exatamente 11 dígitos
- `dataNascimento`: DateTime, data válida

### Validações de Negócio
- Email deve ser único no sistema
- CPF deve ser único no sistema
- CPF deve conter apenas números
- Data de nascimento não pode ser futura
- Usuário não pode ser excluído se tiver empréstimos ativos

---

**Total de endpoints documentados: 7/7** ✅
