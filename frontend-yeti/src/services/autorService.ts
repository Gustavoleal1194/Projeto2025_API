import { API_CONFIG } from '../config/api';
import { API_ROUTES } from '../constants/entities';
import type { Autor, AutorForm } from '../types/entities';

const AUTOR_ENDPOINTS = {
    LISTAR: API_ROUTES.AUTORES,
    OBTER: (id: number) => `${API_ROUTES.AUTORES}/${id}`,
    CRIAR: API_ROUTES.AUTORES,
    ATUALIZAR: API_ROUTES.AUTORES,
    EXCLUIR: (id: number) => `${API_ROUTES.AUTORES}/${id}`,
    POR_NACIONALIDADE: (nacionalidade: string) => `${API_ROUTES.AUTORES_POR_NACIONALIDADE}/${nacionalidade}`,
    BUSCAR: API_ROUTES.AUTORES_BUSCAR,
    COM_LIVROS: API_ROUTES.AUTORES_COM_LIVROS,
    TOGGLE_STATUS: (id: number) => API_ROUTES.AUTORES_TOGGLE_STATUS.replace('{id}', id.toString())
};

class AutorService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Listar todos os autores
    async listar(): Promise<Autor[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.LISTAR}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar autores: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar autores:', error);
            throw error;
        }
    }

    async obter(id: number): Promise<Autor> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.OBTER(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao obter autor: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter autor:', error);
            throw error;
        }
    }

    // Criar novo autor
    async criar(autor: AutorForm): Promise<Autor> {
        try {
            console.log('Enviando dados para criar autor:', autor);
            console.log('URL:', `${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.CRIAR}`);
            console.log('Headers:', this.getAuthHeaders());

            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.CRIAR}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(autor)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro response:', errorText);
                throw new Error(`Erro ao criar autor: ${errorText}`);
            }

            const result = await response.json();
            console.log('Autor criado com sucesso:', result);
            return result;
        } catch (error) {
            console.error('Erro ao criar autor:', error);
            throw error;
        }
    }

    // Atualizar autor
    async atualizar(autor: AutorForm): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.ATUALIZAR}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(autor)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar autor: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar autor:', error);
            throw error;
        }
    }

    // Excluir autor
    async excluir(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.EXCLUIR(id)}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir autor: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao excluir autor:', error);
            throw error;
        }
    }

    // Alternar status do autor
    async toggleStatus(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.TOGGLE_STATUS(id)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao alternar status do autor: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao alternar status do autor:', error);
            throw error;
        }
    }

    // Buscar autores
    async buscar(termo: string): Promise<Autor[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.BUSCAR}?termo=${encodeURIComponent(termo)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar autores: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar autores:', error);
            throw error;
        }
    }

    // Listar autores por nacionalidade
    async listarPorNacionalidade(nacionalidade: string): Promise<Autor[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.POR_NACIONALIDADE(nacionalidade)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar autores por nacionalidade: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar autores por nacionalidade:', error);
            throw error;
        }
    }

    // Listar autores com livros
    async listarComLivros(): Promise<Autor[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${AUTOR_ENDPOINTS.COM_LIVROS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar autores com livros: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar autores com livros:', error);
            throw error;
        }
    }
}

export const autorService = new AutorService();
