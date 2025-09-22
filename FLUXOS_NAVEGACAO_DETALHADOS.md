# 🔄 FLUXOS DE NAVEGAÇÃO DETALHADOS - SISTEMA DE BIBLIOTECA

## 🎯 **FLUXO PRINCIPAL DO USUÁRIO COMUM**

### **1. Descoberta e Primeiro Acesso**
```
Landing Page (/)
├── [Botão "Explorar Biblioteca"] → Estante 3D (/biblioteca/estante)
├── [Botão "Fazer Login"] → Login (/login)
├── [Botão "Criar Conta"] → Registro (/registro)
└── [Botão "Sobre"] → Sobre (/sobre)
```

### **2. Processo de Login**
```
Login Page (/login)
├── Preencher Email → Validação em tempo real
├── Preencher Senha → Validação em tempo real
├── Selecionar Role (Usuario/Funcionario/Admin) → Validação
├── [Botão "Entrar"] → Autenticação → Redirecionamento baseado em role
├── [Link "Esqueci minha senha"] → Recuperar Senha (/recuperar-senha)
└── [Link "Criar conta"] → Registro (/registro)
```

### **3. Dashboard do Usuário**
```
Dashboard Usuário (/dashboard-usuario)
├── [Card "Meus Empréstimos"] → Livros Emprestados (/livros-emprestados)
├── [Card "Histórico"] → Histórico (/historico)
├── [Card "Favoritos"] → Favoritos (/favoritos)
├── [Card "Notificações"] → Notificações (/notificacoes)
├── [Avatar] → Perfil (/perfil)
└── [Botão "Explorar Biblioteca"] → Estante 3D (/biblioteca/estante)
```

### **4. Exploração da Biblioteca**
```
Estante 3D (/biblioteca/estante)
├── [Hover em Livro] → Preview com informações básicas
├── [Click em Livro] → Modal Detalhes do Livro
├── [Botão "Buscar"] → Página de Busca (/busca)
├── [Botão "Filtros"] → Filtros Avançados
├── [Navegação Estante] → Próxima/Anterior Estante
└── [Botão "Favoritar"] → Adicionar aos Favoritos
```

### **5. Detalhes do Livro**
```
Modal Detalhes do Livro
├── [Botão "Emprestar"] → Modal Confirmação Empréstimo
├── [Botão "Favoritar"] → Adicionar aos Favoritos
├── [Link "Ver Autor"] → Detalhes do Autor (/autor/{id})
├── [Link "Ver Editora"] → Detalhes da Editora (/editora/{id})
└── [Botão "Fechar"] → Voltar para Estante
```

### **6. Processo de Empréstimo**
```
Modal Confirmação Empréstimo
├── [Botão "Confirmar"] → Processamento → QR Code
├── [Botão "Cancelar"] → Voltar para Detalhes
└── [QR Code] → Download/Email de Confirmação
```

---

## 👨‍💼 **FLUXO PRINCIPAL DO FUNCIONÁRIO**

### **1. Login do Funcionário**
```
Login Page (/login)
├── Selecionar Role: "Funcionario"
├── Preencher Credenciais
├── [Botão "Entrar"] → Dashboard Funcionário (/dashboard-funcionario)
└── Redirecionamento Automático
```

### **2. Dashboard do Funcionário**
```
Dashboard Funcionário (/dashboard-funcionario)
├── [Card "Gerenciar Livros"] → Gerenciar Livros (/gerenciar-livros)
├── [Card "Gerenciar Empréstimos"] → Gerenciar Empréstimos (/gerenciar-emprestimos)
├── [Card "Gerenciar Usuários"] → Gerenciar Usuários (/gerenciar-usuarios)
├── [Card "Relatórios"] → Relatórios (/relatorios)
├── [Card "Autores"] → Gerenciar Autores (/gerenciar-autores)
├── [Card "Editoras"] → Gerenciar Editoras (/gerenciar-editoras)
└── [Card "Exemplares"] → Gerenciar Exemplares (/gerenciar-exemplares)
```

### **3. Gerenciamento de Livros**
```
Gerenciar Livros (/gerenciar-livros)
├── [Botão "Adicionar Livro"] → Formulário Adicionar Livro (/adicionar-livro)
├── [Lista de Livros] → Ações por Livro
│   ├── [Botão "Editar"] → Formulário Editar Livro (/editar-livro/{id})
│   ├── [Botão "Excluir"] → Modal Confirmação Exclusão
│   └── [Botão "Ver Detalhes"] → Modal Detalhes
├── [Campo Busca] → Filtrar Livros
└── [Pagination] → Navegar entre Páginas
```

