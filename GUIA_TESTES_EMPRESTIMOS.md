# 📚 Guia de Testes - Empréstimos

Este guia documenta todos os **14 endpoints de empréstimos** da API.

## 📋 Lista de Endpoints

1. **GET /api/Emprestimo** - Listar todos os empréstimos
2. **GET /api/Emprestimo/{id}** - Obter empréstimo por ID
3. **POST /api/Emprestimo** - Criar novo empréstimo
4. **PUT /api/Emprestimo** - Atualizar empréstimo
5. **DELETE /api/Emprestimo/{id}** - Excluir empréstimo
6. **GET /api/Emprestimo/por-usuario/{idUsuario}** - Listar empréstimos por usuário
7. **GET /api/Emprestimo/por-exemplar/{idExemplar}** - Listar empréstimos por exemplar
8. **GET /api/Emprestimo/ativos** - Listar empréstimos ativos
9. **GET /api/Emprestimo/vencidos** - Listar empréstimos vencidos
10. **GET /api/Emprestimo/por-status/{status}** - Listar empréstimos por status
11. **GET /api/Emprestimo/emprestados** - Listar empréstimos emprestados
12. **GET /api/Emprestimo/atrasados** - Listar empréstimos atrasados
13. **POST /api/Emprestimo/{id}/devolver** - Devolver empréstimo
14. **POST /api/Emprestimo/{id}/renovar** - Renovar empréstimo

---

## 🔑 Autenticação

**Todos os endpoints de empréstimos requerem autenticação JWT.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Emprestimo
**Descrição**: Listar todos os empréstimos
**Autenticação**: Token JWT necessário

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
    "multa": 0,
    "status": "Emprestado",
    "observacoes": "Empréstimo de teste",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z",
    "tituloLivro": "Dom Casmurro",
    "numeroExemplar": "DC-001",
    "nomeUsuario": "João Silva",
    "emailUsuario": "joao@email.com",
    "estaAtrasado": false,
    "diasAtraso": 0,
    "podeRenovar": true
  }
]
```

---

### 2. GET /api/Emprestimo/{id}
**Descrição**: Obter empréstimo por ID
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do empréstimo

**Resposta Esperada (200 OK):**
```json
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
  "multa": 0,
  "status": "Emprestado",
  "observacoes": "Empréstimo de teste",
  "ativo": true,
  "dataCriacao": "2025-09-21T20:30:00Z",
  "tituloLivro": "Dom Casmurro",
  "numeroExemplar": "DC-001",
  "nomeUsuario": "João Silva",
  "emailUsuario": "joao@email.com",
  "estaAtrasado": false,
  "diasAtraso": 0,
  "podeRenovar": true
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Empréstimo não encontrado"
}
```

---

### 3. POST /api/Emprestimo
**Descrição**: Criar novo empréstimo
**Autenticação**: Token JWT necessário

**Request Body:**
```json
{
  "idExemplar": 1,
  "idUsuario": 1,
  "dataEmprestimo": "2025-09-21T20:30:00Z",
  "dataPrevistaDevolucao": "2025-10-05T20:30:00Z",
  "maxRenovacoes": 3,
  "observacoes": "Empréstimo de teste"
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
  "multa": 0,
  "status": "Emprestado",
  "observacoes": "Empréstimo de teste",
  "ativo": true,
  "dataCriacao": "2025-09-21T21:00:00Z",
  "tituloLivro": "Dom Casmurro",
  "numeroExemplar": "DC-001",
  "nomeUsuario": "João Silva",
  "emailUsuario": "joao@email.com",
  "estaAtrasado": false,
  "diasAtraso": 0,
  "podeRenovar": true
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Exemplar não disponível para empréstimo"
}
```

---

### 4. PUT /api/Emprestimo
**Descrição**: Atualizar empréstimo
**Autenticação**: Token JWT necessário

**Request Body:**
```json
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
  "multa": 0,
  "status": "Emprestado",
  "observacoes": "Empréstimo atualizado"
}
```

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

---

### 5. DELETE /api/Emprestimo/{id}
**Descrição**: Excluir empréstimo
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do empréstimo

**Resposta Esperada (204 No Content):**
```
(Sem conteúdo)
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Empréstimo não encontrado"
}
```

---

### 6. GET /api/Emprestimo/por-usuario/{idUsuario}
**Descrição**: Listar empréstimos por usuário
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `idUsuario` (int): ID do usuário

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
    "multa": 0,
    "status": "Emprestado",
    "observacoes": "Empréstimo de teste",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z",
    "tituloLivro": "Dom Casmurro",
    "numeroExemplar": "DC-001",
    "nomeUsuario": "João Silva",
    "emailUsuario": "joao@email.com",
    "estaAtrasado": false,
    "diasAtraso": 0,
    "podeRenovar": true
  }
]
```

