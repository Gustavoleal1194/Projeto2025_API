# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Sistema de Biblioteca! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)
- [Código de Conduta](#código-de-conduta)

## 🚀 Como Contribuir

### Tipos de Contribuição

1. **🐛 Correção de Bugs**
   - Identificar e corrigir problemas existentes
   - Melhorar tratamento de erros
   - Otimizar performance

2. **✨ Novas Funcionalidades**
   - Implementar novos endpoints
   - Adicionar validações
   - Criar novos relatórios

3. **📚 Documentação**
   - Melhorar README
   - Adicionar exemplos de uso
   - Documentar APIs

4. **🧪 Testes**
   - Adicionar testes unitários
   - Melhorar cobertura de testes
   - Criar testes de integração

5. **🔧 Melhorias Técnicas**
   - Refatorar código
   - Otimizar queries
   - Melhorar arquitetura

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- .NET 8.0 SDK
- SQL Server (LocalDB ou Express)
- Visual Studio 2022 ou VS Code
- Git

### Passos para Configuração

1. **Fork o repositório**
   ```bash
   # Clique no botão "Fork" no GitHub
   ```

2. **Clone seu fork**
   ```bash
   git clone https://github.com/SEU-USUARIO/Projeto2025_API.git
   cd Projeto2025_API
   ```

3. **Configure o remote upstream**
   ```bash
   git remote add upstream https://github.com/Gustavoleal1194/Projeto2025_API.git
   ```

4. **Instale as dependências**
   ```bash
   dotnet restore
   ```

5. **Configure o banco de dados**
   ```bash
   dotnet ef database update --project Projeto2020_API
   ```

6. **Execute a aplicação**
   ```bash
   dotnet run --project Projeto2020_API
   ```

## 📝 Padrões de Código

### Convenções de Nomenclatura

- **Classes**: PascalCase (`LivroService`)
- **Métodos**: PascalCase (`GetAllAsync`)
- **Propriedades**: PascalCase (`Titulo`)
- **Variáveis**: camelCase (`livroId`)
- **Constantes**: UPPER_CASE (`MAX_RENOVACOES`)

### Estrutura de Arquivos

```
Projeto2025_API/
├── Dominio/
│   ├── Entidades/          # Entidades do domínio
│   └── Dtos/               # Data Transfer Objects
├── InfraEstrutura/
│   ├── Data/               # Contexto do banco
│   ├── Migrations/         # Migrações do EF
│   └── Repositorio/        # Implementações dos repositórios
├── Interface/
│   ├── Repositorio/        # Interfaces dos repositórios
│   └── Service/            # Interfaces dos serviços
├── Service/                # Camada de serviços
└── Projeto2020_API/
    ├── Controllers/        # Controllers da API
    ├── Mapping/            # Configuração do AutoMapper
    └── Program.cs          # Configuração da aplicação
```

### Padrões de Commit

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc.
- `refactor`: Refatoração de código
- `test`: Adição de testes
- `chore`: Mudanças em build, dependências, etc.

#### Exemplos

```bash
feat: adicionar endpoint de busca de livros por autor
fix: corrigir validação de CPF em usuários
docs: atualizar README com novos endpoints
refactor: otimizar query de empréstimos ativos
test: adicionar testes para LivroService
```

### Padrões de Código C#

```csharp
// ✅ Bom
public async Task<LivroDTO?> GetByIdAsync(int id)
{
    if (id <= 0)
        throw new ArgumentException("ID deve ser maior que zero", nameof(id));

    var livro = await _livroRepositorio.GetByIdAsync(id);
    return livro != null ? _mapper.Map<LivroDTO>(livro) : null;
}

// ❌ Ruim
public async Task<LivroDTO> GetByIdAsync(int id)
{
    var livro = await _livroRepositorio.GetByIdAsync(id);
    return _mapper.Map<LivroDTO>(livro);
}
```

### Documentação de Código

```csharp
/// <summary>
/// Obtém um livro pelo ID
/// </summary>
/// <param name="id">ID do livro</param>
/// <returns>DTO do livro ou null se não encontrado</returns>
/// <exception cref="ArgumentException">Quando ID é inválido</exception>
public async Task<LivroDTO?> GetByIdAsync(int id)
{
    // Implementação...
}
```

## 🔄 Processo de Pull Request

### 1. Criar uma Branch

```bash
# Atualizar main
git checkout master
git pull upstream master

# Criar nova branch
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
```

### 2. Fazer as Mudanças

- Implemente sua funcionalidade
- Adicione testes se necessário
- Atualize documentação
- Execute testes localmente

### 3. Commit das Mudanças

```bash
git add .
git commit -m "feat: adicionar nova funcionalidade"
```

### 4. Push para seu Fork

```bash
git push origin feature/nova-funcionalidade
```

### 5. Criar Pull Request

1. Vá para o GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Preencha o template do PR
5. Adicione reviewers se necessário

### Template do Pull Request

```markdown
## 📝 Descrição
Breve descrição das mudanças realizadas.

## 🔗 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação
- [ ] Refatoração

## 🧪 Como Testar
Passos para testar as mudanças:

1. Execute `dotnet run`
2. Acesse `/swagger`
3. Teste o endpoint X
4. Verifique se Y funciona

## 📸 Screenshots (se aplicável)
Adicione screenshots das mudanças visuais.

## ✅ Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Não há breaking changes
- [ ] Build passa sem erros
```

## 🐛 Reportando Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado
2. Teste com a versão mais recente
3. Verifique se não é um problema de configuração

### Como Reportar

Use o template de issue:

```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## 🎯 Comportamento Esperado
O que deveria acontecer.

## 📸 Screenshots
Se aplicável, adicione screenshots.

## 🖥️ Ambiente
- OS: [ex: Windows 10]
- .NET Version: [ex: 8.0]
- Browser: [ex: Chrome 91]

## 📋 Logs
Adicione logs relevantes se houver.
```

## 💡 Sugerindo Melhorias

### Antes de Sugerir

1. Verifique se a melhoria já foi sugerida
2. Considere o impacto na arquitetura
3. Pense na compatibilidade com versões anteriores

### Como Sugerir

Use o template de feature request:

```markdown
## 🚀 Funcionalidade Solicitada
Descrição clara da funcionalidade desejada.

## 💭 Problema que Resolve
Qual problema esta funcionalidade resolve?

## 💡 Solução Proposta
Como você imagina que deveria funcionar?

## 🔄 Alternativas Consideradas
Outras soluções que você considerou?

## 📋 Contexto Adicional
Qualquer contexto adicional sobre a solicitação.
```

## 📊 Código de Conduta

### Nossos Compromissos

- Ser respeitoso e inclusivo
- Focar no que é melhor para a comunidade
- Aceitar críticas construtivas
- Mostrar empatia com outros membros

### Comportamentos Inaceitáveis

- Linguagem ou imagens sexualizadas
- Trolling, comentários insultuosos ou ataques pessoais
- Assédio público ou privado
- Publicar informações privadas sem permissão
- Outros comportamentos inadequados em ambiente profissional

### Aplicação

Reporte comportamentos inaceitáveis para guuh.leal@hotmail.com

## 🏆 Reconhecimento

Contribuidores serão reconhecidos no README e em releases.

## 📞 Contato

- **GitHub Issues**: [Criar uma issue](https://github.com/Gustavoleal1194/Projeto2025_API/issues)
- **Email**: guuh.leal@hotmail.com
- **Discord**: [Link do servidor] (se houver)

---

Obrigado por contribuir! 🎉
