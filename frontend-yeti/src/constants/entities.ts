/**
 * CONSTANTES E ENUMS - YETI LIBRARY SYSTEM
 * 
 * Este arquivo contém todas as constantes, enums e valores padrão
 * usados em todo o sistema.
 */

// ========================================
// 1. STATUS DE EMPRÉSTIMO
// ========================================
export const STATUS_EMPRESTIMO = {
    EMPRESTADO: 'Emprestado',
    DEVOLVIDO: 'Devolvido',
    ATRASADO: 'Atrasado',
    RENOVADO: 'Renovado'
} as const;

export type StatusEmprestimo = typeof STATUS_EMPRESTIMO[keyof typeof STATUS_EMPRESTIMO];

// ========================================
// 2. CONDIÇÕES DE EXEMPLAR
// ========================================
export const CONDICAO_EXEMPLAR = {
    EXCELENTE: 'Excelente',
    BOM: 'Bom',
    REGULAR: 'Regular',
    RUIM: 'Ruim',
    DANIFICADO: 'Danificado'
} as const;

export type CondicaoExemplar = typeof CONDICAO_EXEMPLAR[keyof typeof CONDICAO_EXEMPLAR];

// ========================================
// 3. ROLES DE USUÁRIO
// ========================================
export const ROLE_USUARIO = {
    ADMIN: 'Admin',
    FUNCIONARIO: 'Funcionario',
    USUARIO: 'Usuario'
} as const;

export type RoleUsuario = typeof ROLE_USUARIO[keyof typeof ROLE_USUARIO];

// ========================================
// 4. TIPOS DE ALERTA
// ========================================
export const TIPO_ALERTA = {
    ERROR: 'error',
    WARNING: 'warning',
    SUCCESS: 'success',
    INFO: 'info'
} as const;

export type TipoAlerta = typeof TIPO_ALERTA[keyof typeof TIPO_ALERTA];

// ========================================
// 5. PRIORIDADES DE ALERTA
// ========================================
export const PRIORIDADE_ALERTA = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
} as const;

export type PrioridadeAlerta = typeof PRIORIDADE_ALERTA[keyof typeof PRIORIDADE_ALERTA];

// ========================================
// 6. TIPOS DE ATIVIDADE
// ========================================
export const TIPO_ATIVIDADE = {
    LOAN: 'loan',
    RETURN: 'return',
    RENEW: 'renew',
    RESERVE: 'reserve',
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete',
    SYSTEM: 'system',
    ERROR: 'error'
} as const;

export type TipoAtividade = typeof TIPO_ATIVIDADE[keyof typeof TIPO_ATIVIDADE];

// ========================================
// 7. CARGOS DE FUNCIONÁRIO
// ========================================
export const CARGO_FUNCIONARIO = {
    ADMINISTRADOR: 'Administrador',
    BIBLIOTECARIO: 'Bibliotecário',
    ATENDENTE: 'Atendente',
    SUPERVISOR: 'Supervisor',
    AUXILIAR: 'Auxiliar'
} as const;

export type CargoFuncionario = typeof CARGO_FUNCIONARIO[keyof typeof CARGO_FUNCIONARIO];

// ========================================
// 8. GÊNEROS LITERÁRIOS
// ========================================
export const GENERO_LITERARIO = {
    FICCAO: 'Ficção',
    NAO_FICCAO: 'Não Ficção',
    ROMANCE: 'Romance',
    MISTERIO: 'Mistério',
    SUSPENSE: 'Suspense',
    TERROR: 'Terror',
    FANTASIA: 'Fantasia',
    FICCAO_CIENTIFICA: 'Ficção Científica',
    BIOGRAFIA: 'Biografia',
    AUTOBIOGRAFIA: 'Autobiografia',
    HISTORIA: 'História',
    FILOSOFIA: 'Filosofia',
    RELIGIAO: 'Religião',
    CIENCIA: 'Ciência',
    TECNOLOGIA: 'Tecnologia',
    ARTE: 'Arte',
    MUSICA: 'Música',
    CINEMA: 'Cinema',
    LITERATURA: 'Literatura',
    POESIA: 'Poesia',
    TEATRO: 'Teatro',
    INFANTIL: 'Infantil',
    JUVENIL: 'Juvenil',
    DIDATICO: 'Didático',
    TECNICO: 'Técnico',
    MEDICINA: 'Medicina',
    DIREITO: 'Direito',
    ECONOMIA: 'Economia',
    ADMINISTRACAO: 'Administração',
    MARKETING: 'Marketing',
    PSICOLOGIA: 'Psicologia',
    SOCIOLOGIA: 'Sociologia',
    POLITICA: 'Política',
    OUTROS: 'Outros'
} as const;

