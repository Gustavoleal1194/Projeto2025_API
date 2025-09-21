# 📚 Guia de Testes - Exemplares

Este guia documenta todos os **15 endpoints de exemplares** da API.

## 📋 Lista de Endpoints

1. **GET /api/Exemplar** - Listar todos os exemplares
2. **GET /api/Exemplar/{id}** - Obter exemplar por ID
3. **POST /api/Exemplar** - Criar novo exemplar
4. **PUT /api/Exemplar** - Atualizar exemplar
5. **DELETE /api/Exemplar/{id}** - Excluir exemplar
6. **GET /api/Exemplar/disponiveis** - Listar exemplares disponíveis
7. **GET /api/Exemplar/por-livro/{idLivro}** - Listar exemplares por livro
8. **GET /api/Exemplar/disponiveis-por-livro/{idLivro}** - Listar exemplares disponíveis por livro
9. **GET /api/Exemplar/por-localizacao/{localizacao}** - Listar exemplares por localização
10. **GET /api/Exemplar/por-condicao/{condicao}** - Listar exemplares por condição
11. **GET /api/Exemplar/por-numero/{numeroExemplar}** - Buscar exemplar por número
12. **GET /api/Exemplar/emprestados** - Listar exemplares emprestados
13. **GET /api/Exemplar/{id}/verificar-disponibilidade** - Verificar disponibilidade do exemplar
14. **POST /api/Exemplar/{id}/marcar-indisponivel** - Marcar exemplar como indisponível
15. **POST /api/Exemplar/{id}/marcar-disponivel** - Marcar exemplar como disponível

---

## 🔑 Autenticação

**Todos os endpoints de exemplares requerem autenticação JWT.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Exemplar
**Descrição**: Listar todos os exemplares
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "idLivro": 1,
    "numeroExemplar": "DC-001",
    "localizacao": "Estante A1",
    "condicao": "Excelente",
    "disponivel": true,
    "ativo": true,
    "dataAquisicao": "2025-01-15T00:00:00Z",
    "valorAquisicao": 29.90,
    "fornecedor": "Livraria Central",
    "observacoes": "Exemplar novo",
    "dataCriacao": "2025-09-21T20:00:00Z",
    "tituloLivro": "Dom Casmurro",
    "isbn": "978-85-333-0227-3",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 2. GET /api/Exemplar/{id}
**Descrição**: Obter exemplar por ID
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do exemplar

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "idLivro": 1,
  "numeroExemplar": "DC-001",
  "localizacao": "Estante A1",
  "condicao": "Excelente",
  "disponivel": true,
  "ativo": true,
  "dataAquisicao": "2025-01-15T00:00:00Z",
  "valorAquisicao": 29.90,
  "fornecedor": "Livraria Central",
  "observacoes": "Exemplar novo",
  "dataCriacao": "2025-09-21T20:00:00Z",
  "tituloLivro": "Dom Casmurro",
  "isbn": "978-85-333-0227-3",
  "nomeAutor": "Machado de Assis",
  "nomeEditora": "Editora Globo"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Exemplar não encontrado"
}
```

---

### 3. POST /api/Exemplar
**Descrição**: Criar novo exemplar
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "idLivro": 1,
  "numeroExemplar": "DC-002",
  "localizacao": "Estante A2",
  "condicao": "Bom",
  "disponivel": true,
  "dataAquisicao": "2025-02-10T00:00:00Z",
  "valorAquisicao": 29.90,
  "fornecedor": "Livraria Central",
  "observacoes": "Segundo exemplar"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "id": 2,
  "idLivro": 1,
  "numeroExemplar": "DC-002",
  "localizacao": "Estante A2",
  "condicao": "Bom",
  "disponivel": true,
  "ativo": true,
  "dataAquisicao": "2025-02-10T00:00:00Z",
  "valorAquisicao": 29.90,
  "fornecedor": "Livraria Central",
  "observacoes": "Segundo exemplar",
  "dataCriacao": "2025-09-21T21:00:00Z",
  "tituloLivro": "Dom Casmurro",
  "isbn": "978-85-333-0227-3",
  "nomeAutor": "Machado de Assis",
  "nomeEditora": "Editora Globo"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Livro não encontrado"
}
```

---

