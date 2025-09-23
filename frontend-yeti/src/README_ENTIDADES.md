# 📚 GUIA DE USO DAS ENTIDADES - YETI LIBRARY SYSTEM

## 🎯 **VISÃO GERAL**
Este guia explica como usar as interfaces, constantes e utilitários criados para o sistema Yeti Library. Toda a documentação está baseada nas entidades reais do backend.

---

## 📁 **ESTRUTURA DE ARQUIVOS**

```
src/
├── types/
│   └── entities.ts          # Interfaces TypeScript das entidades
├── constants/
│   └── entities.ts          # Constantes, enums e valores padrão
├── utils/
│   └── entityUtils.ts       # Funções utilitárias para formatação e validação
└── README_ENTIDADES.md      # Este guia
```

---

## 🔧 **COMO USAR**

### **1. Importar Interfaces**
```typescript
import { Livro, Autor, Emprestimo, Usuario } from '../types/entities';
import { STATUS_EMPRESTIMO, ROLE_USUARIO } from '../constants/entities';
import { formatarData, validarEmail, formatarMoeda } from '../utils/entityUtils';
```

### **2. Usar em Componentes React**
```typescript
import React, { useState } from 'react';
import { Livro, LivroForm } from '../types/entities';
import { formatarData, validarEmail } from '../utils/entityUtils';

const LivroComponent: React.FC = () => {
  const [livro, setLivro] = useState<Livro | null>(null);
  const [formData, setFormData] = useState<LivroForm>({
    titulo: '',
    isbn: '',
    idAutor: 0,
    idEditora: 0,
    // ... outros campos
  });

  const handleSubmit = () => {
    if (validarEmail(formData.email)) {
      // Enviar dados
    }
  };

  return (
    <div>
      {livro && (
        <p>Data de criação: {formatarData(livro.dataCriacao)}</p>
      )}
    </div>
  );
};
```

### **3. Usar em Serviços de API**
```typescript
import { Livro, ApiResponse, PaginatedResponse } from '../types/entities';
import { API_ROUTES } from '../constants/entities';

class LivroService {
  async buscarLivros(): Promise<PaginatedResponse<Livro>> {
    const response = await fetch(API_ROUTES.LIVROS);
    return response.json();
  }

  async criarLivro(livro: LivroForm): Promise<ApiResponse<Livro>> {
    const response = await fetch(API_ROUTES.LIVROS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro)
    });
    return response.json();
  }
}
```

---

## 📋 **INTERFACES PRINCIPAIS**

### **Entidades Básicas**
- `Livro` - Livros do sistema
- `Autor` - Autores dos livros
- `Editora` - Editoras dos livros
- `Exemplar` - Exemplares físicos
- `Funcionario` - Funcionários da biblioteca
- `Usuario` - Usuários da biblioteca
- `Emprestimo` - Empréstimos realizados

### **Entidades de Sistema**
- `Login` - Dados de login
- `Token` - Token de autenticação
- `DashboardData` - Dados do dashboard
- `Activity` - Atividades recentes
- `SystemAlert` - Alertas do sistema

### **Interfaces de Formulário**
- `LivroForm` - Formulário de livro
- `AutorForm` - Formulário de autor
- `EditoraForm` - Formulário de editora
- `ExemplarForm` - Formulário de exemplar
- `FuncionarioForm` - Formulário de funcionário
- `UsuarioForm` - Formulário de usuário
- `EmprestimoForm` - Formulário de empréstimo

---

## 🎨 **CONSTANTES DISPONÍVEIS**

### **Status e Enums**
```typescript
// Status de empréstimo
STATUS_EMPRESTIMO.EMPRESTADO
STATUS_EMPRESTIMO.DEVOLVIDO
STATUS_EMPRESTIMO.ATRASADO
STATUS_EMPRESTIMO.RENOVADO

// Condições de exemplar
CONDICAO_EXEMPLAR.EXCELENTE
CONDICAO_EXEMPLAR.BOM
CONDICAO_EXEMPLAR.REGULAR
CONDICAO_EXEMPLAR.RUIM
CONDICAO_EXEMPLAR.DANIFICADO

// Roles de usuário
ROLE_USUARIO.ADMIN
ROLE_USUARIO.FUNCIONARIO
ROLE_USUARIO.USUARIO

// Tipos de alerta
TIPO_ALERTA.ERROR
TIPO_ALERTA.WARNING
TIPO_ALERTA.SUCCESS
TIPO_ALERTA.INFO
```

### **Rotas da API**
```typescript
// Usar as rotas predefinidas
API_ROUTES.LIVROS
API_ROUTES.AUTORES
API_ROUTES.EMPRESTIMOS
API_ROUTES.DASHBOARD_RESUMO
// ... todas as rotas disponíveis
```

---

## 🛠️ **FUNÇÕES UTILITÁRIAS**

