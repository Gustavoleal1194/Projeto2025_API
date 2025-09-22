# 🎨 TEMA YETI LIBRARY SYSTEM - GUIA DE ESTILIZAÇÃO

## 🎯 **CONCEITO VISUAL**

### **Yeti Acadêmico - Biblioteca Misteriosa e Sábia**
- **Personagem Central:** Yeti sábio e amigável
- **Ambiente:** Biblioteca tradicional com elementos naturais
- **Filosofia:** Mistério + Sabedoria + Acolhimento
- **Target:** Usuários que buscam conhecimento e aventura intelectual

---

## 🎨 **PALETA DE CORES**

### **Cores Principais**
```css
:root {
  /* Cores do Yeti */
  --yeti-primary: #2C5F2D;        /* Verde floresta - sabedoria */
  --yeti-secondary: #1E3A8A;      /* Azul profundo - mistério */
  --yeti-accent: #F4E4C1;         /* Bege papel - conhecimento */
  --yeti-snow: #FFFFFF;           /* Branco neve - pureza */
  
  /* Cores da Natureza */
  --mountain-blue: #3B82F6;       /* Azul montanha */
  --forest-green: #059669;        /* Verde floresta */
  --ice-blue: #E0F2FE;            /* Azul gelo */
  --earth-brown: #92400E;          /* Marrom terra */
  
  /* Cores dos Livros */
  --book-red: #DC2626;            /* Vermelho clássico */
  --book-blue: #2563EB;           /* Azul acadêmico */
  --book-green: #16A34A;          /* Verde natural */
  --book-gold: #D97706;           /* Dourado especial */
  
  /* Cores de Status */
  --status-available: #10B981;    /* Verde disponível */
  --status-borrowed: #F59E0B;     /* Amarelo emprestado */
  --status-overdue: #EF4444;      /* Vermelho atrasado */
  --status-reserved: #8B5CF6;     /* Roxo reservado */
}
```

### **Gradientes Temáticos**
```css
/* Gradiente Yeti */
.yeti-gradient {
  background: linear-gradient(135deg, #2C5F2D 0%, #1E3A8A 50%, #F4E4C1 100%);
}

/* Gradiente Montanha */
.mountain-gradient {
  background: linear-gradient(180deg, #E0F2FE 0%, #3B82F6 50%, #1E3A8A 100%);
}

/* Gradiente Floresta */
.forest-gradient {
  background: linear-gradient(135deg, #059669 0%, #2C5F2D 50%, #F4E4C1 100%);
}
```

---

## 🖼️ **SISTEMA DE IMAGENS E ÍCONES**

### **Logo Principal**
```css
.yeti-logo {
  background-image: url('/assets/yeti-logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 200px;
  height: 200px;
}

/* Versão compacta para header */
.yeti-logo-small {
  width: 50px;
  height: 50px;
}
```

### **Ícones Temáticos**
```css
/* Ícones de livros com tema Yeti */
.book-icon {
  background: linear-gradient(45deg, var(--book-red), var(--book-blue));
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Ícones de montanha */
.mountain-icon {
  background: var(--mountain-blue);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* Ícones de neve */
.snow-icon {
  background: var(--yeti-snow);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255,255,255,0.5);
}
```

---

## 🎭 **COMPONENTES TEMÁTICOS**

### **1. Header Yeti**
```css
.yeti-header {
  background: var(--yeti-gradient);
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.yeti-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/mountain-silhouette.svg') bottom center no-repeat;
  opacity: 0.1;
  z-index: 0;
}

.yeti-header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### **2. Estante 3D Yeti**
```css
.yeti-estante-3d {
  perspective: 1200px;
  perspective-origin: center center;
  background: var(--mountain-gradient);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.yeti-estante-3d::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url('/assets/snow-pattern.svg') repeat;
  opacity: 0.05;
  animation: snow-fall 20s linear infinite;
}

@keyframes snow-fall {
  0% { transform: translateY(-100px); }
  100% { transform: translateY(100px); }
}

.yeti-livro-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 
    0 8px 25px rgba(0,0,0,0.15),
    inset 0 1px 0 rgba(255,255,255,0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.yeti-livro-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--yeti-gradient);
}

.yeti-livro-card:hover {
  transform: translateZ(80px) rotateY(10deg) rotateX(-5deg);
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,0.9);
}
```

### **3. Formulários Yeti**
```css
.yeti-form {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255,255,255,0.8);
  border: 1px solid rgba(255,255,255,0.2);
}

.yeti-form-field {
  position: relative;
  margin-bottom: 1.5rem;
}

.yeti-form-field label {
  color: var(--yeti-primary);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: block;
}

.yeti-form-field input,
.yeti-form-field select,
.yeti-form-field textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: rgba(255,255,255,0.8);
  transition: all 0.3s ease;
  font-size: 1rem;
}