### 4. PUT /api/Exemplar
**Descrição**: Atualizar exemplar
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "id": 1,
  "idLivro": 1,
  "numeroExemplar": "DC-001",
  "localizacao": "Estante A1 - Prateleira 2",
  "condicao": "Muito Bom",
  "disponivel": true,
  "dataAquisicao": "2025-01-15T00:00:00Z",
  "valorAquisicao": 29.90,
  "fornecedor": "Livraria Central",
  "observacoes": "Exemplar revisado"
}
```

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

---

### 5. DELETE /api/Exemplar/{id}
**Descrição**: Excluir exemplar
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do exemplar

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Exemplar não encontrado"
}
```

---

### 6. GET /api/Exemplar/disponiveis
**Descrição**: Listar exemplares disponíveis
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "idLivro": 1,
    "numeroExemplar": "DC-001",
    "localizacao": "Estante A1",
    "condicao": "Excelente",
    "disponivel": true,
    "ativo": true,
    "dataAquisicao": "2025-01-15T00:00:00Z",
    "valorAquisicao": 29.90,
    "fornecedor": "Livraria Central",
    "observacoes": "Exemplar novo",
    "dataCriacao": "2025-09-21T20:00:00Z",
    "tituloLivro": "Dom Casmurro",
    "isbn": "978-85-333-0227-3",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 7. GET /api/Exemplar/por-livro/{idLivro}
**Descrição**: Listar exemplares por livro
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `idLivro` (int): ID do livro

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "idLivro": 1,
    "numeroExemplar": "DC-001",
    "localizacao": "Estante A1",
    "condicao": "Excelente",
    "disponivel": true,
    "ativo": true,
    "dataAquisicao": "2025-01-15T00:00:00Z",
    "valorAquisicao": 29.90,
    "fornecedor": "Livraria Central",
    "observacoes": "Exemplar novo",
    "dataCriacao": "2025-09-21T20:00:00Z",
    "tituloLivro": "Dom Casmurro",
    "isbn": "978-85-333-0227-3",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 8. GET /api/Exemplar/disponiveis-por-livro/{idLivro}
**Descrição**: Listar exemplares disponíveis por livro
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `idLivro` (int): ID do livro

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "idLivro": 1,
    "numeroExemplar": "DC-001",
    "localizacao": "Estante A1",
    "condicao": "Excelente",
    "disponivel": true,
    "ativo": true,
    "dataAquisicao": "2025-01-15T00:00:00Z",
    "valorAquisicao": 29.90,
    "fornecedor": "Livraria Central",
    "observacoes": "Exemplar novo",
    "dataCriacao": "2025-09-21T20:00:00Z",
    "tituloLivro": "Dom Casmurro",
    "isbn": "978-85-333-0227-3",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 9. GET /api/Exemplar/por-localizacao/{localizacao}
**Descrição**: Listar exemplares por localização
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `localizacao` (string): Localização do exemplar

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "idLivro": 1,
    "numeroExemplar": "DC-001",
    "localizacao": "Estante A1",
    "condicao": "Excelente",
    "disponivel": true,
    "ativo": true,
    "dataAquisicao": "2025-01-15T00:00:00Z",
    "valorAquisicao": 29.90,
    "fornecedor": "Livraria Central",
    "observacoes": "Exemplar novo",
    "dataCriacao": "2025-09-21T20:00:00Z",
    "tituloLivro": "Dom Casmurro",
    "isbn": "978-85-333-0227-3",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 10. GET /api/Exemplar/por-condicao/{condicao}
**Descrição**: Listar exemplares por condição
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `condicao` (string): Condição do exemplar

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "idLivro": 1,
    "numeroExemplar": "DC-001",
    "localizacao": "Estante A1",
    "condicao": "Excelente",
    "disponivel": true,
    "ativo": true,
    "dataAquisicao": "2025-01-15T00:00:00Z",
    "valorAquisicao": 29.90,
    "fornecedor": "Livraria Central",
    "observacoes": "Exemplar novo",
    "dataCriacao": "2025-09-21T20:00:00Z",
    "tituloLivro": "Dom Casmurro",
    "isbn": "978-85-333-0227-3",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 11. GET /api/Exemplar/por-numero/{numeroExemplar}