export type GeneroLiterario = typeof GENERO_LITERARIO[keyof typeof GENERO_LITERARIO];

// ========================================
// 9. IDIOMAS
// ========================================
export const IDIOMAS = {
    PORTUGUES: 'Português',
    INGLES: 'Inglês',
    ESPANHOL: 'Espanhol',
    FRANCES: 'Francês',
    ALEMAO: 'Alemão',
    ITALIANO: 'Italiano',
    CHINES: 'Chinês',
    JAPONES: 'Japonês',
    COREANO: 'Coreano',
    RUSSO: 'Russo',
    ARABE: 'Árabe',
    OUTROS: 'Outros'
} as const;

export type Idioma = typeof IDIOMAS[keyof typeof IDIOMAS];

// ========================================
// 10. ESTADOS BRASILEIROS
// ========================================
export const ESTADOS_BRASIL = {
    AC: 'Acre',
    AL: 'Alagoas',
    AP: 'Amapá',
    AM: 'Amazonas',
    BA: 'Bahia',
    CE: 'Ceará',
    DF: 'Distrito Federal',
    ES: 'Espírito Santo',
    GO: 'Goiás',
    MA: 'Maranhão',
    MT: 'Mato Grosso',
    MS: 'Mato Grosso do Sul',
    MG: 'Minas Gerais',
    PA: 'Pará',
    PB: 'Paraíba',
    PR: 'Paraná',
    PE: 'Pernambuco',
    PI: 'Piauí',
    RJ: 'Rio de Janeiro',
    RN: 'Rio Grande do Norte',
    RS: 'Rio Grande do Sul',
    RO: 'Rondônia',
    RR: 'Roraima',
    SC: 'Santa Catarina',
    SP: 'São Paulo',
    SE: 'Sergipe',
    TO: 'Tocantins'
} as const;

export type EstadoBrasil = typeof ESTADOS_BRASIL[keyof typeof ESTADOS_BRASIL];

// ========================================
// 11. MESES DO ANO
// ========================================
export const MESES_ANO = {
    JANEIRO: 'Janeiro',
    FEVEREIRO: 'Fevereiro',
    MARCO: 'Março',
    ABRIL: 'Abril',
    MAIO: 'Maio',
    JUNHO: 'Junho',
    JULHO: 'Julho',
    AGOSTO: 'Agosto',
    SETEMBRO: 'Setembro',
    OUTUBRO: 'Outubro',
    NOVEMBRO: 'Novembro',
    DEZEMBRO: 'Dezembro'
} as const;

export type MesAno = typeof MESES_ANO[keyof typeof MESES_ANO];

// ========================================
// 12. CONFIGURAÇÕES PADRÃO
// ========================================
export const CONFIGURACOES_PADRAO = {
    MAX_RENOVACOES: 3,
    DIAS_EMPRESTIMO: 14,
    VALOR_MULTA_DIARIA: 2.50,
    DIAS_AVISO_VENCIMENTO: 3,
    TAMANHO_PAGINA: 20,
    TAMANHO_PAGINA_MAX: 100
} as const;

