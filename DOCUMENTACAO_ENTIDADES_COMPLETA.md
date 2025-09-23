# 📚 DOCUMENTAÇÃO COMPLETA DAS ENTIDADES - YETI LIBRARY SYSTEM

## 🎯 **VISÃO GERAL**
Esta documentação contém todas as propriedades das entidades do sistema, com tipos de dados, validações e relacionamentos. Use esta documentação como referência para implementação no frontend.

---

## 📖 **1. LIVRO (LivroDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Tamanho Máx | Descrição |
|-------------|------|-------------|-------------|-----------|
| `Id` | `int` | ❌ | - | ID único do livro (gerado automaticamente) |
| `Titulo` | `string` | ✅ | 200 | Título principal do livro |
| `Subtitulo` | `string` | ❌ | 200 | Subtítulo do livro |
| `ISBN` | `string` | ✅ | 20 | Código ISBN do livro |
| `Ano` | `int` | ❌ | - | Ano de publicação |
| `Edicao` | `int` | ❌ | - | Número da edição (padrão: 1) |
| `NumeroPaginas` | `int` | ❌ | - | Quantidade de páginas |
| `Idioma` | `string` | ❌ | 50 | Idioma do livro (padrão: "Português") |
| `Genero` | `string` | ❌ | 100 | Gênero literário |
| `Sinopse` | `string` | ❌ | 2000 | Sinopse do livro |
| `Preco` | `decimal` | ❌ | - | Preço do livro |
| `CapaUrl` | `string` | ❌ | 500 | URL da imagem da capa |
| `CodigoBarras` | `string` | ❌ | 50 | Código de barras |
| `Ativo` | `bool` | ❌ | - | Status ativo/inativo (padrão: true) |
| `DataCriacao` | `DateTime` | ❌ | - | Data de criação (padrão: DateTime.Now) |

### **Relacionamentos**
| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `IdAutor` | `int` | ✅ | ID do autor do livro |
| `IdEditora` | `int` | ✅ | ID da editora do livro |

### **Propriedades Calculadas (Somente Leitura)**
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `TotalExemplares` | `int` | Total de exemplares do livro |
| `ExemplaresDisponiveis` | `int` | Quantidade de exemplares disponíveis |
| `TemExemplaresDisponiveis` | `bool` | Se há exemplares disponíveis |

### **Propriedades de Navegação (Opcionais)**
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `NomeAutor` | `string?` | Nome do autor (para exibição) |
| `NomeEditora` | `string?` | Nome da editora (para exibição) |

---

## 👤 **2. AUTOR (AutorDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Tamanho Máx | Descrição |
|-------------|------|-------------|-------------|-----------|
| `Id` | `int` | ❌ | - | ID único do autor |
| `Nome` | `string` | ❌ | - | Nome do autor |
| `NomeCompleto` | `string` | ❌ | - | Nome completo do autor |
| `NomeArtistico` | `string` | ❌ | - | Nome artístico/pseudônimo |
| `Nacionalidade` | `string` | ❌ | - | Nacionalidade do autor |
| `PaisOrigem` | `string` | ❌ | - | País de origem |
| `DataNascimento` | `DateTime` | ❌ | - | Data de nascimento |
| `Website` | `string` | ❌ | - | Site pessoal do autor |
| `Email` | `string` | ❌ | - | Email de contato |
| `Telefone` | `string` | ❌ | - | Telefone de contato |
| `Endereco` | `string` | ❌ | - | Endereço residencial |
| `Cidade` | `string` | ❌ | - | Cidade de residência |
| `Estado` | `string` | ❌ | - | Estado de residência |
| `CEP` | `string` | ❌ | - | Código postal |
| `Pais` | `string` | ❌ | - | País de residência |
| `Ativo` | `bool` | ❌ | - | Status ativo/inativo (padrão: true) |
| `DataCriacao` | `DateTime` | ❌ | - | Data de criação (padrão: DateTime.Now) |

---

## 🏢 **3. EDITORA (EditoraDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Tamanho Máx | Descrição |
|-------------|------|-------------|-------------|-----------|
| `Id` | `int` | ❌ | - | ID único da editora |
| `Nome` | `string` | ❌ | - | Nome da editora |
| `CNPJ` | `string` | ❌ | - | CNPJ da editora |
| `Telefone` | `string` | ❌ | - | Telefone de contato |
| `Email` | `string` | ❌ | - | Email de contato |
| `Endereco` | `string` | ❌ | - | Endereço da editora |
| `Cidade` | `string` | ❌ | - | Cidade da editora |
| `Estado` | `string` | ❌ | - | Estado da editora |
| `CEP` | `string` | ❌ | - | Código postal |
| `Pais` | `string` | ❌ | - | País da editora |
| `DataFundacao` | `DateTime` | ❌ | - | Data de fundação |
| `Site` | `string` | ❌ | - | Site oficial da editora |
| `Ativa` | `bool` | ❌ | - | Status ativa/inativa (padrão: true) |
| `DataCriacao` | `DateTime` | ❌ | - | Data de criação (padrão: DateTime.Now) |

