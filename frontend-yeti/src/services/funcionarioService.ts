import { API_CONFIG } from '../config/api';
import { API_ROUTES } from '../constants/entities';
import type { Funcionario, FuncionarioForm } from '../types/entities';

const FUNCIONARIO_ENDPOINTS = {
    LISTAR: API_ROUTES.FUNCIONARIOS,
    OBTER: (id: number) => `${API_ROUTES.FUNCIONARIOS}/${id}`,
    CRIAR: API_ROUTES.FUNCIONARIOS,
    ATUALIZAR: (id: number) => `${API_ROUTES.FUNCIONARIOS}/${id}`,
    EXCLUIR: (id: number) => `${API_ROUTES.FUNCIONARIOS}/${id}`,
    POR_CARGO: (cargo: string) => `${API_ROUTES.FUNCIONARIOS_POR_CARGO}/${cargo}`,
    ATIVOS: API_ROUTES.FUNCIONARIOS_ATIVOS,
    INATIVOS: API_ROUTES.FUNCIONARIOS_INATIVOS,
    POR_EMAIL: (email: string) => `${API_ROUTES.FUNCIONARIOS_POR_EMAIL}/${email}`,
    COUNT: API_ROUTES.FUNCIONARIOS_COUNT,
    EXISTS: (id: number) => `${API_ROUTES.FUNCIONARIOS_EXISTS}/${id}`,
    TOGGLE_STATUS: (id: number) => API_ROUTES.FUNCIONARIOS_TOGGLE_STATUS.replace('{id}', id.toString())
};

class FuncionarioService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Listar todos os funcionários
    async listar(): Promise<Funcionario[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.LISTAR}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar funcionários: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar funcionários:', error);
            throw error;
        }
    }

    // Obter funcionário por ID
    async obter(id: number): Promise<Funcionario> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.OBTER(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao obter funcionário: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter funcionário:', error);
            throw error;
        }
    }

    // Criar novo funcionário
    async criar(funcionario: FuncionarioForm): Promise<Funcionario> {
        try {

            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.CRIAR}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(funcionario)
            });


            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro response:', errorText);
                throw new Error(`Erro ao criar funcionário: ${errorText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao criar funcionário:', error);
            throw error;
        }
    }

    // Atualizar funcionário
    async atualizar(id: number, funcionarioData: FuncionarioForm & { Id: number }): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.ATUALIZAR(id)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(funcionarioData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar funcionário: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            throw error;
        }
    }

    // Excluir funcionário
    async excluir(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.EXCLUIR(id)}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir funcionário: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            throw error;
        }
    }

    // Buscar funcionários por cargo
    async buscarPorCargo(cargo: string): Promise<Funcionario[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.POR_CARGO(cargo)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar funcionários por cargo: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar funcionários por cargo:', error);
            throw error;
        }
    }

    // Buscar funcionários ativos
    async buscarAtivos(): Promise<Funcionario[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.ATIVOS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar funcionários ativos: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar funcionários ativos:', error);
            throw error;
        }
    }

    // Buscar funcionários inativos
    async buscarInativos(): Promise<Funcionario[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.INATIVOS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar funcionários inativos: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar funcionários inativos:', error);
            throw error;
        }
    }

    // Buscar funcionário por email
    async buscarPorEmail(email: string): Promise<Funcionario> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.POR_EMAIL(email)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar funcionário por email: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar funcionário por email:', error);
            throw error;
        }
    }

    // Contar funcionários
    async contar(): Promise<number> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.COUNT}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao contar funcionários: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao contar funcionários:', error);
            throw error;
        }
    }

    // Verificar se funcionário existe
    async existe(id: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.EXISTS(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao verificar se funcionário existe: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao verificar se funcionário existe:', error);
            throw error;
        }
    }

    // Toggle status do funcionário (Ativar/Desativar)
    async toggleStatus(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${FUNCIONARIO_ENDPOINTS.TOGGLE_STATUS(id)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao alterar status do funcionário: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao alterar status do funcionário:', error);
            throw error;
        }
    }
}

export const funcionarioService = new FuncionarioService();