// ========================================
// 13. VALIDAÇÕES
// ========================================
export const VALIDACOES = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    CPF_REGEX: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CEP_REGEX: /^\d{5}-?\d{3}$/,
    TELEFONE_REGEX: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    ISBN_REGEX: /^(978|979)\d{10}$/,
    SENHA_MIN_LENGTH: 6,
    NOME_MAX_LENGTH: 200,
    EMAIL_MAX_LENGTH: 100,
    TELEFONE_MAX_LENGTH: 20,
    CPF_LENGTH: 14,
    CEP_LENGTH: 9,
    ISBN_LENGTH: 13
} as const;

// ========================================
// 14. MENSAGENS DE ERRO
// ========================================
export const MENSAGENS_ERRO = {
    CAMPO_OBRIGATORIO: 'Este campo é obrigatório',
    EMAIL_INVALIDO: 'Email inválido',
    CPF_INVALIDO: 'CPF inválido',
    CEP_INVALIDO: 'CEP inválido',
    TELEFONE_INVALIDO: 'Telefone inválido',
    ISBN_INVALIDO: 'ISBN inválido',
    SENHA_MINIMA: 'Senha deve ter pelo menos 6 caracteres',
    DATA_INVALIDA: 'Data inválida',
    VALOR_INVALIDO: 'Valor inválido',
    TAMANHO_MAXIMO: 'Tamanho máximo excedido',
    TAMANHO_MINIMO: 'Tamanho mínimo não atingido',
    FORMATO_INVALIDO: 'Formato inválido',
    REGISTRO_NAO_ENCONTRADO: 'Registro não encontrado',
    ERRO_SERVIDOR: 'Erro interno do servidor',
    ERRO_REDE: 'Erro de conexão',
    ACESSO_NEGADO: 'Acesso negado',
    SESSAO_EXPIRADA: 'Sessão expirada'
} as const;

// ========================================
// 15. MENSAGENS DE SUCESSO
// ========================================
export const MENSAGENS_SUCESSO = {
    REGISTRO_CRIADO: 'Registro criado com sucesso',
    REGISTRO_ATUALIZADO: 'Registro atualizado com sucesso',
    REGISTRO_EXCLUIDO: 'Registro excluído com sucesso',
    LOGIN_REALIZADO: 'Login realizado com sucesso',
    LOGOUT_REALIZADO: 'Logout realizado com sucesso',
    SENHA_ALTERADA: 'Senha alterada com sucesso',
    EMAIL_ENVIADO: 'Email enviado com sucesso',
    OPERACAO_REALIZADA: 'Operação realizada com sucesso'
} as const;

