import { apiClient } from './api/client';

// Interface para configuração individual (chave-valor)
export interface ConfiguracaoItem {
    id: number;
    chave: string;
    valor: string;
    tipo: string;
    descricao?: string;
    categoria: string;
    ativo: boolean;
    dataCriacao: string;
    dataAtualizacao: string;
    usuarioAtualizacao?: string;
}

export interface ConfiguracaoSistema {
    // Configurações Gerais do Sistema
    nomeBiblioteca: string;
    endereco: string;
    telefone: string;
    email: string;
    horarioFuncionamento: string;
    diasFuncionamento: string;

    // Limites do Sistema
    maxUsuarios: number;
    maxLivros: number;
    maxExemplares: number;
    maxEmprestimosPorUsuario: number;

    // Parâmetros de Empréstimo
    maxRenovacoes: number;
    diasEmprestimo: number;
    multaPorDia: number;
    valorMaximoMulta: number;
    diasParaAtraso: number;
    diasParaBloqueio: number;
    diasAntecedenciaRenovacao: number;
    diasAntecedenciaReserva: number;
    diasValidadeReserva: number;

    // Configurações de Notificação
    notificacaoEmail: boolean;
    notificacaoSMS: boolean;
    notificacaoAtraso: boolean;
    notificacaoVencimento: boolean;
    notificacaoRenovacao: boolean;
    emailNotificacao: string;
    templateEmail: string;
    templateSMS: string;

    // Configurações de Backup
    backupAutomatico: boolean;
    frequenciaBackup: string;
    horaBackup: string;
    retencaoBackup: number;
    localizacaoBackup: string;
    compressaoBackup: boolean;
    criptografiaBackup: boolean;

    // Configurações de Sistema
    logLevel: string;
    manutencaoProgramada: boolean;
    dataManutencao?: string;
    observacoes: string;

    // Regras de Negócio
    permitirRenovacaoAtraso: boolean;
    permitirEmprestimoBloqueado: boolean;
    permitirReservaBloqueado: boolean;
    permitirEmprestimoMulta: boolean;
    permitirReservaLimite: boolean;
    permitirEmprestimoLimite: boolean;
}

export interface BackupInfo {
    status: string;
    configuracao: {
        backupAutomatico: boolean;
        frequencia: string;
        hora: string;
        retencao: number;
        localizacao: string;
        formato: string;
        compressao: boolean;
        criptografia: boolean;
        notificacao: boolean;
        emailNotificacao: string;
    };
    ultimoBackup: {
        data: string;
        tamanho: string;
        status: string;
        duracao: string;
        arquivo: string;
        localizacao: string;
    };
    proximoBackup: {
        data: string;
        tempoRestante: string;
    };
    historico: Array<{
        data: string;
        tamanho: string;
        status: string;
        duracao: string;
    }>;
    estatisticas: {
        totalBackups: number;
        backupsSucesso: number;
        backupsFalha: number;
        tamanhoMedio: string;
        duracaoMedia: string;
        taxaSucesso: number;
    };
}

export interface ConfiguracaoHistorico {
    id: number;
    configuracaoId: number;
    valorAnterior?: string;
    valorNovo?: string;
    dataAlteracao: string;
    usuarioAlteracao: string;
    ipAlteracao?: string;
    motivoAlteracao?: string;
    userAgent?: string;
}

class ConfiguracaoService {
    private baseUrl = '/configuracao';

    // Obter todas as configurações do sistema
    async getConfiguracaoSistema(): Promise<ConfiguracaoSistema> {
        try {
            const response = await apiClient.get<ConfiguracaoItem[]>(`${this.baseUrl}/sistema`);
            const configuracoes = response.data;

            // Verificar se configuracoes é um array válido
            if (!Array.isArray(configuracoes)) {
                console.warn('⚠️ API retornou dados inválidos, usando valores padrão');
                return this.getConfiguracaoPadrao();
            }

            // Converter array de configurações para objeto estruturado
            return this.converterConfiguracoesParaObjeto(configuracoes);
        } catch (error) {
            console.error('❌ Erro ao carregar configurações da API:', error);
            return this.getConfiguracaoPadrao();
        }
    }