---

### 7. GET /api/Emprestimo/por-exemplar/{idExemplar}
**Descrição**: Listar empréstimos por exemplar
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `idExemplar` (int): ID do exemplar

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
    "multa": 0,
    "status": "Emprestado",
    "observacoes": "Empréstimo de teste",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z",
    "tituloLivro": "Dom Casmurro",
    "numeroExemplar": "DC-001",
    "nomeUsuario": "João Silva",
    "emailUsuario": "joao@email.com",
    "estaAtrasado": false,
    "diasAtraso": 0,
    "podeRenovar": true
  }
]
```

---

### 8. GET /api/Emprestimo/ativos
**Descrição**: Listar empréstimos ativos
**Autenticação**: Token JWT necessário

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
    "multa": 0,
    "status": "Emprestado",
    "observacoes": "Empréstimo de teste",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z",
    "tituloLivro": "Dom Casmurro",
    "numeroExemplar": "DC-001",
    "nomeUsuario": "João Silva",
    "emailUsuario": "joao@email.com",
    "estaAtrasado": false,
    "diasAtraso": 0,
    "podeRenovar": true
  }
]
```

---

### 9. GET /api/Emprestimo/vencidos
**Descrição**: Listar empréstimos vencidos
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 2,
    "idExemplar": 2,
    "idUsuario": 2,
    "dataEmprestimo": "2025-09-01T20:30:00Z",
    "dataPrevistaDevolucao": "2025-09-15T20:30:00Z",
    "dataDevolucao": null,
    "dataRenovacao": null,
    "quantidadeRenovacoes": 0,
    "maxRenovacoes": 3,
    "multa": 6.0,
    "status": "Emprestado",
    "observacoes": "Empréstimo vencido",
    "ativo": true,
    "dataCriacao": "2025-09-01T20:30:00Z",
    "tituloLivro": "O Senhor dos Anéis",
    "numeroExemplar": "SDA-001",
    "nomeUsuario": "Maria Santos",
    "emailUsuario": "maria@email.com",
    "estaAtrasado": true,
    "diasAtraso": 6,
    "podeRenovar": false
  }
]
```

---

### 10. GET /api/Emprestimo/por-status/{status}
**Descrição**: Listar empréstimos por status
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `status` (string): Status do empréstimo (Emprestado, Devolvido, Atrasado)

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
    "multa": 0,
    "status": "Emprestado",
    "observacoes": "Empréstimo de teste",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z",
    "tituloLivro": "Dom Casmurro",
    "numeroExemplar": "DC-001",
    "nomeUsuario": "João Silva",
    "emailUsuario": "joao@email.com",
    "estaAtrasado": false,
    "diasAtraso": 0,
    "podeRenovar": true
  }
]
```

---

