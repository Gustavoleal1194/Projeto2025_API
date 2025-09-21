# ⚙️ Guia de Testes - Configuração

Este guia documenta todos os **6 endpoints de configuração** da API.

## 📋 Lista de Endpoints

1. **GET /api/Configuracao/sistema** - Obter configurações do sistema
2. **PUT /api/Configuracao/sistema** - Atualizar configurações do sistema
3. **GET /api/Configuracao/parametros-emprestimo** - Obter parâmetros de empréstimo
4. **PUT /api/Configuracao/parametros-emprestimo** - Atualizar parâmetros de empréstimo
5. **GET /api/Configuracao/backup** - Obter status do backup
6. **POST /api/Configuracao/backup** - Executar backup

---

## 🔑 Autenticação

**Todos os endpoints de configuração requerem autenticação JWT com role Admin.**

Configure o token no Swagger:
1. Clique em **"Authorize"** (botão verde)
2. Digite: `Bearer {seu-token-jwt}`
3. Clique em **"Authorize"**

---

## 📚 Documentação dos Endpoints

### 1. GET /api/Configuracao/sistema
**Descrição**: Obter configurações do sistema
**Autenticação**: Token JWT Admin necessário

**Resposta Esperada (200 OK):**
```json
{
  "nomeBiblioteca": "Biblioteca Municipal",
  "endereco": "Rua das Flores, 123",
  "telefone": "(11) 99999-9999",
  "email": "contato@biblioteca.com",
  "horarioFuncionamento": "08:00 - 18:00",
  "diasFuncionamento": "Segunda a Sexta",
  "configuracoes": {
    "maxUsuarios": 1000,
    "maxLivros": 10000,
    "maxExemplares": 50000,
    "maxEmprestimosPorUsuario": 5,
    "maxRenovacoes": 3,
    "diasEmprestimo": 14,
    "multaPorDia": 1.0,
    "valorMaximoMulta": 50.0,
    "diasParaAtraso": 1,
    "diasParaBloqueio": 7,
    "notificacaoEmail": true,
    "notificacaoSMS": false,
    "backupAutomatico": true,
    "frequenciaBackup": "Diário",
    "horaBackup": "02:00",
    "retencaoBackup": 30,
    "logLevel": "Information",
    "manutencaoProgramada": false,
    "dataManutencao": null,
    "observacoes": "Sistema em funcionamento normal"
  },
  "ultimaAtualizacao": "2025-09-21T21:00:00Z",
  "versao": "1.0.0"
}
```

---

### 2. PUT /api/Configuracao/sistema
**Descrição**: Atualizar configurações do sistema
**Autenticação**: Token JWT Admin necessário

**Body da Requisição:**
```json
{
  "nomeBiblioteca": "Biblioteca Municipal Atualizada",
  "endereco": "Rua das Flores, 456",
  "telefone": "(11) 88888-8888",
  "email": "contato@biblioteca.com.br",
  "horarioFuncionamento": "08:00 - 19:00",
  "diasFuncionamento": "Segunda a Sábado",
  "configuracoes": {
    "maxUsuarios": 1500,
    "maxLivros": 15000,
    "maxExemplares": 75000,
    "maxEmprestimosPorUsuario": 7,
    "maxRenovacoes": 5,
    "diasEmprestimo": 21,
    "multaPorDia": 1.5,
    "valorMaximoMulta": 75.0,
    "diasParaAtraso": 1,
    "diasParaBloqueio": 10,
    "notificacaoEmail": true,
    "notificacaoSMS": true,
    "backupAutomatico": true,
    "frequenciaBackup": "Diário",
    "horaBackup": "03:00",
    "retencaoBackup": 45,
    "logLevel": "Warning",
    "manutencaoProgramada": true,
    "dataManutencao": "2025-09-25T02:00:00Z",
    "observacoes": "Sistema atualizado com novas configurações"
  }
}
```

