export interface LoginRequest {
    email: string;
    senha: string;
    tipoUsuario: 'Usuario' | 'Funcionario';
}

export interface RegisterRequest {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    tipoUsuario: 'Usuario' | 'Funcionario';
}

export interface TokenResponse {
    token: string;
    refreshToken: string;
    expiresIn: number;
}

export interface User {
    id: string;
    nome: string;
    email: string;
    tipoUsuario: 'Usuario' | 'Funcionario';
    ativo: boolean;
    dataCriacao: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}
