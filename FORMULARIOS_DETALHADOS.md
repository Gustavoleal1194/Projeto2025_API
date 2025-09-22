# 📝 FORMULÁRIOS DETALHADOS - SISTEMA DE BIBLIOTECA

## 🔐 **FORMULÁRIOS DE AUTENTICAÇÃO**

### **1. LoginForm.tsx**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  senha: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha muito longa'),
  role: z.enum(['Usuario', 'Funcionario', 'Admin'], {
    required_error: 'Selecione um tipo de usuário'
  })
});

interface LoginFormData {
  email: string;
  senha: string;
  role: 'Usuario' | 'Funcionario' | 'Admin';
}

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/auth/login', data);
      // Processar resposta e redirecionar
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        placeholder="seu@email.com"
        required
      />
      
      <FormField
        label="Senha"
        name="senha"
        type="password"
        register={register}
        error={errors.senha}
        placeholder="Sua senha"
        required
      />
      
      <FormField
        label="Tipo de Usuário"
        name="role"
        type="select"
        register={register}
        error={errors.role}
        options={[
          { value: 'Usuario', label: 'Usuário' },
          { value: 'Funcionario', label: 'Funcionário' },
          { value: 'Admin', label: 'Administrador' }
        ]}
        required
      />
      
      <Button type="submit" className="w-full">
        Entrar
      </Button>
    </form>
  );
};
```

### **2. RegistroForm.tsx**
```typescript
const registroSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  senha: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos 1 letra minúscula, 1 maiúscula e 1 número'),
  confirmarSenha: z.string(),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone muito longo'),
  cpf: z.string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CPF inválido'),
  dataNascimento: z.date({
    required_error: 'Data de nascimento é obrigatória'
  }),
  endereco: z.string()
    .max(200, 'Endereço muito longo')
    .optional()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não coincidem",
  path: ["confirmarSenha"],
});

interface RegistroFormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date;
  endereco?: string;
}
```

## 📚 **FORMULÁRIOS DE LIVROS**

### **3. AdicionarLivroForm.tsx**
```typescript
const adicionarLivroSchema = z.object({
  titulo: z.string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo'),
  isbn: z.string()
    .min(10, 'ISBN deve ter pelo menos 10 caracteres')
    .max(17, 'ISBN muito longo')
    .regex(/^[0-9-]+$/, 'ISBN deve conter apenas números e hífens'),
  genero: z.string()
    .min(1, 'Gênero é obrigatório')
    .max(50, 'Gênero muito longo'),
  sinopse: z.string()
    .min(10, 'Sinopse deve ter pelo menos 10 caracteres')
    .max(2000, 'Sinopse muito longa'),
  ano: z.number()
    .min(1000, 'Ano inválido')
    .max(new Date().getFullYear(), 'Ano não pode ser futuro'),
  idAutor: z.number()
    .positive('Autor é obrigatório'),
  idEditora: z.number()
    .positive('Editora é obrigatória'),
  capa: z.instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'Arquivo deve ter no máximo 5MB')
    .refine((file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Formato de imagem inválido'),
  observacoes: z.string()
    .max(500, 'Observações muito longas')
    .optional()
});

interface AdicionarLivroFormData {
  titulo: string;
  isbn: string;
  genero: string;
  sinopse: string;
  ano: number;
  idAutor: number;
  idEditora: number;
  capa?: File;
  observacoes?: string;
}
```

### **4. EditarLivroForm.tsx**
```typescript
const editarLivroSchema = adicionarLivroSchema.extend({
  id: z.number().positive('ID é obrigatório')
});

interface EditarLivroFormData extends AdicionarLivroFormData {
  id: number;
}
```

## 👥 **FORMULÁRIOS DE USUÁRIOS**

### **5. AdicionarUsuarioForm.tsx**
```typescript
const adicionarUsuarioSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  senha: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha muito longa'),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone muito longo'),
  cpf: z.string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CPF inválido'),
  dataNascimento: z.date({
    required_error: 'Data de nascimento é obrigatória'
  }),
  endereco: z.string()
    .max(200, 'Endereço muito longo')
    .optional(),
  ativo: z.boolean().default(true)
});

interface AdicionarUsuarioFormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date;
  endereco?: string;
  ativo: boolean;
}
```

### **6. EditarPerfilForm.tsx**
```typescript
const editarPerfilSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone muito longo'),
  dataNascimento: z.date({
    required_error: 'Data de nascimento é obrigatória'
  }),
  endereco: z.string()
    .max(200, 'Endereço muito longo')
    .optional()
});

