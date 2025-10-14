# ✅ CHECKLIST DE TAREFAS - YETI LIBRARY SYSTEM

## 📋 **TAREFAS CRÍTICAS (SPRINT 1)**

### **🔧 BACKEND - ENDPOINTS VAZIOS**

#### **IMP-001: RelatóriosController**
- [ ] **usuarios-mais-ativos** - Implementar consulta SQL para usuários mais ativos
  - [ ] Criar método `GetUsuariosMaisAtivosAsync` no UsuarioService
  - [ ] Implementar consulta SQL com JOIN e COUNT
  - [ ] Testar endpoint: `GET /api/relatorios/usuarios-mais-ativos?top=10`
  - [ ] Validar retorno com dados reais

- [ ] **atrasos-por-periodo** - Implementar consulta SQL para atrasos
  - [ ] Criar método `GetAtrasosPorPeriodoAsync` no EmprestimoService
  - [ ] Implementar consulta SQL com filtro de data
  - [ ] Testar endpoint: `GET /api/relatorios/atrasos-por-periodo?dataInicio=2025-01-01&dataFim=2025-01-31`
  - [ ] Validar retorno com dados reais

- [ ] **multas-por-periodo** - Implementar consulta SQL para multas
  - [ ] Criar método `GetMultasPorPeriodoAsync` no EmprestimoService
  - [ ] Implementar consulta SQL com cálculo de multas
  - [ ] Testar endpoint: `GET /api/relatorios/multas-por-periodo?dataInicio=2025-01-01&dataFim=2025-01-31`
  - [ ] Validar retorno com dados reais

- [ ] **estoque-baixo** - Implementar consulta SQL para estoque baixo
  - [ ] Criar método `GetEstoqueBaixoAsync` no ExemplarService
  - [ ] Implementar consulta SQL com filtro de quantidade
  - [ ] Testar endpoint: `GET /api/relatorios/estoque-baixo?limiteMinimo=5`
  - [ ] Validar retorno com dados reais

#### **IMP-002: DashboardController**
- [ ] **grafico-emprestimos-mensal** - Implementar agregação mensal
  - [ ] Criar método `GetEmprestimosMensalAsync` no EmprestimoService
  - [ ] Implementar consulta SQL com GROUP BY mês
  - [ ] Testar endpoint: `GET /api/dashboard/grafico-emprestimos-mensal?ano=2025`
  - [ ] Validar retorno com dados reais

- [ ] **grafico-generos-populares** - Implementar agregação de gêneros
  - [ ] Criar método `GetGenerosPopularesAsync` no LivroService
  - [ ] Implementar consulta SQL com JOIN e COUNT
  - [ ] Testar endpoint: `GET /api/dashboard/grafico-generos-populares`
  - [ ] Validar retorno com dados reais

### **🎨 FRONTEND - HISTÓRICO DE USUÁRIO**

#### **IMP-005: UsuarioDashboard**
- [ ] **Implementar carregamento de histórico**
  - [ ] Criar método `listarHistorico` no usuarioEmprestimoService
  - [ ] Implementar chamada para API de histórico
  - [ ] Atualizar estado `historicoTotal` com dados reais
  - [ ] Remover TODO da linha 85

- [ ] **Conectar com API**
  - [ ] Verificar se endpoint `/api/emprestimos/historico` existe
  - [ ] Implementar endpoint se não existir
  - [ ] Testar carregamento de dados
  - [ ] Validar exibição no dashboard

### **🧪 TESTES - ESTRUTURA BÁSICA**

#### **IMP-009: Testes Unitários**
- [ ] **Configurar estrutura de testes**
  - [ ] Verificar se `jest.config.js` está correto
  - [ ] Criar pasta `src/components/__tests__/`
  - [ ] Criar pasta `src/pages/__tests__/`
  - [ ] Criar pasta `src/services/__tests__/`

