# 📊 Guia de Testes - Relatórios

Este guia documenta todos os **6 endpoints de relatórios** da API.

## 📋 Lista de Endpoints

1. **GET /api/Relatorios/emprestimos-por-periodo** - Relatório de empréstimos por período
2. **GET /api/Relatorios/livros-mais-emprestados** - Relatório de livros mais emprestados
3. **GET /api/Relatorios/usuarios-mais-ativos** - Relatório de usuários mais ativos
4. **GET /api/Relatorios/atrasos-por-periodo** - Relatório de atrasos por período
5. **GET /api/Relatorios/multas-por-periodo** - Relatório de multas por período
6. **GET /api/Relatorios/estoque-baixo** - Relatório de estoque baixo

---

## 🔑 Autenticação

**Todos os endpoints de relatórios requerem autenticação JWT com role Admin ou Funcionario.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Relatorios/emprestimos-por-periodo
**Descrição**: Relatório de empréstimos por período
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros de Query:**
- `dataInicio` (DateTime): Data de início do período
- `dataFim` (DateTime): Data de fim do período

**Resposta Esperada (200 OK):**
```json
{
  "dataInicio": "2025-09-01T00:00:00Z",
  "dataFim": "2025-09-30T23:59:59Z",
  "totalEmprestimos": 150,
  "emprestimos": [
    {
      "id": 1,
      "dataEmprestimo": "2025-09-15T10:30:00Z",
      "dataPrevistaDevolucao": "2025-09-29T10:30:00Z",
      "dataDevolucao": "2025-09-28T14:20:00Z",
      "status": "Devolvido",
      "tituloLivro": "Dom Casmurro",
      "numeroExemplar": "DC-001",
      "nomeUsuario": "João Silva",
      "emailUsuario": "joao@email.com"
    }
  ],
  "resumo": {
    "totalEmprestados": 120,
    "totalDevolvidos": 25,
    "totalAtrasados": 5,
    "taxaDevolucao": 83.33
  }
}
```

---

### 2. GET /api/Relatorios/livros-mais-emprestados
**Descrição**: Relatório de livros mais emprestados
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
{
  "periodo": "Últimos 30 dias",
  "livros": [
    {
      "id": 1,
      "titulo": "Dom Casmurro",
      "autor": "Machado de Assis",
      "editora": "Editora Globo",
      "totalEmprestimos": 25,
      "totalExemplares": 3,
      "exemplaresDisponiveis": 1,
      "taxaUtilizacao": 83.33
    },
    {
      "id": 2,
      "titulo": "O Senhor dos Anéis",
      "autor": "J.R.R. Tolkien",
      "editora": "Editora Martins Fontes",
      "totalEmprestimos": 18,
      "totalExemplares": 2,
      "exemplaresDisponiveis": 0,
      "taxaUtilizacao": 90.0
    }
  ],
  "resumo": {
    "totalLivros": 2,
    "totalEmprestimos": 43,
    "mediaEmprestimosPorLivro": 21.5
  }
}
```

---

### 3. GET /api/Relatorios/usuarios-mais-ativos
**Descrição**: Relatório de usuários mais ativos
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
{
  "periodo": "Últimos 30 dias",
  "usuarios": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "totalEmprestimos": 15,
      "totalDevolucoes": 12,
      "totalAtrasos": 1,
      "totalMultas": 5.0,
      "taxaDevolucao": 80.0
    },
    {
      "id": 2,
      "nome": "Maria Santos",
      "email": "maria@email.com",
      "totalEmprestimos": 12,
      "totalDevolucoes": 11,
      "totalAtrasos": 0,
      "totalMultas": 0.0,
      "taxaDevolucao": 91.67
    }
  ],
  "resumo": {
    "totalUsuarios": 2,
    "totalEmprestimos": 27,
    "mediaEmprestimosPorUsuario": 13.5
  }
}
```

---

### 4. GET /api/Relatorios/atrasos-por-periodo
**Descrição**: Relatório de atrasos por período
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros de Query:**
- `dataInicio` (DateTime): Data de início do período
- `dataFim` (DateTime): Data de fim do período

