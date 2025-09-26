/**
 * UTILITÁRIO DE MAPEAMENTO DE ERROS - YETI LIBRARY SYSTEM
 * 
 * Converte erros do backend em mensagens amigáveis para o usuário
 */

export interface BackendError {
    message?: string;
    details?: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
}

export class ErrorMapper {
    /**
     * Mapeia erros HTTP para mensagens amigáveis
     */
    static mapHttpError(status: number, errorText?: string): { title: string; message: string } {
        switch (status) {
            case 400:
                return {
                    title: 'Dados Inválidos',
                    message: this.extractErrorMessage(errorText) || 'Os dados fornecidos são inválidos. Verifique as informações e tente novamente.'
                };
            case 401:
                return {
                    title: 'Não Autorizado',
                    message: 'Você não tem permissão para realizar esta ação. Faça login novamente.'
                };
            case 403:
                return {
                    title: 'Acesso Negado',
                    message: 'Você não tem permissão para acessar este recurso.'
                };
            case 404:
                return {
                    title: 'Não Encontrado',
                    message: 'O recurso solicitado não foi encontrado.'
                };
            case 409:
                return {
                    title: 'Conflito',
                    message: this.extractErrorMessage(errorText) || 'Já existe um registro com estas informações.'
                };
            case 422:
                return {
                    title: 'Validação Falhou',
                    message: this.extractErrorMessage(errorText) || 'Os dados não passaram na validação. Verifique as informações.'
                };
            case 500:
                return {
                    title: 'Erro Interno',
                    message: 'Ocorreu um erro interno no servidor. Tente novamente em alguns minutos.'
                };
            default:
                return {
                    title: 'Erro',
                    message: this.extractErrorMessage(errorText) || 'Ocorreu um erro inesperado. Tente novamente.'
                };
        }
    }

    /**
     * Mapeia erros específicos do backend para mensagens amigáveis
     */
    static mapBackendError(error: any): { title: string; message: string } {
        // Se for uma string simples
        if (typeof error === 'string') {
            return this.mapStringError(error);
        }

        // Se for um objeto com propriedades
        if (typeof error === 'object' && error !== null) {
            // Se tiver message específica
            if (error.message) {
                return this.mapStringError(error.message);
            }

            // Se tiver errors de validação
            if (error.errors && typeof error.errors === 'object') {
                const firstError = Object.values(error.errors)[0];
                if (Array.isArray(firstError) && firstError.length > 0) {
                    return {
                        title: 'Validação Falhou',
                        message: firstError[0]
                    };
                }
            }
        }

        return {
            title: 'Erro',
            message: 'Ocorreu um erro inesperado. Tente novamente.'
        };
    }

    /**
     * Mapeia mensagens de erro específicas do backend
     */
    private static mapStringError(errorMessage: string): { title: string; message: string } {
        const message = errorMessage.toLowerCase();

        // Erros de usuário
        if (message.includes('email') && message.includes('já existe')) {
            return {
                title: 'Email Já Cadastrado',
                message: 'Já existe um usuário cadastrado com este email. Use um email diferente.'
            };
        }

        if (message.includes('cpf') && message.includes('já existe')) {
            return {
                title: 'CPF Já Cadastrado',
                message: 'Já existe um usuário cadastrado com este CPF. Verifique o número informado.'
            };
        }

        if (message.includes('email') && message.includes('inválido')) {
            return {
                title: 'Email Inválido',
                message: 'O formato do email está inválido. Verifique e tente novamente.'
            };
        }

        if (message.includes('cpf') && message.includes('inválido')) {
            return {
                title: 'CPF Inválido',
                message: 'O CPF informado é inválido. Verifique o número e tente novamente.'
            };
        }

        // Erros de empréstimo
        if (message.includes('exemplar') && message.includes('não está disponível')) {
            return {
                title: 'Exemplar Indisponível',
                message: 'O exemplar selecionado não está disponível para empréstimo. Escolha outro exemplar.'
            };
        }

        if (message.includes('usuário') && message.includes('inativo') && message.includes('não pode receber empréstimos')) {
            return {
                title: 'Usuário Inativo',
                message: 'Usuários inativos não podem receber empréstimos. Reative o usuário antes de criar o empréstimo.'
            };
        }

        if (message.includes('usuário') && message.includes('não encontrado')) {
            return {
                title: 'Usuário Não Encontrado',
                message: 'O usuário selecionado não foi encontrado. Verifique o ID do usuário.'
            };
        }

        if (message.includes('exemplar') && message.includes('não encontrado')) {
            return {
                title: 'Exemplar Não Encontrado',
                message: 'O exemplar selecionado não foi encontrado. Verifique o ID do exemplar.'
            };
        }

        if (message.includes('livro') && message.includes('não encontrado')) {
            return {
                title: 'Livro Não Encontrado',
                message: 'O livro selecionado não foi encontrado. Verifique o ID do livro.'
            };
        }

        // Erros de autor
        if (message.includes('autor') && message.includes('já existe')) {
            return {
                title: 'Autor Já Cadastrado',
                message: 'Já existe um autor com este nome. Use um nome diferente.'
            };
        }

        // Erros de editora
        if (message.includes('editora') && message.includes('já existe')) {
            return {
                title: 'Editora Já Cadastrada',
                message: 'Já existe uma editora com este nome. Use um nome diferente.'
            };
        }

        // Erros de funcionário
        if (message.includes('funcionário') && message.includes('já existe')) {
            return {
                title: 'Funcionário Já Cadastrado',
                message: 'Já existe um funcionário com este email. Use um email diferente.'
            };
        }

        // Erros de senha
        if (message.includes('senha') && message.includes('muito curta')) {
            return {
                title: 'Senha Muito Curta',
                message: 'A senha deve ter pelo menos 6 caracteres.'
            };
        }

        if (message.includes('senha') && message.includes('não coincidem')) {
            return {
                title: 'Senhas Não Coincidem',
                message: 'As senhas informadas não coincidem. Digite a mesma senha nos dois campos.'
            };
        }

        // Erros de data
        if (message.includes('data') && message.includes('inválida')) {
            return {
                title: 'Data Inválida',
                message: 'A data informada é inválida. Verifique o formato e tente novamente.'
            };
        }

        if (message.includes('data') && message.includes('futura')) {
            return {
                title: 'Data Futura',
                message: 'A data informada não pode ser no futuro. Escolha uma data válida.'
            };
        }

        // Erros genéricos
        if (message.includes('obrigatório')) {
            return {
                title: 'Campo Obrigatório',
                message: 'Preencha todos os campos obrigatórios antes de continuar.'
            };
        }

        if (message.includes('formato') && message.includes('inválido')) {
            return {
                title: 'Formato Inválido',
                message: 'O formato dos dados informados é inválido. Verifique e tente novamente.'
            };
        }

        // Retorna a mensagem original se não conseguir mapear
        return {
            title: 'Erro',
            message: errorMessage
        };
    }

    /**
     * Extrai mensagem de erro de uma string de resposta
     */
    private static extractErrorMessage(errorText?: string): string | null {
        if (!errorText) return null;

        try {
            // Tenta fazer parse como JSON
            const errorObj = JSON.parse(errorText);
            if (errorObj.message) return errorObj.message;
            if (errorObj.error) return errorObj.error;
            if (errorObj.details) return errorObj.details;
        } catch {
            // Se não for JSON, retorna o texto original
            return errorText;
        }

        return null;
    }
}