### **4. Gerenciamento de Empréstimos**
```
Gerenciar Empréstimos (/gerenciar-emprestimos)
├── [Botão "Novo Empréstimo"] → Formulário Novo Empréstimo (/novo-emprestimo)
├── [Lista de Empréstimos] → Ações por Empréstimo
│   ├── [Botão "Devolver"] → Formulário Devolução
│   ├── [Botão "Renovar"] → Formulário Renovação
│   └── [Botão "Ver Detalhes"] → Modal Detalhes
├── [Filtros] → Filtrar por Status/Período
└── [Relatórios] → Gerar Relatórios
```

### **5. Processo de Novo Empréstimo**
```
Formulário Novo Empréstimo (/novo-emprestimo)
├── [Selecionar Usuário] → Busca e Seleção
├── [Selecionar Exemplar] → Busca e Seleção
├── [Data Empréstimo] → Calendário
├── [Data Devolução Prevista] → Cálculo Automático
├── [Observações] → Campo Opcional
├── [Botão "Salvar"] → Processamento → Confirmação
└── [Botão "Cancelar"] → Voltar para Lista
```

---

## 👑 **FLUXO PRINCIPAL DO ADMINISTRADOR**

### **1. Login do Administrador**
```
Login Page (/login)
├── Selecionar Role: "Admin"
├── Preencher Credenciais
├── [Botão "Entrar"] → Dashboard Admin (/dashboard-admin)
└── Redirecionamento Automático
```

### **2. Dashboard do Administrador**
```
Dashboard Admin (/dashboard-admin)
├── [Card "Gerenciar Funcionários"] → Gerenciar Funcionários (/gerenciar-funcionarios)
├── [Card "Configurações Sistema"] → Configurações (/configuracoes-sistema)
├── [Card "Relatórios Avançados"] → Relatórios Avançados (/relatorios-avancados)
├── [Card "Auditoria"] → Auditoria (/auditoria)
├── [Card "Backup"] → Backup e Restore
└── [Card "Métricas"] → Métricas de Performance
```

### **3. Gerenciamento de Funcionários**
```
Gerenciar Funcionários (/gerenciar-funcionarios)
├── [Botão "Adicionar Funcionário"] → Formulário Adicionar (/adicionar-funcionario)
├── [Lista de Funcionários] → Ações por Funcionário
│   ├── [Botão "Editar"] → Formulário Editar (/editar-funcionario/{id})
│   ├── [Botão "Desativar"] → Modal Confirmação
│   └── [Botão "Ver Perfil"] → Modal Detalhes
├── [Filtros] → Filtrar por Cargo/Status
└── [Exportar] → Exportar Lista
```

### **4. Configurações do Sistema**
```
Configurações Sistema (/configuracoes-sistema)
├── [Aba "Geral"] → Configurações Básicas
├── [Aba "Empréstimos"] → Regras de Empréstimo
├── [Aba "Notificações"] → Configurações de Notificação
├── [Aba "Segurança"] → Configurações de Segurança
├── [Botão "Salvar"] → Aplicar Configurações
└── [Botão "Resetar"] → Voltar ao Padrão
```

---

## 🔍 **FLUXOS DE BUSCA E DESCOBERTA**

### **1. Busca Simples**
```
Página de Busca (/busca)
├── [Campo Busca] → Digitar Termo
├── [Botão "Buscar"] → Executar Busca
├── [Resultados] → Lista de Livros Encontrados
│   ├── [Click em Livro] → Detalhes do Livro
│   └── [Botão "Favoritar"] → Adicionar aos Favoritos
├── [Filtros Rápidos] → Gênero, Autor, Ano
└── [Ordenação] → Por Título, Autor, Ano
```

### **2. Busca Avançada**
```
Busca Avançada (/busca-avancada)
├── [Formulário Completo] → Todos os Filtros
│   ├── Título → Campo de Texto
│   ├── Autor → Dropdown com Busca
│   ├── Editora → Dropdown com Busca
│   ├── Gênero → Checkbox Múltipla Seleção
│   ├── Ano → Range Slider
│   ├── ISBN → Campo de Texto
│   └── Disponibilidade → Radio Button
├── [Botão "Buscar"] → Executar Busca Avançada
├── [Botão "Limpar"] → Resetar Formulário
└── [Resultados] → Lista Filtrada
```

