import { API_CONFIG } from '../config/api';
import type { Emprestimo } from '../types/entities';

class UsuarioEmprestimoService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async listarEmprestimosAtivos(): Promise<Emprestimo[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/meus-emprestimos`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao listar empréstimos ativos');
        }

        const emprestimos = await response.json();
        // Filtrar apenas os empréstimos ativos (status 'Emprestado' ou 'Atrasado')
        return emprestimos.filter((emprestimo: any) =>
            emprestimo.status === 'Emprestado' || emprestimo.status === 'Atrasado'
        );
    }

    async listarEmprestimosAtrasados(): Promise<Emprestimo[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/atrasados`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao listar empréstimos atrasados');
        }

        return await response.json();
    }

    async listarEmprestimosPorUsuario(idUsuario: number): Promise<Emprestimo[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/por-usuario/${idUsuario}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao listar empréstimos do usuário');
        }

        return await response.json();
    }

    async renovarEmprestimo(id: number): Promise<void> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Emprestimo/${id}/renovar`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Erro ao renovar empréstimo');
        }
    }
}

export default new UsuarioEmprestimoService();