**Resposta Esperada (200 OK):**
```json
{
  "sucesso": true,
  "mensagem": "Configurações do sistema atualizadas com sucesso",
  "dados": {
    "nomeBiblioteca": "Biblioteca Municipal Atualizada",
    "endereco": "Rua das Flores, 456",
    "telefone": "(11) 88888-8888",
    "email": "contato@biblioteca.com.br",
    "horarioFuncionamento": "08:00 - 19:00",
    "diasFuncionamento": "Segunda a Sábado",
    "configuracoes": {
      "maxUsuarios": 1500,
      "maxLivros": 15000,
      "maxExemplares": 75000,
      "maxEmprestimosPorUsuario": 7,
      "maxRenovacoes": 5,
      "diasEmprestimo": 21,
      "multaPorDia": 1.5,
      "valorMaximoMulta": 75.0,
      "diasParaAtraso": 1,
      "diasParaBloqueio": 10,
      "notificacaoEmail": true,
      "notificacaoSMS": true,
      "backupAutomatico": true,
      "frequenciaBackup": "Diário",
      "horaBackup": "03:00",
      "retencaoBackup": 45,
      "logLevel": "Warning",
      "manutencaoProgramada": true,
      "dataManutencao": "2025-09-25T02:00:00Z",
      "observacoes": "Sistema atualizado com novas configurações"
    },
    "ultimaAtualizacao": "2025-09-21T21:30:00Z",
    "versao": "1.0.0"
  }
}
```

---

### 3. GET /api/Configuracao/parametros-emprestimo
**Descrição**: Obter parâmetros de empréstimo
**Autenticação**: Token JWT Admin necessário

**Resposta Esperada (200 OK):**
```json
{
  "parametros": {
    "diasEmprestimo": 14,
    "maxRenovacoes": 3,
    "multaPorDia": 1.0,
    "valorMaximoMulta": 50.0,
    "diasParaAtraso": 1,
    "diasParaBloqueio": 7,
    "maxEmprestimosPorUsuario": 5,
    "maxEmprestimosSimultaneos": 3,
    "diasAntecedenciaRenovacao": 2,
    "diasAntecedenciaReserva": 7,
    "diasValidadeReserva": 3,
    "notificacaoAtraso": true,
    "notificacaoVencimento": true,
    "notificacaoRenovacao": true,
    "emailNotificacao": "noreply@biblioteca.com",
    "smsNotificacao": false,
    "templateEmail": "Padrão",
    "templateSMS": "Padrão"
  },
  "regras": {
    "permitirRenovacaoAtraso": false,
    "permitirEmprestimoBloqueado": false,
    "permitirReservaBloqueado": false,
    "permitirEmprestimoMulta": false,
    "permitirReservaMulta": false,
    "permitirEmprestimoLimite": true,
    "permitirReservaLimite": true,
    "permitirEmprestimoVencido": false,
    "permitirReservaVencida": false
  },
  "ultimaAtualizacao": "2025-09-21T21:00:00Z",
  "versao": "1.0.0"
}
```

---

### 4. PUT /api/Configuracao/parametros-emprestimo
**Descrição**: Atualizar parâmetros de empréstimo
**Autenticação**: Token JWT Admin necessário

**Body da Requisição:**
```json
{
  "parametros": {
    "diasEmprestimo": 21,
    "maxRenovacoes": 5,
    "multaPorDia": 1.5,
    "valorMaximoMulta": 75.0,
    "diasParaAtraso": 1,
    "diasParaBloqueio": 10,
    "maxEmprestimosPorUsuario": 7,
    "maxEmprestimosSimultaneos": 5,
    "diasAntecedenciaRenovacao": 3,
    "diasAntecedenciaReserva": 10,
    "diasValidadeReserva": 5,
    "notificacaoAtraso": true,
    "notificacaoVencimento": true,
    "notificacaoRenovacao": true,
    "emailNotificacao": "noreply@biblioteca.com.br",
    "smsNotificacao": true,
    "templateEmail": "Personalizado",
    "templateSMS": "Personalizado"
  },
  "regras": {
    "permitirRenovacaoAtraso": false,
    "permitirEmprestimoBloqueado": false,
    "permitirReservaBloqueado": false,
    "permitirEmprestimoMulta": false,
    "permitirReservaMulta": false,
    "permitirEmprestimoLimite": true,
    "permitirReservaLimite": true,
    "permitirEmprestimoVencido": false,
    "permitirReservaVencida": false
  }
}
```