### **3. Navegação por Categorias**
```
Estante 3D com Filtros
├── [Filtro por Gênero] → Filtrar Livros
├── [Filtro por Autor] → Filtrar por Autor
├── [Filtro por Editora] → Filtrar por Editora
├── [Filtro por Ano] → Range de Anos
├── [Filtro Disponibilidade] → Apenas Disponíveis
├── [Ordenação] → Alfabética, Cronológica, Popularidade
└── [Visualização] → Grade, Lista, Estante 3D
```

---

## 📱 **FLUXOS RESPONSIVOS**

### **1. Mobile (320px - 768px)**
```
Mobile Navigation
├── [Menu Hambúrguer] → Menu Lateral
├── [Estante Compacta] → 2 Livros por Linha
├── [Touch Gestures] → Swipe, Tap, Long Press
├── [Formulários Adaptados] → Campos Maiores
└── [Navegação Simplificada] → Menos Opções
```

### **2. Tablet (768px - 1024px)**
```
Tablet Navigation
├── [Menu Lateral] → Navegação Expandida
├── [Estante Média] → 3-4 Livros por Linha
├── [Touch + Mouse] → Híbrido
├── [Formulários Otimizados] → Melhor Usabilidade
└── [Layout Adaptativo] → Flexível
```

### **3. Desktop (1024px+)**
```
Desktop Navigation
├── [Menu Horizontal] → Navegação Completa
├── [Estante Completa] → 5 Livros por Linha
├── [Hover Effects] → Interações Avançadas
├── [Formulários Completos] → Todas as Funcionalidades
└── [Multi-tarefa] → Múltiplas Abas
```

---

## 🔐 **FLUXOS DE SEGURANÇA E AUTENTICAÇÃO**

### **1. Controle de Acesso**
```
Middleware de Autenticação
├── [Verificar Token] → Validade do JWT
├── [Verificar Role] → Permissões do Usuário
├── [Verificar Rota] → Acesso Permitido
├── [Redirecionar] → Login se Não Autenticado
└── [Bloquear] → 403 se Sem Permissão
```

### **2. Renovação de Token**
```
Token Refresh
├── [Token Expirado] → Detectar Expiração
├── [Refresh Token] → Renovar Automaticamente
├── [Atualizar Headers] → Novos Headers
├── [Continuar Requisição] → Prosseguir
└── [Logout] → Se Refresh Falhar
```

### **3. Logout e Limpeza**
```
Processo de Logout
├── [Botão Logout] → Confirmar Logout
├── [Limpar Storage] → Remover Tokens
├── [Invalidar Sessão] → Backend
├── [Redirecionar] → Landing Page
└── [Limpar Estado] → Resetar Stores
```

---

## 📊 **FLUXOS DE RELATÓRIOS E DASHBOARD**

### **1. Dashboard com Métricas**
```
Dashboard Principal
├── [Cards Métricas] → Números Principais
├── [Gráficos] → Visualizações
├── [Tabelas] → Dados Detalhados
├── [Filtros] → Período, Categoria
└── [Exportar] → PDF, Excel, CSV
```

### **2. Geração de Relatórios**
```
Relatórios
├── [Selecionar Tipo] → Empréstimos, Usuários, Livros
├── [Definir Período] → Data Início/Fim
├── [Aplicar Filtros] → Categorias Específicas
├── [Gerar Relatório] → Processamento
├── [Visualizar] → Preview do Relatório
└── [Exportar] → Download
```

---

## 🎯 **RESUMO DOS FLUXOS**

### **Total de Fluxos Mapeados: 15+**
- ✅ **3 Fluxos Principais** (Usuário, Funcionário, Admin)
- ✅ **3 Fluxos de Busca** (Simples, Avançada, Categorias)
- ✅ **3 Fluxos Responsivos** (Mobile, Tablet, Desktop)
- ✅ **3 Fluxos de Segurança** (Acesso, Token, Logout)
- ✅ **2 Fluxos de Relatórios** (Dashboard, Geração)
- ✅ **1 Fluxo de Descoberta** (Landing → Biblioteca)

### **Características dos Fluxos:**
- ✅ **Navegação Intuitiva** com breadcrumbs
- ✅ **Validação em Tempo Real** em formulários
- ✅ **Feedback Visual** para todas as ações
- ✅ **Loading States** durante processamento
- ✅ **Error Handling** com mensagens claras
- ✅ **Confirmações** para ações destrutivas
- ✅ **Redirecionamentos** baseados em roles
- ✅ **Persistência** de estado entre páginas

**Todos os fluxos estão integrados com os 99 endpoints da API e garantem uma experiência de usuário completa e funcional!** 🚀
