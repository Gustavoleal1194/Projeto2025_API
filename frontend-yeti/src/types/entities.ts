/**
 * INTERFACES DAS ENTIDADES - YETI LIBRARY SYSTEM
 * 
 * Este arquivo contém todas as interfaces TypeScript baseadas nas entidades do backend.
 * Use estas interfaces para tipagem correta em todo o frontend.
 */

// ========================================
// 1. LIVRO
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
    sinopse: string;
    preco: number;
    capaUrl: string;
    codigoBarras: string;
    ativo: boolean;
    dataCriacao: string; // ISO string
    idAutor: number;
    idEditora: number;
    // Propriedades calculadas (somente leitura)
    totalExemplares: number;
    exemplaresDisponiveis: number;
    temExemplaresDisponiveis: boolean;
    // Propriedades de navegação (opcionais)
    nomeAutor?: string;
    nomeEditora?: string;
}

// ========================================
// 2. AUTOR
// ========================================
export interface Autor {
    id: number;
    nome: string;
    nomeCompleto: string;
    nomeArtistico: string;
    nacionalidade: string;
    paisOrigem: string;
    dataNascimento: string; // ISO string
    website: string;
    email: string;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;
    ativo: boolean;
    dataCriacao: string; // ISO string
}

// ========================================
// 3. EDITORA
// ========================================
export interface Editora {
    id: number;
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;
    dataFundacao: string; // ISO string
    site: string;
    ativa: boolean;
    dataCriacao: string; // ISO string
}

// ========================================
// 4. EXEMPLAR
// ========================================
export interface Exemplar {
    id: number;
    idLivro: number;
    numeroExemplar: string;
    localizacao: string;
    condicao: string;
    disponivel: boolean;
    ativo: boolean;
    dataAquisicao: string; // ISO string
    valorAquisicao: number;
    fornecedor: string;
    observacoes: string;
    dataCriacao: string; // ISO string
    // Propriedades de navegação (opcionais)
    tituloLivro?: string;
    isbn?: string;
    nomeAutor?: string;
    nomeEditora?: string;
}

// ========================================
// 5. FUNCIONÁRIO
// ========================================
export interface Funcionario {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    cargo: string;
    salario: number;
    dataAdmissao: string; // ISO string
    dataDemissao?: string; // ISO string (nullable)
    ativo: boolean;
}

// ========================================
// 6. USUÁRIO
// ========================================
export interface Usuario {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    cpf: string;
    dataNascimento: string; // ISO string
    ativo: boolean;
}

// ========================================
// 6.1. USUÁRIO DTO (para formulários)
// ========================================
export interface UsuarioDTO {
    id?: number;
    nome: string;
    email: string;
    telefone?: string;
    senha?: string;
    cpf: string;
    dataNascimento?: string; // ISO string
    ativo?: boolean;
}

// ========================================
// 7. EMPRÉSTIMO
// ========================================
export interface Emprestimo {
    id: number;
    idExemplar: number;
    idUsuario: number;
    dataEmprestimo: string; // ISO string
    dataPrevistaDevolucao: string; // ISO string
    dataDevolucao?: string; // ISO string (nullable)
    dataRenovacao?: string; // ISO string (nullable)
    quantidadeRenovacoes: number;
    maxRenovacoes: number;
    multa: number;
    status: string;
    observacoes: string;
    ativo: boolean;
    dataCriacao: string; // ISO string
    // Propriedades de navegação (opcionais)
    tituloLivro?: string;
    numeroExemplar?: string;
    nomeUsuario?: string;
    emailUsuario?: string;

    // Informações do livro (para exibição)
    nomeAutor?: string;
    nomeEditora?: string;
    genero?: string;
    ano?: number;
    sinopse?: string;
    capaUrl?: string;
    numeroPaginas?: number;
    idioma?: string;

    // Propriedades calculadas (somente leitura)
    estaAtrasado: boolean;
    diasAtraso: number;
    podeRenovar: boolean;
}

// ========================================
// 8. LOGIN
// ========================================
export interface Login {
    email: string;
    senha: string;
}

// ========================================
// 9. TOKEN
// ========================================
export interface Token {
    token: string;
    expiration: string; // ISO string
    tipo: string;
    nome: string;
    email: string;
    role: string;
}

// ========================================
// 10. DASHBOARD
// ========================================
export interface DashboardData {
    totalUsuarios: number;
    totalLivros: number;
    totalExemplares: number;
    emprestimosAtivos: number;
    livrosAtrasados: number;
    funcionariosAtivos: number;
    usuariosOnline: number;
    livrosDisponiveis: number;
}

export interface Activity {
    id: number | string; // Aceita tanto number quanto string para IDs únicos
    user: string;
    action: string;
    time: string;
    type: 'loan' | 'return' | 'renewal' | 'overdue';
    status: 'success' | 'warning' | 'error' | 'info';
    realDate?: Date; // Data real para ordenação
}

export interface OverdueBook {
    id: number;
    title: string;
    user: string;
    daysOverdue: number;
    exemplar: string;
    multa: number;
}

export interface TopBook {
    id: number;
    title: string;
    author: string;
    emprestimos: number;
    rating: number;
}

export interface MonthlyStat {
    month: string;
    emprestimos: number;
    devolucoes: number;
}

export interface SystemAlert {
    id: number;
    type: string;
    message: string;
    priority: string;
}