// ========================================
// 16. ROTAS DA API
// ========================================
export const API_ROUTES = {
    // Autenticação
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',

    // Dashboard
    DASHBOARD_RESUMO: '/api/dashboard/resumo-geral',
    DASHBOARD_ESTATISTICAS: '/api/dashboard/estatisticas-emprestimos',
    DASHBOARD_ALERTAS: '/api/dashboard/alertas',

    // Livros
    LIVROS: '/api/livro',
    LIVROS_DISPONIVEIS: '/api/livro/disponiveis',
    LIVROS_BUSCAR: '/api/livro/buscar',
    LIVROS_POR_GENERO: '/api/livro/por-genero',
    LIVROS_POR_AUTOR: '/api/livro/por-autor',
    LIVROS_POR_EDITORA: '/api/livro/por-editora',
    LIVROS_EM_ESTOQUE: '/api/livro/em-estoque',

    // Autores
    AUTORES: '/api/autor',
    AUTORES_POR_NACIONALIDADE: '/api/autor/por-nacionalidade',
    AUTORES_BUSCAR: '/api/autor/buscar',
    AUTORES_COM_LIVROS: '/api/autor/com-livros',
    AUTORES_TOGGLE_STATUS: '/api/autor/{id}/toggle-status',

    // Editoras
    EDITORAS: '/api/editora',
    EDITORAS_ATIVAS: '/api/editora/ativas',
    EDITORAS_POR_CIDADE: '/api/editora/por-cidade',
    EDITORAS_POR_ESTADO: '/api/editora/por-estado',
    EDITORAS_BUSCAR: '/api/editora/buscar',

    // Exemplares
    EXEMPLARES: '/api/exemplar',
    EXEMPLARES_DISPONIVEIS: '/api/exemplar/disponiveis',
    EXEMPLARES_POR_LIVRO: '/api/exemplar/por-livro',
    EXEMPLARES_DISPONIVEIS_POR_LIVRO: '/api/exemplar/disponiveis-por-livro',
    EXEMPLARES_POR_LOCALIZACAO: '/api/exemplar/por-localizacao',
    EXEMPLARES_POR_CONDICAO: '/api/exemplar/por-condicao',
    EXEMPLARES_POR_NUMERO: '/api/exemplar/por-numero',
    EXEMPLARES_EMPRESTADOS: '/api/exemplar/emprestados',
    EXEMPLARES_VERIFICAR_DISPONIBILIDADE: '/api/exemplar/{id}/verificar-disponibilidade',
    EXEMPLARES_MARCAR_INDISPONIVEL: '/api/exemplar/{id}/marcar-indisponivel',
    EXEMPLARES_MARCAR_DISPONIVEL: '/api/exemplar/{id}/marcar-disponivel',

    // Funcionários
    FUNCIONARIOS: '/api/funcionario',
    FUNCIONARIOS_POR_CARGO: '/api/funcionario/cargo',
    FUNCIONARIOS_ATIVOS: '/api/funcionario/ativos',
    FUNCIONARIOS_INATIVOS: '/api/funcionario/inativos',
    FUNCIONARIOS_POR_EMAIL: '/api/funcionario/email',
    FUNCIONARIOS_COUNT: '/api/funcionario/count',
    FUNCIONARIOS_EXISTS: '/api/funcionario/exists',
    FUNCIONARIOS_TOGGLE_STATUS: '/api/funcionario/{id}/toggle-status',

    // Usuários
    USUARIOS: '/api/usuario',
    USUARIOS_POR_NOME: '/api/usuario/por-nome',
    USUARIOS_POR_CPF: '/api/usuario/por-cpf',
    USUARIOS_TOGGLE_STATUS: '/api/usuario/{id}/toggle-status',

    // Empréstimos
    EMPRESTIMOS: '/api/emprestimo',
    EMPRESTIMOS_POR_USUARIO: '/api/emprestimo/por-usuario',
    EMPRESTIMOS_POR_EXEMPLAR: '/api/emprestimo/por-exemplar',
    EMPRESTIMOS_ATIVOS: '/api/emprestimo/ativos',
    EMPRESTIMOS_VENCIDOS: '/api/emprestimo/vencidos',
    EMPRESTIMOS_POR_STATUS: '/api/emprestimo/por-status',
    EMPRESTIMOS_EMPRESTADOS: '/api/emprestimo/emprestados',
    EMPRESTIMOS_ATRASADOS: '/api/emprestimo/atrasados',
    EMPRESTIMOS_DEVOLVER: '/api/emprestimo/{id}/devolver',
    EMPRESTIMOS_RENOVAR: '/api/emprestimo/{id}/renovar',

    // Relatórios
    RELATORIOS_EMPRESTIMOS_PERIODO: '/api/relatorios/emprestimos-por-periodo',
    RELATORIOS_LIVROS_MAIS_EMPRESTADOS: '/api/relatorios/livros-mais-emprestados',
    RELATORIOS_USUARIOS_MAIS_ATIVOS: '/api/relatorios/usuarios-mais-ativos',
    RELATORIOS_ATRASOS_PERIODO: '/api/relatorios/atrasos-por-periodo',
    RELATORIOS_MULTAS_PERIODO: '/api/relatorios/multas-por-periodo',
    RELATORIOS_ESTOQUE_BAIXO: '/api/relatorios/estoque-baixo'
} as const;

// ========================================
// 16. CONFIGURAÇÕES DE PAGINAÇÃO
// ========================================
export const PAGINACAO = {
    PAGINA_INICIAL: 1,
    TAMANHO_PADRAO: 20,
    TAMANHO_MAXIMO: 100,
    OPCOES_TAMANHO: [10, 20, 50, 100]
} as const;