interface EditarPerfilFormData {
  nome: string;
  telefone: string;
  dataNascimento: Date;
  endereco?: string;
}
```

## 👨‍💼 **FORMULÁRIOS DE FUNCIONÁRIOS**

### **7. AdicionarFuncionarioForm.tsx**
```typescript
const adicionarFuncionarioSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  senha: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha muito longa'),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone muito longo'),
  cargo: z.string()
    .min(1, 'Cargo é obrigatório')
    .max(50, 'Cargo muito longo'),
  salario: z.number()
    .positive('Salário deve ser positivo')
    .max(999999.99, 'Salário muito alto'),
  dataAdmissao: z.date({
    required_error: 'Data de admissão é obrigatória'
  }),
  ativo: z.boolean().default(true)
});

interface AdicionarFuncionarioFormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cargo: string;
  salario: number;
  dataAdmissao: Date;
  ativo: boolean;
}
```

## 📖 **FORMULÁRIOS DE AUTORES**

### **8. AdicionarAutorForm.tsx**
```typescript
const adicionarAutorSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  biografia: z.string()
    .min(10, 'Biografia deve ter pelo menos 10 caracteres')
    .max(2000, 'Biografia muito longa'),
  dataNascimento: z.date({
    required_error: 'Data de nascimento é obrigatória'
  }),
  nacionalidade: z.string()
    .min(2, 'Nacionalidade é obrigatória')
    .max(50, 'Nacionalidade muito longa'),
  foto: z.instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'Arquivo deve ter no máximo 5MB')
    .refine((file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Formato de imagem inválido')
});

interface AdicionarAutorFormData {
  nome: string;
  biografia: string;
  dataNascimento: Date;
  nacionalidade: string;
  foto?: File;
}
```

## 🏢 **FORMULÁRIOS DE EDITORAS**

### **9. AdicionarEditoraForm.tsx**
```typescript
const adicionarEditoraSchema = z.object({
  nome: z.string()
    .min(2, 'Nome é obrigatório')
    .max(100, 'Nome muito longo'),
  cnpj: z.string()
    .min(14, 'CNPJ deve ter 14 dígitos')
    .max(18, 'CNPJ inválido')
    .optional(),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone muito longo'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  website: z.string()
    .url('Website inválido')
    .optional(),
  especializacao: z.string()
    .min(1, 'Especialização é obrigatória')
    .max(100, 'Especialização muito longa'),
  dataFundacao: z.date({
    required_error: 'Data de fundação é obrigatória'
  }),
  endereco: z.object({
    logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    estado: z.string().min(2, 'Estado é obrigatório'),
    cep: z.string().min(8, 'CEP inválido'),
    pais: z.string().min(2, 'País é obrigatório')
  })
});

interface AdicionarEditoraFormData {
  nome: string;
  cnpj?: string;
  telefone: string;
  email: string;
  website?: string;
  especializacao: string;
  dataFundacao: Date;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;
  };
}
```

## 📋 **FORMULÁRIOS DE EXEMPLARES**

### **10. AdicionarExemplarForm.tsx**
```typescript
const adicionarExemplarSchema = z.object({
  codigoExemplar: z.string()
    .min(1, 'Código do exemplar é obrigatório')
    .max(20, 'Código muito longo'),
  idLivro: z.number()
    .positive('Livro é obrigatório'),
  disponivel: z.boolean().default(true),
  observacoes: z.string()
    .max(500, 'Observações muito longas')
    .optional()
});

interface AdicionarExemplarFormData {
  codigoExemplar: string;
  idLivro: number;
  disponivel: boolean;
  observacoes?: string;
}
```

## 📚 **FORMULÁRIOS DE EMPRÉSTIMOS**

### **11. NovoEmprestimoForm.tsx**
```typescript
const novoEmprestimoSchema = z.object({
  idUsuario: z.number()
    .positive('Usuário é obrigatório'),
  idExemplar: z.number()
    .positive('Exemplar é obrigatório'),
  dataEmprestimo: z.date({
    required_error: 'Data de empréstimo é obrigatória'
  }),
  dataDevolucaoPrevista: z.date({
    required_error: 'Data de devolução prevista é obrigatória'
  }),
  observacoes: z.string()
    .max(500, 'Observações muito longas')
    .optional()
}).refine((data) => data.dataDevolucaoPrevista > data.dataEmprestimo, {
  message: "Data de devolução deve ser posterior ao empréstimo",
  path: ["dataDevolucaoPrevista"],
});

interface NovoEmprestimoFormData {
  idUsuario: number;
  idExemplar: number;
  dataEmprestimo: Date;
  dataDevolucaoPrevista: Date;
  observacoes?: string;
}
```

### **12. DevolverEmprestimoForm.tsx**
```typescript
const devolverEmprestimoSchema = z.object({
  id: z.number().positive('ID do empréstimo é obrigatório'),
  dataDevolucaoReal: z.date({
    required_error: 'Data de devolução real é obrigatória'
  }),
  observacoes: z.string()
    .max(500, 'Observações muito longas')
    .optional()
});

