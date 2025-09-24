import { API_CONFIG } from '../config/api';

export interface UsuarioAtual {
    email: string;
    role: string;
}

class UsuarioAuthService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async getCurrentUser(): Promise<UsuarioAtual> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao obter usuário atual');
        }

        return await response.json();
    }

    async validarToken(): Promise<boolean> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/validar-token`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            return response.ok;
        } catch {
            return false;
        }
    }

    logout(): void {
        localStorage.removeItem('yeti_token');
        localStorage.removeItem('yeti_user');
        window.location.href = '/';
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('yeti_token');
        return !!token;
    }

    getStoredUser(): any {
        const user = localStorage.getItem('yeti_user');
        return user ? JSON.parse(user) : null;
    }
}

export default new UsuarioAuthService();
