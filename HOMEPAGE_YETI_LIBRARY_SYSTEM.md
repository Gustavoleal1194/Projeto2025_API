# 🏠 HOMEPAGE YETI LIBRARY SYSTEM - ESPECIFICAÇÃO VISUAL

## 🎯 **ANÁLISE DA INTERFACE VISUAL**

Baseado na análise da imagem, a homepage do **Yeti Library System** apresenta um design moderno e acolhedor que combina elementos naturais com funcionalidade acadêmica.

---

## 🏗️ **ESTRUTURA DA HOMEPAGE**

### **Layout Principal**
```
┌─────────────────────────────────────────────────────────┐
│                    BARRA SUPERIOR                       │
│  [🔍 Buscar na estante...]              [👤 Perfil]    │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│   SIDEBAR   │              ÁREA PRINCIPAL               │
│             │                                           │
│   [🦍]      │        ┌─────────────────────────┐        │
│   YETI      │        │                         │        │
│   LIBRARY   │        │      ESTANTE 3D         │        │
│   SYSTEM    │        │                         │        │
│             │        │    📚 📚 📚 📚 📚      │        │
│   Dashboard │        │    📚 📚 📚 📚 📚      │        │
│   Explorar  │        │    📚 📚 📚 📚 📚      │        │
│   Livros    │        │    📚 📚 📚 📚 📚      │        │
│   Meus      │        │    📚 📚 📚 📚 📚      │        │
│   Empréstimos│       │                         │        │
│             │        └─────────────────────────┘        │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

---

## 🎨 **COMPONENTES DA HOMEPAGE**

### **1. Sidebar de Navegação**
```css
.yeti-sidebar {
  width: 280px;
  height: 100vh;
  background: var(--yeti-ice-dark); /* #34688C */
  color: var(--ice-white); /* #F8F8F8 */
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.yeti-logo-container {
  padding: 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--yeti-sky-medium);
}

.yeti-logo {
  width: 80px;
  height: 80px;
  background: var(--yeti-sky-light); /* #A9D6E5 */
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--yeti-sky-medium);
}

.yeti-logo svg {
  width: 50px;
  height: 50px;
}

.yeti-system-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ice-white);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.yeti-navigation {
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: var(--ice-white);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: var(--forest-sage);
}

.nav-item.active {
  background: var(--paper-beige); /* #D2B48C */
  color: var(--wood-dark); /* #4F3A2C */
  border-left-color: var(--forest-dark);
}

.nav-item svg {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}
```

### **2. Barra Superior**
```css
.yeti-top-bar {
  height: 70px;
  background: var(--ice-white); /* #F8F8F8 */
  border-bottom: 1px solid var(--yeti-sky-medium);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  margin-left: 280px;
  position: fixed;
  top: 0;
  right: 0;
  left: 280px;
  z-index: 999;
}

.yeti-search-container {
  flex: 1;
  max-width: 500px;
  position: relative;
}

.yeti-search-bar {
  width: 100%;
  height: 45px;
  background: var(--ice-white);
  border: 2px solid var(--yeti-sky-medium);
  border-radius: 25px;
  padding: 0 20px 0 50px;
  font-size: 1rem;
  color: var(--charcoal);
  transition: all 0.3s ease;
}

.yeti-search-bar:focus {
  outline: none;
  border-color: var(--forest-sage);
  box-shadow: 0 0 0 3px rgba(125, 171, 139, 0.1);
}

.yeti-search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--yeti-sky-medium);
  width: 20px;
  height: 20px;
}

.yeti-user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.yeti-user-profile:hover {
  background: var(--yeti-sky-light);
}

.yeti-user-avatar {
  width: 40px;
  height: 40px;
  background: var(--forest-sage);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ice-white);
  font-weight: 600;
}
```

### **3. Área Principal - Estante 3D**
```css
.yeti-main-content {
  margin-left: 280px;
  margin-top: 70px;
  padding: 2rem;
  background: var(--ice-white);
  min-height: calc(100vh - 70px);
}

.yeti-bookshelf-container {
  background: var(--book-saddle); /* #8B4513 */
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 
    0 10px 30px rgba(139, 69, 19, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.yeti-bookshelf-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/wood-texture.svg') repeat;
  opacity: 0.1;
  pointer-events: none;
}

.yeti-bookshelf-title {
  color: var(--ice-white);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.yeti-books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  perspective: 1000px;
}

.yeti-book {
  background: linear-gradient(135deg, var(--forest-sage), var(--yeti-sky-medium));
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: var(--ice-white);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;
}

.yeti-book::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--yeti-sky-light);
}