// ========================================
// 11. TIPOS DE STATUS E ENUMS
// ========================================
export type StatusEmprestimo = 'Emprestado' | 'Devolvido' | 'Atrasado' | 'Renovado';
export type CondicaoExemplar = 'Excelente' | 'Bom' | 'Regular' | 'Ruim' | 'Danificado';
export type RoleUsuario = 'Admin' | 'Funcionario' | 'Usuario';
export type TipoAlerta = 'error' | 'warning' | 'success' | 'info';
export type PrioridadeAlerta = 'high' | 'medium' | 'low';

// ========================================
// 12. INTERFACES PARA FORMULÁRIOS
// ========================================
export interface LivroForm {
    titulo: string;
    subtitulo?: string;
    isbn: string;
    ano: number;
    edicao: number;
    numeroPaginas: number;
    idioma: string;
    genero: string;
    sinopse: string;
    preco: number;
    capaUrl: string;
    codigoBarras: string;
    ativo: boolean;
    idAutor: number;
    idEditora: number;
}

export interface AutorForm {
    nome: string;
    nomeCompleto: string;
    nomeArtistico: string;
    nacionalidade: string;
    paisOrigem: string;
    dataNascimento: string;
    website: string;
    email: string;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;
    ativo: boolean;
}

export interface EditoraForm {
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;
    dataFundacao: string;
    site: string;
    ativa: boolean;
}

export interface ExemplarForm {
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

export interface FuncionarioForm {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    cargo: string;
    salario: number;
    dataAdmissao: string;
    dataDemissao?: string;
    ativo: boolean;
}

export interface UsuarioForm {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    cpf: string;
    dataNascimento: string;
}

export interface EmprestimoForm {
    idExemplar: number;
    idUsuario: number;
    dataEmprestimo: string;
    dataPrevistaDevolucao: string;
    observacoes: string;
}

// ========================================
// 13. INTERFACES PARA RESPOSTAS DA API
// ========================================
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// ========================================
// 14. INTERFACES PARA FILTROS E BUSCA
// ========================================
export interface LivroFilter {
    titulo?: string;
    autor?: string;
    editora?: string;
    genero?: string;
    ano?: number;
    ativo?: boolean;
    temExemplaresDisponiveis?: boolean;
}

export interface EmprestimoFilter {
    status?: StatusEmprestimo;
    usuario?: string;
    livro?: string;
    dataInicio?: string;
    dataFim?: string;
    atrasado?: boolean;
}

export interface UsuarioFilter {
    nome?: string;
    email?: string;
    cpf?: string;
    ativo?: boolean;
}

export interface FuncionarioFilter {
    nome?: string;
    email?: string;
    cargo?: string;
    ativo?: boolean;
}

// ========================================
// 15. INTERFACES PARA RELATÓRIOS
// ========================================
export interface RelatorioEmprestimos {
    periodo: {
        inicio: string;
        fim: string;
    };
    totalEmprestimos: number;
    totalDevolucoes: number;
    totalAtrasos: number;
    totalMultas: number;
    emprestimosPorDia: Array<{
        data: string;
        emprestimos: number;
        devolucoes: number;
    }>;
}

export interface RelatorioLivrosPopulares {
    periodo: {
        inicio: string;
        fim: string;
    };
    livros: Array<{
        id: number;
        titulo: string;
        autor: string;
        totalEmprestimos: number;
        ranking: number;
    }>;
}

export interface RelatorioUsuariosAtivos {
    periodo: {
        inicio: string;
        fim: string;
    };
    usuarios: Array<{
        id: number;
        nome: string;
        email: string;
        totalEmprestimos: number;
        ranking: number;
    }>;
}

// ========================================
// 16. INTERFACES PARA CONFIGURAÇÕES
// ========================================
export interface ConfiguracaoSistema {
    maxRenovacoes: number;
    diasEmprestimo: number;
    valorMultaDiaria: number;
    diasAvisoVencimento: number;
    emailNotificacoes: boolean;
    smsNotificacoes: boolean;
}

// ========================================
// 17. INTERFACES PARA NOTIFICAÇÕES
// ========================================
export interface Notificacao {
    id: number;
    titulo: string;
    mensagem: string;
    tipo: TipoAlerta;
    prioridade: PrioridadeAlerta;
    lida: boolean;
    dataCriacao: string;
    dataLeitura?: string;
}

// ========================================
// 18. INTERFACES PARA AUDITORIA
// ========================================
export interface Auditoria {
    id: number;
    entidade: string;
    entidadeId: number;
    acao: string;
    usuario: string;
    dadosAnteriores?: any;
    dadosNovos?: any;
    dataAcao: string;
    ipAddress: string;
    userAgent: string;
}

// ========================================
// 19. INTERFACES PARA ESTATÍSTICAS
// ========================================
export interface EstatisticasGerais {
    totalUsuarios: number;
    totalLivros: number;
    totalExemplares: number;
    totalEmprestimos: number;
    totalEmprestimosAtivos: number;
    totalAtrasos: number;
    totalMultas: number;
    usuariosOnline: number;
    livrosDisponiveis: number;
    funcionariosAtivos: number;
}

export interface EstatisticasMensais {
    mes: string;
    emprestimos: number;
    devolucoes: number;
    atrasos: number;
    multas: number;
    novosUsuarios: number;
    novosLivros: number;
}

// ========================================
// 20. INTERFACES PARA EXPORTAÇÃO
// ========================================
export interface ExportacaoConfig {
    formato: 'excel' | 'pdf' | 'csv';
    entidade: string;
    filtros?: any;
    campos: string[];
    ordenacao?: {
        campo: string;
        direcao: 'asc' | 'desc';
    };
}

export interface ExportacaoResultado {
    sucesso: boolean;
    arquivo?: string;
    erro?: string;
    totalRegistros: number;
}
