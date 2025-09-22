# 🎨 PALETA DE CORES YETI LIBRARY SYSTEM

## 🎯 **CONCEITO VISUAL BASEADO NA INTERFACE**

Baseado na análise da interface visual, a paleta de cores do **Yeti Library System** combina elementos naturais (montanhas, gelo, floresta) com a tradição acadêmica (livros, madeira, papel).

---

## 🌈 **PALETA COMPLETA DE CORES**

### **1. Azuis Gelados (Yeti & Montanhas)**
```css
:root {
  /* Azuis Gelados - Tema Yeti */
  --yeti-sky-light: #A9D6E5;    /* Azul Céu Claro - Backgrounds suaves */
  --yeti-sky-medium: #6A9AC4;   /* Azul Celeste Suave - Elementos principais */
  --yeti-ice-dark: #34688C;     /* Azul Meia-Noite - Textos e destaques */
  
  /* Aplicações */
  --sidebar-bg: var(--yeti-ice-dark);
  --logo-bg: var(--yeti-sky-light);
  --button-primary: var(--yeti-sky-medium);
  --text-primary: var(--yeti-ice-dark);
}
```

### **2. Verdes Naturais (Sabedoria & Frescor)**
```css
:root {
  /* Verdes Naturais - Sabedoria */
  --forest-sage: #7DAB8B;       /* Verde Sálvia - Acentos e ícones */
  --forest-dark: #4A7D5C;       /* Verde Floresta Escuro - Contraste */
  
  /* Aplicações */
  --accent-green: var(--forest-sage);
  --button-secondary: var(--forest-dark);
  --highlight-bg: var(--forest-sage);
}
```

### **3. Marrons Terrosos (Aconchego & Livros)**
```css
:root {
  /* Marrons Terrosos - Livros e Madeira */
  --book-saddle: #8B4513;       /* Marrom Sela - Capas de livros */
  --paper-beige: #D2B48C;       /* Bege Claro - Backgrounds de papel */
  --wood-dark: #4F3A2C;         /* Marrom Café - Textos escuros */
  
  /* Aplicações */
  --bookshelf-wood: var(--book-saddle);
  --card-bg: var(--paper-beige);
  --text-dark: var(--wood-dark);
}
```

### **4. Neutros (Base & Contraste)**
```css
:root {
  /* Neutros - Base da Interface */
  --ice-white: #F8F8F8;         /* Branco Gelo - Background principal */
  --charcoal: #333333;          /* Cinza Carvão - Texto principal */
  
  /* Aplicações */
  --main-bg: var(--ice-white);
  --text-main: var(--charcoal);
  --card-border: var(--charcoal);
}
```

---

## 🏗️ **APLICAÇÃO DA PALETA NA INTERFACE**

### **1. Sidebar (Navegação Lateral)**
```css
.yeti-sidebar {
  background: var(--yeti-ice-dark);  /* #34688C */
  color: var(--ice-white);           /* #F8F8F8 */
  border-right: 3px solid var(--forest-dark); /* #4A7D5C */
}

.yeti-logo {
  background: var(--yeti-sky-light); /* #A9D6E5 */
  border: 2px solid var(--yeti-sky-medium); /* #6A9AC4 */
}

.nav-item.active {
  background: var(--paper-beige);    /* #D2B48C */
  color: var(--wood-dark);           /* #4F3A2C */
}
```

### **2. Estante de Livros 3D**
```css
.yeti-bookshelf {
  background: var(--book-saddle);    /* #8B4513 */
  border-radius: 12px;
  box-shadow: 
    0 8px 25px rgba(139, 69, 19, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.yeti-book {
  background: linear-gradient(135deg, var(--forest-sage), var(--yeti-sky-medium));
  border: 1px solid var(--wood-dark);
  transition: all 0.3s ease;
}

.yeti-book:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}
```

### **3. Cards de Livros**
```css
.yeti-book-card {
  background: var(--ice-white);      /* #F8F8F8 */
  border: 2px solid var(--forest-sage); /* #7DAB8B */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.yeti-book-card .title {
  color: var(--wood-dark);          /* #4F3A2C */
  font-weight: 600;
}

.yeti-book-card .button {
  background: var(--forest-dark);   /* #4A7D5C */
  color: var(--ice-white);
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
}
```

### **4. Barra de Busca**
```css
.yeti-search-bar {
  background: var(--ice-white);     /* #F8F8F8 */
  border: 2px solid var(--yeti-sky-medium); /* #6A9AC4 */
  border-radius: 25px;
  color: var(--charcoal);           /* #333333 */
}

.yeti-search-bar:focus {
  border-color: var(--forest-sage); /* #7DAB8B */
  box-shadow: 0 0 0 3px rgba(125, 171, 139, 0.1);
}
```

---

## 🎨 **SISTEMA DE CORES POR CONTEXTO**

### **1. Cores Primárias (Layout Principal)**
```css
/* Layout Principal */
--primary-bg: var(--ice-white);           /* #F8F8F8 */
--primary-text: var(--charcoal);          /* #333333 */
--primary-accent: var(--yeti-ice-dark);   /* #34688C */
--primary-border: var(--yeti-sky-medium); /* #6A9AC4 */
```

### **2. Cores Secundárias (Elementos de Interface)**
```css
/* Elementos de Interface */
--secondary-bg: var(--paper-beige);       /* #D2B48C */
--secondary-text: var(--wood-dark);       /* #4F3A2C */
--secondary-accent: var(--forest-sage);   /* #7DAB8B */
--secondary-border: var(--forest-dark);   /* #4A7D5C */
```