.yeti-book:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.yeti-book-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.yeti-book-author {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.yeti-book-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.yeti-book-status.available {
  background: var(--forest-sage);
  color: var(--ice-white);
}

.yeti-book-status.borrowed {
  background: var(--book-saddle);
  color: var(--ice-white);
}

.yeti-book-status.reserved {
  background: var(--yeti-sky-medium);
  color: var(--ice-white);
}
```

### **4. Card de Livro (Hover)**
```css
.yeti-book-card {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ice-white);
  border: 2px solid var(--forest-sage);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  text-align: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 100;
}

.yeti-book:hover .yeti-book-card {
  opacity: 1;
  bottom: -120px;
}

.yeti-book-card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--wood-dark);
  margin-bottom: 0.5rem;
}

.yeti-book-card-author {
  font-size: 1rem;
  color: var(--charcoal);
  margin-bottom: 0.5rem;
}

.yeti-book-card-description {
  font-size: 0.9rem;
  color: var(--charcoal);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.yeti-book-card-button {
  background: var(--forest-dark);
  color: var(--ice-white);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.yeti-book-card-button:hover {
  background: var(--forest-sage);
}
```

---

## 📱 **RESPONSIVIDADE**

### **Tablet (768px - 1024px)**
```css
@media (max-width: 1024px) {
  .yeti-sidebar {
    width: 240px;
  }
  
  .yeti-main-content {
    margin-left: 240px;
  }
  
  .yeti-top-bar {
    left: 240px;
  }
  
  .yeti-books-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
}
```

### **Mobile (320px - 768px)**
```css
@media (max-width: 768px) {
  .yeti-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .yeti-sidebar.open {
    transform: translateX(0);
  }
  
  .yeti-main-content {
    margin-left: 0;
  }
  
  .yeti-top-bar {
    left: 0;
  }
  
  .yeti-books-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.8rem;
  }
  
  .yeti-book-card {
    min-width: 200px;
    padding: 1rem;
  }
}
```

---

## 🎯 **FUNCIONALIDADES DA HOMEPAGE**

### **1. Navegação**
- ✅ **Sidebar fixa** com logo do Yeti
- ✅ **Menu de navegação** com ícones
- ✅ **Indicador de página ativa**
- ✅ **Hover effects** suaves

### **2. Busca**
- ✅ **Barra de busca** na parte superior
- ✅ **Ícone de busca** integrado
- ✅ **Placeholder** "Buscar na estante..."
- ✅ **Focus states** com cores temáticas

### **3. Estante 3D**
- ✅ **Grid responsivo** de livros
- ✅ **Efeitos 3D** no hover
- ✅ **Cards de informação** que aparecem
- ✅ **Status dos livros** coloridos

### **4. Interatividade**
- ✅ **Hover effects** nos livros
- ✅ **Transições suaves** com CSS
- ✅ **Feedback visual** imediato
- ✅ **Cards informativos** no hover

---

## 🎨 **PALETA APLICADA**

### **Cores Principais:**
- ✅ **Sidebar:** #34688C (Azul Meia-Noite)
- ✅ **Background:** #F8F8F8 (Branco Gelo)
- ✅ **Estante:** #8B4513 (Marrom Sela)
- ✅ **Acentos:** #7DAB8B (Verde Sálvia)
- ✅ **Textos:** #333333 (Cinza Carvão)

### **Elementos Visuais:**
- ✅ **Logo:** Círculo azul claro com Yeti
- ✅ **Livros:** Gradientes coloridos
- ✅ **Cards:** Fundo branco com bordas verdes
- ✅ **Botões:** Verde escuro com hover

---

## 🚀 **IMPLEMENTAÇÃO**

### **Estrutura HTML**
```html
<div class="yeti-homepage">
  <!-- Sidebar -->
  <aside class="yeti-sidebar">
    <div class="yeti-logo-container">
      <div class="yeti-logo">
        <!-- SVG do Yeti -->
      </div>
      <h1 class="yeti-system-title">YETI LIBRARY SYSTEM</h1>
    </div>
    <nav class="yeti-navigation">
      <!-- Itens de navegação -->
    </nav>
  </aside>

  <!-- Barra Superior -->
  <header class="yeti-top-bar">
    <div class="yeti-search-container">
      <svg class="yeti-search-icon"><!-- Ícone de busca --></svg>
      <input class="yeti-search-bar" placeholder="Buscar na estante...">
    </div>
    <div class="yeti-user-profile">
      <div class="yeti-user-avatar">U</div>
    </div>
  </header>

  <!-- Conteúdo Principal -->
  <main class="yeti-main-content">
    <div class="yeti-bookshelf-container">
      <h2 class="yeti-bookshelf-title">Estante Virtual</h2>
      <div class="yeti-books-grid">
        <!-- Livros da estante -->
      </div>
    </div>
  </main>
</div>
```

**A homepage está completamente especificada e pronta para implementação!** 🎯
