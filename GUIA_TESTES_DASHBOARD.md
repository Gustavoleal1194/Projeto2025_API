# 📊 Guia de Testes - Dashboard

Este guia documenta todos os **5 endpoints de dashboard** da API.

## 📋 Lista de Endpoints

1. **GET /api/Dashboard/resumo-geral** - Resumo geral do sistema
2. **GET /api/Dashboard/estatisticas-emprestimos** - Estatísticas de empréstimos
3. **GET /api/Dashboard/grafico-emprestimos-mensal** - Gráfico de empréstimos mensal
4. **GET /api/Dashboard/grafico-generos-populares** - Gráfico de gêneros populares
5. **GET /api/Dashboard/alertas** - Alertas do sistema

---

## 🔑 Autenticação

**Todos os endpoints de dashboard requerem autenticação JWT com role Admin ou Funcionario.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Dashboard/resumo-geral
**Descrição**: Resumo geral do sistema
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
{
  "totalLivros": 150,
  "totalExemplares": 300,
  "totalUsuarios": 45,
  "totalEmprestimosAtivos": 25,
  "totalAtrasos": 3,
  "totalMultas": 45.0,
  "estatisticas": {
    "taxaDevolucao": 92.5,
    "mediaEmprestimosPorUsuario": 5.6,
    "livrosMaisEmprestados": 3,
    "usuariosMaisAtivos": 2
  },
  "ultimaAtualizacao": "2025-09-21T21:00:00Z"
}
```

---

### 2. GET /api/Dashboard/estatisticas-emprestimos
**Descrição**: Estatísticas de empréstimos
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
{
  "periodo": "Últimos 30 dias",
  "totalEmprestimos": 120,
  "totalDevolucoes": 95,
  "totalAtrasos": 8,
  "totalMultas": 80.0,
  "estatisticas": {
    "taxaDevolucao": 79.17,
    "mediaDiasEmprestimo": 12.5,
    "mediaDiasAtraso": 3.2,
    "valorMedioMulta": 10.0
  },
  "tendencias": {
    "emprestimosCrescimento": 15.5,
    "devolucoesCrescimento": 12.3,
    "atrasosCrescimento": -5.2
  }
}
```

---

### 3. GET /api/Dashboard/grafico-emprestimos-mensal
**Descrição**: Gráfico de empréstimos mensal
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros de Query:**
- `meses` (int, opcional): Número de meses para exibir (padrão: 12)

**Resposta Esperada (200 OK):**
```json
{
  "periodo": "Últimos 12 meses",
  "dados": [
    {
      "mes": "2024-10",
      "emprestimos": 45,
      "devolucoes": 42,
      "atrasos": 3
    },
    {
      "mes": "2024-11",
      "emprestimos": 52,
      "devolucoes": 48,
      "atrasos": 4
    },
    {
      "mes": "2024-12",
      "emprestimos": 38,
      "devolucoes": 35,
      "atrasos": 2
    },
    {
      "mes": "2025-01",
      "emprestimos": 41,
      "devolucoes": 39,
      "atrasos": 2
    },
    {
      "mes": "2025-02",
      "emprestimos": 48,
      "devolucoes": 45,
      "atrasos": 3
    },
    {
      "mes": "2025-03",
      "emprestimos": 55,
      "devolucoes": 52,
      "atrasos": 3
    },
    {
      "mes": "2025-04",
      "emprestimos": 62,
      "devolucoes": 58,
      "atrasos": 4
    },
    {
      "mes": "2025-05",
      "emprestimos": 58,
      "devolucoes": 55,
      "atrasos": 3
    },
    {
      "mes": "2025-06",
      "emprestimos": 65,
      "devolucoes": 62,
      "atrasos": 3
    },
    {
      "mes": "2025-07",
      "emprestimos": 72,
      "devolucoes": 68,
      "atrasos": 4
    },
    {
      "mes": "2025-08",
      "emprestimos": 68,
      "devolucoes": 65,
      "atrasos": 3
    },
    {
      "mes": "2025-09",
      "emprestimos": 75,
      "devolucoes": 72,
      "atrasos": 3
    }
  ],
  "resumo": {
    "totalEmprestimos": 679,
    "totalDevolucoes": 641,
    "totalAtrasos": 38,
    "mediaMensal": 56.58
  }
}
```

---

### 4. GET /api/Dashboard/grafico-generos-populares
**Descrição**: Gráfico de gêneros populares
**Autenticação**: Token JWT Admin/Funcionario necessário

**Parâmetros de Query:**
- `limite` (int, opcional): Número de gêneros para exibir (padrão: 10)