### **3. Cores de Ação (Botões e Links)**
```css
/* Ações e Interações */
--action-primary: var(--yeti-sky-medium); /* #6A9AC4 */
--action-secondary: var(--forest-dark);   /* #4A7D5C */
--action-success: var(--forest-sage);     /* #7DAB8B */
--action-warning: var(--book-saddle);     /* #8B4513 */
--action-danger: #DC2626;                 /* Vermelho para erros */
```

### **4. Cores de Status (Livros e Empréstimos)**
```css
/* Status de Livros */
--status-available: var(--forest-sage);   /* #7DAB8B - Disponível */
--status-borrowed: var(--book-saddle);    /* #8B4513 - Emprestado */
--status-reserved: var(--yeti-sky-medium); /* #6A9AC4 - Reservado */
--status-overdue: #DC2626;                /* Vermelho - Atrasado */
```

---

## 🎯 **IMPLEMENTAÇÃO CSS COMPLETA**

### **Variáveis CSS Globais**
```css
:root {
  /* === AZUIS GELADOS === */
  --yeti-sky-light: #A9D6E5;
  --yeti-sky-medium: #6A9AC4;
  --yeti-ice-dark: #34688C;
  
  /* === VERDES NATURAIS === */
  --forest-sage: #7DAB8B;
  --forest-dark: #4A7D5C;
  
  /* === MARRONS TERROSOS === */
  --book-saddle: #8B4513;
  --paper-beige: #D2B48C;
  --wood-dark: #4F3A2C;
  
  /* === NEUTROS === */
  --ice-white: #F8F8F8;
  --charcoal: #333333;
  
  /* === APLICAÇÕES ESPECÍFICAS === */
  --sidebar-bg: var(--yeti-ice-dark);
  --main-bg: var(--ice-white);
  --bookshelf-wood: var(--book-saddle);
  --text-primary: var(--charcoal);
  --text-secondary: var(--wood-dark);
  --accent-color: var(--forest-sage);
  --button-primary: var(--yeti-sky-medium);
  --button-secondary: var(--forest-dark);
}
```

### **Classes Utilitárias**
```css
/* Backgrounds */
.bg-yeti-sky { background-color: var(--yeti-sky-light); }
.bg-yeti-ice { background-color: var(--yeti-ice-dark); }
.bg-forest-sage { background-color: var(--forest-sage); }
.bg-forest-dark { background-color: var(--forest-dark); }
.bg-book-saddle { background-color: var(--book-saddle); }
.bg-paper-beige { background-color: var(--paper-beige); }
.bg-ice-white { background-color: var(--ice-white); }

/* Textos */
.text-yeti-ice { color: var(--yeti-ice-dark); }
.text-forest-sage { color: var(--forest-sage); }
.text-wood-dark { color: var(--wood-dark); }
.text-charcoal { color: var(--charcoal); }

/* Bordas */
.border-yeti-sky { border-color: var(--yeti-sky-medium); }
.border-forest-sage { border-color: var(--forest-sage); }
.border-book-saddle { border-color: var(--book-saddle); }
```

---

## 🎨 **GRADIENTES TEMÁTICOS**

### **Gradientes Yeti**
```css
/* Gradiente Montanha */
.yeti-mountain-gradient {
  background: linear-gradient(135deg, var(--yeti-sky-light) 0%, var(--yeti-sky-medium) 50%, var(--yeti-ice-dark) 100%);
}

/* Gradiente Floresta */
.yeti-forest-gradient {
  background: linear-gradient(135deg, var(--forest-sage) 0%, var(--forest-dark) 100%);
}

/* Gradiente Livro */
.yeti-book-gradient {
  background: linear-gradient(135deg, var(--book-saddle) 0%, var(--paper-beige) 100%);
}

/* Gradiente Yeti Completo */
.yeti-complete-gradient {
  background: linear-gradient(135deg, var(--yeti-sky-light) 0%, var(--forest-sage) 50%, var(--book-saddle) 100%);
}
```

---

## 🎯 **APLICAÇÃO NA HOMEPAGE**

### **Estrutura Visual da Homepage**
```css
.yeti-homepage {
  background: var(--ice-white);
  min-height: 100vh;
}

.yeti-sidebar {
  background: var(--yeti-ice-dark);
  width: 280px;
  color: var(--ice-white);
}

.yeti-main-content {
  background: var(--ice-white);
  flex: 1;
}

.yeti-bookshelf-container {
  background: var(--book-saddle);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem;
}

.yeti-search-bar {
  background: var(--ice-white);
  border: 2px solid var(--yeti-sky-medium);
  border-radius: 25px;
  padding: 12px 24px;
  color: var(--charcoal);
}

.yeti-book-card {
  background: var(--ice-white);
  border: 2px solid var(--forest-sage);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

---

## 🎨 **RESUMO DA PALETA**

### **Cores Principais:**
- ✅ **#F8F8F8** - Branco Gelo (Background principal)
- ✅ **#34688C** - Azul Meia-Noite (Sidebar)
- ✅ **#6A9AC4** - Azul Celeste Suave (Botões primários)
- ✅ **#7DAB8B** - Verde Sálvia (Acentos)
- ✅ **#8B4513** - Marrom Sela (Estante de livros)
- ✅ **#333333** - Cinza Carvão (Textos)

### **Aplicação Visual:**
- ✅ **Sidebar** - Azul Meia-Noite com logo em Azul Céu Claro
- ✅ **Estante** - Marrom Sela com livros coloridos
- ✅ **Cards** - Branco Gelo com bordas Verde Sálvia
- ✅ **Busca** - Branco Gelo com bordas Azul Celeste
- ✅ **Textos** - Cinza Carvão para legibilidade

**A paleta está perfeitamente alinhada com o conceito Yeti Acadêmico e a interface visual!** 🎯
