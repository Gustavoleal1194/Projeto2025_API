# 🎯 PLANO DE CORREÇÕES - YETI LIBRARY SYSTEM

## 📋 **CRONOGRAMA DE IMPLEMENTAÇÃO**

### **📅 SPRINT 1 - FUNCIONALIDADES CRÍTICAS (Semana 1)**
**Objetivo**: Resolver funcionalidades que impedem uso em produção

#### **Dia 1-2: Backend - Endpoints Vazios**
- [ ] **IMP-001**: Implementar 4 endpoints do RelatóriosController
  - `usuarios-mais-ativos` - Consulta SQL para usuários mais ativos
  - `atrasos-por-periodo` - Consulta SQL para atrasos por período
  - `multas-por-periodo` - Consulta SQL para multas por período
  - `estoque-baixo` - Consulta SQL para livros com estoque baixo

- [ ] **IMP-002**: Implementar 2 endpoints do DashboardController
  - `grafico-emprestimos-mensal` - Agregação de empréstimos por mês
  - `grafico-generos-populares` - Agregação de gêneros mais emprestados

#### **Dia 3-4: Frontend - Histórico de Usuário**
- [ ] **IMP-005**: Implementar histórico no UsuarioDashboard
  - Conectar com API de histórico
  - Implementar carregamento de dados
  - Atualizar estatísticas

#### **Dia 5: Testes - Estrutura Básica**
- [ ] **IMP-009**: Criar estrutura básica de testes
  - Configurar arquivos de teste
  - Criar testes para componentes principais
  - Implementar cobertura básica

---

### **📅 SPRINT 2 - VALIDAÇÕES E TESTES (Semana 2)**
**Objetivo**: Garantir qualidade e confiabilidade do sistema

#### **Dia 1-2: Frontend - Placeholders**
- [ ] **IMP-006**: Implementar placeholders em 6 formulários
  - GerenciarAutores.tsx
  - GerenciarEditoras.tsx
  - GerenciarFuncionarios.tsx
  - GerenciarExemplares.tsx
  - GerenciarEmprestimos.tsx
  - MeuPerfil.tsx

#### **Dia 3-4: Backend - Endpoints Comentados**
- [ ] **IMP-003**: Descomentar endpoints de solicitação
  - Implementar API real para solicitações
  - Remover dependência do localStorage
  - Implementar persistência no backend

- [ ] **IMP-004**: Implementar lógica de configuração
  - Implementar persistência de configurações
  - Remover dados mockados
  - Conectar com banco de dados

#### **Dia 5: Testes - Integração**
- [ ] **IMP-010**: Implementar testes de integração
  - Configurar Cypress
  - Criar testes E2E para fluxos principais
  - Implementar testes de API

---

### **📅 SPRINT 3 - UX E PERFORMANCE (Semana 3)**
**Objetivo**: Melhorar experiência do usuário e performance

#### **Dia 1-2: Notificações**
- [ ] **IMP-007**: Implementar notificações em tempo real
  - Configurar WebSocket
  - Implementar push notifications
  - Criar sistema de configurações

#### **Dia 3-4: Backup e Configurações**
- [ ] **IMP-008**: Implementar backup funcional
  - Implementar geração de backup
  - Criar interface de download
  - Implementar agendamento

#### **Dia 5: Otimizações**
- [ ] Otimizações de performance
- [ ] Documentação atualizada
- [ ] Testes de carga

---

## 🛠️ **DETALHAMENTO TÉCNICO DAS CORREÇÕES**

### **IMP-001: RelatóriosController - Implementação Completa**

#### **1. usuarios-mais-ativos**
```csharp
[HttpGet("usuarios-mais-ativos")]
public async Task<ActionResult> GetUsuariosMaisAtivos([FromQuery] int top = 10)
{
    var usuarios = await _usuarioService.GetUsuariosMaisAtivosAsync(top);
    return Ok(new { Top = top, Usuarios = usuarios });
}
```

#### **2. atrasos-por-periodo**
```csharp
[HttpGet("atrasos-por-periodo")]
public async Task<ActionResult> GetAtrasosPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
{
    var atrasos = await _emprestimoService.GetAtrasosPorPeriodoAsync(dataInicio, dataFim);
    return Ok(new { 
        DataInicio = dataInicio, 
        DataFim = dataFim, 
        TotalAtrasos = atrasos.Count, 
        Atrasos = atrasos 
    });
}
```

#### **3. multas-por-periodo**
```csharp
[HttpGet("multas-por-periodo")]
public async Task<ActionResult> GetMultasPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
{
    var multas = await _emprestimoService.GetMultasPorPeriodoAsync(dataInicio, dataFim);
    return Ok(new { 
        DataInicio = dataInicio, 
        DataFim = dataFim, 
        TotalMultas = multas.Sum(m => m.Valor), 
        Multas = multas 
    });
}
```

#### **4. estoque-baixo**
```csharp
[HttpGet("estoque-baixo")]
public async Task<ActionResult> GetEstoqueBaixo([FromQuery] int limiteMinimo = 5)
{
    var livros = await _exemplarService.GetEstoqueBaixoAsync(limiteMinimo);
    return Ok(new { 
        LimiteMinimo = limiteMinimo, 
        Livros = livros 
    });
}
```

### **IMP-002: DashboardController - Implementação Completa**

#### **1. grafico-emprestimos-mensal**
```csharp
[HttpGet("grafico-emprestimos-mensal")]
public async Task<ActionResult> GetGraficoEmprestimosMensal([FromQuery] int ano = 2025)
{
    var dados = await _emprestimoService.GetEmprestimosMensalAsync(ano);
    return Ok(new { Ano = ano, Dados = dados });
}
```