**Resposta Esperada (200 OK):**
```json
{
  "sucesso": true,
  "mensagem": "Parâmetros de empréstimo atualizados com sucesso",
  "dados": {
    "parametros": {
      "diasEmprestimo": 21,
      "maxRenovacoes": 5,
      "multaPorDia": 1.5,
      "valorMaximoMulta": 75.0,
      "diasParaAtraso": 1,
      "diasParaBloqueio": 10,
      "maxEmprestimosPorUsuario": 7,
      "maxEmprestimosSimultaneos": 5,
      "diasAntecedenciaRenovacao": 3,
      "diasAntecedenciaReserva": 10,
      "diasValidadeReserva": 5,
      "notificacaoAtraso": true,
      "notificacaoVencimento": true,
      "notificacaoRenovacao": true,
      "emailNotificacao": "noreply@biblioteca.com.br",
      "smsNotificacao": true,
      "templateEmail": "Personalizado",
      "templateSMS": "Personalizado"
    },
    "regras": {
      "permitirRenovacaoAtraso": false,
      "permitirEmprestimoBloqueado": false,
      "permitirReservaBloqueado": false,
      "permitirEmprestimoMulta": false,
      "permitirReservaMulta": false,
      "permitirEmprestimoLimite": true,
      "permitirReservaLimite": true,
      "permitirEmprestimoVencido": false,
      "permitirReservaVencida": false
    },
    "ultimaAtualizacao": "2025-09-21T21:30:00Z",
    "versao": "1.0.0"
  }
}
```

---

### 5. GET /api/Configuracao/backup
**Descrição**: Obter status do backup
**Autenticação**: Token JWT Admin necessário

**Resposta Esperada (200 OK):**
```json
{
  "status": "Ativo",
  "configuracao": {
    "backupAutomatico": true,
    "frequencia": "Diário",
    "hora": "02:00",
    "retencao": 30,
    "localizacao": "C:\\Backups\\Biblioteca",
    "formato": "SQL",
    "compressao": true,
    "criptografia": false,
    "notificacao": true,
    "emailNotificacao": "admin@biblioteca.com"
  },
  "ultimoBackup": {
    "data": "2025-09-21T02:00:00Z",
    "tamanho": "125.5 MB",
    "status": "Sucesso",
    "duracao": "00:05:30",
    "arquivo": "backup_20250921_020000.sql",
    "localizacao": "C:\\Backups\\Biblioteca\\backup_20250921_020000.sql"
  },
  "proximoBackup": {
    "data": "2025-09-22T02:00:00Z",
    "tempoRestante": "05:00:00"
  },
  "historico": [
    {
      "data": "2025-09-21T02:00:00Z",
      "tamanho": "125.5 MB",
      "status": "Sucesso",
      "duracao": "00:05:30"
    },
    {
      "data": "2025-09-20T02:00:00Z",
      "tamanho": "124.8 MB",
      "status": "Sucesso",
      "duracao": "00:05:25"
    },
    {
      "data": "2025-09-19T02:00:00Z",
      "tamanho": "125.1 MB",
      "status": "Sucesso",
      "duracao": "00:05:35"
    }
  ],
  "estatisticas": {
    "totalBackups": 30,
    "backupsSucesso": 29,
    "backupsFalha": 1,
    "tamanhoMedio": "125.1 MB",
    "duracaoMedia": "00:05:30",
    "taxaSucesso": 96.67
  }
}
```