interface DevolverEmprestimoFormData {
  id: number;
  dataDevolucaoReal: Date;
  observacoes?: string;
}
```

## 🔍 **FORMULÁRIOS DE BUSCA**

### **13. BuscaSimplesForm.tsx**
```typescript
const buscaSimplesSchema = z.object({
  termo: z.string()
    .min(1, 'Termo de busca é obrigatório')
    .max(100, 'Termo de busca muito longo')
});

interface BuscaSimplesFormData {
  termo: string;
}
```

### **14. FiltrosAvancadosForm.tsx**
```typescript
const filtrosAvancadosSchema = z.object({
  termo: z.string().optional(),
  genero: z.string().optional(),
  autor: z.string().optional(),
  editora: z.string().optional(),
  anoMin: z.number().optional(),
  anoMax: z.number().optional(),
  disponivel: z.boolean().optional(),
  ordenarPor: z.enum(['titulo', 'autor', 'ano', 'genero']).optional(),
  ordem: z.enum(['asc', 'desc']).optional()
});

interface FiltrosAvancadosFormData {
  termo?: string;
  genero?: string;
  autor?: string;
  editora?: string;
  anoMin?: number;
  anoMax?: number;
  disponivel?: boolean;
  ordenarPor?: 'titulo' | 'autor' | 'ano' | 'genero';
  ordem?: 'asc' | 'desc';
}
```

## ⚙️ **FORMULÁRIOS DE CONFIGURAÇÃO**

### **15. ConfiguracoesSistemaForm.tsx**
```typescript
const configuracoesSistemaSchema = z.object({
  nomeSistema: z.string()
    .min(1, 'Nome do sistema é obrigatório')
    .max(100, 'Nome muito longo'),
  tempoEmprestimo: z.number()
    .positive('Tempo de empréstimo deve ser positivo')
    .max(365, 'Tempo máximo é 365 dias'),
  maxEmprestimos: z.number()
    .positive('Máximo de empréstimos deve ser positivo')
    .max(20, 'Máximo é 20 empréstimos'),
  multaPorDia: z.number()
    .min(0, 'Multa não pode ser negativa')
    .max(100, 'Multa muito alta'),
  notificacoesAtivas: z.boolean().default(true),
  emailSistema: z.string()
    .email('Email inválido')
    .optional()
});

interface ConfiguracoesSistemaFormData {
  nomeSistema: string;
  tempoEmprestimo: number;
  maxEmprestimos: number;
  multaPorDia: number;
  notificacoesAtivas: boolean;
  emailSistema?: string;
}
```

## 🧩 **COMPONENTE FORM FIELD REUTILIZÁVEL**

### **FormField.tsx**
```typescript
import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'file' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  options?: { value: any; label: string }[];
  register?: any;
  className?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, name, type, placeholder, required, error, options, register, className }, ref) => {
    return (
      <div className={`space-y-2 ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {type === 'select' ? (
          <select
            id={name}
            {...register?.(name)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            {...register?.(name)}
            placeholder={placeholder}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        ) : type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              id={name}
              type="checkbox"
              {...register?.(name)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
              {label}
            </label>
          </div>
        ) : (
          <input
            id={name}
            type={type}
            {...register?.(name)}
            placeholder={placeholder}
            ref={ref}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}
        
        {error && (
          <p className="text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }
);
```

## 🎯 **RESUMO DOS FORMULÁRIOS**

### **Total de Formulários: 25+**
- ✅ **3 Formulários de Autenticação**
- ✅ **4 Formulários de Livros**
- ✅ **3 Formulários de Usuários**
- ✅ **2 Formulários de Funcionários**
- ✅ **2 Formulários de Autores**
- ✅ **2 Formulários de Editoras**
- ✅ **2 Formulários de Exemplares**
- ✅ **3 Formulários de Empréstimos**
- ✅ **2 Formulários de Busca**
- ✅ **1 Formulário de Configuração**
- ✅ **1 Componente FormField Reutilizável**

### **Validações Implementadas:**
- ✅ **Validação de email** com regex
- ✅ **Validação de senha** com critérios de segurança
- ✅ **Validação de CPF/CNPJ** com formato
- ✅ **Validação de datas** com range
- ✅ **Validação de arquivos** com tipo e tamanho
- ✅ **Validação de números** com range
- ✅ **Validação de strings** com tamanho
- ✅ **Validação de URLs** com formato
- ✅ **Validação de campos obrigatórios**
- ✅ **Validação de confirmação de senha**

**Todos os formulários estão estruturados para integrar perfeitamente com os 99 endpoints da API!** 🚀