// ========================================
// 17. CONFIGURAÇÕES DE ORDENAÇÃO
// ========================================
export const ORDENACAO = {
    ASC: 'asc',
    DESC: 'desc'
} as const;

export type DirecaoOrdenacao = typeof ORDENACAO[keyof typeof ORDENACAO];

// ========================================
// 18. CONFIGURAÇÕES DE EXPORTAÇÃO
// ========================================
export const EXPORTACAO = {
    FORMATOS: {
        EXCEL: 'excel',
        PDF: 'pdf',
        CSV: 'csv'
    },
    TAMANHOS: {
        PEQUENO: 100,
        MEDIO: 500,
        GRANDE: 1000
    }
} as const;

// ========================================
// 19. CONFIGURAÇÕES DE NOTIFICAÇÃO
// ========================================
export const NOTIFICACAO = {
    DURACAO_PADRAO: 5000, // 5 segundos
    DURACAO_LONGA: 10000, // 10 segundos
    POSICOES: {
        TOP_RIGHT: 'top-right',
        TOP_LEFT: 'top-left',
        BOTTOM_RIGHT: 'bottom-right',
        BOTTOM_LEFT: 'bottom-left'
    }
} as const;

// ========================================
// 20. CONFIGURAÇÕES DE CACHE
// ========================================
export const CACHE = {
    DURACAO_PADRAO: 300000, // 5 minutos
    DURACAO_LONGA: 1800000, // 30 minutos
    DURACAO_CURTA: 60000, // 1 minuto
    CHAVES: {
        DASHBOARD: 'dashboard',
        LIVROS: 'livros',
        AUTORES: 'autores',
        EDITORAS: 'editoras',
        EXEMPLARES: 'exemplares',
        FUNCIONARIOS: 'funcionarios',
        USUARIOS: 'usuarios',
        EMPRESTIMOS: 'emprestimos'
    }
} as const;

// ========================================
// 21. INTERFACES DE ENTIDADES
// ========================================

export interface Livro {
    id: number;
    titulo: string;
    subtitulo?: string;
    isbn: string;
    ano: number;
    edicao: number;
    numeroPaginas: number;
    idioma: string;
    genero: string;
    sinopse?: string;
    preco: number;
    capaUrl?: string;
    codigoBarras?: string;
    ativo: boolean;
    dataCriacao: string;
    idAutor: number;
    idEditora: number;
    totalExemplares: number;
    exemplaresDisponiveis: number;
    temExemplaresDisponiveis: boolean;
    nomeAutor?: string;
    nomeEditora?: string;
}

export interface LivroCreateRequest {
    titulo: string;
    subtitulo?: string;
    isbn: string;
    ano: number;
    edicao?: number;
    numeroPaginas: number;
    idioma?: string;
    genero: string;
    sinopse?: string;
    preco: number;
    capaUrl?: string;
    codigoBarras?: string;
    idAutor: number;
    idEditora: number;
}

export interface LivroUpdateRequest extends LivroCreateRequest {
    id: number;
}

// ===== EXEMPLARES =====
export interface Exemplar {
    id: number;
    idLivro: number;
    numeroExemplar: string;
    localizacao: string;
    condicao: string;
    disponivel: boolean;
    ativo: boolean;
    dataAquisicao: string;
    valorAquisicao: number;
    fornecedor: string;
    observacoes: string;
    dataCriacao: string;
    tituloLivro?: string;
    isbn?: string;
    nomeAutor?: string;
    nomeEditora?: string;
}

export interface ExemplarCreateRequest {
    idLivro: number;
    numeroExemplar: string;
    localizacao: string;
    condicao: string;
    disponivel: boolean;
    ativo: boolean;
    dataAquisicao: string;
    valorAquisicao: number;
    fornecedor: string;
    observacoes: string;
}

export interface ExemplarUpdateRequest extends ExemplarCreateRequest {
    id: number;
}
