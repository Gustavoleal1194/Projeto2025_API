/**
 * CONFIGURAÇÃO GLOBAL DA API - YETI LIBRARY SYSTEM
 * Centraliza todas as URLs para facilitar manutenção e mudanças de ambiente
 */

// Configurações de ambiente
const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
} as const;

// URLs base por ambiente
const ENVIRONMENT_URLS = {
    [ENV.DEVELOPMENT]: {
        BACKEND: 'http://localhost:5072',
        FRONTEND: 'http://localhost:5173',
        API_BASE: 'http://localhost:5072/api'
    },
    [ENV.PRODUCTION]: {
        BACKEND: import.meta.env.VITE_BACKEND_URL || 'https://api.yetilibrary.com',
        FRONTEND: import.meta.env.VITE_FRONTEND_URL || 'https://yetilibrary.com',
        API_BASE: import.meta.env.VITE_API_URL || 'https://api.yetilibrary.com/api'
    },
    [ENV.TEST]: {
        BACKEND: 'http://localhost:5072',
        FRONTEND: 'http://localhost:5173',
        API_BASE: 'http://localhost:5072/api'
    }
} as const;

// Detectar ambiente atual
const getCurrentEnvironment = (): keyof typeof ENVIRONMENT_URLS => {
    if (import.meta.env.MODE === 'production') return ENV.PRODUCTION;
    if (import.meta.env.MODE === 'test') return ENV.TEST;
    return ENV.DEVELOPMENT;
};

// Configuração atual baseada no ambiente
const currentEnv = getCurrentEnvironment();
const currentConfig = ENVIRONMENT_URLS[currentEnv];

/**
 * Configuração principal da API
 */
export const API_CONFIG = {
    // URLs principais
    BASE_URL: currentConfig.BACKEND,
    API_BASE_URL: currentConfig.API_BASE,
    FRONTEND_URL: currentConfig.FRONTEND,

    // Configurações de timeout e retry
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,

    // Headers padrão
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },

    // Configurações de autenticação
    AUTH: {
        TOKEN_KEY: 'yeti_token',
        USER_KEY: 'yeti_user',
        REFRESH_TOKEN_KEY: 'yeti_refresh_token'
    },

    // Endpoints principais (sem a URL base)
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/auth/login',
            LOGOUT: '/api/auth/logout',
            REFRESH: '/api/auth/refresh',
            ME: '/api/auth/me'
        },
        DASHBOARD: {
            RESUMO: '/api/Dashboard/resumo-geral',
            ESTATISTICAS: '/api/Dashboard/estatisticas-emprestimos',
            ALERTAS: '/api/Dashboard/alertas'
        }
    }
} as const;

/**
 * Função para construir URLs completas
 */
export const buildApiUrl = (endpoint: string): string => {
    // Se o endpoint já começa com http, retorna como está
    if (endpoint.startsWith('http')) {
        return endpoint;
    }

    // Se o endpoint começa com /api, adiciona apenas a BASE_URL
    if (endpoint.startsWith('/api')) {
        return `${API_CONFIG.BASE_URL}${endpoint}`;
    }

    // Caso contrário, usa a API_BASE_URL completa
    return `${API_CONFIG.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

/**
 * Função para obter headers de autenticação
 */
export const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
    return {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Função para verificar se está em ambiente de desenvolvimento
 */
export const isDevelopment = (): boolean => {
    return currentEnv === ENV.DEVELOPMENT;
};

/**
 * Função para verificar se está em ambiente de produção
 */
export const isProduction = (): boolean => {
    return currentEnv === ENV.PRODUCTION;
};

export default API_CONFIG;