### 11. GET /api/Emprestimo/emprestados
**Descrição**: Listar empréstimos emprestados
**Autenticação**: Token JWT necessário

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
    "multa": 0,
    "status": "Emprestado",
    "observacoes": "Empréstimo de teste",
    "ativo": true,
    "dataCriacao": "2025-09-21T20:30:00Z",
    "tituloLivro": "Dom Casmurro",
    "numeroExemplar": "DC-001",
    "nomeUsuario": "João Silva",
    "emailUsuario": "joao@email.com",
    "estaAtrasado": false,
    "diasAtraso": 0,
    "podeRenovar": true
  }
]
```

---

### 12. GET /api/Emprestimo/atrasados
**Descrição**: Listar empréstimos atrasados
**Autenticação**: Token JWT necessário

**Resposta Esperada (200 OK):**
```json
[
  {
    "id": 2,
    "idExemplar": 2,
    "idUsuario": 2,
    "dataEmprestimo": "2025-09-01T20:30:00Z",
    "dataPrevistaDevolucao": "2025-09-15T20:30:00Z",
    "dataDevolucao": null,
    "dataRenovacao": null,
    "quantidadeRenovacoes": 0,
    "maxRenovacoes": 3,
    "multa": 6.0,
    "status": "Emprestado",
    "observacoes": "Empréstimo atrasado",
    "ativo": true,
    "dataCriacao": "2025-09-01T20:30:00Z",
    "tituloLivro": "O Senhor dos Anéis",
    "numeroExemplar": "SDA-001",
    "nomeUsuario": "Maria Santos",
    "emailUsuario": "maria@email.com",
    "estaAtrasado": true,
    "diasAtraso": 6,
    "podeRenovar": false
  }
]
```

---

### 13. POST /api/Emprestimo/{id}/devolver
**Descrição**: Devolver empréstimo
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do empréstimo

**Resposta Esperada (200 OK):**
```json
{
  "message": "Empréstimo devolvido com sucesso",
  "dataDevolucao": "2025-09-21T21:00:00Z",
  "multa": 0
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Empréstimo não encontrado"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Empréstimo já foi devolvido"
}
```

---

### 14. POST /api/Emprestimo/{id}/renovar
**Descrição**: Renovar empréstimo
**Autenticação**: Token JWT necessário

**Parâmetros:**
- `id` (int): ID do empréstimo

**Resposta Esperada (200 OK):**
```json
{
  "message": "Empréstimo renovado com sucesso",
  "novaDataPrevistaDevolucao": "2025-10-19T20:30:00Z",
  "quantidadeRenovacoes": 1
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "message": "Empréstimo não encontrado"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "message": "Empréstimo não pode ser renovado"
}
```

---

## 🚨 Troubleshooting

### Problemas Comuns e Soluções

#### 401 Unauthorized
**Causa**: Token JWT inválido ou expirado
**Solução**: Faça login novamente para obter um novo token

#### 404 Not Found
**Causa**: Empréstimo não encontrado
**Solução**: Verifique se o ID existe no banco de dados

#### 400 Bad Request - Exemplar indisponível
**Causa**: Exemplar não está disponível para empréstimo
**Solução**: Verifique se o exemplar está disponível

#### 400 Bad Request - Empréstimo já devolvido
**Causa**: Tentativa de devolver empréstimo já devolvido
**Solução**: Verifique o status do empréstimo

#### 400 Bad Request - Não pode renovar
**Causa**: Empréstimo não pode ser renovado (já devolvido, atrasado, etc.)
**Solução**: Verifique as condições do empréstimo

---

## 💡 Dicas Importantes

1. **Para criar empréstimo**, exemplar e usuário devem existir
2. **Exemplar deve estar disponível** para empréstimo
3. **Status possíveis**: Emprestado, Devolvido, Atrasado
4. **Renovação** só é possível se não estiver atrasado e não exceder maxRenovacoes
5. **Multa** é calculada automaticamente para empréstimos atrasados
6. **Data de devolução** é preenchida automaticamente na devolução
7. **Campos calculados** são preenchidos automaticamente

---

## 📝 Validações

### Campos Obrigatórios
- `idExemplar`: Int, deve existir e estar disponível
- `idUsuario`: Int, deve existir
- `dataEmprestimo`: DateTime, data válida
- `dataPrevistaDevolucao`: DateTime, deve ser futura

### Validações de Negócio
- Exemplar deve existir e estar disponível
- Usuário deve existir
- Data de devolução prevista deve ser futura
- Empréstimo não pode ser renovado se já devolvido
- Empréstimo não pode ser renovado se atrasado
- Empréstimo não pode ser renovado se exceder maxRenovacoes

---

**Total de endpoints documentados: 14/14** ✅
