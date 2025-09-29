import { API_CONFIG } from '../config/api';
import { API_ROUTES } from '../constants/entities';
import type { Exemplar, ExemplarCreateRequest, ExemplarUpdateRequest } from '../constants/entities';

const EXEMPLAR_ENDPOINTS = {
    LISTAR: API_ROUTES.EXEMPLARES,
    OBTER: (id: number) => `${API_ROUTES.EXEMPLARES}/${id}`,
    CRIAR: API_ROUTES.EXEMPLARES,
    ATUALIZAR: (id: number) => `${API_ROUTES.EXEMPLARES}/${id}`,
    EXCLUIR: (id: number) => `${API_ROUTES.EXEMPLARES}/${id}`,
    DISPONIVEIS: API_ROUTES.EXEMPLARES_DISPONIVEIS,
    POR_LIVRO: (idLivro: number) => `${API_ROUTES.EXEMPLARES_POR_LIVRO}/${idLivro}`,
    DISPONIVEIS_POR_LIVRO: (idLivro: number) => `${API_ROUTES.EXEMPLARES_DISPONIVEIS_POR_LIVRO}/${idLivro}`,
    POR_LOCALIZACAO: (localizacao: string) => `${API_ROUTES.EXEMPLARES_POR_LOCALIZACAO}/${localizacao}`,
    POR_CONDICAO: (condicao: string) => `${API_ROUTES.EXEMPLARES_POR_CONDICAO}/${condicao}`,
    POR_NUMERO: (numero: string) => `${API_ROUTES.EXEMPLARES_POR_NUMERO}/${numero}`,
    EMPRESTADOS: API_ROUTES.EXEMPLARES_EMPRESTADOS,
    VERIFICAR_DISPONIBILIDADE: (id: number) => `${API_ROUTES.EXEMPLARES_VERIFICAR_DISPONIBILIDADE.replace('{id}', id.toString())}`,
    MARCAR_INDISPONIVEL: (id: number) => `${API_ROUTES.EXEMPLARES_MARCAR_INDISPONIVEL.replace('{id}', id.toString())}`,
    MARCAR_DISPONIVEL: (id: number) => `${API_ROUTES.EXEMPLARES_MARCAR_DISPONIVEL.replace('{id}', id.toString())}`
};

class ExemplarService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Listar todos os exemplares
    async listar(): Promise<Exemplar[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.LISTAR}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar exemplares: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar exemplares:', error);
            throw error;
        }
    }

    // Obter exemplar por ID
    async obter(id: number): Promise<Exemplar> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.OBTER(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao obter exemplar: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter exemplar:', error);
            throw error;
        }
    }

    // Criar novo exemplar
    async criar(exemplar: ExemplarCreateRequest): Promise<Exemplar> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.CRIAR}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(exemplar)
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar exemplar: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar exemplar:', error);
            throw error;
        }
    }

    // Atualizar exemplar
    async atualizar(exemplar: ExemplarUpdateRequest): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.ATUALIZAR(exemplar.id!)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(exemplar)
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar exemplar: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar exemplar:', error);
            throw error;
        }
    }

    // Excluir exemplar
    async excluir(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.EXCLUIR(id)}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir exemplar: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao excluir exemplar:', error);
            throw error;
        }
    }

    // Listar exemplares disponíveis
    async listarDisponiveis(): Promise<Exemplar[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.DISPONIVEIS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar exemplares disponíveis: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar exemplares disponíveis:', error);
            throw error;
        }
    }

    // Listar exemplares por livro
    async listarPorLivro(idLivro: number): Promise<Exemplar[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.POR_LIVRO(idLivro)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar exemplares por livro: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar exemplares por livro:', error);
            throw error;
        }
    }

    // Listar exemplares disponíveis por livro
    async listarDisponiveisPorLivro(idLivro: number): Promise<Exemplar[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.DISPONIVEIS_POR_LIVRO(idLivro)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar exemplares disponíveis por livro: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar exemplares disponíveis por livro:', error);
            throw error;
        }
    }

    // Listar exemplares por localização
    async listarPorLocalizacao(localizacao: string): Promise<Exemplar[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.POR_LOCALIZACAO(localizacao)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar exemplares por localização: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar exemplares por localização:', error);
            throw error;
        }
    }

    // Listar exemplares por condição
    async listarPorCondicao(condicao: string): Promise<Exemplar[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.POR_CONDICAO(condicao)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar exemplares por condição: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar exemplares por condição:', error);
            throw error;
        }
    }

    // Buscar exemplar por número
    async buscarPorNumero(numero: string): Promise<Exemplar> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.POR_NUMERO(numero)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar exemplar por número: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar exemplar por número:', error);
            throw error;
        }
    }

    // Listar exemplares emprestados
    async listarEmprestados(): Promise<Exemplar[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.EMPRESTADOS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar exemplares emprestados: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar exemplares emprestados:', error);
            throw error;
        }
    }

    // Verificar disponibilidade do exemplar
    async verificarDisponibilidade(id: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.VERIFICAR_DISPONIBILIDADE(id)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao verificar disponibilidade: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            throw error;
        }
    }

    // Marcar exemplar como indisponível
    async marcarIndisponivel(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.MARCAR_INDISPONIVEL(id)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao marcar exemplar como indisponível: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao marcar exemplar como indisponível:', error);
            throw error;
        }
    }

    // Marcar exemplar como disponível
    async marcarDisponivel(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${EXEMPLAR_ENDPOINTS.MARCAR_DISPONIVEL(id)}`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao marcar exemplar como disponível: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao marcar exemplar como disponível:', error);
            throw error;
        }
    }
}

export const exemplarService = new ExemplarService();
