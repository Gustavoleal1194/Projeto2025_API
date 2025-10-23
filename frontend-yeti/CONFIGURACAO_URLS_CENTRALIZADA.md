# Configuração Centralizada de URLs - Yeti Library System

## Visão Geral

Este sistema implementa uma configuração centralizada para todas as URLs do backend e frontend, eliminando a repetição de URLs hardcoded no código e facilitando mudanças de ambiente.

## Arquivos Principais

### 1. `src/config/api.ts`
Arquivo principal de configuração que centraliza todas as URLs e configurações da API.

**Principais funcionalidades:**
- Configuração automática por ambiente (development, production, test)
- URLs centralizadas para backend e frontend
- Headers padrão
- Configurações de autenticação
- Funções utilitárias para construção de URLs

### 2. `env.example`
Arquivo de exemplo para variáveis de ambiente. Copie para `.env` e configure conforme necessário.

## Como Usar

### Importação Básica
```typescript
import { API_CONFIG, buildApiUrl, getAuthHeaders } from '../config/api';
```

### Construção de URLs
```typescript
// Para endpoints que começam com /api
const url = buildApiUrl('/api/Usuario');

// Para URLs completas
const fullUrl = buildApiUrl('http://exemplo.com/api');
```

### Headers de Autenticação
```typescript
// Usar headers padrão com autenticação
const headers = getAuthHeaders();

// Usar em fetch
const response = await fetch(buildApiUrl('/api/Usuario'), {
    method: 'GET',
    headers: getAuthHeaders()
});
```

### Configuração por Ambiente

#### Desenvolvimento
```typescript
// URLs padrão para desenvolvimento
BACKEND: 'http://localhost:5072'
FRONTEND: 'http://localhost:5173'
API_BASE: 'http://localhost:5072/api'
```

#### Produção
```typescript
// URLs configuráveis via variáveis de ambiente
BACKEND: process.env.VITE_BACKEND_URL || 'https://api.yetilibrary.com'
FRONTEND: process.env.VITE_FRONTEND_URL || 'https://yetilibrary.com'
API_BASE: process.env.VITE_API_URL || 'https://api.yetilibrary.com/api'
```

## Variáveis de Ambiente

Configure no arquivo `.env`:

```env
# URLs do Backend
VITE_BACKEND_URL=http://localhost:5072
VITE_API_URL=http://localhost:5072/api

# URLs do Frontend
VITE_FRONTEND_URL=http://localhost:5173

# Ambiente
VITE_NODE_ENV=development
```

## Migração de Código Antigo

### Antes (URLs hardcoded)
```typescript
const response = await fetch('http://localhost:5072/api/Usuario', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

### Depois (URLs centralizadas)
```typescript
const response = await fetch(buildApiUrl('/api/Usuario'), {
    headers: getAuthHeaders()
});
```

## Benefícios

1. **Manutenibilidade**: Mudanças de URL em um só lugar
2. **Flexibilidade**: Diferentes configurações por ambiente
3. **Consistência**: Headers e configurações padronizadas
4. **Segurança**: Configurações sensíveis via variáveis de ambiente
5. **Produtividade**: Menos código repetitivo

## Estrutura da Configuração

```typescript
export const API_CONFIG = {
    // URLs principais
    BASE_URL: 'http://localhost:5072',
    API_BASE_URL: 'http://localhost:5072/api',
    FRONTEND_URL: 'http://localhost:5173',
    
    // Configurações
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    
    // Headers padrão
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Autenticação
    AUTH: {
        TOKEN_KEY: 'yeti_token',
        USER_KEY: 'yeti_user',
        REFRESH_TOKEN_KEY: 'yeti_refresh_token'
    }
};
```

## Funções Utilitárias

### `buildApiUrl(endpoint: string)`
Constrói URLs completas baseadas no endpoint fornecido.

### `getAuthHeaders()`
Retorna headers padrão com autenticação incluída.

### `isDevelopment()` / `isProduction()`
Verificam o ambiente atual.

## Exemplos de Uso

### Service Layer
```typescript
import { buildApiUrl, getAuthHeaders } from '../config/api';

class UsuarioService {
    async obterUsuarios() {
        const response = await fetch(buildApiUrl('/api/Usuario'), {
            headers: getAuthHeaders()
        });
        return response.json();
    }
}
```

### Componente React
```typescript
import { API_CONFIG, buildApiUrl, getAuthHeaders } from '../config/api';

const MeuComponente = () => {
    const [dados, setDados] = useState([]);
    
    useEffect(() => {
        const carregarDados = async () => {
            const response = await fetch(buildApiUrl('/api/MeusDados'), {
                headers: getAuthHeaders()
            });
            const dados = await response.json();
            setDados(dados);
        };
        
        carregarDados();
    }, []);
    
    return <div>{/* render */}</div>;
};
```

## Troubleshooting

### Problema: URLs não estão sendo aplicadas
**Solução**: Verifique se o arquivo `.env` está na raiz do projeto e se as variáveis estão corretas.

### Problema: Headers de autenticação não funcionam
**Solução**: Verifique se o token está sendo salvo com a chave correta (`yeti_token`).

### Problema: Ambiente não detectado corretamente
**Solução**: Verifique se `import.meta.env.MODE` está configurado corretamente no Vite.

## Conclusão

Esta configuração centralizada elimina a repetição de URLs no código, facilita mudanças de ambiente e melhora a manutenibilidade do projeto. Sempre use as funções utilitárias em vez de URLs hardcoded.