- [ ] **Criar testes básicos**
  - [ ] `Button.test.tsx` - Teste de renderização e clique
  - [ ] `Input.test.tsx` - Teste de validação
  - [ ] `Layout.test.tsx` - Teste de estrutura
  - [ ] `Dashboard.test.tsx` - Teste de carregamento

- [ ] **Configurar cobertura**
  - [ ] Executar `npm run test:coverage`
  - [ ] Verificar se cobertura está sendo gerada
  - [ ] Ajustar configuração se necessário

---

## 📋 **TAREFAS IMPORTANTES (SPRINT 2)**

### **🎨 FRONTEND - PLACEHOLDERS**

#### **IMP-006: Formulários sem Placeholders**
- [ ] **GerenciarAutores.tsx**
  - [ ] Importar `getPlaceholderByFieldName`
  - [ ] Adicionar placeholder em campo `nome`
  - [ ] Adicionar placeholder em campo `biografia`
  - [ ] Testar formulário

- [ ] **GerenciarEditoras.tsx**
  - [ ] Importar `getPlaceholderByFieldName`
  - [ ] Adicionar placeholder em campo `nome`
  - [ ] Adicionar placeholder em campo `endereco`
  - [ ] Testar formulário

- [ ] **GerenciarFuncionarios.tsx**
  - [ ] Importar `getPlaceholderByFieldName`
  - [ ] Adicionar placeholder em campo `nome`
  - [ ] Adicionar placeholder em campo `email`
  - [ ] Adicionar placeholder em campo `telefone`
  - [ ] Testar formulário

- [ ] **GerenciarExemplares.tsx**
  - [ ] Importar `getPlaceholderByFieldName`
  - [ ] Adicionar placeholder em campo `codigo`
  - [ ] Adicionar placeholder em campo `observacoes`
  - [ ] Testar formulário

- [ ] **GerenciarEmprestimos.tsx**
  - [ ] Importar `getPlaceholderByFieldName`
  - [ ] Adicionar placeholder em campo `observacoes`
  - [ ] Testar formulário

- [ ] **MeuPerfil.tsx**
  - [ ] Importar `getPlaceholderByFieldName`
  - [ ] Adicionar placeholders em todos os campos
  - [ ] Testar formulário

### **🔧 BACKEND - ENDPOINTS COMENTADOS**

#### **IMP-003: SolicitacaoEmprestimoService**
- [ ] **Descomentar endpoints**
  - [ ] Descomentar método `listarSolicitacoesPendentes`
  - [ ] Descomentar método `aprovarSolicitacao`
  - [ ] Implementar endpoint `/api/solicitacao-emprestimo/pendentes`
  - [ ] Implementar endpoint `/api/solicitacao-emprestimo/aprovar`

- [ ] **Remover dependência do localStorage**
  - [ ] Implementar persistência no backend
  - [ ] Criar tabela `SolicitacaoEmprestimo` se não existir
  - [ ] Implementar CRUD completo
  - [ ] Testar persistência

#### **IMP-004: ConfiguracoesService**
- [ ] **Implementar persistência real**
  - [ ] Criar endpoint `/api/configuracao` se não existir
  - [ ] Implementar método `updateConfiguracaoSistema`
  - [ ] Remover dados mockados
  - [ ] Conectar com banco de dados

### **🧪 TESTES - INTEGRAÇÃO**

#### **IMP-010: Testes E2E**
- [ ] **Configurar Cypress**
  - [ ] Instalar Cypress: `npm install --save-dev cypress`
  - [ ] Configurar `cypress.config.ts`
  - [ ] Criar pasta `cypress/integration/`

- [ ] **Criar testes E2E**
  - [ ] `login.spec.ts` - Teste de login
  - [ ] `emprestimo.spec.ts` - Teste de empréstimo
  - [ ] `dashboard.spec.ts` - Teste de dashboard
  - [ ] `relatorios.spec.ts` - Teste de relatórios

- [ ] **Executar testes**
  - [ ] `npm run test:e2e` - Executar Cypress
  - [ ] `npm run test:e2e:headless` - Modo headless
  - [ ] Verificar se todos os testes passam