.yeti-form-field input:focus,
.yeti-form-field select:focus,
.yeti-form-field textarea:focus {
  outline: none;
  border-color: var(--yeti-primary);
  box-shadow: 0 0 0 3px rgba(44, 95, 45, 0.1);
  background: rgba(255,255,255,1);
}

.yeti-form-field::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--yeti-gradient);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.yeti-form-field:focus-within::after {
  transform: scaleX(1);
}
```

### **4. Botões Yeti**
```css
.yeti-btn {
  background: var(--yeti-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.yeti-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.yeti-btn:hover::before {
  left: 100%;
}

.yeti-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(44, 95, 45, 0.3);
}

.yeti-btn:active {
  transform: translateY(0);
}

/* Variações de botão */
.yeti-btn-secondary {
  background: rgba(255,255,255,0.1);
  border: 2px solid var(--yeti-primary);
  color: var(--yeti-primary);
}

.yeti-btn-danger {
  background: linear-gradient(135deg, #EF4444, #DC2626);
}

.yeti-btn-success {
  background: linear-gradient(135deg, #10B981, #059669);
}
```

---

## 🎨 **ANIMAÇÕES TEMÁTICAS**

### **1. Animação de Neve**
```css
@keyframes snow-fall {
  0% { 
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% { 
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.snowflake {
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: snow-fall 3s linear infinite;
}

.snowflake:nth-child(odd) {
  animation-duration: 4s;
  animation-delay: -1s;
}

.snowflake:nth-child(even) {
  animation-duration: 5s;
  animation-delay: -2s;
}
```

### **2. Animação de Livros**
```css
@keyframes book-flip {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}

.yeti-livro-card:hover {
  animation: book-flip 0.6s ease-in-out;
}
```

### **3. Animação de Montanha**
```css
@keyframes mountain-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% { 
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  }
}

.yeti-mountain {
  animation: mountain-glow 3s ease-in-out infinite;
}
```

---

## 📱 **RESPONSIVIDADE YETI**

### **Mobile (320px - 768px)**
```css
@media (max-width: 768px) {
  .yeti-header {
    padding: 1rem;
  }
  
  .yeti-logo {
    width: 40px;
    height: 40px;
  }
  
  .yeti-estante-3d {
    padding: 1rem;
  }
  
  .yeti-livro-card {
    width: 120px;
    height: 180px;
  }
}
```

### **Tablet (768px - 1024px)**
```css
@media (min-width: 768px) and (max-width: 1024px) {
  .yeti-estante-3d {
    padding: 1.5rem;
  }
  
  .yeti-livro-card {
    width: 150px;
    height: 225px;
  }
}
```

---

## 🎯 **ELEMENTOS TEMÁTICOS**

### **1. Padrões de Fundo**
```css
.yeti-pattern-snow {
  background-image: url('/assets/snow-pattern.svg');
  background-repeat: repeat;
  opacity: 0.1;
}

.yeti-pattern-mountains {
  background-image: url('/assets/mountain-pattern.svg');
  background-repeat: repeat-x;
  background-position: bottom;
  opacity: 0.05;
}

.yeti-pattern-books {
  background-image: url('/assets/book-pattern.svg');
  background-repeat: repeat;
  opacity: 0.03;
}
```

### **2. Efeitos de Vidro**
```css
.yeti-glass {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
}
```

### **3. Sombras Temáticas**
```css
.yeti-shadow-soft {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.yeti-shadow-medium {
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.yeti-shadow-strong {
  box-shadow: 0 15px 50px rgba(0,0,0,0.2);
}
```

---

## 🎨 **SISTEMA DE CORES POR STATUS**

### **Livros**
```css
.status-disponivel {
  background: var(--status-available);
  color: white;
}

.status-emprestado {
  background: var(--status-borrowed);
  color: white;
}

.status-atrasado {
  background: var(--status-overdue);
  color: white;
}

.status-reservado {
  background: var(--status-reserved);
  color: white;
}
```

### **Usuários**
```css
.role-usuario {
  background: var(--mountain-blue);
  color: white;
}

.role-funcionario {
  background: var(--forest-green);
  color: white;
}

.role-admin {
  background: var(--book-red);
  color: white;
}
```

---

## 🎯 **PRÓXIMOS PASSOS**

1. **Aguardando código do Yeti Form** para integração
2. **Criar assets visuais** (SVGs, imagens, ícones)
3. **Implementar tema** nos componentes existentes
4. **Testar responsividade** em todos os dispositivos
5. **Ajustar animações** para performance

---

## 📝 **NOTA IMPORTANTE**

**Aguardando o código do formulário Yeti Form para:**
- ✅ Integrar com nossa documentação
- ✅ Adaptar para o tema Yeti Library System
- ✅ Documentar para uso futuro
- ✅ Criar variações temáticas

**Por favor, envie o código do Yeti Form!** 🚀