---

## 📄 **4. EXEMPLAR (ExemplarDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Tamanho Máx | Descrição |
|-------------|------|-------------|-------------|-----------|
| `Id` | `int` | ❌ | - | ID único do exemplar |
| `IdLivro` | `int` | ✅ | - | ID do livro ao qual pertence |
| `NumeroExemplar` | `string` | ✅ | 50 | Número único do exemplar |
| `Localizacao` | `string` | ❌ | 100 | Localização física na biblioteca |
| `Condicao` | `string` | ❌ | 20 | Condição física (padrão: "Bom") |
| `Disponivel` | `bool` | ❌ | - | Se está disponível para empréstimo (padrão: true) |
| `Ativo` | `bool` | ❌ | - | Status ativo/inativo (padrão: true) |
| `DataAquisicao` | `DateTime` | ❌ | - | Data de aquisição (padrão: DateTime.Now) |
| `ValorAquisicao` | `decimal` | ❌ | - | Valor pago na aquisição (padrão: 0) |
| `Fornecedor` | `string` | ❌ | 100 | Fornecedor do exemplar |
| `Observacoes` | `string` | ❌ | 500 | Observações sobre o exemplar |
| `DataCriacao` | `DateTime` | ❌ | - | Data de criação (padrão: DateTime.Now) |

### **Propriedades de Navegação (Opcionais)**
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `TituloLivro` | `string?` | Título do livro (para exibição) |
| `ISBN` | `string?` | ISBN do livro (para exibição) |
| `NomeAutor` | `string?` | Nome do autor (para exibição) |
| `NomeEditora` | `string?` | Nome da editora (para exibição) |

---

## 👨‍💼 **5. FUNCIONÁRIO (FuncionarioDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Tamanho Máx | Descrição |
|-------------|------|-------------|-------------|-----------|
| `Id` | `int` | ❌ | - | ID único do funcionário |
| `Nome` | `string` | ❌ | - | Nome completo do funcionário |
| `Email` | `string` | ❌ | - | Email do funcionário |
| `Telefone` | `string` | ❌ | - | Telefone do funcionário |
| `Senha` | `string` | ❌ | - | Senha criptografada |
| `Cargo` | `string` | ❌ | - | Cargo/função do funcionário |
| `Salario` | `decimal` | ❌ | - | Salário do funcionário |
| `DataAdmissao` | `DateTime` | ❌ | - | Data de admissão |
| `DataDemissao` | `DateTime?` | ❌ | - | Data de demissão (nullable) |
| `Ativo` | `bool` | ❌ | - | Status ativo/inativo (padrão: true) |

---

## 👥 **6. USUÁRIO (UsuarioDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Tamanho Máx | Descrição |
|-------------|------|-------------|-------------|-----------|
| `Id` | `int` | ❌ | - | ID único do usuário |
| `Nome` | `string` | ❌ | - | Nome completo do usuário |
| `Email` | `string` | ❌ | - | Email do usuário |
| `Telefone` | `string` | ❌ | - | Telefone do usuário |
| `Senha` | `string` | ❌ | - | Senha criptografada |
| `CPF` | `string` | ❌ | - | CPF do usuário |
| `DataNascimento` | `DateTime` | ❌ | - | Data de nascimento |

---

## 📚 **7. EMPRÉSTIMO (EmprestimoDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Tamanho Máx | Descrição |
|-------------|------|-------------|-------------|-----------|
| `Id` | `int` | ❌ | - | ID único do empréstimo |
| `IdExemplar` | `int` | ✅ | - | ID do exemplar emprestado |
| `IdUsuario` | `int` | ✅ | - | ID do usuário que fez o empréstimo |
| `DataEmprestimo` | `DateTime` | ❌ | - | Data do empréstimo |
| `DataPrevistaDevolucao` | `DateTime` | ❌ | - | Data prevista para devolução |
| `DataDevolucao` | `DateTime?` | ❌ | - | Data real de devolução (nullable) |
| `DataRenovacao` | `DateTime?` | ❌ | - | Data da última renovação (nullable) |
| `QuantidadeRenovacoes` | `int` | ❌ | - | Quantidade de renovações (padrão: 0) |
| `MaxRenovacoes` | `int` | ❌ | - | Máximo de renovações permitidas (padrão: 3) |
| `Multa` | `decimal` | ❌ | - | Valor da multa (padrão: 0) |
| `Status` | `string` | ✅ | 20 | Status do empréstimo (padrão: "Emprestado") |
| `Observacoes` | `string` | ❌ | 500 | Observações sobre o empréstimo |
| `Ativo` | `bool` | ❌ | - | Status ativo/inativo (padrão: true) |
| `DataCriacao` | `DateTime` | ❌ | - | Data de criação (padrão: DateTime.Now) |

### **Propriedades de Navegação (Opcionais)**
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `TituloLivro` | `string?` | Título do livro (para exibição) |
| `NumeroExemplar` | `string?` | Número do exemplar (para exibição) |
| `NomeUsuario` | `string?` | Nome do usuário (para exibição) |
| `EmailUsuario` | `string?` | Email do usuário (para exibição) |

