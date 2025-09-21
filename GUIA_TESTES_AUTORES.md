# ✍️ Guia de Testes - Autores

Este guia documenta todos os **7 endpoints de autores** da API.

## 📋 Lista de Endpoints

1. **GET /api/Autor** - Listar todos os autores
2. **GET /api/Autor/{id}** - Obter autor por ID
3. **POST /api/Autor** - Criar novo autor
4. **PUT /api/Autor** - Atualizar autor
5. **DELETE /api/Autor/{id}** - Excluir autor
6. **GET /api/Autor/por-nacionalidade/{nacionalidade}** - Listar autores por nacionalidade
7. **GET /api/Autor/buscar/{termo}** - Buscar autores por termo
8. **GET /api/Autor/com-livros** - Listar autores com livros

---

## 🔑 Autenticação

**Todos os endpoints de autores requerem autenticação JWT.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Autor
**Descrição**: Listar todos os autores
**Autenticação**: Token JWT necessário

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
    "email": "machado@email.com",
    "telefone": "11999999999",
    "website": "https://machado.com",
    "endereco": "Rua das Flores, 123",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "cep": "20000-000",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:00:00Z"
  }
]
```

---

### 2. GET /api/Autor/{id}
**Descrição**: Obter autor por ID
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do autor

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "nome": "Machado de Assis",
  "nomeCompleto": "Joaquim Maria Machado de Assis",
  "nomeArtistico": "Machado de Assis",
  "dataNascimento": "1839-06-21T00:00:00Z",
  "nacionalidade": "Brasileira",
  "pais": "Brasil",
  "paisOrigem": "Brasil",
  "email": "machado@email.com",
  "telefone": "11999999999",
  "website": "https://machado.com",
  "endereco": "Rua das Flores, 123",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "cep": "20000-000",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:00:00Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Autor não encontrado"
}
```

---

### 3. POST /api/Autor
**Descrição**: Criar novo autor
**Autenticação**: Token JWT necessário

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
  "email": "tolkien@email.com",
  "telefone": "11988888888",
  "website": "https://tolkien.com",
  "endereco": "Oxford Street, 456",
  "cidade": "Oxford",
  "estado": "Inglaterra",
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
  "email": "tolkien@email.com",
  "telefone": "11988888888",
  "website": "https://tolkien.com",
  "endereco": "Oxford Street, 456",
  "cidade": "Oxford",
  "estado": "Inglaterra",
  "cep": "OX1 1AA",
  "ativo": true,
  "dataCriacao": "2025-09-21T21:00:00Z"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Já existe um autor com este email"
}
```

---

### 4. PUT /api/Autor
**Descrição**: Atualizar autor
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "id": 1,
  "nome": "Machado de Assis",
  "nomeCompleto": "Joaquim Maria Machado de Assis",
  "nomeArtistico": "Machado de Assis",
  "dataNascimento": "1839-06-21T00:00:00Z",
  "nacionalidade": "Brasileira",
  "pais": "Brasil",
  "paisOrigem": "Brasil",
  "email": "machado.assis@email.com",
  "telefone": "11999999999",
  "website": "https://machado.com",
  "endereco": "Rua das Flores, 123",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "cep": "20000-000"
}
```

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

---

### 5. DELETE /api/Autor/{id}
**Descrição**: Excluir autor
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do autor

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Autor não encontrado"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Não é possível excluir autor com livros cadastrados"
}
```

---

### 6. GET /api/Autor/por-nacionalidade/{nacionalidade}
**Descrição**: Listar autores por nacionalidade
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `nacionalidade` (string): Nacionalidade do autor

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Machado de Assis",
    "nacionalidade": "Brasileira",
    "pais": "Brasil"
  }
]
```

---

### 7. GET /api/Autor/buscar/{termo}
**Descrição**: Buscar autores por termo
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `termo` (string): Termo de busca

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Machado de Assis",
    "nomeCompleto": "Joaquim Maria Machado de Assis",
    "nacionalidade": "Brasileira"
  }
]
```

---

### 8. GET /api/Autor/com-livros
**Descrição**: Listar autores com livros
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Machado de Assis",
    "nomeCompleto": "Joaquim Maria Machado de Assis",
    "nacionalidade": "Brasileira",
    "pais": "Brasil",
    "totalLivros": 2
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
**Causa**: Autor não encontrado
**Solução**: Verifique se o ID existe no banco de dados

#### 400 Bad Request - Email duplicado
**Causa**: Já existe um autor com este email
**Solução**: Use um email diferente

#### 400 Bad Request - Autor com livros
**Causa**: Tentativa de excluir autor com livros cadastrados
**Solução**: Primeiro exclua ou transfira os livros do autor

---

## 💡 Dicas Importantes

1. **Email deve ser único** no sistema
2. **Campos obrigatórios**: nome, dataNascimento, nacionalidade
3. **Data de nascimento** deve ser uma data válida
4. **Para excluir autor**, ele não pode ter livros cadastrados
5. **Busca por termo** procura em nome, nomeCompleto e nomeArtistico
6. **Nacionalidade** é usada para filtrar autores
7. **Endpoint com-livros** mostra apenas autores que têm livros cadastrados

---

## 📝 Validações

### Campos Obrigatórios
- `nome`: String, máximo 150 caracteres
- `dataNascimento`: DateTime, data válida
- `nacionalidade`: String, máximo 50 caracteres

### Campos Opcionais
- `nomeCompleto`: String, máximo 150 caracteres
- `nomeArtistico`: String, máximo 150 caracteres
- `pais`: String, máximo 50 caracteres
- `paisOrigem`: String, máximo 50 caracteres
- `email`: String, formato de email válido, máximo 100 caracteres
- `telefone`: String, máximo 20 caracteres
- `website`: String, máximo 200 caracteres
- `endereco`: String, máximo 300 caracteres
- `cidade`: String, máximo 100 caracteres
- `estado`: String, máximo 50 caracteres
- `cep`: String, máximo 10 caracteres

### Validações de Negócio
- Email deve ser único no sistema
- Data de nascimento não pode ser futura
- Autor não pode ser excluído se tiver livros cadastrados

---

**Total de endpoints documentados: 8/8** ✅