### **Formatação**
```typescript
// Formatar datas
formatarData('2024-01-15') // "15/01/2024"
formatarDataHora('2024-01-15T10:30:00Z') // "15/01/2024 10:30:00"

// Formatar moeda
formatarMoeda(25.50) // "R$ 25,50"

// Formatar documentos
formatarCPF('12345678901') // "123.456.789-01"
formatarCEP('12345678') // "12345-678"
formatarTelefone('11987654321') // "(11) 98765-4321"
formatarISBN('9781234567890') // "978-12-345-67890-0"
```

### **Validação**
```typescript
// Validar dados
validarEmail('usuario@email.com') // true
validarCPF('123.456.789-01') // true
validarCEP('12345-678') // true
validarTelefone('(11) 98765-4321') // true
validarISBN('9781234567890') // true
validarSenha('123456') // true
validarData('2024-01-15') // true
```

### **Manipulação de Dados**
```typescript
// Gerar dados únicos
gerarNumeroExemplar(1, 5) // "EX-0001-005"

// Calcular datas
calcularDataDevolucao('2024-01-15', 14) // "2024-01-29T00:00:00.000Z"

// Calcular multas
calcularMulta(5, 2.50) // 12.50

// Verificar atrasos
verificarAtraso('2024-01-10') // true (se hoje > 10/01/2024)
calcularDiasAtraso('2024-01-10') // 5 (dias de atraso)
```

### **Formatação de Status**
```typescript
// Obter cores para status
obterCorStatusEmprestimo('Emprestado') // "text-blue-600 bg-blue-100"
obterCorCondicaoExemplar('Bom') // "text-blue-600 bg-blue-100"
obterCorTipoAlerta('error') // "text-red-600 bg-red-100 border-red-200"
```

---

## 📝 **EXEMPLOS PRÁTICOS**

### **1. Componente de Lista de Livros**
```typescript
import React from 'react';
import { Livro } from '../types/entities';
import { formatarData, formatarMoeda } from '../utils/entityUtils';

interface LivroListProps {
  livros: Livro[];
}

const LivroList: React.FC<LivroListProps> = ({ livros }) => {
  return (
    <div>
      {livros.map(livro => (
        <div key={livro.id} className="livro-card">
          <h3>{livro.titulo}</h3>
          <p>Autor: {livro.nomeAutor}</p>
          <p>Editora: {livro.nomeEditora}</p>
          <p>Preço: {formatarMoeda(livro.preco)}</p>
          <p>Criado em: {formatarData(livro.dataCriacao)}</p>
          <p>Exemplares: {livro.exemplaresDisponiveis}/{livro.totalExemplares}</p>
        </div>
      ))}
    </div>
  );
};
```

### **2. Formulário de Empréstimo**
```typescript
import React, { useState } from 'react';
import { EmprestimoForm } from '../types/entities';
import { validarData, calcularDataDevolucao } from '../utils/entityUtils';

const EmprestimoForm: React.FC = () => {
  const [formData, setFormData] = useState<EmprestimoForm>({
    idExemplar: 0,
    idUsuario: 0,
    dataEmprestimo: new Date().toISOString(),
    dataPrevistaDevolucao: '',
    observacoes: ''
  });

  const handleDataEmprestimoChange = (data: string) => {
    setFormData({
      ...formData,
      dataEmprestimo: data,
      dataPrevistaDevolucao: calcularDataDevolucao(data, 14)
    });
  };

  return (
    <form>
      <input
        type="datetime-local"
        value={formData.dataEmprestimo}
        onChange={(e) => handleDataEmprestimoChange(e.target.value)}
      />
      <input
        type="datetime-local"
        value={formData.dataPrevistaDevolucao}
        readOnly
      />
    </form>
  );
};
```

### **3. Validação de Formulário**
```typescript
import { validarEmail, validarCPF, gerarMensagemErro } from '../utils/entityUtils';

const validarFormularioUsuario = (dados: UsuarioForm) => {
  const erros: Record<string, string> = {};

  // Validar email
  if (!validarEmail(dados.email)) {
    erros.email = gerarMensagemErro('email', dados.email, { tipo: 'email' });
  }

  // Validar CPF
  if (!validarCPF(dados.cpf)) {
    erros.cpf = gerarMensagemErro('cpf', dados.cpf, { tipo: 'cpf' });
  }

  // Validar campos obrigatórios
  if (!dados.nome) {
    erros.nome = gerarMensagemErro('nome', dados.nome, { obrigatorio: true });
  }

  return erros;
};
```

---

## ⚠️ **IMPORTANTE**

1. **Sempre use as interfaces** para tipagem correta
2. **Use as constantes** em vez de strings hardcoded
3. **Use as funções utilitárias** para formatação e validação
4. **Mantenha a consistência** com o backend
5. **Valide dados** antes de enviar para a API
6. **Trate erros** apropriadamente

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Implementar serviços de API** usando as interfaces
2. **Criar componentes reutilizáveis** com tipagem correta
3. **Implementar validações** nos formulários
4. **Adicionar tratamento de erros** global
5. **Criar hooks customizados** para cada entidade
6. **Implementar cache** para melhor performance

---

**📚 Esta documentação deve ser consultada sempre que houver dúvidas sobre as entidades durante o desenvolvimento.**
