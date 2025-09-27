import { API_CONFIG } from '../config/api';
import { API_ROUTES } from '../constants/entities';
import type { Editora, EditoraForm } from '../types/entities';

const EDITORA_ENDPOINTS = {
    LISTAR: API_ROUTES.EDITORAS,
    OBTER: (id: number) => `${API_ROUTES.EDITORAS}/${id}`,
    CRIAR: API_ROUTES.EDITORAS,
    ATUALIZAR: API_ROUTES.EDITORAS,
    EXCLUIR: (id: number) => `${API_ROUTES.EDITORAS}/${id}`,
    ATIVAS: API_ROUTES.EDITORAS_ATIVAS,
    POR_CIDADE: (cidade: string) => `${API_ROUTES.EDITORAS_POR_CIDADE}/${cidade}`,
    POR_ESTADO: (estado: string) => `${API_ROUTES.EDITORAS_POR_ESTADO}/${estado}`,
    BUSCAR: API_ROUTES.EDITORAS_BUSCAR,
    TOGGLE_STATUS: (id: number) => API_ROUTES.EDITORAS_TOGGLE_STATUS.replace('{id}', id.toString())
};

class EditoraService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Listar todas as editoras
    async listar(): Promise<Editora[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.LISTAR}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar editoras: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar editoras:', error);
            throw error;
        }
    }

    async obter(id: number): Promise<Editora> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.OBTER(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao obter editora: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter editora:', error);
            throw error;
        }
    }

    // Criar nova editora
    async criar(editora: EditoraForm): Promise<Editora> {
        try {

            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.CRIAR}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(editora)
            });


            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro response:', errorText);
                throw new Error(`Erro ao criar editora: ${errorText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao criar editora:', error);
            throw error;
        }
    }

    // Atualizar editora
    async atualizar(editora: EditoraForm): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.ATUALIZAR}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(editora)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar editora: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar editora:', error);
            throw error;
        }
    }

    // Excluir editora
    async excluir(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.EXCLUIR(id)}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir editora: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao excluir editora:', error);
            throw error;
        }
    }

    // Alternar status da editora
    async toggleStatus(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.TOGGLE_STATUS(id)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao alternar status da editora: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao alternar status da editora:', error);
            throw error;
        }
    }

    // Buscar editoras
    async buscar(termo: string): Promise<Editora[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.BUSCAR}?termo=${encodeURIComponent(termo)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar editoras: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar editoras:', error);
            throw error;
        }
    }

    // Listar editoras ativas
    async listarAtivas(): Promise<Editora[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.ATIVAS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar editoras ativas: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar editoras ativas:', error);
            throw error;
        }
    }

    // Listar editoras por cidade
    async listarPorCidade(cidade: string): Promise<Editora[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.POR_CIDADE(cidade)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar editoras por cidade: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar editoras por cidade:', error);
            throw error;
        }
    }

    // Listar editoras por estado
    async listarPorEstado(estado: string): Promise<Editora[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EDITORA_ENDPOINTS.POR_ESTADO(estado)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar editoras por estado: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar editoras por estado:', error);
            throw error;
        }
    }
}

export const editoraService = new EditoraService();