**Resposta Esperada (200 OK):**
```json
{
  "periodo": "Últimos 30 dias",
  "generos": [
    {
      "genero": "Romance",
      "totalEmprestimos": 45,
      "totalLivros": 25,
      "mediaEmprestimosPorLivro": 1.8,
      "percentual": 37.5
    },
    {
      "genero": "Fantasia",
      "totalEmprestimos": 32,
      "totalLivros": 18,
      "mediaEmprestimosPorLivro": 1.78,
      "percentual": 26.67
    },
    {
      "genero": "Ficção Científica",
      "totalEmprestimos": 28,
      "totalLivros": 15,
      "mediaEmprestimosPorLivro": 1.87,
      "percentual": 23.33
    },
    {
      "genero": "Biografia",
      "totalEmprestimos": 15,
      "totalLivros": 12,
      "mediaEmprestimosPorLivro": 1.25,
      "percentual": 12.5
    }
  ],
  "resumo": {
    "totalGeneros": 4,
    "totalEmprestimos": 120,
    "generoMaisPopular": "Romance",
    "generoMenosPopular": "Biografia"
  }
}
```

---

### 5. GET /api/Dashboard/alertas
**Descrição**: Alertas do sistema
**Autenticação**: Token JWT Admin/Funcionario necessário

**Resposta Esperada (200 OK):**
```json
{
  "totalAlertas": 4,
  "alertas": [
    {
      "id": 1,
      "tipo": "EstoqueBaixo",
      "titulo": "Estoque Baixo",
      "descricao": "3 livros com estoque baixo",
      "prioridade": "Média",
      "dataCriacao": "2025-09-21T20:00:00Z",
      "ativo": true,
      "detalhes": {
        "livros": [
          {
            "id": 1,
            "titulo": "Dom Casmurro",
            "exemplaresDisponiveis": 1,
            "totalExemplares": 2
          },
          {
            "id": 2,
            "titulo": "O Senhor dos Anéis",
            "exemplaresDisponiveis": 0,
            "totalExemplares": 1
          }
        ]
      }
    },
    {
      "id": 2,
      "tipo": "Atraso",
      "titulo": "Empréstimos Atrasados",
      "descricao": "5 empréstimos em atraso",
      "prioridade": "Alta",
      "dataCriacao": "2025-09-21T19:30:00Z",
      "ativo": true,
      "detalhes": {
        "totalAtrasos": 5,
        "totalMultas": 75.0
      }
    },
    {
      "id": 3,
      "tipo": "Sistema",
      "titulo": "Backup Pendente",
      "descricao": "Backup semanal não realizado",
      "prioridade": "Baixa",
      "dataCriacao": "2025-09-21T18:00:00Z",
      "ativo": true,
      "detalhes": {
        "ultimoBackup": "2025-09-14T02:00:00Z",
        "diasSemBackup": 7
      }
    },
    {
      "id": 4,
      "tipo": "Usuario",
      "titulo": "Novos Usuários",
      "descricao": "10 novos usuários cadastrados hoje",
      "prioridade": "Baixa",
      "dataCriacao": "2025-09-21T17:00:00Z",
      "ativo": true,
      "detalhes": {
        "novosUsuarios": 10,
        "dataInicio": "2025-09-21T00:00:00Z"
      }
    }
  ],
  "resumo": {
    "alertasAtivos": 4,
    "alertasAltaPrioridade": 1,
    "alertasMediaPrioridade": 1,
    "alertasBaixaPrioridade": 2
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

#### 400 Bad Request - Parâmetros inválidos
**Causa**: Parâmetros de query inválidos
**Solução**: Verifique se os parâmetros estão no formato correto

---

## 💡 Dicas Importantes

1. **Todos os endpoints** requerem permissão de Admin ou Funcionario
2. **Dados são atualizados em tempo real** com base nos dados atuais
3. **Período padrão** é os últimos 30 dias se não especificado
4. **Gráficos** retornam dados prontos para exibição
5. **Alertas** são gerados automaticamente pelo sistema
6. **Estatísticas** incluem tendências e comparações
7. **Filtros de data** são inclusivos (incluem as datas de início e fim)

---

## 📝 Parâmetros de Query

### Gráfico de Empréstimos Mensal
- `meses`: int (opcional, padrão: 12)

### Gráfico de Gêneros Populares
- `limite`: int (opcional, padrão: 10)

---

## 📊 Tipos de Alertas

### EstoqueBaixo
- **Prioridade**: Média
- **Descrição**: Livros com estoque baixo
- **Detalhes**: Lista de livros afetados

### Atraso
- **Prioridade**: Alta
- **Descrição**: Empréstimos em atraso
- **Detalhes**: Total de atrasos e multas

### Sistema
- **Prioridade**: Baixa
- **Descrição**: Alertas do sistema
- **Detalhes**: Informações específicas do alerta

### Usuario
- **Prioridade**: Baixa
- **Descrição**: Alertas relacionados a usuários
- **Detalhes**: Informações específicas do alerta

---

**Total de endpoints documentados: 5/5** ✅
