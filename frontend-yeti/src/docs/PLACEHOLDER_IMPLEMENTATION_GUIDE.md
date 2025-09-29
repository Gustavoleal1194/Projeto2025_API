# 📝 Guia de Implementação de Placeholders Inteligentes

## 🎯 **VISÃO GERAL**

Este guia mostra como implementar placeholders inteligentes em todos os formulários do sistema, melhorando a UX e reduzindo erros de preenchimento.

## 🚀 **IMPLEMENTAÇÃO RÁPIDA**

### **1. Importar o Helper**
```typescript
import { getPlaceholderByFieldName } from '../components/PlaceholderHelper';
```

### **2. Usar nos Campos**
```typescript
<input
    type="text"
    value={formData.campo}
    onChange={(e) => setFormData({ ...formData, campo: e.target.value })}
    placeholder={getPlaceholderByFieldName('nomeDoCampo')}
    required
/>
```

## 📋 **FORMULÁRIOS PARA ATUALIZAR**

### **✅ JÁ IMPLEMENTADOS:**
- [x] **GerenciarUsuarios.tsx** - Placeholders completos
- [x] **GerenciarLivros.tsx** - Placeholders básicos

### **🔄 PENDENTES:**
- [ ] **GerenciarAutores.tsx**
- [ ] **GerenciarEditoras.tsx**
- [ ] **GerenciarFuncionarios.tsx**
- [ ] **GerenciarExemplares.tsx**
- [ ] **GerenciarEmprestimos.tsx**
- [ ] **MeuPerfil.tsx**
- [ ] **LoginPage.tsx**

## 🎯 **TIPOS DE PLACEHOLDERS DISPONÍVEIS**

### **📝 CAMPOS DE TEXTO**
```typescript
getPlaceholderByFieldName('nome')           // "Digite o nome completo (ex: João Silva Santos)"
getPlaceholderByFieldName('email')          // "Digite seu email (ex: joao@email.com)"
getPlaceholderByFieldName('telefone')       // "Digite apenas números (ex: 11999999999)"
```

### **📝 CAMPOS DE DOCUMENTO**
```typescript
getPlaceholderByFieldName('cpf')            // "Digite apenas números (ex: 12345678901)"
getPlaceholderByFieldName('cnpj')           // "Digite apenas números (ex: 12345678000195)"
getPlaceholderByFieldName('cep')            // "Digite apenas números (ex: 01234567)"
```

### **📝 CAMPOS DE ENDEREÇO**
```typescript
getPlaceholderByFieldName('endereco')       // "Digite o endereço completo (ex: Rua das Flores, 123)"
getPlaceholderByFieldName('cidade')         // "Digite o nome da cidade (ex: São Paulo)"
getPlaceholderByFieldName('estado')         // "Digite a sigla do estado (ex: SP)"
getPlaceholderByFieldName('pais')           // "Digite o nome do país (ex: Brasil)"
```

### **📝 CAMPOS DE LIVRO**
```typescript
getPlaceholderByFieldName('titulo')         // "Digite o título do livro (ex: O Pequeno Príncipe)"
getPlaceholderByFieldName('subtitulo')      // "Digite o subtítulo (opcional)"
getPlaceholderByFieldName('isbn')           // "Digite o ISBN (ex: 9788535902775)"
getPlaceholderByFieldName('ano')            // "Digite o ano de publicação (ex: 2024)"
getPlaceholderByFieldName('genero')         // "Digite o gênero (ex: Ficção, Romance, Aventura)"
getPlaceholderByFieldName('idioma')         // "Digite o idioma (ex: Português, Inglês, Espanhol)"
```

### **📝 CAMPOS DE SENHA**
```typescript
getPlaceholderByFieldName('senha')          // "Digite uma senha segura (mínimo 6 caracteres)"
getPlaceholderByFieldName('confirmarsenha') // "Digite a mesma senha novamente"
```

### **📝 CAMPOS DE DATA**
```typescript
getPlaceholderByFieldName('datanascimento') // "Selecione sua data de nascimento"
getPlaceholderByFieldName('datafundacao')   // "Selecione a data de fundação"
getPlaceholderByFieldName('dataadmissao')   // "Selecione a data de admissão"
```

### **📝 CAMPOS NUMÉRICOS**
```typescript
getPlaceholderByFieldName('numeropaginas')  // "Digite o número de páginas (ex: 250)"
getPlaceholderByFieldName('preco')          // "Digite o preço (ex: 29.90)"
getPlaceholderByFieldName('salario')        // "Digite o salário (ex: 5000.00)"
getPlaceholderByFieldName('valor')          // "Digite o valor (ex: 100.00)"
```

