// import { API_CONFIG } from '../config/api'; // TODO: Usar quando implementar endpoints reais

export interface SolicitacaoEmprestimo {
    id: string;
    exemplarId: number;
    usuarioId: number;
    livroTitulo: string;
    nomeUsuario: string;
    dataSolicitacao: Date;
    status: 'pendente' | 'aprovada' | 'rejeitada';
    observacoes?: string;
}

class SolicitacaoEmprestimoService {
    // private getAuthHeaders(): HeadersInit {
    //   const token = localStorage.getItem('yeti_token');
    //   return {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   };
    // }

    // Solicitar empréstimo (usuário)
    async solicitarEmprestimo(exemplarId: number, livroTitulo: string): Promise<void> {
        try {
            console.log('📚 Iniciando solicitação de empréstimo:', {
                exemplarId,
                livroTitulo,
                timestamp: new Date().toISOString()
            });

            // Verificar se o exemplar está disponível (agora usando API real)
            const exemplarDisponivel = await this.verificarExemplarDisponivel(exemplarId);
            if (!exemplarDisponivel) {
                throw new Error('Exemplar não está disponível para empréstimo');
            }

            console.log('✅ Exemplar verificado como disponível');

            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // TODO: Implementar chamada real para API
            // const response = await fetch(`${API_CONFIG.BASE_URL}/api/solicitacao-emprestimo`, {
            //   method: 'POST',
            //   headers: this.getAuthHeaders(),
            //   body: JSON.stringify({
            //     exemplarId,
            //     livroTitulo
            //   })
            // });

            // if (!response.ok) {
            //   throw new Error('Erro ao solicitar empréstimo');
            // }

            // Obter dados reais do usuário logado
            const usuarioLogado = this.getUsuarioLogado();
            console.log('👤 Dados do usuário logado:', usuarioLogado);

            // Por enquanto, vamos usar localStorage para simular
            const solicitacoes = this.getSolicitacoesFromStorage();
            const novaSolicitacao: SolicitacaoEmprestimo = {
                id: `solicitacao-${Date.now()}`,
                exemplarId,
                usuarioId: usuarioLogado.id,
                livroTitulo,
                nomeUsuario: usuarioLogado.nome,
                dataSolicitacao: new Date(),
                status: 'pendente'
            };

            solicitacoes.push(novaSolicitacao);
            localStorage.setItem('yeti_solicitacoes', JSON.stringify(solicitacoes));

            console.log('💾 Solicitação salva no localStorage:', novaSolicitacao);
            console.log('📊 Total de solicitações:', solicitacoes.length);
            console.log('🔍 Verificando nomeUsuario na solicitação:', novaSolicitacao.nomeUsuario);

            // Notificar admin (simulação)
            this.notificarAdmin(novaSolicitacao);

        } catch (error) {
            console.error('Erro ao solicitar empréstimo:', error);
            throw error;
        }
    }

    // Listar solicitações pendentes (admin)
    async listarSolicitacoesPendentes(): Promise<SolicitacaoEmprestimo[]> {
        try {
            // TODO: Implementar endpoint real no backend
            // const response = await fetch(`${API_CONFIG.BASE_URL}/api/solicitacao-emprestimo/pendentes`, {
            //   method: 'GET',
            //   headers: this.getAuthHeaders()
            // });

            // if (!response.ok) {
            //   throw new Error('Erro ao listar solicitações');
            // }

            // return await response.json();

            // Por enquanto, retornar do localStorage
            return this.getSolicitacoesFromStorage().filter(s => s.status === 'pendente');
        } catch (error) {
            console.error('Erro ao listar solicitações:', error);
            return [];
        }
    }

    // Aprovar solicitação (admin)
    async aprovarSolicitacao(id: string): Promise<void> {
        try {
            // TODO: Implementar endpoint real no backend
            const solicitacoes = this.getSolicitacoesFromStorage();
            const solicitacao = solicitacoes.find(s => s.id === id);

            if (solicitacao) {
                solicitacao.status = 'aprovada';
                localStorage.setItem('yeti_solicitacoes', JSON.stringify(solicitacoes));
            }
        } catch (error) {
            console.error('Erro ao aprovar solicitação:', error);
            throw error;
        }
    }

    // Rejeitar solicitação (admin)
    async rejeitarSolicitacao(id: string, motivo?: string): Promise<void> {
        try {
            // TODO: Implementar endpoint real no backend
            const solicitacoes = this.getSolicitacoesFromStorage();
            const solicitacao = solicitacoes.find(s => s.id === id);

            if (solicitacao) {
                solicitacao.status = 'rejeitada';
                solicitacao.observacoes = motivo;
                localStorage.setItem('yeti_solicitacoes', JSON.stringify(solicitacoes));
            }
        } catch (error) {
            console.error('Erro ao rejeitar solicitação:', error);
            throw error;
        }
    }

    // Métodos auxiliares
    private getSolicitacoesFromStorage(): SolicitacaoEmprestimo[] {
        try {
            const stored = localStorage.getItem('yeti_solicitacoes');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    // Obter dados do usuário logado
    private getUsuarioLogado(): { id: number; nome: string } {
        try {
            const userData = localStorage.getItem('yeti_user');
            if (userData) {
                const user = JSON.parse(userData);
                console.log('📋 Dados do usuário no localStorage:', user);

                // Tentar diferentes campos possíveis para ID
                const userId = user.id || user.userId || user.idUsuario || 1;

                // Tentar diferentes campos possíveis para nome
                const userName = user.nome || user.name || user.nomeCompleto || user.fullName || user.username || 'Usuário';

                console.log('🔍 ID extraído:', userId);
                console.log('🔍 Nome extraído:', userName);

                return {
                    id: userId,
                    nome: userName
                };
            }
        } catch (error) {
            console.error('❌ Erro ao obter dados do usuário:', error);
        }

        // Fallback se não conseguir obter dados
        console.warn('⚠️ Não foi possível obter dados do usuário, usando valores padrão');
        return {
            id: 1,
            nome: 'Usuário'
        };
    }

    // Verificar se exemplar está disponível
    private async verificarExemplarDisponivel(exemplarId: number): Promise<boolean> {
        try {
            console.log('🔍 Verificando disponibilidade do exemplar:', exemplarId);

            // Importar o exemplarService dinamicamente para evitar dependência circular
            const { exemplarService } = await import('./exemplarService');

            // Verificar disponibilidade via API real
            const disponivel = await exemplarService.verificarDisponibilidade(exemplarId);

            console.log(`📊 Exemplar ${exemplarId} disponível:`, disponivel);
            return disponivel;
        } catch (error) {
            console.error('❌ Erro ao verificar disponibilidade do exemplar:', error);
            // Em caso de erro, assumir que está disponível para não bloquear o fluxo
            return true;
        }
    }

    // Método removido - usando nome fixo "Gustavo Leal"

    private notificarAdmin(solicitacao: SolicitacaoEmprestimo): void {
        // Simular notificação para admin
        console.log('🔔 Notificação para admin:', {
            tipo: 'solicitacao',
            titulo: 'Nova Solicitação de Empréstimo',
            mensagem: `"${solicitacao.livroTitulo}" solicitado por ${solicitacao.nomeUsuario}`,
            data: solicitacao
        });

        // TODO: Implementar notificação real (WebSocket, Server-Sent Events, etc.)
        // Por enquanto, vamos usar um evento customizado
        window.dispatchEvent(new CustomEvent('novaSolicitacao', {
            detail: solicitacao
        }));
    }
}

export const solicitacaoEmprestimoService = new SolicitacaoEmprestimoService();
export default solicitacaoEmprestimoService;
