# 👨‍💼 Guia de Testes - Funcionários

Este guia documenta todos os **10 endpoints de funcionários** da API.

## 📋 Lista de Endpoints

1. **GET /api/Funcionario** - Listar todos os funcionários
2. **GET /api/Funcionario/{id}** - Obter funcionário por ID
3. **POST /api/Funcionario** - Criar novo funcionário
4. **PUT /api/Funcionario** - Atualizar funcionário
5. **DELETE /api/Funcionario/{id}** - Excluir funcionário
6. **GET /api/Funcionario/cargo/{cargo}** - Listar funcionários por cargo
7. **GET /api/Funcionario/ativos** - Listar funcionários ativos
8. **GET /api/Funcionario/inativos** - Listar funcionários inativos
9. **GET /api/Funcionario/email/{email}** - Buscar funcionário por email
10. **GET /api/Funcionario/count** - Contar funcionários
11. **GET /api/Funcionario/exists/{id}** - Verificar se funcionário existe

---

## 🔑 Autenticação

**Todos os endpoints de funcionários requerem autenticação JWT com role Admin ou Funcionario.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Funcionario
**Descrição**: Listar todos os funcionários
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
[
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
    "dataCriacao": "2025-09-21T20:00:00Z"
  },
  {
    "id": 2,
    "nome": "João Silva",
    "email": "joao@biblioteca.com",
    "telefone": "11988776655",
    "cargo": "Assistente",
    "salario": 2500.00,
    "dataAdmissao": "2025-02-01T00:00:00Z",
    "dataDemissao": null,
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z"
  }
]
```

---

### 2. GET /api/Funcionario/{id}
**Descrição**: Obter funcionário por ID
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros:**
- `id` (int): ID do funcionário

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
  "dataCriacao": "2025-09-21T20:00:00Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Funcionário não encontrado"
}
```

---

### 3. POST /api/Funcionario
**Descrição**: Criar novo funcionário
**Autenticação**: Token JWT Admin/Funcionario necessário

**Request Body:**
```json
{
  "nome": "Pedro Oliveira",
  "email": "pedro@biblioteca.com",
  "senha": "123456",
  "telefone": "11977665544",
  "cargo": "Auxiliar",
  "salario": 2000.00,
  "dataAdmissao": "2025-03-01T00:00:00Z"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 3,
  "nome": "Pedro Oliveira",
  "email": "pedro@biblioteca.com",
  "telefone": "11977665544",
  "cargo": "Auxiliar",
  "salario": 2000.00,
  "dataAdmissao": "2025-03-01T00:00:00Z",
  "dataDemissao": null,
  "ativo": true,
  "dataCriacao": "2025-09-21T21:00:00Z"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existe um funcionário com este email"
}
```

---

### 4. PUT /api/Funcionario
**Descrição**: Atualizar funcionário
**Autenticação**: Token JWT Admin/Funcionario necessário

**Request Body:**
```json
{
  "id": 1,
  "nome": "Maria Santos Silva",
  "email": "maria.santos@biblioteca.com",
  "telefone": "11999887766",
  "cargo": "Bibliotecária Sênior",
  "salario": 4000.00,
  "dataAdmissao": "2025-01-15T00:00:00Z",
  "dataDemissao": null
}
```

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

---

### 5. DELETE /api/Funcionario/{id}
**Descrição**: Excluir funcionário
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros:**
- `id` (int): ID do funcionário

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Funcionário não encontrado"
}
```

---

### 6. GET /api/Funcionario/cargo/{cargo}
**Descrição**: Listar funcionários por cargo
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros:**
- `cargo` (string): Cargo do funcionário

**Resposta Esperada (200 OK):**
```json
[
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
    "dataCriacao": "2025-09-21T20:00:00Z"
  }
]
```

---

### 7. GET /api/Funcionario/ativos
**Descrição**: Listar funcionários ativos
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
[
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
    "dataCriacao": "2025-09-21T20:00:00Z"
  },
  {
    "id": 2,
    "nome": "João Silva",
    "email": "joao@biblioteca.com",
    "telefone": "11988776655",
    "cargo": "Assistente",
    "salario": 2500.00,
    "dataAdmissao": "2025-02-01T00:00:00Z",
    "dataDemissao": null,
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z"
  }
]
```

---

### 8. GET /api/Funcionario/inativos
**Descrição**: Listar funcionários inativos
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 3,
    "nome": "Ana Costa",
    "email": "ana@biblioteca.com",
    "telefone": "11966554433",
    "cargo": "Auxiliar",
    "salario": 2000.00,
    "dataAdmissao": "2024-12-01T00:00:00Z",
    "dataDemissao": "2025-08-31T00:00:00Z",
    "ativo": false,
    "dataCriacao": "2024-12-01T00:00:00Z"
  }
]
```

---

### 9. GET /api/Funcionario/email/{email}
**Descrição**: Buscar funcionário por email
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros:**
- `email` (string): Email do funcionário

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
  "dataCriacao": "2025-09-21T20:00:00Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Funcionário não encontrado"
}
```

---

### 10. GET /api/Funcionario/count
**Descrição**: Contar funcionários
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
{
  "total": 3,
  "ativos": 2,
  "inativos": 1
}
```

---

### 11. GET /api/Funcionario/exists/{id}
**Descrição**: Verificar se funcionário existe
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros:**
- `id` (int): ID do funcionário

**Resposta Esperada (200 OK):**
```json
{
  "exists": true,
  "id": 1,
  "nome": "Maria Santos"
}
```

**Resposta Esperada (200 OK) - Não existe:**
```json
{
  "exists": false,
  "id": 999,
  "nome": null
}
```

---

## 🚨 Troubleshooting

### Problemas Comuns e Soluções

#### 401 Unauthorized
**Causa**: Token JWT inválido ou expirado
**Solução**: Faça login novamente para obter um novo token

#### 403 Forbidden
**Causa**: Token válido mas sem permissão (role Usuario)
**Solução**: Use um token de usuário com role "Admin" ou "Funcionario"

#### 404 Not Found
**Causa**: Funcionário não encontrado
**Solução**: Verifique se o ID existe no banco de dados

#### 400 Bad Request - Email duplicado
**Causa**: Já existe um funcionário com este email
**Solução**: Use um email diferente

---

## 💡 Dicas Importantes

1. **Email deve ser único** no sistema
2. **Campos obrigatórios**: nome, email, senha, telefone, cargo, salario, dataAdmissao
3. **Senha será criptografada** automaticamente
4. **Data de admissão** não pode ser futura
5. **Salário** deve ser positivo
6. **Para excluir funcionário**, ele não pode ter empréstimos ativos
7. **Busca por cargo** é exata (case-sensitive)

---

## 📝 Validações

### Campos Obrigatórios
- `nome`: String, máximo 150 caracteres
- `email`: String, formato de email válido, máximo 100 caracteres
- `senha`: String, será criptografada automaticamente
- `telefone`: String, máximo 20 caracteres
- `cargo`: String, máximo 100 caracteres
- `salario`: Decimal, deve ser positivo
- `dataAdmissao`: DateTime, data válida

### Campos Opcionais
- `dataDemissao`: DateTime, deve ser posterior à data de admissão

### Validações de Negócio
- Email deve ser único no sistema
- Data de admissão não pode ser futura
- Data de demissão deve ser posterior à data de admissão
- Salário deve ser positivo
- Funcionário não pode ser excluído se tiver empréstimos ativos

---

**Total de endpoints documentados: 11/11** ✅
