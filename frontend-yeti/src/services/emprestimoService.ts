import { API_CONFIG } from '../config/api';
import { API_ROUTES } from '../constants/entities';
import type { Emprestimo, EmprestimoForm } from '../types/entities';

const EMPRESTIMO_ENDPOINTS = {
    LISTAR: API_ROUTES.EMPRESTIMOS,
    OBTER: (id: number) => `${API_ROUTES.EMPRESTIMOS}/${id}`,
    CRIAR: API_ROUTES.EMPRESTIMOS,
    ATUALIZAR: (id: number) => `${API_ROUTES.EMPRESTIMOS}/${id}`,
    EXCLUIR: (id: number) => `${API_ROUTES.EMPRESTIMOS}/${id}`,
    ATIVOS: API_ROUTES.EMPRESTIMOS_ATIVOS,
    POR_USUARIO: (usuarioId: number) => `${API_ROUTES.EMPRESTIMOS_POR_USUARIO}/${usuarioId}`,
    POR_EXEMPLAR: (exemplarId: number) => `${API_ROUTES.EMPRESTIMOS_POR_EXEMPLAR}/${exemplarId}`,
    ATRASADOS: API_ROUTES.EMPRESTIMOS_ATRASADOS,
    BUSCAR: '/api/emprestimo/buscar',
    DEVOLVER: (id: number) => `${API_ROUTES.EMPRESTIMOS}/${id}/devolver`,
    RENOVAR: (id: number) => `${API_ROUTES.EMPRESTIMOS}/${id}/renovar`
};

class EmprestimoService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Listar todos os empréstimos
    async listar(): Promise<Emprestimo[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.LISTAR}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar empréstimos: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar empréstimos:', error);
            throw error;
        }
    }

    async obter(id: number): Promise<Emprestimo> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.OBTER(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao obter empréstimo: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter empréstimo:', error);
            throw error;
        }
    }

    // Criar novo empréstimo
    async criar(emprestimo: EmprestimoForm): Promise<Emprestimo> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.CRIAR}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(emprestimo)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao criar empréstimo: ${errorText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao criar empréstimo:', error);
            throw error;
        }
    }

    // Atualizar empréstimo
    async atualizar(emprestimo: EmprestimoForm & { id: number }): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.ATUALIZAR(emprestimo.id)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(emprestimo)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar empréstimo: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar empréstimo:', error);
            throw error;
        }
    }

    // Excluir empréstimo
    async excluir(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.EXCLUIR(id)}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir empréstimo: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao excluir empréstimo:', error);
            throw error;
        }
    }

    // Devolver empréstimo
    async devolver(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.DEVOLVER(id)}`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao devolver empréstimo: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao devolver empréstimo:', error);
            throw error;
        }
    }

    // Devolver empréstimo por ID (método POST)
    async devolverEmprestimoPorId(emprestimoId: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.DEVOLVER(emprestimoId)}`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao devolver empréstimo: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao devolver empréstimo:', error);
            throw error;
        }
    }

    // Renovar empréstimo
    async renovar(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.RENOVAR(id)}`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao renovar empréstimo: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao renovar empréstimo:', error);
            throw error;
        }
    }

    // Buscar empréstimos
    async buscar(termo: string): Promise<Emprestimo[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.BUSCAR}?termo=${encodeURIComponent(termo)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar empréstimos: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
            throw error;
        }
    }

    // Listar empréstimos ativos
    async listarAtivos(): Promise<Emprestimo[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.ATIVOS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar empréstimos ativos: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar empréstimos ativos:', error);
            throw error;
        }
    }

    // Listar empréstimos por usuário
    async listarPorUsuario(usuarioId: number): Promise<Emprestimo[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.POR_USUARIO(usuarioId)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar empréstimos por usuário: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar empréstimos por usuário:', error);
            throw error;
        }
    }

    // Listar empréstimos por exemplar
    async listarPorExemplar(exemplarId: number): Promise<Emprestimo[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.POR_EXEMPLAR(exemplarId)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar empréstimos por exemplar: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar empréstimos por exemplar:', error);
            throw error;
        }
    }

    // Listar empréstimos atrasados
    async listarAtrasados(): Promise<Emprestimo[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EMPRESTIMO_ENDPOINTS.ATRASADOS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar empréstimos atrasados: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar empréstimos atrasados:', error);
            throw error;
        }
    }
}

export const emprestimoService = new EmprestimoService();