---

## 📋 **TAREFAS MÉDIAS (SPRINT 3)**

### **🔔 NOTIFICAÇÕES**

#### **IMP-007: Notificações em Tempo Real**
- [ ] **Configurar WebSocket**
  - [ ] Instalar dependências WebSocket
  - [ ] Configurar servidor WebSocket
  - [ ] Implementar conexão no frontend

- [ ] **Implementar push notifications**
  - [ ] Configurar service worker
  - [ ] Implementar notificações push
  - [ ] Testar notificações

### **💾 BACKUP**

#### **IMP-008: Backup Funcional**
- [ ] **Implementar geração de backup**
  - [ ] Criar endpoint `/api/backup/executar`
  - [ ] Implementar geração de arquivo de backup
  - [ ] Implementar download de backup

- [ ] **Implementar interface**
  - [ ] Criar botão de backup
  - [ ] Implementar progresso de backup
  - [ ] Implementar download automático

---

## 🎯 **CRITÉRIOS DE VALIDAÇÃO**

### **Funcionalidade**
- [ ] **Todos os endpoints retornam dados reais**
  - [ ] RelatóriosController: 4 endpoints funcionando
  - [ ] DashboardController: 2 endpoints funcionando
  - [ ] SolicitacaoEmprestimoService: Endpoints descomentados

- [ ] **Frontend funcionando completamente**
  - [ ] Histórico de usuário carregando
  - [ ] Placeholders em todos os formulários
  - [ ] Notificações em tempo real

### **Qualidade**
- [ ] **Testes implementados**
  - [ ] Testes unitários: 70% de cobertura
  - [ ] Testes E2E: 5 fluxos testados
  - [ ] Todos os testes passando

### **Produção**
- [ ] **Sistema 100% funcional**
  - [ ] Todos os TODOs resolvidos
  - [ ] Código limpo e documentado
  - [ ] Pronto para deploy

---

## 🚀 **COMANDOS DE EXECUÇÃO**

### **Backend**
```bash
# Implementar endpoints
cd Projeto2020_API
dotnet build
dotnet run

# Testar endpoints
curl -X GET "http://localhost:5000/api/relatorios/usuarios-mais-ativos?top=10"
curl -X GET "http://localhost:5000/api/dashboard/grafico-emprestimos-mensal?ano=2025"
```

### **Frontend**
```bash
# Implementar placeholders
cd frontend-yeti
npm install
npm run dev

# Testar formulários
# Verificar placeholders nos formulários
```

### **Testes**
```bash
# Executar testes
npm test
npm run test:coverage
npm run test:e2e

# Verificar cobertura
npm run test:ci
```

---

## 📊 **MÉTRICAS DE PROGRESSO**

### **Sprint 1 - Metas**
- [ ] **Backend**: 4 endpoints implementados ✅
- [ ] **Frontend**: Histórico funcionando ✅
- [ ] **Testes**: Estrutura básica criada ✅
- [ ] **Cobertura**: 20% de testes ✅

### **Sprint 2 - Metas**
- [ ] **Frontend**: 6 formulários com placeholders ✅
- [ ] **Backend**: Endpoints de solicitação funcionando ✅
- [ ] **Testes**: Cobertura de 50% ✅
- [ ] **E2E**: 5 fluxos testados ✅

### **Sprint 3 - Metas**
- [ ] **Notificações**: WebSocket funcionando ✅
- [ ] **Backup**: Geração funcionando ✅
- [ ] **Performance**: Otimizações aplicadas ✅
- [ ] **Cobertura**: 70% de testes ✅

---

## 🎯 **STATUS FINAL**

**Objetivo**: Sistema 100% funcional e pronto para produção
**Prazo**: 3-4 semanas
**Status Atual**: 87% completo
**Próximo Marco**: 95% completo (após Sprint 1)

**O projeto está muito próximo da conclusão! Com as implementações identificadas, estará pronto para produção.** 🚀
