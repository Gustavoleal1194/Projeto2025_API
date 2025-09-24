import type { Livro, LivroCreateRequest, LivroUpdateRequest } from '../constants/entities';
import { API_CONFIG } from '../config/api';
import { API_ROUTES } from '../constants/entities';

const LIVRO_ENDPOINTS = {
    LISTAR: API_ROUTES.LIVROS,
    OBTER: (id: number) => `${API_ROUTES.LIVROS}/${id}`,
    CRIAR: API_ROUTES.LIVROS,
    ATUALIZAR: API_ROUTES.LIVROS,
    EXCLUIR: (id: number) => `${API_ROUTES.LIVROS}/${id}`,
    DISPONIVEIS: API_ROUTES.LIVROS_DISPONIVEIS,
    POR_GENERO: (genero: string) => `${API_ROUTES.LIVROS_POR_GENERO}/${genero}`,
    POR_AUTOR: (idAutor: number) => `${API_ROUTES.LIVROS_POR_AUTOR}/${idAutor}`,
    POR_EDITORA: (idEditora: number) => `${API_ROUTES.LIVROS_POR_EDITORA}/${idEditora}`,
    BUSCAR: (termo: string) => `${API_ROUTES.LIVROS_BUSCAR}/${termo}`,
    EM_ESTOQUE: API_ROUTES.LIVROS_EM_ESTOQUE,
} as const;

class LivroService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Listar todos os livros
    async listar(): Promise<Livro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.LISTAR}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar livros: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar livros:', error);
            throw error;
        }
    }

    // Obter livro por ID
    async obter(id: number): Promise<Livro> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.OBTER(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Livro não encontrado');
                }
                throw new Error(`Erro ao obter livro: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter livro:', error);
            throw error;
        }
    }

    // Criar novo livro
    async criar(livro: LivroCreateRequest): Promise<Livro> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.CRIAR}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(livro)
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar livro: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            throw error;
        }
    }

    // Atualizar livro
    async atualizar(livro: LivroUpdateRequest): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.ATUALIZAR}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(livro)
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar livro: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            throw error;
        }
    }

    // Excluir livro
    async excluir(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.EXCLUIR(id)}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir livro: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao excluir livro:', error);
            throw error;
        }
    }

    // Listar livros disponíveis
    async listarDisponiveis(): Promise<Livro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.DISPONIVEIS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar livros disponíveis: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar livros disponíveis:', error);
            throw error;
        }
    }

    // Buscar livros por termo
    async buscar(termo: string): Promise<Livro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.BUSCAR(termo)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar livros: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            throw error;
        }
    }

    // Listar livros por gênero
    async listarPorGenero(genero: string): Promise<Livro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.POR_GENERO(genero)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar livros por gênero: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar livros por gênero:', error);
            throw error;
        }
    }

    // Listar livros por autor
    async listarPorAutor(idAutor: number): Promise<Livro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.POR_AUTOR(idAutor)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar livros por autor: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar livros por autor:', error);
            throw error;
        }
    }

    // Listar livros por editora
    async listarPorEditora(idEditora: number): Promise<Livro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.POR_EDITORA(idEditora)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar livros por editora: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar livros por editora:', error);
            throw error;
        }
    }

    // Listar livros em estoque
    async listarEmEstoque(): Promise<Livro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${LIVRO_ENDPOINTS.EM_ESTOQUE}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar livros em estoque: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar livros em estoque:', error);
            throw error;
        }
    }

}

export const livroService = new LivroService();
export default livroService;
