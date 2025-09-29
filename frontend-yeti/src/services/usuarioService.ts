import { API_CONFIG } from '../config/api';
import { API_ROUTES } from '../constants/entities';
import type { Usuario, UsuarioDTO } from '../types/entities';

const USUARIO_ENDPOINTS = {
    LISTAR: API_ROUTES.USUARIOS,
    OBTER: (id: number) => `${API_ROUTES.USUARIOS}/${id}`,
    CRIAR: API_ROUTES.USUARIOS,
    ATUALIZAR: (id: number) => `${API_ROUTES.USUARIOS}/${id}`,
    EXCLUIR: (id: number) => `${API_ROUTES.USUARIOS}/${id}`,
    POR_NOME: (nome: string) => `${API_ROUTES.USUARIOS_POR_NOME}/${nome}`,
    POR_CPF: (cpf: string) => `${API_ROUTES.USUARIOS_POR_CPF}/${cpf}`,
    TOGGLE_STATUS: (id: number) => API_ROUTES.USUARIOS_TOGGLE_STATUS.replace('{id}', id.toString())
};

class UsuarioService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Listar todos os usuários
    async listar(): Promise<Usuario[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${USUARIO_ENDPOINTS.LISTAR}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar usuários: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    }

    // Obter usuário por ID
    async obter(id: number): Promise<Usuario> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${USUARIO_ENDPOINTS.OBTER(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao obter usuário: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            throw error;
        }
    }

    // Criar novo usuário
    async criar(usuario: UsuarioDTO): Promise<Usuario> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${USUARIO_ENDPOINTS.CRIAR}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao criar usuário: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    // Atualizar usuário
    async atualizar(usuario: UsuarioDTO): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${USUARIO_ENDPOINTS.ATUALIZAR(usuario.id!)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar usuário: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    // Excluir usuário
    async excluir(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${USUARIO_ENDPOINTS.EXCLUIR(id)}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir usuário: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            throw error;
        }
    }

    // Buscar usuários por nome
    async buscarPorNome(nome: string): Promise<Usuario[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${USUARIO_ENDPOINTS.POR_NOME(nome)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar usuários por nome: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar usuários por nome:', error);
            throw error;
        }
    }

    // Buscar usuário por CPF
    async buscarPorCpf(cpf: string): Promise<Usuario> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${USUARIO_ENDPOINTS.POR_CPF(cpf)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar usuário por CPF: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar usuário por CPF:', error);
            throw error;
        }
    }

    // Toggle status do usuário (Ativar/Desativar)
    async toggleStatus(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${USUARIO_ENDPOINTS.TOGGLE_STATUS(id)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao alterar status do usuário: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao alterar status do usuário:', error);
            throw error;
        }
    }
}

export const usuarioService = new UsuarioService();
