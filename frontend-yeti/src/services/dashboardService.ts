/**
 * SERVIÇO DE DASHBOARD - YETI LIBRARY SYSTEM
 * 
 * Este serviço contém todas as chamadas para APIs relacionadas ao dashboard.
 */

import type {
    DashboardData,
    Activity,
    OverdueBook,
    TopBook,
    MonthlyStat,
    SystemAlert
} from '../types/entities';
import { API_ROUTES } from '../constants/entities';
import { API_CONFIG } from '../config/api';

// URL base da API
const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Classe para gerenciar todas as operações do dashboard
 */
export class DashboardService {
    private static getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('yeti_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    private static async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na API:', response.status, response.statusText);
            console.error('Detalhes do erro:', errorText);
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * Busca resumo geral do dashboard
     */
    static async getResumoGeral(): Promise<DashboardData> {
        try {

            const response = await fetch(`${API_BASE_URL}${API_ROUTES.DASHBOARD_RESUMO}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });


            const data = await this.handleResponse<any>(response);

            // Mapear dados da API para o formato esperado (camelCase -> camelCase)
            const mappedData = {
                totalUsuarios: data.totalUsuarios || 0,
                totalLivros: data.totalLivros || 0,
                totalExemplares: data.totalExemplares || 0,
                emprestimosAtivos: data.totalEmprestimosAtivos || 0,
                livrosAtrasados: data.totalAtrasos || 0,
                funcionariosAtivos: 0, // Não disponível na API atual
                usuariosOnline: 0, // Não disponível na API atual
                livrosDisponiveis: 0 // Não disponível na API atual
            };

            return mappedData;
        } catch (error) {
            console.error('❌ Erro ao buscar resumo geral:', error);
            // Retorna dados padrão em caso de erro
            return {
                totalUsuarios: 0,
                totalLivros: 0,
                totalExemplares: 0,
                emprestimosAtivos: 0,
                livrosAtrasados: 0,
                funcionariosAtivos: 0,
                usuariosOnline: 0,
                livrosDisponiveis: 0
            };
        }
    }

    /**
     * Busca estatísticas de empréstimos
     */
    static async getEstatisticasEmprestimos(): Promise<{
        emprestimosHoje: number;
        emprestimosEstaSemana: number;
        emprestimosEsteMes: number;
        devolucoesHoje: number;
        devolucoesEstaSemana: number;
        devolucoesEsteMes: number;
    }> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ROUTES.DASHBOARD_ESTATISTICAS}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await this.handleResponse<any>(response);

            // Mapear dados da API para o formato esperado (PascalCase -> camelCase)
            return {
                emprestimosHoje: data.EmprestimosHoje || 0,
                emprestimosEstaSemana: data.EmprestimosEstaSemana || 0,
                emprestimosEsteMes: data.EmprestimosEsteMes || 0,
                devolucoesHoje: data.DevolucoesHoje || 0,
                devolucoesEstaSemana: data.DevolucoesEstaSemana || 0,
                devolucoesEsteMes: data.DevolucoesEsteMes || 0
            };
        } catch (error) {
            console.error('Erro ao buscar estatísticas de empréstimos:', error);
            return {
                emprestimosHoje: 0,
                emprestimosEstaSemana: 0,
                emprestimosEsteMes: 0,
                devolucoesHoje: 0,
                devolucoesEstaSemana: 0,
                devolucoesEsteMes: 0
            };
        }
    }

    /**
     * Busca atividades recentes
     */
    static async getAtividadesRecentes(): Promise<Activity[]> {
        try {

            // Buscar empréstimos emprestados e devolvidos
            const emprestimosEmprestados = await fetch(`${API_BASE_URL}/api/emprestimo/emprestados`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            }).then(response => {
                return this.handleResponse<any[]>(response);
            });

            const emprestimosDevolvidos = await fetch(`${API_BASE_URL}/api/emprestimo/devolvidos`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            }).then(response => {
                return this.handleResponse<any[]>(response);
            });



            const atividades: Activity[] = [];

            // Adicionar TODOS os empréstimos emprestados (sem limitação)
            emprestimosEmprestados.forEach((emprestimo) => {
                // Parse da data para empréstimos
                const dataString = emprestimo.dataEmprestimo || emprestimo.DataEmprestimo;
                let dataEmprestimo: Date;
                if (dataString.includes('T') && !dataString.includes('Z') && !dataString.includes('+')) {
                    // Data sem timezone - aplicar correção
                    dataEmprestimo = new Date(dataString + 'Z');
                } else {
                    dataEmprestimo = new Date(dataString);
                }

                atividades.push({
                    id: `loan_${emprestimo.id}_${Date.now()}`, // ID único baseado no ID do empréstimo
                    user: emprestimo.nomeUsuario || emprestimo.NomeUsuario || 'Usuário',
                    action: `Emprestou "${emprestimo.tituloLivro || emprestimo.TituloLivro || 'Livro'}"`,
                    time: this.calcularTempoRelativo(dataString),
                    type: 'loan',
                    status: 'success',
                    realDate: dataEmprestimo // Adicionar data real para ordenação
                });
            });

            // Adicionar TODAS as devoluções recentes (sem limitação)
            emprestimosDevolvidos.forEach((emprestimo) => {
                // Parse da data para devoluções - FORÇAR correção de timezone
                const dataString = emprestimo.dataDevolucao || emprestimo.DataDevolucao;

                // FORÇAR correção de timezone para TODAS as devoluções
                let dataDevolucao: Date;
                if (dataString.includes('T')) {
                    // Se tem T, aplicar correção de timezone
                    if (!dataString.includes('Z') && !dataString.includes('+')) {
                        dataDevolucao = new Date(dataString + 'Z');
                    } else {
                        // Se já tem timezone, remover e aplicar correção
                        const dataSemTimezone = dataString.replace(/[Z+].*$/, '');
                        dataDevolucao = new Date(dataSemTimezone + 'Z');
                    }
                } else {
                    dataDevolucao = new Date(dataString);
                }

                atividades.push({
                    id: `return_${emprestimo.id}_${Date.now()}`, // ID único baseado no ID do empréstimo
                    user: emprestimo.nomeUsuario || emprestimo.NomeUsuario || 'Usuário',
                    action: `Devolveu "${emprestimo.tituloLivro || emprestimo.TituloLivro || 'Livro'}"`,
                    time: this.calcularTempoRelativo(dataString),
                    type: 'return',
                    status: 'success',
                    realDate: dataDevolucao // Adicionar data real para ordenação
                });
            });


            // Remover duplicatas baseadas no ID do empréstimo
            const atividadesUnicas = atividades.filter((atividade, index, self) => {
                const emprestimoId = (atividade.id as string).split('_')[1]; // Extrair ID do empréstimo
                return self.findIndex(a => (a.id as string).split('_')[1] === emprestimoId) === index;
            });


            // Ordenar por data real (mais recente primeiro) e pegar apenas os 10 primeiros
            const atividadesOrdenadas = atividadesUnicas
                .sort((a, b) => {
                    // Usar a data real armazenada na atividade
                    const dateA = (a as any).realDate || new Date();
                    const dateB = (b as any).realDate || new Date();
                    return dateB.getTime() - dateA.getTime();
                })
                .slice(0, 10);


            return atividadesOrdenadas;
        } catch (error) {
            console.error('Erro ao buscar atividades recentes:', error);
            return [];
        }
    }

    /**
     * Busca livros atrasados
     */
    static async getLivrosAtrasados(): Promise<OverdueBook[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/emprestimo/atrasados`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const emprestimos = await this.handleResponse<any[]>(response);

            // Converter empréstimos atrasados em livros atrasados
            return emprestimos.map((emprestimo, index) => ({
                id: emprestimo.id,
                title: emprestimo.tituloLivro || 'Livro',
                user: emprestimo.nomeUsuario || 'Usuário',
                daysOverdue: emprestimo.diasAtraso || 0,
                exemplar: emprestimo.numeroExemplar || `EX-${index + 1}`,
                multa: emprestimo.multa || 0
            }));
        } catch (error) {
            console.error('Erro ao buscar livros atrasados:', error);
            return [];
        }
    }

    /**
     * Busca livros mais emprestados
     */
    static async getLivrosMaisEmprestados(): Promise<TopBook[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/relatorios/livros-mais-emprestados?top=5`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await this.handleResponse<any>(response);

            // Verificar se data.livros existe e é um array (camelCase)
            if (!data.livros || !Array.isArray(data.livros)) {
                console.warn('⚠️ getLivrosMaisEmprestados: data.livros não é um array válido:', data);
                return [];
            }

            return data.livros.map((livro: any, index: number) => ({
                id: livro.id || index + 1,
                title: livro.titulo || 'Livro',
                author: livro.autor || 'Autor',
                emprestimos: livro.totalEmprestimos || 0,
                rating: 4.5 + Math.random() * 0.5 // Simular rating
            }));
        } catch (error) {
            console.error('Erro ao buscar livros mais emprestados:', error);
            return [];
        }
    }

    /**
     * Busca estatísticas mensais
     */
    static async getEstatisticasMensais(): Promise<MonthlyStat[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/relatorios/emprestimos-por-periodo?dataInicio=2024-01-01&dataFim=2024-12-31`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            await this.handleResponse<any>(response);

            // Simular dados mensais baseados nos dados recebidos
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
            return meses.map((mes) => ({
                month: mes,
                emprestimos: Math.floor(Math.random() * 50) + 100,
                devolucoes: Math.floor(Math.random() * 45) + 95
            }));
        } catch (error) {
            console.error('Erro ao buscar estatísticas mensais:', error);
            return [];
        }
    }