---

### 6. POST /api/Configuracao/backup
**Descrição**: Executar backup
**Autenticação**: Token JWT Admin necessário

**Body da Requisição (opcional):**
```json
{
  "tipo": "Completo",
  "comprimir": true,
  "criptografar": false,
  "notificar": true,
  "observacoes": "Backup manual executado pelo administrador"
}
```

**Resposta Esperada (200 OK):**
```json
{
  "sucesso": true,
  "mensagem": "Backup iniciado com sucesso",
  "dados": {
    "id": "backup_20250921_213000",
    "tipo": "Completo",
    "status": "Em andamento",
    "dataInicio": "2025-09-21T21:30:00Z",
    "configuracao": {
      "comprimir": true,
      "criptografar": false,
      "notificar": true,
      "observacoes": "Backup manual executado pelo administrador"
    },
    "progresso": {
      "etapa": "Iniciando",
      "percentual": 0,
      "tempoEstimado": "00:05:00"
    }
  }
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "sucesso": false,
  "mensagem": "Não é possível executar backup no momento",
  "erro": "Backup anterior ainda em andamento",
  "detalhes": {
    "backupAnterior": {
      "id": "backup_20250921_210000",
      "status": "Em andamento",
      "dataInicio": "2025-09-21T21:00:00Z",
      "tempoDecorrido": "00:30:00"
    }
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
**Causa**: Token válido mas sem permissão (role Usuario ou Funcionario)
**Solução**: Use um token de usuário com role "Admin"

#### 400 Bad Request - Validação
**Causa**: Dados inválidos no body da requisição
**Solução**: Verifique se todos os campos obrigatórios estão preenchidos corretamente

#### 500 Internal Server Error
**Causa**: Erro interno do servidor
**Solução**: Verifique os logs do sistema e tente novamente

---

## 💡 Dicas Importantes

1. **Apenas Administradores** podem acessar endpoints de configuração
2. **Configurações são aplicadas imediatamente** após a atualização
3. **Backup automático** é executado conforme configurado
4. **Validações** são aplicadas antes de salvar as configurações
5. **Logs** são gerados para todas as alterações de configuração
6. **Backup manual** pode ser executado a qualquer momento
7. **Configurações** são versionadas para auditoria

---

## 📝 Campos de Configuração

### Sistema
- **nomeBiblioteca**: Nome da biblioteca
- **endereco**: Endereço completo
- **telefone**: Telefone de contato
- **email**: Email de contato
- **horarioFuncionamento**: Horário de funcionamento
- **diasFuncionamento**: Dias da semana de funcionamento

### Parâmetros de Empréstimo
- **diasEmprestimo**: Número de dias para empréstimo
- **maxRenovacoes**: Máximo de renovações permitidas
- **multaPorDia**: Valor da multa por dia de atraso
- **valorMaximoMulta**: Valor máximo de multa
- **diasParaAtraso**: Dias para considerar atraso
- **diasParaBloqueio**: Dias para bloquear usuário

### Backup
- **backupAutomatico**: Se o backup automático está ativo
- **frequencia**: Frequência do backup (Diário, Semanal, Mensal)
- **hora**: Hora para executar o backup
- **retencao**: Dias para reter os backups
- **localizacao**: Pasta onde salvar os backups

---

## 🔧 Tipos de Backup

### Completo
- **Descrição**: Backup completo do banco de dados
- **Tamanho**: Maior
- **Duração**: Mais longa
- **Uso**: Backup principal

### Incremental
- **Descrição**: Backup apenas das alterações
- **Tamanho**: Menor
- **Duração**: Mais rápida
- **Uso**: Backup diário

### Diferencial
- **Descrição**: Backup desde o último backup completo
- **Tamanho**: Médio
- **Duração**: Média
- **Uso**: Backup semanal

---

**Total de endpoints documentados: 6/6** ✅
