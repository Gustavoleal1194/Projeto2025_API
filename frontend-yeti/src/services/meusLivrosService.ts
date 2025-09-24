/**
 * SERVIÇO DE MEUS LIVROS - YETI LIBRARY SYSTEM
 * 
 * Serviço específico para gerenciar livros emprestados pelo usuário
 * Focado em empréstimos ativos e histórico
 */

import { API_CONFIG } from '../config/api';
import type { Emprestimo } from '../types/entities';

// Interface para livro emprestado com informações completas
export interface MeuLivro {
    id: number;
    titulo: string;
    subtitulo?: string;
    nomeAutor: string;
    nomeEditora: string;
    genero: string;
    ano: number;
    sinopse: string;
    capaUrl?: string;
    numeroPaginas?: number;
    idioma?: string;

    // Informações do empréstimo
    emprestimoId: number;
    dataEmprestimo: string;
    dataPrevistaDevolucao: string;
    dataDevolucao?: string;
    status: string;
    estaAtrasado: boolean;
    quantidadeRenovacoes: number;
    maxRenovacoes: number;
    numeroExemplar: string;

    // Informações de disponibilidade
    podeRenovar: boolean;
    diasRestantes: number;
    diasAtraso?: number;
}

// Interface para filtros de meus livros
export interface FiltrosMeusLivros {
    status?: 'Emprestado' | 'Devolvido' | 'Atrasado';
    atrasado?: boolean;
    podeRenovar?: boolean;
    genero?: string;
    autor?: string;
    termo?: string;
}

class MeusLivrosService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Lista todos os empréstimos do usuário (ativos e históricos)
     */
    async listarMeusLivros(): Promise<MeuLivro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/ativos`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar meus livros: ${response.status}`);
            }

            const emprestimos: Emprestimo[] = await response.json();
            return this.mapearEmprestimosParaMeusLivros(emprestimos);
        } catch (error) {
            console.error('Erro ao listar meus livros:', error);
            throw error;
        }
    }

    /**
     * Lista apenas livros ativos (emprestados)
     */
    async listarLivrosAtivos(): Promise<MeuLivro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/ativos`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar livros ativos: ${response.status}`);
            }

            const emprestimos: Emprestimo[] = await response.json();
            const livrosAtivos = emprestimos.filter(e => e.status === 'Emprestado');
            return this.mapearEmprestimosParaMeusLivros(livrosAtivos);
        } catch (error) {
            console.error('Erro ao listar livros ativos:', error);
            throw error;
        }
    }

    /**
     * Lista livros atrasados
     */
    async listarLivrosAtrasados(): Promise<MeuLivro[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/atrasados`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar livros atrasados: ${response.status}`);
            }

            const emprestimos: Emprestimo[] = await response.json();
            return this.mapearEmprestimosParaMeusLivros(emprestimos);
        } catch (error) {
            console.error('Erro ao listar livros atrasados:', error);
            throw error;
        }
    }

    /**
     * Renova um empréstimo
     */
    async renovarEmprestimo(emprestimoId: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/${emprestimoId}/renovar`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao renovar empréstimo: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao renovar empréstimo:', error);
            throw error;
        }
    }

    /**
     * Devolve um empréstimo
     */
    async devolverEmprestimo(emprestimoId: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/${emprestimoId}/devolver`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao devolver empréstimo: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao devolver empréstimo:', error);
            throw error;
        }
    }

    /**
     * Aplica filtros aos meus livros
     */
    async aplicarFiltros(filtros: FiltrosMeusLivros): Promise<MeuLivro[]> {
        try {
            let livros = await this.listarMeusLivros();

            // Aplicar filtros
            if (filtros.status) {
                livros = livros.filter(livro => livro.status === filtros.status);
            }

            if (filtros.atrasado !== undefined) {
                livros = livros.filter(livro => livro.estaAtrasado === filtros.atrasado);
            }

            if (filtros.podeRenovar !== undefined) {
                livros = livros.filter(livro => livro.podeRenovar === filtros.podeRenovar);
            }

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
     * Obtém estatísticas dos meus livros
     */
    async obterEstatisticas(): Promise<{
        total: number;
        ativos: number;
        atrasados: number;
        devolvidos: number;
        proximosVencimentos: number;
    }> {
        try {
            const livros = await this.listarMeusLivros();

            const ativos = livros.filter(l => l.status === 'Emprestado');
            const atrasados = livros.filter(l => l.estaAtrasado);
            const devolvidos = livros.filter(l => l.status === 'Devolvido');

            // Próximos vencimentos (próximos 3 dias)
            const hoje = new Date();
            const proximosVencimentos = ativos.filter(l => {
                const dataVencimento = new Date(l.dataPrevistaDevolucao);
                const diffTime = dataVencimento.getTime() - hoje.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 3;
            }).length;

            return {
                total: livros.length,
                ativos: ativos.length,
                atrasados: atrasados.length,
                devolvidos: devolvidos.length,
                proximosVencimentos
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    /**
     * Mapeia empréstimos para interface MeuLivro
     */
    private mapearEmprestimosParaMeusLivros(emprestimos: Emprestimo[]): MeuLivro[] {
        return emprestimos.map(emprestimo => {
            const hoje = new Date();
            const dataVencimento = new Date(emprestimo.dataPrevistaDevolucao);
            const diffTime = dataVencimento.getTime() - hoje.getTime();
            const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diasAtraso = diasRestantes < 0 ? Math.abs(diasRestantes) : undefined;

            return {
                id: emprestimo.idExemplar || 0, // Usando idExemplar como ID do livro
                titulo: emprestimo.tituloLivro || 'Título não disponível',
                subtitulo: undefined, // Não disponível no empréstimo
                nomeAutor: 'Autor não informado', // Não disponível no empréstimo
                nomeEditora: 'Editora não informada', // Não disponível no empréstimo
                genero: 'Gênero não informado', // Não disponível no empréstimo
                ano: new Date().getFullYear(), // Não disponível no empréstimo
                sinopse: 'Sinopse não disponível', // Não disponível no empréstimo
                capaUrl: undefined, // Não disponível no empréstimo
                numeroPaginas: undefined, // Não disponível no empréstimo
                idioma: undefined, // Não disponível no empréstimo

                // Informações do empréstimo
                emprestimoId: emprestimo.id,
                dataEmprestimo: emprestimo.dataEmprestimo,
                dataPrevistaDevolucao: emprestimo.dataPrevistaDevolucao,
                dataDevolucao: emprestimo.dataDevolucao,
                status: emprestimo.status,
                estaAtrasado: emprestimo.estaAtrasado || false,
                quantidadeRenovacoes: emprestimo.quantidadeRenovacoes || 0,
                maxRenovacoes: emprestimo.maxRenovacoes || 3,
                numeroExemplar: emprestimo.numeroExemplar || 'N/A',

                // Informações calculadas
                podeRenovar: (emprestimo.status === 'Emprestado' &&
                    (emprestimo.quantidadeRenovacoes || 0) < (emprestimo.maxRenovacoes || 3) &&
                    !emprestimo.estaAtrasado),
                diasRestantes: diasRestantes,
                diasAtraso: diasAtraso
            };
        });
    }
}

export default new MeusLivrosService();