### **Propriedades Calculadas (Somente Leitura)**
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `EstaAtrasado` | `bool` | Se o empréstimo está atrasado |
| `DiasAtraso` | `int` | Quantidade de dias de atraso |
| `PodeRenovar` | `bool` | Se pode ser renovado |

---

## 🔐 **8. LOGIN (LoginDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Validação | Descrição |
|-------------|------|-------------|-----------|-----------|
| `Email` | `string` | ✅ | Email válido | Email para login |
| `Senha` | `string` | ✅ | Mín. 6 caracteres | Senha para login |

---

## 🎫 **9. TOKEN (TokenDTO)**

### **Propriedades Básicas**
| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `Token` | `string` | ❌ | Token JWT |
| `Expiration` | `DateTime` | ❌ | Data de expiração do token |
| `Tipo` | `string` | ❌ | Tipo do token (padrão: "Bearer") |
| `Nome` | `string` | ❌ | Nome do usuário autenticado |
| `Email` | `string` | ❌ | Email do usuário autenticado |
| `Role` | `string` | ❌ | Role do usuário (Admin/Usuario) |

---

## 🔗 **10. RELACIONAMENTOS ENTRE ENTIDADES**

### **Livro → Autor**
- **Um livro** pertence a **um autor**
- **Chave estrangeira**: `Livro.IdAutor` → `Autor.Id`

### **Livro → Editora**
- **Um livro** pertence a **uma editora**
- **Chave estrangeira**: `Livro.IdEditora` → `Editora.Id`

### **Exemplar → Livro**
- **Um exemplar** pertence a **um livro**
- **Chave estrangeira**: `Exemplar.IdLivro` → `Livro.Id`

### **Empréstimo → Exemplar**
- **Um empréstimo** refere-se a **um exemplar**
- **Chave estrangeira**: `Emprestimo.IdExemplar` → `Exemplar.Id`

### **Empréstimo → Usuário**
- **Um empréstimo** é feito por **um usuário**
- **Chave estrangeira**: `Emprestimo.IdUsuario` → `Usuario.Id`

---

## 📋 **11. STATUS E VALORES PADRÃO**

### **Status de Empréstimo**
- `"Emprestado"` - Livro emprestado
- `"Devolvido"` - Livro devolvido
- `"Atrasado"` - Empréstimo vencido
- `"Renovado"` - Empréstimo renovado

### **Condições de Exemplar**
- `"Excelente"` - Estado perfeito
- `"Bom"` - Estado bom (padrão)
- `"Regular"` - Estado regular
- `"Ruim"` - Estado ruim
- `"Danificado"` - Exemplar danificado

### **Roles de Usuário**
- `"Admin"` - Administrador do sistema
- `"Funcionario"` - Funcionário da biblioteca
- `"Usuario"` - Usuário comum

---

## 🎯 **12. IMPLEMENTAÇÃO NO FRONTEND**

### **Interfaces TypeScript Sugeridas**
```typescript
// Exemplo para Livro
interface Livro {
  id: number;
  titulo: string;
  subtitulo?: string;
  isbn: string;
  ano: number;
  edicao: number;
  numeroPaginas: number;
  idioma: string;
  genero: string;
  sinopse: string;
  preco: number;
  capaUrl: string;
  codigoBarras: string;
  ativo: boolean;
  dataCriacao: string; // ISO string
  idAutor: number;
  idEditora: number;
  totalExemplares: number;
  exemplaresDisponiveis: number;
  temExemplaresDisponiveis: boolean;
  nomeAutor?: string;
  nomeEditora?: string;
}
```

### **Validações Frontend**
- **Campos obrigatórios**: Sempre validar antes do envio
- **Tamanhos máximos**: Implementar validação de caracteres
- **Formatos**: Validar email, CPF, CEP, etc.
- **Datas**: Converter para formato ISO string
- **Decimais**: Tratar valores monetários corretamente

---

## ⚠️ **13. OBSERVAÇÕES IMPORTANTES**

1. **Propriedades Calculadas**: Não devem ser enviadas na criação/edição
2. **Propriedades de Navegação**: Apenas para exibição, não para persistência
3. **Datas**: Sempre converter para ISO string no frontend
4. **Senhas**: Nunca exibir em formulários, sempre usar campos de senha
5. **IDs**: Gerados automaticamente pelo backend
6. **Validações**: Implementar tanto no frontend quanto no backend
7. **Relacionamentos**: Sempre validar se as chaves estrangeiras existem

---

## 🚀 **14. PRÓXIMOS PASSOS**

1. **Criar interfaces TypeScript** baseadas nesta documentação
2. **Implementar validações** nos formulários
3. **Criar serviços de API** para cada entidade
4. **Implementar CRUD** completo para cada entidade
5. **Adicionar tratamento de erros** apropriado
6. **Implementar paginação** para listas grandes
7. **Adicionar filtros e busca** nas listagens

---

**📝 Esta documentação deve ser consultada sempre que houver dúvidas sobre as propriedades das entidades durante a implementação do frontend.**