#### **2. grafico-generos-populares**
```csharp
[HttpGet("grafico-generos-populares")]
public async Task<ActionResult> GetGraficoGenerosPopulares()
{
    var generos = await _livroService.GetGenerosPopularesAsync();
    return Ok(new { Generos = generos });
}
```

### **IMP-005: UsuarioDashboard - Histórico**

#### **Implementação do Histórico**
```typescript
const loadHistorico = async () => {
    try {
        const historico = await usuarioEmprestimoService.listarHistorico();
        setStats(prev => ({ 
            ...prev, 
            historicoTotal: historico.length 
        }));
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
};

// Adicionar ao useEffect
useEffect(() => {
    loadUserData();
    loadHistorico(); // Adicionar esta linha
}, []);
```

### **IMP-006: Placeholders - Implementação em Formulários**

#### **Estrutura do PlaceholderHelper**
```typescript
// src/components/PlaceholderHelper.ts
export const getPlaceholderByFieldName = (fieldName: string): string => {
    const placeholders: Record<string, string> = {
        nome: "Digite o nome completo (ex: João Silva Santos)",
        email: "Digite seu email (ex: joao@email.com)",
        telefone: "Digite apenas números (ex: 11999999999)",
        cpf: "Digite apenas números (ex: 12345678901)",
        cnpj: "Digite apenas números (ex: 12345678000195)",
        cep: "Digite apenas números (ex: 01234567)",
        endereco: "Digite o endereço completo (ex: Rua das Flores, 123)",
        cidade: "Digite o nome da cidade (ex: São Paulo)",
        estado: "Digite a sigla do estado (ex: SP)",
        // ... mais campos
    };
    
    return placeholders[fieldName] || `Digite o ${fieldName}`;
};
```

#### **Implementação nos Formulários**
```typescript
// Exemplo para GerenciarAutores.tsx
import { getPlaceholderByFieldName } from '../components/PlaceholderHelper';

<input
    type="text"
    value={formData.nome}
    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
    placeholder={getPlaceholderByFieldName('nome')}
    required
/>
```

### **IMP-009: Testes - Estrutura Completa**

#### **Configuração de Testes**
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';

// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
    it('renders with correct text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        screen.getByText('Click me').click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
```

#### **Testes de Integração**
```typescript
// cypress/integration/emprestimo.spec.ts
describe('Fluxo de Empréstimo', () => {
    it('deve permitir empréstimo completo', () => {
        cy.visit('/login');
        cy.get('[data-testid="email"]').type('usuario@test.com');
        cy.get('[data-testid="senha"]').type('123456');
        cy.get('[data-testid="entrar"]').click();
        
        cy.visit('/biblioteca/estante');
        cy.get('[data-testid="livro-card"]').first().click();
        cy.get('[data-testid="emprestar-btn"]').click();
        cy.get('[data-testid="confirmar-btn"]').click();
        cy.get('[data-testid="sucesso-message"]').should('be.visible');
    });
});
```

---

## 📊 **MÉTRICAS DE PROGRESSO**

### **Sprint 1 - Metas**
- [ ] **Backend**: 4 endpoints implementados
- [ ] **Frontend**: Histórico funcionando
- [ ] **Testes**: Estrutura básica criada
- [ ] **Cobertura**: 20% de testes

### **Sprint 2 - Metas**
- [ ] **Frontend**: 6 formulários com placeholders
- [ ] **Backend**: Endpoints de solicitação funcionando
- [ ] **Testes**: Cobertura de 50%
- [ ] **E2E**: 5 fluxos testados

### **Sprint 3 - Metas**
- [ ] **Notificações**: WebSocket funcionando
- [ ] **Backup**: Geração funcionando
- [ ] **Performance**: Otimizações aplicadas
- [ ] **Cobertura**: 70% de testes

---

## 🎯 **CRITÉRIOS DE SUCESSO**

### **Funcionalidade**
- ✅ Todos os endpoints retornam dados reais
- ✅ Histórico de usuário funcionando
- ✅ Placeholders em todos os formulários
- ✅ Notificações em tempo real

### **Qualidade**
- ✅ 70% de cobertura de testes
- ✅ Todos os fluxos E2E testados
- ✅ Performance otimizada
- ✅ Documentação atualizada

### **Produção**
- ✅ Sistema 100% funcional
- ✅ Todos os TODOs resolvidos
- ✅ Código limpo e documentado
- ✅ Pronto para deploy

---

## 🚀 **COMANDOS DE IMPLEMENTAÇÃO**

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

## 📝 **CHECKLIST FINAL**

### **Sprint 1 - Crítico**
- [ ] **IMP-001**: 4 endpoints do RelatóriosController ✅
- [ ] **IMP-002**: 2 endpoints do DashboardController ✅
- [ ] **IMP-005**: Histórico no UsuarioDashboard ✅
- [ ] **IMP-009**: Estrutura de testes ✅

### **Sprint 2 - Alto**
- [ ] **IMP-006**: Placeholders em 6 formulários ✅
- [ ] **IMP-010**: Testes de integração ✅
- [ ] **IMP-003**: Endpoints de solicitação ✅
- [ ] **IMP-004**: Lógica de configuração ✅

### **Sprint 3 - Médio**
- [ ] **IMP-007**: Notificações em tempo real ✅
- [ ] **IMP-008**: Backup funcional ✅
- [ ] Otimizações de performance ✅
- [ ] Documentação atualizada ✅

**Status Final**: 🎯 **SISTEMA 100% FUNCIONAL E PRONTO PARA PRODUÇÃO**