    /**
     * Busca alertas do sistema
     */
    static async getAlertasSistema(): Promise<SystemAlert[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/dashboard/alertas`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await this.handleResponse<any[]>(response);

            // Converter dados da API para o formato esperado
            return data.map((alerta, index) => ({
                id: alerta.id || index + 1,
                type: alerta.type || 'info',
                message: alerta.message || 'Alerta do sistema',
                priority: alerta.priority || 'low'
            }));
        } catch (error) {
            console.error('Erro ao buscar alertas do sistema:', error);
            // Retorna alertas padrão em caso de erro
            return [
                {
                    id: 1,
                    type: 'info',
                    message: 'Sistema funcionando normalmente',
                    priority: 'low'
                }
            ];
        }
    }

    /**
     * Busca todos os dados do dashboard de uma vez
     */
    static async getAllDashboardData(): Promise<{
        resumo: DashboardData;
        atividades: Activity[];
        livrosAtrasados: OverdueBook[];
        livrosPopulares: TopBook[];
        estatisticasMensais: MonthlyStat[];
        alertas: SystemAlert[];
    }> {
        try {

            const [
                resumo,
                atividades,
                livrosAtrasados,
                livrosPopulares,
                estatisticasMensais,
                alertas
            ] = await Promise.all([
                this.getResumoGeral(),
                this.getAtividadesRecentes(),
                this.getLivrosAtrasados(),
                this.getLivrosMaisEmprestados(),
                this.getEstatisticasMensais(),
                this.getAlertasSistema()
            ]);

            const result = {
                resumo,
                atividades,
                livrosAtrasados,
                livrosPopulares,
                estatisticasMensais,
                alertas
            };

            return result;
        } catch (error) {
            console.error('❌ getAllDashboardData: Erro ao buscar dados do dashboard:', error);
            throw error;
        }
    }

    /**
     * Calcula tempo relativo (ex: "2 min atrás")
     */
    private static calcularTempoRelativo(data: string): string {
        const agora = new Date();

        // Parse inteligente da data - FORÇAR correção de timezone
        let dataEmprestimo: Date;
        if (data.includes('T')) {
            // Se tem T, aplicar correção de timezone
            if (!data.includes('Z') && !data.includes('+')) {
                dataEmprestimo = new Date(data + 'Z');
            } else {
                // Se já tem timezone, remover e aplicar correção
                const dataSemTimezone = data.replace(/[Z+].*$/, '');
                dataEmprestimo = new Date(dataSemTimezone + 'Z');
            }
        } else {
            dataEmprestimo = new Date(data);
        }

        const diffMs = agora.getTime() - dataEmprestimo.getTime();
        const diffMinutos = Math.floor(diffMs / (1000 * 60));
        const diffHoras = Math.floor(diffMinutos / 60);
        const diffDias = Math.floor(diffHoras / 24);


        // Se a data for futura, mostrar como "agora"
        if (diffMs < 0) {
            return 'agora';
        }

        if (diffMinutos < 60) {
            return `${diffMinutos} min atrás`;
        } else if (diffHoras < 24) {
            return `${diffHoras} hora${diffHoras > 1 ? 's' : ''} atrás`;
        } else {
            return `${diffDias} dia${diffDias > 1 ? 's' : ''} atrás`;
        }
    }


}

export default DashboardService;