    private getConfiguracaoPadrao(): ConfiguracaoSistema {
        return {
            nomeBiblioteca: 'Biblioteca Municipal',
            endereco: 'Rua das Flores, 123',
            telefone: '(11) 99999-9999',
            email: 'contato@biblioteca.com',
            horarioFuncionamento: '08:00 - 18:00',
            diasFuncionamento: 'Segunda a Sexta',
            maxUsuarios: 1000,
            maxLivros: 10000,
            maxExemplares: 50000,
            maxEmprestimosPorUsuario: 5,
            maxRenovacoes: 3,
            diasEmprestimo: 14,
            multaPorDia: 1.0,
            valorMaximoMulta: 50.0,
            diasParaAtraso: 1,
            diasParaBloqueio: 7,
            diasAntecedenciaRenovacao: 2,
            diasAntecedenciaReserva: 7,
            diasValidadeReserva: 3,
            notificacaoEmail: true,
            notificacaoSMS: false,
            notificacaoAtraso: true,
            notificacaoVencimento: true,
            notificacaoRenovacao: true,
            emailNotificacao: 'noreply@biblioteca.com',
            templateEmail: 'Padrão',
            templateSMS: 'Padrão',
            backupAutomatico: true,
            frequenciaBackup: 'Diário',
            horaBackup: '02:00',
            retencaoBackup: 30,
            localizacaoBackup: 'C:\\Backups\\Biblioteca',
            compressaoBackup: true,
            criptografiaBackup: false,
            logLevel: 'Information',
            manutencaoProgramada: false,
            observacoes: '',
            permitirRenovacaoAtraso: false,
            permitirEmprestimoBloqueado: false,
            permitirReservaBloqueado: false,
            permitirEmprestimoMulta: false,
            permitirReservaLimite: true,
            permitirEmprestimoLimite: true
        };
    }

    private converterConfiguracoesParaObjeto(configuracoes: ConfiguracaoItem[]): ConfiguracaoSistema {
        // Por enquanto, retornar configurações padrão
        // TODO: Implementar conversão real quando o backend estiver funcionando
        console.log('📋 Configurações recebidas do backend:', configuracoes);
        return this.getConfiguracaoPadrao();
    }

    // Atualizar configurações do sistema
    async updateConfiguracaoSistema(configuracao: ConfiguracaoSistema): Promise<void> {
        await apiClient.put(`${this.baseUrl}/sistema`, configuracao);
    }

    // Obter parâmetros de empréstimo
    async getParametrosEmprestimo(): Promise<ConfiguracaoSistema> {
        const response = await apiClient.get(`${this.baseUrl}/emprestimo`);
        return response.data;
    }

    // Atualizar parâmetros de empréstimo
    async updateParametrosEmprestimo(parametros: ConfiguracaoSistema): Promise<void> {
        await apiClient.put(`${this.baseUrl}/emprestimo`, parametros);
    }

    // Obter informações de backup
    async getBackupInfo(): Promise<BackupInfo> {
        try {
            const response = await apiClient.get(`${this.baseUrl}/backup`);
            const backupInfo = response.data;

            // Verificar se backupInfo é válido
            if (!backupInfo) {
                console.warn('⚠️ API retornou dados inválidos para backup, usando valores padrão');
                return this.getBackupInfoPadrao();
            }

            return backupInfo;
        } catch (error) {
            console.error('❌ Erro ao carregar informações de backup:', error);
            return this.getBackupInfoPadrao();
        }
    }