**Resposta Esperada (200 OK):**
```json
{
  "dataInicio": "2025-09-01T00:00:00Z",
  "dataFim": "2025-09-30T23:59:59Z",
  "totalAtrasos": 8,
  "atrasos": [
    {
      "id": 1,
      "dataEmprestimo": "2025-09-01T10:30:00Z",
      "dataPrevistaDevolucao": "2025-09-15T10:30:00Z",
      "dataDevolucao": "2025-09-20T14:20:00Z",
      "diasAtraso": 5,
      "multa": 25.0,
      "tituloLivro": "Dom Casmurro",
      "numeroExemplar": "DC-001",
      "nomeUsuario": "João Silva",
      "emailUsuario": "joao@email.com"
    }
  ],
  "resumo": {
    "totalMultas": 200.0,
    "mediaDiasAtraso": 3.5,
    "taxaAtraso": 5.33
  }
}
```

---

### 5. GET /api/Relatorios/multas-por-periodo
**Descrição**: Relatório de multas por período
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros de Query:**
- `dataInicio` (DateTime): Data de início do período
- `dataFim` (DateTime): Data de fim do período

**Resposta Esperada (200 OK):**
```json
{
  "dataInicio": "2025-09-01T00:00:00Z",
  "dataFim": "2025-09-30T23:59:59Z",
  "totalMultas": 200.0,
  "multas": [
    {
      "id": 1,
      "dataEmprestimo": "2025-09-01T10:30:00Z",
      "dataPrevistaDevolucao": "2025-09-15T10:30:00Z",
      "dataDevolucao": "2025-09-20T14:20:00Z",
      "diasAtraso": 5,
      "valorMulta": 25.0,
      "status": "Paga",
      "tituloLivro": "Dom Casmurro",
      "numeroExemplar": "DC-001",
      "nomeUsuario": "João Silva",
      "emailUsuario": "joao@email.com"
    }
  ],
  "resumo": {
    "totalMultasPagas": 150.0,
    "totalMultasPendentes": 50.0,
    "mediaMulta": 25.0
  }
}
```

---

### 6. GET /api/Relatorios/estoque-baixo
**Descrição**: Relatório de estoque baixo
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros de Query:**
- `limite` (int, opcional): Limite de exemplares para considerar estoque baixo (padrão: 2)

**Resposta Esperada (200 OK):**
```json
{
  "limite": 2,
  "totalLivrosComEstoqueBaixo": 3,
  "livros": [
    {
      "id": 1,
      "titulo": "Dom Casmurro",
      "autor": "Machado de Assis",
      "editora": "Editora Globo",
      "totalExemplares": 2,
      "exemplaresDisponiveis": 1,
      "exemplaresEmprestados": 1,
      "status": "Estoque Baixo"
    },
    {
      "id": 2,
      "titulo": "O Senhor dos Anéis",
      "autor": "J.R.R. Tolkien",
      "editora": "Editora Martins Fontes",
      "totalExemplares": 1,
      "exemplaresDisponiveis": 0,
      "exemplaresEmprestados": 1,
      "status": "Sem Estoque"
    }
  ],
  "resumo": {
    "totalExemplares": 3,
    "totalDisponiveis": 1,
    "totalEmprestados": 2,
    "taxaUtilizacao": 66.67
  }
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

#### 400 Bad Request - Período inválido
**Causa**: Data de início posterior à data de fim
**Solução**: Verifique se as datas estão corretas

#### 400 Bad Request - Parâmetros inválidos
**Causa**: Parâmetros de query inválidos
**Solução**: Verifique se os parâmetros estão no formato correto

---

## 💡 Dicas Importantes

1. **Todos os relatórios** requerem permissão de Admin ou Funcionario
2. **Datas devem estar no formato ISO 8601** (YYYY-MM-DDTHH:mm:ssZ)
3. **Período padrão** é os últimos 30 dias se não especificado
4. **Limite de estoque baixo** padrão é 2 exemplares
5. **Relatórios são gerados em tempo real** com base nos dados atuais
6. **Campos calculados** são preenchidos automaticamente
7. **Filtros de data** são inclusivos (incluem as datas de início e fim)

---

## 📝 Parâmetros de Query

### Empréstimos por Período
- `dataInicio`: DateTime (obrigatório)
- `dataFim`: DateTime (obrigatório)

### Atrasos por Período
- `dataInicio`: DateTime (obrigatório)
- `dataFim`: DateTime (obrigatório)

### Multas por Período
- `dataInicio`: DateTime (obrigatório)
- `dataFim`: DateTime (obrigatório)

### Estoque Baixo
- `limite`: int (opcional, padrão: 2)

---

**Total de endpoints documentados: 6/6** ✅
