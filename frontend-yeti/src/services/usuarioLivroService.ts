import { API_CONFIG } from '../config/api';
import type { Livro } from '../types/entities';

class UsuarioLivroService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async listarLivrosDisponiveis(): Promise<Livro[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Livro/disponiveis`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao listar livros disponíveis');
        }

        return await response.json();
    }

    async buscarLivros(termo: string): Promise<Livro[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Livro/buscar/${encodeURIComponent(termo)}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar livros');
        }

        return await response.json();
    }

    async listarLivrosPorGenero(genero: string): Promise<Livro[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Livro/por-genero/${encodeURIComponent(genero)}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao listar livros por gênero');
        }

        return await response.json();
    }

    async obterLivroPorId(id: number): Promise<Livro> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Livro/${id}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao obter livro');
        }

        return await response.json();
    }
}

export default new UsuarioLivroService();