**Descrição**: Buscar exemplar por número
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `numeroExemplar` (string): Número do exemplar

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "idLivro": 1,
  "numeroExemplar": "DC-001",
  "localizacao": "Estante A1",
  "condicao": "Excelente",
  "disponivel": true,
  "ativo": true,
  "dataAquisicao": "2025-01-15T00:00:00Z",
  "valorAquisicao": 29.90,
  "fornecedor": "Livraria Central",
  "observacoes": "Exemplar novo",
  "dataCriacao": "2025-09-21T20:00:00Z",
  "tituloLivro": "Dom Casmurro",
  "isbn": "978-85-333-0227-3",
  "nomeAutor": "Machado de Assis",
  "nomeEditora": "Editora Globo"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Exemplar não encontrado"
}
```

---

### 12. GET /api/Exemplar/emprestados
**Descrição**: Listar exemplares emprestados
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 2,
    "idLivro": 1,
    "numeroExemplar": "DC-002",
    "localizacao": "Estante A2",
    "condicao": "Bom",
    "disponivel": false,
    "ativo": true,
    "dataAquisicao": "2025-02-10T00:00:00Z",
    "valorAquisicao": 29.90,
    "fornecedor": "Livraria Central",
    "observacoes": "Segundo exemplar",
    "dataCriacao": "2025-09-21T21:00:00Z",
    "tituloLivro": "Dom Casmurro",
    "isbn": "978-85-333-0227-3",
    "nomeAutor": "Machado de Assis",
    "nomeEditora": "Editora Globo"
  }
]
```

---

### 13. GET /api/Exemplar/{id}/verificar-disponibilidade
**Descrição**: Verificar disponibilidade do exemplar
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do exemplar

**Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "disponivel": true,
  "mensagem": "Exemplar disponível para empréstimo"
}
```

**Resposta Esperada (200 OK) - Indisponível:**
```json
{
  "id": 1,
  "disponivel": false,
  "mensagem": "Exemplar não disponível para empréstimo"
}
```

---

### 14. POST /api/Exemplar/{id}/marcar-indisponivel
**Descrição**: Marcar exemplar como indisponível
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do exemplar

**Resposta Esperada (200 OK):**
```json
{
  "message": "Exemplar marcado como indisponível com sucesso"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Exemplar não encontrado"
}
```

---

### 15. POST /api/Exemplar/{id}/marcar-disponivel
**Descrição**: Marcar exemplar como disponível
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do exemplar

**Resposta Esperada (200 OK):**
```json
{
  "message": "Exemplar marcado como disponível com sucesso"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Exemplar não encontrado"
}
```

---

## 🚨 Troubleshooting

### Problemas Comuns e Soluções

#### 401 Unauthorized
**Causa**: Token JWT inválido ou expirado
**Solução**: Faça login novamente para obter um novo token

#### 404 Not Found
**Causa**: Exemplar não encontrado
**Solução**: Verifique se o ID existe no banco de dados

#### 400 Bad Request - Livro não encontrado
**Causa**: ID do livro não existe
**Solução**: Use um ID de livro válido

#### 400 Bad Request - Exemplar já emprestado
**Causa**: Tentativa de marcar como disponível um exemplar emprestado
**Solução**: Primeiro devolva o empréstimo

---

## 💡 Dicas Importantes

1. **Para criar um exemplar**, você precisa de um Livro existente
2. **Campos obrigatórios**: idLivro, numeroExemplar, localizacao, condicao
3. **Número do exemplar deve ser único** por livro
4. **Condições possíveis**: Excelente, Muito Bom, Bom, Regular, Ruim
5. **Para marcar como indisponível**, o exemplar deve estar disponível
6. **Para marcar como disponível**, o exemplar deve estar indisponível
7. **Exemplares emprestados** não podem ser marcados como disponíveis

---

## 📝 Validações

### Campos Obrigatórios
- `idLivro`: Int, deve existir na tabela Livro
- `numeroExemplar`: String, máximo 50 caracteres
- `localizacao`: String, máximo 100 caracteres
- `condicao`: String, máximo 20 caracteres

### Validações de Negócio
- Livro deve existir no sistema
- Número do exemplar deve ser único por livro
- Condição deve ser uma das opções válidas
- Data de aquisição não pode ser futura
- Valor de aquisição deve ser positivo

---

**Total de endpoints documentados: 15/15** ✅
