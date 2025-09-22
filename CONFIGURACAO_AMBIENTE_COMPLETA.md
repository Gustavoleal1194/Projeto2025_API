# ⚙️ CONFIGURAÇÃO DE AMBIENTE COMPLETA - YETI LIBRARY SYSTEM

## 🎯 **CONFIGURAÇÃO INICIAL DO PROJETO**

### **1. package.json Completo**
```json
{
  "name": "yeti-library-system",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "@tanstack/react-query": "^4.35.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "framer-motion": "^10.16.0",
    "axios": "^1.5.0",
    "fuse.js": "^6.6.0",
    "lucide-react": "^0.263.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.6.0",
    "jest-environment-jsdom": "^29.6.0",
    "@types/jest": "^29.5.3",
    "ts-jest": "^29.1.0"
  }
}
```

### **2. tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/store/*": ["./src/store/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### **3. tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azuis Gelados (Yeti & Montanhas)
        'yeti-sky-light': '#A9D6E5',
        'yeti-sky-medium': '#6A9AC4',
        'yeti-ice-dark': '#34688C',
        
        // Verdes Naturais (Sabedoria & Frescor)
        'forest-sage': '#7DAB8B',
        'forest-dark': '#4A7D5C',
        
        // Marrons Terrosos (Aconchego & Livros)
        'book-saddle': '#8B4513',
        'paper-beige': '#D2B48C',
        'wood-dark': '#4F3A2C',
        
        // Neutros (Base & Contraste)
        'ice-white': '#F8F8F8',
        'charcoal': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'snow-fall': 'snowFall 20s linear infinite',
        'book-flip': 'bookFlip 0.6s ease-in-out',
        'mountain-glow': 'mountainGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        snowFall: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        bookFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        mountainGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
      },
      backgroundImage: {
        'yeti-gradient': 'linear-gradient(135deg, #2C5F2D 0%, #1E3A8A 50%, #F4E4C1 100%)',
        'mountain-gradient': 'linear-gradient(180deg, #E0F2FE 0%, #3B82F6 50%, #1E3A8A 100%)',
        'forest-gradient': 'linear-gradient(135deg, #059669 0%, #2C5F2D 50%, #F4E4C1 100%)',
        'book-gradient': 'linear-gradient(135deg, #8B4513 0%, #D2B48C 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### **4. vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5072',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion'],
          forms: ['react-hook-form', 'zod'],
          state: ['zustand', '@tanstack/react-query'],
        },
      },
    },
  },
});
```

### **5. .env.example**
```env
# API Configuration
VITE_API_URL=http://localhost:5072
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Yeti Library System
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_DATA=false

# External Services
VITE_SENTRY_DSN=
VITE_GOOGLE_ANALYTICS_ID=
```

### **6. .eslintrc.json**
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react-refresh"],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### **7. .prettierrc**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### **8. jest.config.js**
```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/assets/(.*)$': '<rootDir>/src/assets/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## 🎯 **CONFIGURAÇÃO COMPLETA**

### **✅ O que está incluído:**
- ✅ **package.json** com todas as dependências
- ✅ **tsconfig.json** com paths configurados
- ✅ **tailwind.config.js** com tema Yeti
- ✅ **vite.config.ts** com proxy para API
- ✅ **.env.example** com variáveis de ambiente
- ✅ **ESLint** e **Prettier** configurados
- ✅ **Jest** configurado para testes
- ✅ **Scripts** de desenvolvimento prontos

### **🚀 Próximos passos:**
1. **Criar hooks e utilitários**
2. **Criar contextos e providers**
3. **Criar configuração de rotas**
4. **Criar configuração de testes**

**Agora a configuração de ambiente está 100% completa!** 🎯
