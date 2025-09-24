/**
 * SERVIÇO DE PERFIL DO USUÁRIO - YETI LIBRARY SYSTEM
 * 
 * Serviço para gerenciar dados do perfil do usuário logado
 */

import { API_CONFIG } from '../config/api';
import type { UsuarioDTO } from '../types/entities';

class UsuarioPerfilService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    /**
     * Obtém dados completos do usuário logado
     */
    async obterMeuPerfil(): Promise<UsuarioDTO> {
        try {
            // Usar o endpoint que usa o token JWT para identificar o usuário
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/Usuario/meus-dados`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar dados do usuário');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            throw error;
        }
    }

    /**
     * Atualiza dados do perfil do usuário
     */
    async atualizarPerfil(dadosPerfil: Partial<UsuarioDTO>): Promise<UsuarioDTO> {
        try {
            // Primeiro obter o ID do usuário atual
            const perfilAtual = await this.obterMeuPerfil();

            // Incluir o ID nos dados
            const dadosCompletos = {
                ...dadosPerfil,
                id: perfilAtual.id
            };

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/Usuario`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(dadosCompletos)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao atualizar perfil');
            }

            // Buscar dados atualizados
            return await this.obterMeuPerfil();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas do usuário
     */
    async obterEstatisticasUsuario(): Promise<{
        totalEmprestimos: number;
        emprestimosAtivos: number;
        emprestimosAtrasados: number;
        totalFavoritos: number;
    }> {
        try {
            // Usar o endpoint que usa o token JWT para identificar o usuário
            const emprestimosResponse = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/meus-emprestimos`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!emprestimosResponse.ok) {
                throw new Error('Erro ao buscar empréstimos');
            }

            const emprestimos = await emprestimosResponse.json();

            // Calcular estatísticas
            const totalEmprestimos = emprestimos.length;
            const emprestimosAtivos = emprestimos.filter((e: any) => e.status === 'Emprestado').length;
            const emprestimosAtrasados = emprestimos.filter((e: any) => e.estaAtrasado).length;

            // Buscar favoritos do localStorage
            const favoritos = JSON.parse(localStorage.getItem('yeti_livros_favoritos') || '[]');
            const totalFavoritos = favoritos.length;

            return {
                totalEmprestimos,
                emprestimosAtivos,
                emprestimosAtrasados,
                totalFavoritos
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    /**
     * Formatar data para exibição
     */
    formatarData(data: string): string {
        try {
            return new Date(data).toLocaleDateString('pt-BR');
        } catch {
            return data;
        }
    }

    /**
     * Calcular idade
     */
    calcularIdade(dataNascimento: string): number {
        try {
            const hoje = new Date();
            const nascimento = new Date(dataNascimento);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mesAtual = hoje.getMonth();
            const mesNascimento = nascimento.getMonth();

            if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }

            return idade;
        } catch {
            return 0;
        }
    }
}

export default new UsuarioPerfilService();
