/**
 * SERVIÇO DE EXPLORAR LIVROS - YETI LIBRARY SYSTEM
 * 
 * Serviço específico para a área de exploração de livros
 * Focado em informações relevantes para leitores
 */

import { API_CONFIG } from '../config/api';
import type { Livro } from '../types/entities';

// Interface para filtros de exploração
export interface FiltrosExploracao {
    genero?: string;
    autor?: string;
    editora?: string;
    anoMin?: number;
    anoMax?: number;
    disponivel?: boolean;
    termo?: string;
}

// Interface para informações resumidas do livro (otimizada para exploração)
export interface LivroResumido {
    id: number;
    titulo: string;
    subtitulo?: string;
    nomeAutor: string;
    nomeEditora: string;
    genero: string;
    ano: number;
    sinopse: string;
    capaUrl?: string;
    exemplaresDisponiveis: number;
    totalExemplares: number;
    temExemplaresDisponiveis: boolean;
    numeroPaginas?: number;
    idioma?: string;
}

class ExplorarLivrosService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Lista todos os livros disponíveis para exploração
     */
    async listarLivrosDisponiveis(): Promise<LivroResumido[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/livro/disponiveis`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar livros: ${response.status}`);
            }

            const livros: Livro[] = await response.json();
            return this.mapearParaLivrosResumidos(livros);
        } catch (error) {
            console.error('Erro ao listar livros disponíveis:', error);
            throw error;
        }
    }

    /**
     * Busca livros por termo de pesquisa
     */
    async buscarLivros(termo: string): Promise<LivroResumido[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/livro/buscar/${encodeURIComponent(termo)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar livros: ${response.status}`);
            }

            const livros: Livro[] = await response.json();
            return this.mapearParaLivrosResumidos(livros);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            throw error;
        }
    }

    /**
     * Lista livros por gênero
     */
    async listarPorGenero(genero: string): Promise<LivroResumido[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/livro/por-genero/${encodeURIComponent(genero)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar livros por gênero: ${response.status}`);
            }

            const livros: Livro[] = await response.json();
            return this.mapearParaLivrosResumidos(livros);
        } catch (error) {
            console.error('Erro ao listar livros por gênero:', error);
            throw error;
        }
    }

    /**
     * Lista livros por autor
     */
    async listarPorAutor(idAutor: number): Promise<LivroResumido[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/livro/por-autor/${idAutor}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar livros por autor: ${response.status}`);
            }

            const livros: Livro[] = await response.json();
            return this.mapearParaLivrosResumidos(livros);
        } catch (error) {
            console.error('Erro ao listar livros por autor:', error);
            throw error;
        }
    }

    /**
     * Lista livros por editora
     */
    async listarPorEditora(idEditora: number): Promise<LivroResumido[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/livro/por-editora/${idEditora}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar livros por editora: ${response.status}`);
            }

            const livros: Livro[] = await response.json();
            return this.mapearParaLivrosResumidos(livros);
        } catch (error) {
            console.error('Erro ao listar livros por editora:', error);
            throw error;
        }
    }

    /**
     * Obtém detalhes completos de um livro
     */
    async obterDetalhesLivro(id: number): Promise<Livro> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/livro/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao obter detalhes do livro: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter detalhes do livro:', error);
            throw error;
        }
    }

    /**
     * Lista todos os gêneros disponíveis
     */
    async listarGeneros(): Promise<string[]> {
        try {
            const livros = await this.listarLivrosDisponiveis();
            const generos = [...new Set(livros.map(livro => livro.genero))];
            return generos.sort();
        } catch (error) {
            console.error('Erro ao listar gêneros:', error);
            return [];
        }
    }

    /**
     * Aplica filtros aos livros
     */
    async aplicarFiltros(filtros: FiltrosExploracao): Promise<LivroResumido[]> {
        try {
            let livros = await this.listarLivrosDisponiveis();

            // Aplicar filtros
            if (filtros.genero) {
                livros = livros.filter(livro => 
                    livro.genero.toLowerCase().includes(filtros.genero!.toLowerCase())
                );
            }

            if (filtros.autor) {
                livros = livros.filter(livro => 
                    livro.nomeAutor.toLowerCase().includes(filtros.autor!.toLowerCase())
                );
            }

            if (filtros.editora) {
                livros = livros.filter(livro => 
                    livro.nomeEditora.toLowerCase().includes(filtros.editora!.toLowerCase())
                );
            }

            if (filtros.anoMin) {
                livros = livros.filter(livro => livro.ano >= filtros.anoMin!);
            }

            if (filtros.anoMax) {
                livros = livros.filter(livro => livro.ano <= filtros.anoMax!);
            }

            if (filtros.disponivel !== undefined) {
                livros = livros.filter(livro => 
                    filtros.disponivel ? livro.temExemplaresDisponiveis : !livro.temExemplaresDisponiveis
                );
            }

            if (filtros.termo) {
                const termo = filtros.termo.toLowerCase();
                livros = livros.filter(livro => 
                    livro.titulo.toLowerCase().includes(termo) ||
                    livro.nomeAutor.toLowerCase().includes(termo) ||
                    livro.genero.toLowerCase().includes(termo) ||
                    livro.sinopse.toLowerCase().includes(termo)
                );
            }

            return livros;
        } catch (error) {
            console.error('Erro ao aplicar filtros:', error);
            throw error;
        }
    }

    /**
     * Mapeia livros completos para versão resumida
     */
    private mapearParaLivrosResumidos(livros: Livro[]): LivroResumido[] {
        return livros.map(livro => ({
            id: livro.id,
            titulo: livro.titulo,
            subtitulo: livro.subtitulo,
            nomeAutor: livro.nomeAutor || 'Autor não informado',
            nomeEditora: livro.nomeEditora || 'Editora não informada',
            genero: livro.genero,
            ano: livro.ano,
            sinopse: livro.sinopse,
            capaUrl: livro.capaUrl,
            exemplaresDisponiveis: livro.exemplaresDisponiveis || 0,
            totalExemplares: livro.totalExemplares || 0,
            temExemplaresDisponiveis: livro.temExemplaresDisponiveis || false,
            numeroPaginas: livro.numeroPaginas,
            idioma: livro.idioma
        }));
    }
}

export default new ExplorarLivrosService();
