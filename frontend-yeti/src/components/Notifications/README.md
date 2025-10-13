# 🔔 Sistema de Notificações

## 📋 **Funcionalidades Implementadas:**

### **Tipos de Notificações:**
- **🔴 Livros Atrasados** - Urgente (prioridade alta)
- **🟡 Aviso de Vencimento** - 2 dias antes do prazo (prioridade média)
- **🟢 Novos Livros** - Livros adicionados recentemente (prioridade baixa)
- **📚 Reservas Disponíveis** - Livro reservado está disponível (prioridade média)
- **⚙️ Sistema** - Manutenções, atualizações, etc. (prioridade média)

### **Características:**
- **Badge com contador** no ícone de notificação
- **Dropdown responsivo** com lista de notificações
- **Marcar como lida** individualmente
- **Marcar todas como lidas**
- **Diferentes prioridades** (cores e ícones)
- **Timestamps** das notificações
- **Animações suaves** com Framer Motion
- **Atualização automática** a cada 5 minutos

## 🛠️ **Componentes:**

### **NotificationButton.tsx**
- Componente principal baseado no design fornecido
- Integrado no header do usuário
- Dropdown com lista de notificações
- Animações e interações

### **useNotificationSystem.ts**
- Hook para gerenciar notificações
- Integração com APIs do backend
- Lógica de negócio para diferentes tipos de notificação
- Atualização automática

## 📱 **Como Usar:**

1. **Visualizar notificações:** Clique no ícone de envelope no header
2. **Marcar como lida:** Clique em uma notificação individual
3. **Marcar todas como lidas:** Use o botão no cabeçalho do dropdown
4. **Navegar:** Clique em notificações para ir à página relevante

## 🔧 **Integração:**

O componente está integrado no `UsuarioHeader.tsx` e aparece automaticamente para todos os usuários logados.

## 🎨 **Design:**

- Baseado no componente de envelope fornecido
- Cores e estilos consistentes com o tema do sistema
- Responsivo para diferentes tamanhos de tela
- Animações suaves e profissionais

## 📊 **Dados:**

As notificações são geradas automaticamente baseadas em:
- Empréstimos ativos do usuário
- Datas de vencimento
- Novos livros adicionados
- Eventos do sistema

## 🚀 **Próximos Passos:**

- [ ] Notificações push em tempo real
- [ ] Configurações de notificação por usuário
- [ ] Histórico de notificações
- [ ] Notificações por email
- [ ] Integração com WebSocket para atualizações em tempo real
