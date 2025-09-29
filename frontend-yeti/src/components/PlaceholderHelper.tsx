import React from 'react';

// Tipos de placeholders para diferentes campos
export const PLACEHOLDER_TYPES = {
    // Campos de texto
    NOME: "Digite o nome completo (ex: João Silva Santos)",
    NOME_SIMPLES: "Digite o nome (ex: João)",
    NOME_EMPRESA: "Digite o nome da empresa (ex: Editora ABC)",

    // Campos de contato
    EMAIL: "Digite seu email (ex: joao@email.com)",
    TELEFONE: "Digite apenas números (ex: 11999999999)",
    WEBSITE: "Digite a URL completa (ex: https://www.exemplo.com)",

    // Campos de documento
    CPF: "Digite apenas números (ex: 12345678901)",
    CNPJ: "Digite apenas números (ex: 12345678000195)",
    CEP: "Digite apenas números (ex: 01234567)",

    // Campos de endereço
    ENDERECO: "Digite o endereço completo (ex: Rua das Flores, 123)",
    CIDADE: "Digite o nome da cidade (ex: São Paulo)",
    ESTADO: "Digite a sigla do estado (ex: SP)",
    PAIS: "Digite o nome do país (ex: Brasil)",

    // Campos de livro
    TITULO_LIVRO: "Digite o título do livro (ex: O Pequeno Príncipe)",
    SUBTITULO: "Digite o subtítulo (opcional)",
    ISBN: "Digite o ISBN (ex: 9788535902775)",
    ANO: "Digite o ano de publicação (ex: 2024)",
    GENERO: "Digite o gênero (ex: Ficção, Romance, Aventura)",
    IDIOMA: "Digite o idioma (ex: Português, Inglês, Espanhol)",

    // Campos de senha
    SENHA: "Digite uma senha segura (mínimo 6 caracteres)",
    CONFIRMAR_SENHA: "Digite a mesma senha novamente",

    // Campos de data
    DATA_NASCIMENTO: "Selecione sua data de nascimento",
    DATA_FUNDACAO: "Selecione a data de fundação",
    DATA_ADMISSAO: "Selecione a data de admissão",

    // Campos numéricos
    NUMERO_PAGINAS: "Digite o número de páginas (ex: 250)",
    PRECO: "Digite o preço (ex: 29.90)",
    SALARIO: "Digite o salário (ex: 5000.00)",
    VALOR: "Digite o valor (ex: 100.00)",

    // Campos de texto longo
    DESCRICAO: "Digite uma descrição detalhada",
    SINOPSE: "Digite a sinopse do livro",
    BIOGRAFIA: "Digite a biografia do autor",
    OBSERVACOES: "Digite observações adicionais (opcional)",

    // Campos de localização
    LOCALIZACAO: "Digite a localização (ex: Estante A, Prateleira 3)",
    CARGO: "Digite o cargo (ex: Gerente, Analista, Diretor)",
    NACIONALIDADE: "Digite a nacionalidade (ex: Brasileiro, Americano)",

    // Campos de busca
    BUSCAR: "Digite para buscar...",
    FILTRAR: "Selecione para filtrar...",

    // Campos de código
    CODIGO_BARRAS: "Digite o código de barras (ex: 7891234567890)",
    NUMERO_EXEMPLAR: "Digite o número do exemplar (ex: 001, 002)",

    // Campos de status
    STATUS: "Selecione o status",
    CONDICAO: "Selecione a condição (Bom, Regular, Ruim)",

    // Campos de quantidade
    QUANTIDADE: "Digite a quantidade (ex: 10)",
    ESTOQUE: "Digite a quantidade em estoque (ex: 50)",

    // Campos de período
    PERIODO: "Selecione o período",
    DATA_INICIO: "Selecione a data de início",
    DATA_FIM: "Selecione a data de fim"
} as const;

// Função para obter placeholder baseado no tipo de campo
export const getPlaceholder = (fieldType: keyof typeof PLACEHOLDER_TYPES): string => {
    return PLACEHOLDER_TYPES[fieldType] || "Digite o valor";
};

// Função para obter placeholder baseado no nome do campo
export const getPlaceholderByFieldName = (fieldName: string): string => {
    const fieldNameLower = fieldName.toLowerCase();

    // Mapeamento de nomes de campos para tipos de placeholder
    const fieldMapping: Record<string, keyof typeof PLACEHOLDER_TYPES> = {
        'nome': 'NOME',
        'nomecompleto': 'NOME',
        'email': 'EMAIL',
        'telefone': 'TELEFONE',
        'cpf': 'CPF',
        'cnpj': 'CNPJ',
        'cep': 'CEP',
        'endereco': 'ENDERECO',
        'rua': 'ENDERECO',
        'cidade': 'CIDADE',
        'estado': 'ESTADO',
        'pais': 'PAIS',
        'titulo': 'TITULO_LIVRO',
        'subtitulo': 'SUBTITULO',
        'isbn': 'ISBN',
        'ano': 'ANO',
        'genero': 'GENERO',
        'idioma': 'IDIOMA',
        'senha': 'SENHA',
        'confirmarsenha': 'CONFIRMAR_SENHA',
        'datanascimento': 'DATA_NASCIMENTO',
        'datafundacao': 'DATA_FUNDACAO',
        'dataadmissao': 'DATA_ADMISSAO',
        'numeropaginas': 'NUMERO_PAGINAS',
        'preco': 'PRECO',
        'salario': 'SALARIO',
        'valor': 'VALOR',
        'descricao': 'DESCRICAO',
        'sinopse': 'SINOPSE',
        'biografia': 'BIOGRAFIA',
        'observacoes': 'OBSERVACOES',
        'localizacao': 'LOCALIZACAO',
        'cargo': 'CARGO',
        'nacionalidade': 'NACIONALIDADE',
        'buscar': 'BUSCAR',
        'filtrar': 'FILTRAR',
        'codigobarras': 'CODIGO_BARRAS',
        'numeroexemplar': 'NUMERO_EXEMPLAR',
        'status': 'STATUS',
        'condicao': 'CONDICAO',
        'quantidade': 'QUANTIDADE',
        'estoque': 'ESTOQUE',
        'periodo': 'PERIODO',
        'datainicio': 'DATA_INICIO',
        'datafim': 'DATA_FIM',
        'website': 'WEBSITE',
        'site': 'WEBSITE'
    };

    const placeholderType = fieldMapping[fieldNameLower];
    return placeholderType ? getPlaceholder(placeholderType) : "Digite o valor";
};

// Componente para exibir dicas de preenchimento
interface PlaceholderHintProps {
    fieldName: string;
    className?: string;
}

export const PlaceholderHint: React.FC<PlaceholderHintProps> = ({
    fieldName,
    className = "text-xs text-gray-500 mt-1"
}) => {
    const hint = getPlaceholderByFieldName(fieldName);

    return (
        <p className={className}>
            💡 {hint}
        </p>
    );
};

export default PLACEHOLDER_TYPES;
