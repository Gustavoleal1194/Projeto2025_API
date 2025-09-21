# 🔐 Guia de Testes - Autenticação

Este guia documenta todos os **7 endpoints de autenticação** da API.

## 📋 Lista de Endpoints

1. **POST /api/Auth/login** - Fazer login e obter token JWT
2. **POST /api/Auth/validar-token** - Validar token JWT
3. **GET /api/Auth/me** - Obter informações do usuário atual
4. **POST /api/Auth/registrar** - Registrar novo usuário
5. **POST /api/Auth/registrar-funcionario** - Registrar novo funcionário
6. **POST /api/Auth/criar-admin** - Criar administrador inicial
7. **GET /api/Auth/teste-token** - Endpoint de teste de token

---

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

## 📚 Documentação dos Endpoints

### 1. POST /api/Auth/login
**Descrição**: Fazer login e obter token JWT
**Autenticação**: Não necessária

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

**Resposta de Erro (401 Unauthorized):**
```json
{
  "message": "Email ou senha inválidos"
}
```

---

### 2. POST /api/Auth/validar-token
**Descrição**: Validar token JWT
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
{
  "message": "Token válido"
}
```

**Resposta de Erro (401 Unauthorized):**
```json
{
  "message": "Token inválido"
}
```

---

### 3. GET /api/Auth/me
**Descrição**: Obter informações do usuário atual
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
{
  "email": "admin@biblioteca.com",
  "role": "Admin"
}
```

**Resposta de Erro (401 Unauthorized):**
```json
{
  "message": "Token inválido"
}
```

---

### 4. POST /api/Auth/registrar
**Descrição**: Registrar novo usuário
**Autenticação**: Não necessária

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "telefone": "11987654321",
  "cpf": "12345678901",
  "dataNascimento": "1990-05-15T00:00:00Z"
}
```

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
  "dataCriacao": "2025-09-21T20:30:00Z"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existe um usuário com este email"
}
```

---

### 5. POST /api/Auth/registrar-funcionario
**Descrição**: Registrar novo funcionário
**Autenticação**: Token Admin/Funcionario necessário

**Request Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@biblioteca.com",
  "senha": "123456",
  "telefone": "11999887766",
  "cargo": "Bibliotecária",
  "salario": 3500.00,
  "dataAdmissao": "2025-01-15T00:00:00Z"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "nome": "Maria Santos",
  "email": "maria@biblioteca.com",
  "telefone": "11999887766",
  "cargo": "Bibliotecária",
  "salario": 3500.00,
  "dataAdmissao": "2025-01-15T00:00:00Z",
  "dataDemissao": null,
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z"
}
```

**Resposta de Erro (403 Forbidden):**
```json
{
  "message": "Acesso negado"
}
```

---

### 6. POST /api/Auth/criar-admin
**Descrição**: Criar administrador inicial (só funciona se não houver funcionários)
**Autenticação**: Não necessária

**Request Body:**
```json
{
  "nome": "Administrador",
  "email": "admin@biblioteca.com",
  "senha": "123456",
  "telefone": "11999999999"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "nome": "Administrador",
  "email": "admin@biblioteca.com",
  "telefone": "11999999999",
  "cargo": "Administrador",
  "salario": 5000.00,
  "dataAdmissao": "2025-09-21T20:30:00Z",
  "dataDemissao": null,
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existem funcionários cadastrados no sistema"
}
```

---

### 7. GET /api/Auth/teste-token
**Descrição**: Endpoint de teste de token
**Autenticação**: Não necessária

**Resposta Esperada (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.teste",
  "expiration": "2025-09-22T04:00:00Z",
  "tipo": "Bearer",
  "nome": "João Teste",
  "email": "joao@teste.com",
  "role": "Usuario"
}
```

---

## 🚨 Troubleshooting

### Problemas Comuns e Soluções

#### 401 Unauthorized
**Causa**: Token JWT inválido ou expirado
**Solução**: Faça login novamente para obter um novo token

#### 403 Forbidden
**Causa**: Token válido mas sem permissão para a operação
**Solução**: Use um token de usuário com role "Admin" ou "Funcionario"

#### 400 Bad Request
**Causa**: Dados inválidos ou duplicados
**Solução**: Verifique se email/CPF já existem no sistema

---

## 💡 Dicas Importantes

1. **O token expira em 8 horas** - faça login novamente se necessário
2. **Para criar funcionários**, você precisa de um token Admin
3. **O endpoint criar-admin** só funciona se não houver funcionários no sistema
4. **Campos obrigatórios** devem sempre ser preenchidos nos requests
5. **Email e CPF** devem ser únicos no sistema

---

**Total de endpoints documentados: 7/7** ✅
