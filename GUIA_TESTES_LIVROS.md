# 📖 Guia de Testes - Livros

Este guia documenta todos os **11 endpoints de livros** da API.

## 📋 Lista de Endpoints

1. **GET /api/Livro** - Listar todos os livros
2. **GET /api/Livro/{id}** - Obter livro por ID
3. **POST /api/Livro** - Criar novo livro
4. **PUT /api/Livro** - Atualizar livro
5. **DELETE /api/Livro/{id}** - Excluir livro
6. **GET /api/Livro/disponiveis** - Listar livros com exemplares disponíveis
7. **GET /api/Livro/por-genero/{genero}** - Listar livros por gênero
8. **GET /api/Livro/por-autor/{idAutor}** - Listar livros por autor
9. **GET /api/Livro/por-editora/{idEditora}** - Listar livros por editora
10. **GET /api/Livro/buscar/{termo}** - Buscar livros por termo
11. **GET /api/Livro/em-estoque** - Listar livros em estoque

---

## 🔑 Autenticação

**Todos os endpoints de livros requerem autenticação JWT.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Livro
**Descrição**: Listar todos os livros
**Autenticação**: Token JWT necessário

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
    "capaUrl": "http://example.com/capa.jpg",
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

### 2. GET /api/Livro/{id}
**Descrição**: Obter livro por ID
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do livro

**Resposta Esperada (200 OK):**
```json
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
  "capaUrl": "http://example.com/capa.jpg",
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
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Livro não encontrado"
}
```

---

### 3. POST /api/Livro
**Descrição**: Criar novo livro
**Autenticação**: Token JWT necessário

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
  "sinopse": "A história de Frodo e o Anel...",
  "preco": 45.90,
  "capaUrl": "http://example.com/capa_sda.jpg",
  "codigoBarras": "1234567890124",
  "idAutor": 2,
  "idEditora": 2
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
  "sinopse": "A história de Frodo e o Anel...",
  "preco": 45.90,
  "capaUrl": "http://example.com/capa_sda.jpg",
  "codigoBarras": "1234567890124",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z",
  "idAutor": 2,
  "idEditora": 2,
  "totalExemplares": 0,
  "exemplaresDisponiveis": 0,
  "temExemplaresDisponiveis": false,
  "nomeAutor": "J.R.R. Tolkien",
  "nomeEditora": "Editora Martins Fontes"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Dados inválidos"
}
```

---

### 4. PUT /api/Livro
**Descrição**: Atualizar livro
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "id": 1,
  "titulo": "Dom Casmurro - Edição Especial",
  "subtitulo": "Romance Clássico",
  "isbn": "978-85-333-0227-3",
  "ano": 1899,
  "edicao": 2,
  "numeroPaginas": 280,
  "idioma": "Português",
  "genero": "Romance",
  "sinopse": "Romance de Machado de Assis - Edição revisada...",
  "preco": 35.90,
  "capaUrl": "http://example.com/capa_especial.jpg",
  "codigoBarras": "1234567890123",
  "idAutor": 1,
  "idEditora": 1
}
```

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

---

### 5. DELETE /api/Livro/{id}
**Descrição**: Excluir livro
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do livro

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Livro não encontrado"
}
```

---

### 6. GET /api/Livro/disponiveis
**Descrição**: Listar livros com exemplares disponíveis
**Autenticação**: Token JWT necessário

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
    "capaUrl": "http://example.com/capa.jpg",
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

### 7. GET /api/Livro/por-genero/{genero}
**Descrição**: Listar livros por gênero
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `genero` (string): Gênero do livro

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "genero": "Romance",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 8. GET /api/Livro/por-autor/{idAutor}
**Descrição**: Listar livros por autor
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `idAutor` (int): ID do autor

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 9. GET /api/Livro/por-editora/{idEditora}
**Descrição**: Listar livros por editora
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `idEditora` (int): ID da editora

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 10. GET /api/Livro/buscar/{termo}
**Descrição**: Buscar livros por termo
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `termo` (string): Termo de busca

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 11. GET /api/Livro/em-estoque
**Descrição**: Listar livros em estoque
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "totalExemplares": 2,
    "exemplaresDisponiveis": 1,
    "temExemplaresDisponiveis": true
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
**Causa**: Livro não encontrado
**Solução**: Verifique se o ID existe no banco de dados

#### 400 Bad Request
**Causa**: Dados inválidos
**Solução**: Verifique se todos os campos obrigatórios estão preenchidos

#### 500 Internal Server Error
**Causa**: Erro interno do servidor
**Solução**: Verifique os logs da aplicação para mais detalhes

---

## 💡 Dicas Importantes

1. **Para criar um livro**, você precisa de um Autor e Editora existentes
2. **Campos obrigatórios**: titulo, isbn, ano, idAutor, idEditora
3. **ISBN deve ser único** no sistema
4. **Código de barras deve ser único** no sistema
5. **Para endpoints de busca**, use termos que existem no banco de dados
6. **Os campos calculados** (totalExemplares, exemplaresDisponiveis) são preenchidos automaticamente

---

**Total de endpoints documentados: 11/11** ✅