### **📝 CAMPOS DE TEXTO LONGO**
```typescript
getPlaceholderByFieldName('descricao')      // "Digite uma descrição detalhada"
getPlaceholderByFieldName('sinopse')        // "Digite a sinopse do livro"
getPlaceholderByFieldName('biografia')      // "Digite a biografia do autor"
getPlaceholderByFieldName('observacoes')    // "Digite observações adicionais (opcional)"
```

### **📝 CAMPOS DE LOCALIZAÇÃO**
```typescript
getPlaceholderByFieldName('localizacao')    // "Digite a localização (ex: Estante A, Prateleira 3)"
getPlaceholderByFieldName('cargo')          // "Digite o cargo (ex: Gerente, Analista, Diretor)"
getPlaceholderByFieldName('nacionalidade')  // "Digite a nacionalidade (ex: Brasileiro, Americano)"
```

### **📝 CAMPOS DE CÓDIGO**
```typescript
getPlaceholderByFieldName('codigobarras')   // "Digite o código de barras (ex: 7891234567890)"
getPlaceholderByFieldName('numeroexemplar') // "Digite o número do exemplar (ex: 001, 002)"
```

### **📝 CAMPOS DE STATUS**
```typescript
getPlaceholderByFieldName('status')         // "Selecione o status"
getPlaceholderByFieldName('condicao')       // "Selecione a condição (Bom, Regular, Ruim)"
```

### **📝 CAMPOS DE QUANTIDADE**
```typescript
getPlaceholderByFieldName('quantidade')     // "Digite a quantidade (ex: 10)"
getPlaceholderByFieldName('estoque')        // "Digite a quantidade em estoque (ex: 50)"
```

### **📝 CAMPOS DE PERÍODO**
```typescript
getPlaceholderByFieldName('periodo')        // "Selecione o período"
getPlaceholderByFieldName('datainicio')     // "Selecione a data de início"
getPlaceholderByFieldName('datafim')        // "Selecione a data de fim"
```

### **📝 CAMPOS DE BUSCA**
```typescript
getPlaceholderByFieldName('buscar')         // "Digite para buscar..."
getPlaceholderByFieldName('filtrar')        // "Selecione para filtrar..."
```

## 🔧 **EXEMPLOS DE IMPLEMENTAÇÃO**

### **Exemplo 1: Campo de Nome**
```typescript
<input
    type="text"
    value={formData.nome}
    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
    placeholder={getPlaceholderByFieldName('nome')}
    required
/>
```

### **Exemplo 2: Campo de Email**
```typescript
<input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder={getPlaceholderByFieldName('email')}
    required
/>
```

### **Exemplo 3: Campo de CPF com Formatação**
```typescript
<input
    type="text"
    value={formData.cpf}
    onChange={(e) => {
        const cpfFormatado = formatarCPF(e.target.value);
        setFormData({ ...formData, cpf: cpfFormatado });
    }}
    placeholder={getPlaceholderByFieldName('cpf')}
    maxLength={14}
    required
/>
```

### **Exemplo 4: Campo de Data**
```typescript
<input
    type="date"
    value={formData.dataNascimento}
    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
    placeholder={getPlaceholderByFieldName('datanascimento')}
/>
```

### **Exemplo 5: Campo de Número**
```typescript
<input
    type="number"
    value={formData.ano}
    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
    placeholder={getPlaceholderByFieldName('ano')}
    min="1000"
    max={new Date().getFullYear()}
    required
/>
```

## 🎯 **BENEFÍCIOS**

### **✅ PARA O USUÁRIO:**
- **Reduz erros** - Sabe exatamente o que digitar
- **Melhora UX** - Interface mais amigável
- **Acelera preenchimento** - Exemplos claros
- **Padroniza experiência** - Consistência visual

### **✅ PARA O DESENVOLVEDOR:**
- **Código limpo** - Placeholders centralizados
- **Fácil manutenção** - Um local para alterar
- **Reutilização** - Mesmo padrão em todos os formulários
- **Escalabilidade** - Fácil adicionar novos tipos

## 🚀 **PRÓXIMOS PASSOS**

1. **Implementar em todos os formulários** - Seguir os exemplos
2. **Testar a experiência** - Verificar se os placeholders ajudam
3. **Adicionar novos tipos** - Conforme necessário
4. **Coletar feedback** - Melhorar baseado no uso

## 📝 **NOTAS IMPORTANTES**

- **Placeholders são informativos** - Não substituem validação
- **Mantêm formatação automática** - CPF, telefone, etc.
- **São responsivos** - Funcionam em todos os dispositivos
- **São acessíveis** - Seguem padrões de acessibilidade

---

**Implementação completa de placeholders inteligentes para melhorar a UX e reduzir erros!** 🎉
