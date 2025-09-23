/**
 * UTILITÁRIOS PARA ENTIDADES - YETI LIBRARY SYSTEM
 * 
 * Este arquivo contém funções utilitárias para formatação,
 * validação e manipulação das entidades.
 */

import {
    STATUS_EMPRESTIMO,
    CONDICAO_EXEMPLAR,
    ROLE_USUARIO,
    TIPO_ALERTA,
    PRIORIDADE_ALERTA,
    VALIDACOES,
    MENSAGENS_ERRO
} from '../constants/entities';

// ========================================
// 1. FORMATAÇÃO DE DADOS
// ========================================

/**
 * Formata uma data para o padrão brasileiro (dd/mm/yyyy)
 */
export const formatarData = (data: string | Date): string => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
};

/**
 * Formata uma data e hora para o padrão brasileiro
 */
export const formatarDataHora = (data: string | Date): string => {
    const date = new Date(data);
    return date.toLocaleString('pt-BR');
};

/**
 * Formata um valor monetário para o padrão brasileiro
 */
export const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

/**
 * Formata um CPF (xxx.xxx.xxx-xx)
 */
export const formatarCPF = (cpf: string): string => {
    const numeros = cpf.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata um CEP (xxxxx-xxx)
 */
export const formatarCEP = (cep: string): string => {
    const numeros = cep.replace(/\D/g, '');
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Formata um telefone ((xx) xxxxx-xxxx)
 */
export const formatarTelefone = (telefone: string): string => {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
};

/**
 * Formata um ISBN (xxx-xx-xxx-xxxxx-x)
 */
export const formatarISBN = (isbn: string): string => {
    const numeros = isbn.replace(/\D/g, '');
    if (numeros.length === 13) {
        return numeros.replace(/(\d{3})(\d{2})(\d{3})(\d{5})(\d{1})/, '$1-$2-$3-$4-$5');
    }
    return isbn;
};

/**
 * Formata um número de páginas
 */
export const formatarPaginas = (paginas: number): string => {
    return `${paginas} ${paginas === 1 ? 'página' : 'páginas'}`;
};

/**
 * Formata um status de empréstimo
 */
export const formatarStatusEmprestimo = (status: string): string => {
    const statusMap: Record<string, string> = {
        [STATUS_EMPRESTIMO.EMPRESTADO]: 'Emprestado',
        [STATUS_EMPRESTIMO.DEVOLVIDO]: 'Devolvido',
        [STATUS_EMPRESTIMO.ATRASADO]: 'Atrasado',
        [STATUS_EMPRESTIMO.RENOVADO]: 'Renovado'
    };
    return statusMap[status] || status;
};

/**
 * Formata uma condição de exemplar
 */
export const formatarCondicaoExemplar = (condicao: string): string => {
    const condicaoMap: Record<string, string> = {
        [CONDICAO_EXEMPLAR.EXCELENTE]: 'Excelente',
        [CONDICAO_EXEMPLAR.BOM]: 'Bom',
        [CONDICAO_EXEMPLAR.REGULAR]: 'Regular',
        [CONDICAO_EXEMPLAR.RUIM]: 'Ruim',
        [CONDICAO_EXEMPLAR.DANIFICADO]: 'Danificado'
    };
    return condicaoMap[condicao] || condicao;
};

/**
 * Formata um role de usuário
 */
export const formatarRoleUsuario = (role: string): string => {
    const roleMap: Record<string, string> = {
        [ROLE_USUARIO.ADMIN]: 'Administrador',
        [ROLE_USUARIO.FUNCIONARIO]: 'Funcionário',
        [ROLE_USUARIO.USUARIO]: 'Usuário'
    };
    return roleMap[role] || role;
};

// ========================================
// 2. VALIDAÇÕES
// ========================================

/**
 * Valida um email
 */
export const validarEmail = (email: string): boolean => {
    return VALIDACOES.EMAIL_REGEX.test(email);
};

/**
 * Valida um CPF
 */
export const validarCPF = (cpf: string): boolean => {
    const numeros = cpf.replace(/\D/g, '');
    if (numeros.length !== 11) return false;

    // Validação básica de CPF
    if (/^(\d)\1{10}$/.test(numeros)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(numeros[i]) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    if (parseInt(numeros[9]) !== digito1) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(numeros[i]) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    return parseInt(numeros[10]) === digito2;
};

/**
 * Valida um CEP
 */
export const validarCEP = (cep: string): boolean => {
    return VALIDACOES.CEP_REGEX.test(cep);
};

/**
 * Valida um telefone
 */
export const validarTelefone = (telefone: string): boolean => {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length === 10 || numeros.length === 11;
};

/**
 * Valida um ISBN
 */
export const validarISBN = (isbn: string): boolean => {
    const numeros = isbn.replace(/\D/g, '');
    return numeros.length === 13 && VALIDACOES.ISBN_REGEX.test(numeros);
};

/**
 * Valida uma senha
 */
export const validarSenha = (senha: string): boolean => {
    return senha.length >= VALIDACOES.SENHA_MIN_LENGTH;
};

/**
 * Valida uma data
 */
export const validarData = (data: string): boolean => {
    const date = new Date(data);
    return !isNaN(date.getTime());
};

/**
 * Valida se uma data é futura
 */
export const validarDataFutura = (data: string): boolean => {
    const date = new Date(data);
    const hoje = new Date();
    return date > hoje;
};

/**
 * Valida se uma data é passada
 */
export const validarDataPassada = (data: string): boolean => {
    const date = new Date(data);
    const hoje = new Date();
    return date < hoje;
};

// ========================================
// 3. MANIPULAÇÃO DE DADOS
// ========================================

/**
 * Remove caracteres especiais de uma string
 */
export const removerCaracteresEspeciais = (texto: string): string => {
    return texto.replace(/[^\w\s]/gi, '');
};

/**
 * Converte uma string para slug
 */
export const converterParaSlug = (texto: string): string => {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
};

/**
 * Capitaliza a primeira letra de cada palavra
 */
export const capitalizarPalavras = (texto: string): string => {
    return texto.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

/**
 * Trunca um texto com reticências
 */
export const truncarTexto = (texto: string, tamanho: number): string => {
    if (texto.length <= tamanho) return texto;
    return texto.substring(0, tamanho) + '...';
};

/**
 * Gera um número de exemplar único
 */
export const gerarNumeroExemplar = (idLivro: number, sequencia: number): string => {
    return `EX-${idLivro.toString().padStart(4, '0')}-${sequencia.toString().padStart(3, '0')}`;
};

/**
 * Calcula a data de devolução prevista
 */
export const calcularDataDevolucao = (dataEmprestimo: string, diasEmprestimo: number = 14): string => {
    const data = new Date(dataEmprestimo);
    data.setDate(data.getDate() + diasEmprestimo);
    return data.toISOString();
};

/**
 * Calcula a multa por atraso
 */
export const calcularMulta = (diasAtraso: number, valorDiario: number = 2.50): number => {
    return diasAtraso * valorDiario;
};

/**
 * Verifica se um empréstimo está atrasado
 */
export const verificarAtraso = (dataPrevistaDevolucao: string): boolean => {
    const dataPrevista = new Date(dataPrevistaDevolucao);
    const hoje = new Date();
    return hoje > dataPrevista;
};

/**
 * Calcula os dias de atraso
 */
export const calcularDiasAtraso = (dataPrevistaDevolucao: string): number => {
    const dataPrevista = new Date(dataPrevistaDevolucao);
    const hoje = new Date();
    const diffTime = hoje.getTime() - dataPrevista.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ========================================
// 4. FORMATAÇÃO DE STATUS
// ========================================

/**
 * Retorna a cor do status de empréstimo
 */
export const obterCorStatusEmprestimo = (status: string): string => {
    const cores: Record<string, string> = {
        [STATUS_EMPRESTIMO.EMPRESTADO]: 'text-blue-600 bg-blue-100',
        [STATUS_EMPRESTIMO.DEVOLVIDO]: 'text-green-600 bg-green-100',
        [STATUS_EMPRESTIMO.ATRASADO]: 'text-red-600 bg-red-100',
        [STATUS_EMPRESTIMO.RENOVADO]: 'text-yellow-600 bg-yellow-100'
    };
    return cores[status] || 'text-gray-600 bg-gray-100';
};

/**
 * Retorna a cor da condição do exemplar
 */
export const obterCorCondicaoExemplar = (condicao: string): string => {
    const cores: Record<string, string> = {
        [CONDICAO_EXEMPLAR.EXCELENTE]: 'text-green-600 bg-green-100',
        [CONDICAO_EXEMPLAR.BOM]: 'text-blue-600 bg-blue-100',
        [CONDICAO_EXEMPLAR.REGULAR]: 'text-yellow-600 bg-yellow-100',
        [CONDICAO_EXEMPLAR.RUIM]: 'text-orange-600 bg-orange-100',
        [CONDICAO_EXEMPLAR.DANIFICADO]: 'text-red-600 bg-red-100'
    };
    return cores[condicao] || 'text-gray-600 bg-gray-100';
};

/**
 * Retorna a cor do tipo de alerta
 */
export const obterCorTipoAlerta = (tipo: string): string => {
    const cores: Record<string, string> = {
        [TIPO_ALERTA.ERROR]: 'text-red-600 bg-red-100 border-red-200',
        [TIPO_ALERTA.WARNING]: 'text-yellow-600 bg-yellow-100 border-yellow-200',
        [TIPO_ALERTA.SUCCESS]: 'text-green-600 bg-green-100 border-green-200',
        [TIPO_ALERTA.INFO]: 'text-blue-600 bg-blue-100 border-blue-200'
    };
    return cores[tipo] || 'text-gray-600 bg-gray-100 border-gray-200';
};

/**
 * Retorna a cor da prioridade do alerta
 */
export const obterCorPrioridadeAlerta = (prioridade: string): string => {
    const cores: Record<string, string> = {
        [PRIORIDADE_ALERTA.HIGH]: 'bg-red-500',
        [PRIORIDADE_ALERTA.MEDIUM]: 'bg-yellow-500',
        [PRIORIDADE_ALERTA.LOW]: 'bg-green-500'
    };
    return cores[prioridade] || 'bg-gray-500';
};

// ========================================
// 5. UTILITÁRIOS DE FORMULÁRIO
// ========================================

/**
 * Gera mensagens de erro para validação
 */
export const gerarMensagemErro = (_campo: string, valor: any, regras: any): string => {
    if (!valor && regras.obrigatorio) {
        return MENSAGENS_ERRO.CAMPO_OBRIGATORIO;
    }

    if (valor && regras.tamanhoMaximo && valor.length > regras.tamanhoMaximo) {
        return MENSAGENS_ERRO.TAMANHO_MAXIMO;
    }

    if (valor && regras.tamanhoMinimo && valor.length < regras.tamanhoMinimo) {
        return MENSAGENS_ERRO.TAMANHO_MINIMO;
    }

    if (valor && regras.tipo === 'email' && !validarEmail(valor)) {
        return MENSAGENS_ERRO.EMAIL_INVALIDO;
    }

    if (valor && regras.tipo === 'cpf' && !validarCPF(valor)) {
        return MENSAGENS_ERRO.CPF_INVALIDO;
    }

    if (valor && regras.tipo === 'cep' && !validarCEP(valor)) {
        return MENSAGENS_ERRO.CEP_INVALIDO;
    }

    if (valor && regras.tipo === 'telefone' && !validarTelefone(valor)) {
        return MENSAGENS_ERRO.TELEFONE_INVALIDO;
    }

    if (valor && regras.tipo === 'isbn' && !validarISBN(valor)) {
        return MENSAGENS_ERRO.ISBN_INVALIDO;
    }

    if (valor && regras.tipo === 'senha' && !validarSenha(valor)) {
        return MENSAGENS_ERRO.SENHA_MINIMA;
    }

    if (valor && regras.tipo === 'data' && !validarData(valor)) {
        return MENSAGENS_ERRO.DATA_INVALIDA;
    }

    return '';
};

/**
 * Limpa dados de formulário
 */
export const limparDadosFormulario = (dados: any): any => {
    const dadosLimpos: any = {};

    for (const [chave, valor] of Object.entries(dados)) {
        if (valor !== null && valor !== undefined && valor !== '') {
            dadosLimpos[chave] = valor;
        }
    }

    return dadosLimpos;
};

/**
 * Converte dados de formulário para o formato da API
 */
export const converterParaAPI = (dados: any): any => {
    const dadosAPI: any = {};

    for (const [chave, valor] of Object.entries(dados)) {
        if (valor instanceof Date) {
            dadosAPI[chave] = valor.toISOString();
        } else if (typeof valor === 'string' && valor.includes('T') && valor.includes('Z')) {
            // Já é uma data ISO
            dadosAPI[chave] = valor;
        } else {
            dadosAPI[chave] = valor;
        }
    }

    return dadosAPI;
};

// ========================================
// 6. UTILITÁRIOS DE PAGINAÇÃO
// ========================================

/**
 * Calcula o total de páginas
 */
export const calcularTotalPaginas = (totalRegistros: number, tamanhoPagina: number): number => {
    return Math.ceil(totalRegistros / tamanhoPagina);
};

/**
 * Calcula o offset para paginação
 */
export const calcularOffset = (pagina: number, tamanhoPagina: number): number => {
    return (pagina - 1) * tamanhoPagina;
};

/**
 * Gera array de números de página para paginação
 */
export const gerarNumerosPagina = (paginaAtual: number, totalPaginas: number, maxBotoes: number = 5): number[] => {
    const numeros: number[] = [];
    const metade = Math.floor(maxBotoes / 2);

    let inicio = Math.max(1, paginaAtual - metade);
    let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

    if (fim - inicio + 1 < maxBotoes) {
        inicio = Math.max(1, fim - maxBotoes + 1);
    }

    for (let i = inicio; i <= fim; i++) {
        numeros.push(i);
    }

    return numeros;
};

// ========================================
// 7. UTILITÁRIOS DE BUSCA E FILTRO
// ========================================

/**
 * Normaliza texto para busca
 */
export const normalizarTextoBusca = (texto: string): string => {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
};

/**
 * Verifica se um texto contém outro (busca)
 */
export const contemTexto = (texto: string, busca: string): boolean => {
    const textoNormalizado = normalizarTextoBusca(texto);
    const buscaNormalizada = normalizarTextoBusca(busca);
    return textoNormalizado.includes(buscaNormalizada);
};

/**
 * Filtra array por propriedade
 */
export const filtrarPorPropriedade = <T>(array: T[], propriedade: keyof T, valor: any): T[] => {
    return array.filter(item => {
        const valorItem = item[propriedade];
        if (typeof valorItem === 'string') {
            return contemTexto(valorItem, valor);
        }
        return valorItem === valor;
    });
};

/**
 * Ordena array por propriedade
 */
export const ordenarPorPropriedade = <T>(array: T[], propriedade: keyof T, direcao: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
        const valorA = a[propriedade];
        const valorB = b[propriedade];

        if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
        if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
        return 0;
    });
};
