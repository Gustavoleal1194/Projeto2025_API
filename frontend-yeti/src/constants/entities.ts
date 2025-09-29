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
    DASHBOARD_RESUMO: '/api/Dashboard/resumo-geral',
    DASHBOARD_ESTATISTICAS: '/api/Dashboard/estatisticas-emprestimos',
    DASHBOARD_ALERTAS: '/api/Dashboard/alertas',

    // Livros
    LIVROS: '/api/Livro',
    LIVROS_DISPONIVEIS: '/api/Livro/disponiveis',
    LIVROS_BUSCAR: '/api/Livro/buscar',
    LIVROS_POR_GENERO: '/api/Livro/por-genero',
    LIVROS_POR_AUTOR: '/api/Livro/por-autor',
    LIVROS_POR_EDITORA: '/api/Livro/por-editora',
    LIVROS_EM_ESTOQUE: '/api/Livro/em-estoque',

    // Autores
    AUTORES: '/api/Autor',
    AUTORES_POR_NACIONALIDADE: '/api/Autor/por-nacionalidade',
    AUTORES_BUSCAR: '/api/Autor/buscar',
    AUTORES_COM_LIVROS: '/api/Autor/com-livros',
    AUTORES_TOGGLE_STATUS: '/api/Autor/{id}/toggle-status',

    // Editoras
    EDITORAS: '/api/Editora',
    EDITORAS_ATIVAS: '/api/Editora/ativas',
    EDITORAS_POR_CIDADE: '/api/Editora/por-cidade',
    EDITORAS_POR_ESTADO: '/api/Editora/por-estado',
    EDITORAS_BUSCAR: '/api/Editora/buscar',
    EDITORAS_TOGGLE_STATUS: '/api/Editora/{id}/toggle-status',

    // Exemplares
    EXEMPLARES: '/api/Exemplar',
    EXEMPLARES_DISPONIVEIS: '/api/Exemplar/disponiveis',
    EXEMPLARES_POR_LIVRO: '/api/Exemplar/por-livro',
    EXEMPLARES_DISPONIVEIS_POR_LIVRO: '/api/Exemplar/disponiveis-por-livro',
    EXEMPLARES_POR_LOCALIZACAO: '/api/Exemplar/por-localizacao',
    EXEMPLARES_POR_CONDICAO: '/api/Exemplar/por-condicao',
    EXEMPLARES_POR_NUMERO: '/api/Exemplar/por-numero',
    EXEMPLARES_EMPRESTADOS: '/api/Exemplar/emprestados',
    EXEMPLARES_VERIFICAR_DISPONIBILIDADE: '/api/Exemplar/{id}/verificar-disponibilidade',
    EXEMPLARES_MARCAR_INDISPONIVEL: '/api/Exemplar/{id}/marcar-indisponivel',
    EXEMPLARES_MARCAR_DISPONIVEL: '/api/Exemplar/{id}/marcar-disponivel',

    // Funcionários
    FUNCIONARIOS: '/api/Funcionario',
    FUNCIONARIOS_POR_CARGO: '/api/Funcionario/cargo',
    FUNCIONARIOS_ATIVOS: '/api/Funcionario/ativos',
    FUNCIONARIOS_INATIVOS: '/api/Funcionario/inativos',
    FUNCIONARIOS_POR_EMAIL: '/api/Funcionario/email',
    FUNCIONARIOS_COUNT: '/api/Funcionario/count',
    FUNCIONARIOS_EXISTS: '/api/Funcionario/exists',
    FUNCIONARIOS_TOGGLE_STATUS: '/api/Funcionario/{id}/toggle-status',

    // Usuários
    USUARIOS: '/api/Usuario',
    USUARIOS_POR_NOME: '/api/Usuario/por-nome',
    USUARIOS_POR_CPF: '/api/Usuario/por-cpf',
    USUARIOS_TOGGLE_STATUS: '/api/Usuario/{id}/toggle-status',

    // Empréstimos
    EMPRESTIMOS: '/api/Emprestimo',
    EMPRESTIMOS_POR_USUARIO: '/api/Emprestimo/por-usuario',
    EMPRESTIMOS_POR_EXEMPLAR: '/api/Emprestimo/por-exemplar',
    EMPRESTIMOS_ATIVOS: '/api/Emprestimo/ativos',
    EMPRESTIMOS_VENCIDOS: '/api/Emprestimo/vencidos',
    EMPRESTIMOS_POR_STATUS: '/api/Emprestimo/por-status',
    EMPRESTIMOS_EMPRESTADOS: '/api/Emprestimo/emprestados',
    EMPRESTIMOS_ATRASADOS: '/api/Emprestimo/atrasados',
    EMPRESTIMOS_DEVOLVER: '/api/Emprestimo/{id}/devolver',
    EMPRESTIMOS_RENOVAR: '/api/Emprestimo/{id}/renovar',

    // Relatórios
    RELATORIOS_EMPRESTIMOS_PERIODO: '/api/Relatorios/emprestimos-por-periodo',
    RELATORIOS_LIVROS_MAIS_EMPRESTADOS: '/api/Relatorios/livros-mais-emprestados',
    RELATORIOS_USUARIOS_MAIS_ATIVOS: '/api/Relatorios/usuarios-mais-ativos',
    RELATORIOS_ATRASOS_PERIODO: '/api/Relatorios/atrasos-por-periodo',
    RELATORIOS_MULTAS_PERIODO: '/api/Relatorios/multas-por-periodo',
    RELATORIOS_ESTOQUE_BAIXO: '/api/Relatorios/estoque-baixo'
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