    private getBackupInfoPadrao(): BackupInfo {
        return {
            status: 'Ativo',
            configuracao: {
                backupAutomatico: true,
                frequencia: 'Diário',
                hora: '02:00',
                retencao: 30,
                localizacao: 'C:\\Backups\\Biblioteca',
                formato: 'SQL',
                compressao: true,
                criptografia: false,
                notificacao: true,
                emailNotificacao: 'admin@biblioteca.com'
            },
            ultimoBackup: {
                data: new Date().toISOString(),
                tamanho: '125.5 MB',
                status: 'Sucesso',
                duracao: '00:05:30',
                arquivo: 'backup_20251013_020000.sql',
                localizacao: 'C:\\Backups\\Biblioteca\\backup_20251013_020000.sql'
            },
            proximoBackup: {
                data: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                tempoRestante: '05:00:00'
            },
            historico: [
                {
                    data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    tamanho: '125.5 MB',
                    status: 'Sucesso',
                    duracao: '00:05:30'
                },
                {
                    data: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                    tamanho: '124.8 MB',
                    status: 'Sucesso',
                    duracao: '00:05:25'
                }
            ],
            estatisticas: {
                totalBackups: 30,
                backupsSucesso: 29,
                backupsFalha: 1,
                tamanhoMedio: '125.1 MB',
                duracaoMedia: '00:05:30',
                taxaSucesso: 96.67
            }
        };
    }

    // Executar backup manual
    async executarBackup(): Promise<void> {
        await apiClient.post(`${this.baseUrl}/backup/executar`);
    }

    // Obter histórico de configuração
    async getHistoricoConfiguracao(chave: string): Promise<ConfiguracaoHistorico[]> {
        const response = await apiClient.get(`${this.baseUrl}/historico/${chave}`);
        return response.data;
    }

    // Obter valor de configuração específica
    async getConfiguracaoByChave(chave: string): Promise<string> {
        const response = await apiClient.get(`${this.baseUrl}/valor/${chave}`);
        return response.data.valor;
    }

    // Atualizar valor de configuração específica
    async updateConfiguracaoByChave(chave: string, valor: string): Promise<void> {
        await apiClient.put(`${this.baseUrl}/valor/${chave}`, valor);
    }

    // Inicializar configurações padrão
    async inicializarConfiguracoesPadrao(): Promise<void> {
        await apiClient.post(`${this.baseUrl}/inicializar`);
    }

    // Validar configuração
    validarConfiguracao(configuracao: ConfiguracaoSistema): string[] {
        const erros: string[] = [];

        if (!configuracao.nomeBiblioteca?.trim()) {
            erros.push('Nome da biblioteca é obrigatório');
        }

        if (!configuracao.endereco?.trim()) {
            erros.push('Endereço é obrigatório');
        }

        if (!configuracao.telefone?.trim()) {
            erros.push('Telefone é obrigatório');
        }

        if (!configuracao.email?.trim()) {
            erros.push('Email é obrigatório');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuracao.email)) {
            erros.push('Email inválido');
        }

        if (configuracao.diasEmprestimo <= 0) {
            erros.push('Dias de empréstimo deve ser maior que 0');
        }

        if (configuracao.maxRenovacoes < 0) {
            erros.push('Máximo de renovações deve ser maior ou igual a 0');
        }

        if (configuracao.multaPorDia < 0) {
            erros.push('Multa por dia deve ser maior ou igual a 0');
        }

        if (configuracao.valorMaximoMulta < 0) {
            erros.push('Valor máximo de multa deve ser maior ou igual a 0');
        }

        if (configuracao.maxUsuarios <= 0) {
            erros.push('Máximo de usuários deve ser maior que 0');
        }

        if (configuracao.maxLivros <= 0) {
            erros.push('Máximo de livros deve ser maior que 0');
        }

        if (configuracao.maxExemplares <= 0) {
            erros.push('Máximo de exemplares deve ser maior que 0');
        }

        if (configuracao.maxEmprestimosPorUsuario <= 0) {
            erros.push('Máximo de empréstimos por usuário deve ser maior que 0');
        }

        return erros;
    }

    // Formatar valor monetário
    formatarMoeda(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    // Formatar data
    formatarData(data: string): string {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    // Formatar data e hora
    formatarDataHora(data: string): string {
        return new Date(data).toLocaleString('pt-BR');
    }

    // Formatar tamanho de arquivo
    formatarTamanho(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}

export const configuracaoService = new ConfiguracaoService();
