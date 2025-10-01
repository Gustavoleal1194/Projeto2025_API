import { motion } from 'framer-motion';
import { EditIcon, DeleteIcon, PlayIcon, PauseIcon, ReturnIcon } from '../components/Icons';

// Interfaces para configuração da tabela
interface TableColumn {
    key: string;
    label: string;
    icon?: string;
    type?: string;
    sortable?: boolean;
    render?: (item: any, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

interface TableConfig {
    data: any[];
    columns: TableColumn[];
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    emptyMessage?: string;
    className?: string;
    rowKey?: string | ((item: any, index: number) => string | number);
    onRowClick?: (item: any, index: number) => void;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (field: string) => void;
    actions?: (item: any, index: number) => React.ReactNode;
    showActions?: boolean;
    showLoading?: boolean;
    loadingComponent?: React.ReactNode;
}

// Função para criar coluna com ícone
const createIconColumn = (
    key: string,
    label: string,
    icon: string,
    options: Partial<TableColumn> = {}
): TableColumn => ({
    key,
    label,
    icon,
    ...options
});

// Função principal que gera qualquer tabela
const createTable = (config: TableConfig) => {
    const {
        columns,
        data,
        loading = false,
        error = null,
        onRetry,
        emptyMessage = 'Nenhum item encontrado',
        className = '',
        rowKey = 'id',
        onRowClick,
        sortField,
        sortDirection = 'asc',
        onSort,
        actions,
        showActions = false,
        showLoading = true,
        loadingComponent
    } = config;

    const getRowKey = (item: any, index: number): string | number => {
        if (typeof rowKey === 'function') {
            return rowKey(item, index);
        }
        return item[rowKey] || index;
    };

    const handleSort = (field: string) => {
        if (onSort) {
            onSort(field);
        }
    };

    const getSortIcon = (field: string) => {
        if (sortField !== field) return '↕️';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    // Loading state
    if (loading && showLoading) {
        return loadingComponent || (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Carregando dados...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-600 text-lg font-medium mb-2">Erro ao carregar dados</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                Tentar Novamente
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">{emptyMessage}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Table
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700 ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-100 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600" style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)' }}>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider ${column.headerClassName || ''} ${column.sortable ? 'cursor-pointer hover:bg-blue-700 transition-colors duration-200' : ''
                                        }`}
                                    style={{ color: '#ffffff' }}
                                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                                >
                                    <span className="flex items-center gap-2">
                                        {column.icon && <span>{column.icon}</span>}
                                        <span>{column.label}</span>
                                        {column.sortable && (
                                            <span className="ml-1 text-xs">
                                                {getSortIcon(column.key)}
                                            </span>
                                        )}
                                    </span>
                                </th>
                            ))}
                            {showActions && (
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                    <span className="flex items-center gap-2">
                                        <span>⚙️</span>
                                        <span>Ações</span>
                                    </span>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-blue-100 dark:divide-gray-700">
                        {data.map((item, index) => (
                            <motion.tr
                                key={getRowKey(item, index)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''
                                    }`}
                                onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                                    >
                                        {column.render ? column.render(item, index) : item[column.key]}
                                    </td>
                                ))}
                                {showActions && actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        <div className="flex items-center space-x-2">
                                            {actions(item, index)}
                                        </div>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Receitas de configuração para cada tipo de tabela
const TABLE_RECIPES = {
    usuarios: {
        columns: [
            { key: 'usuario', label: 'Usuário', icon: '👤', type: 'avatar' },
            { key: 'email', label: 'Email', icon: '📧', type: 'text' },
            { key: 'cpf', label: 'CPF', icon: '📄', type: 'mono' },
            { key: 'telefone', label: 'Telefone', icon: '📱', type: 'mono' },
            { key: 'ativo', label: 'Status', icon: '📊', type: 'status' }
        ],
        actions: ['edit', 'toggle', 'delete']
    },
    funcionarios: {
        columns: [
            { key: 'funcionario', label: 'Funcionário', icon: '👨‍💼', type: 'avatar' },
            { key: 'email', label: 'Email', icon: '📧', type: 'text' },
            { key: 'telefone', label: 'Telefone', icon: '📱', type: 'mono' },
            { key: 'cargo', label: 'Cargo', icon: '💼', type: 'text' },
            { key: 'ativo', label: 'Status', icon: '📊', type: 'status' }
        ],
        actions: ['edit', 'toggle', 'delete']
    },
    livros: {
        columns: [
            { key: 'capa', label: 'Capa', icon: '🖼️', type: 'book_cover' },
            { key: 'livro', label: 'Livro', icon: '📚', type: 'book_info' },
            { key: 'isbn', label: 'ISBN', icon: '🔢', type: 'mono' },
            { key: 'ano', label: 'Ano', icon: '📅', type: 'text' },
            { key: 'genero', label: 'Gênero', icon: '🏷️', type: 'tag' },
            { key: 'ativo', label: 'Status', icon: '📊', type: 'status' }
        ],
        actions: ['edit', 'delete']
    },
    autores: {
        columns: [
            { key: 'autor', label: 'Autor', icon: '✍️', type: 'avatar' },
            { key: 'email', label: 'Email', icon: '📧', type: 'text' },
            { key: 'dataNascimento', label: 'Data de Nascimento', icon: '🎂', type: 'date' },
            { key: 'nacionalidade', label: 'Nacionalidade', icon: '🌍', type: 'text' },
            { key: 'ativo', label: 'Status', icon: '📊', type: 'status' }
        ],
        actions: ['edit', 'toggle', 'delete']
    },
    editoras: {
        columns: [
            { key: 'editora', label: 'Editora', icon: '🏢', type: 'avatar' },
            { key: 'email', label: 'Email', icon: '📧', type: 'text' },
            { key: 'telefone', label: 'Telefone', icon: '📱', type: 'mono' },
            { key: 'endereco', label: 'Endereço', icon: '📍', type: 'text' },
            { key: 'dataFundacao', label: 'Fundação', icon: '📅', type: 'date' },
            { key: 'ativa', label: 'Status', icon: '📊', type: 'status' }
        ],
        actions: ['edit', 'toggle', 'delete']
    },
    exemplares: {
        columns: [
            { key: 'capa', label: 'Capa', icon: '🖼️', type: 'book_cover' },
            { key: 'livro', label: 'Livro', icon: '📚', type: 'exemplar_book_info' },
            { key: 'exemplar', label: 'Exemplar', icon: '📖', type: 'exemplar_details' },
            { key: 'localizacao', label: 'Localização', icon: '📍', type: 'text' },
            { key: 'condicao', label: 'Condição', icon: '🏷️', type: 'condition' },
            { key: 'disponivel', label: 'Disponível', icon: '📊', type: 'availability' }
        ],
        actions: ['edit', 'delete']
    },
    emprestimos: {
        columns: [
            { key: 'id', label: 'ID', icon: '🆔', type: 'loan_id' },
            { key: 'livro', label: 'Livro', icon: '📚', type: 'book_with_cover' },
            { key: 'usuario', label: 'Usuário', icon: '👤', type: 'user' },
            { key: 'exemplar', label: 'Exemplar', icon: '🔢', type: 'exemplar' },
            { key: 'datas', label: 'Datas', icon: '📅', type: 'loan_dates' },
            { key: 'status', label: 'Status', icon: '📊', type: 'loan_status' }
        ],
        actions: ['edit', 'return', 'delete']
    }
};

// Função para renderizar campos baseado no tipo
const renderField = (item: any, field: any) => {
    const { key, type } = field;
    const value = item[key];

    switch (type) {
        case 'avatar':
            const name = item.nome || item.titulo || item.nomeAutor || 'N/A';
            const initial = name.charAt(0).toUpperCase();
            return (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-14 w-14">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">{initial}</span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">ID: {item.id}</div>
                    </div>
                </div>
            );

        case 'book_cover':
            return (
                <div className="flex justify-center">
                    <div className="h-20 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                        {item.capaUrl ? (
                            <img
                                src={item.capaUrl}
                                alt={item.titulo || 'Livro'}
                                className="h-full w-full object-cover rounded-lg"
                            />
                        ) : (
                            <span className="text-gray-400 text-2xl">📚</span>
                        )}
                    </div>
                </div>
            );

        case 'book_info':
            return (
                <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.titulo || item.nome}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">{item.nomeAutor || item.autor}</div>
                    {item.subtitulo && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.subtitulo}</div>
                    )}
                </div>
            );

        case 'exemplar_book_info':
            return (
                <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.tituloLivro || 'N/A'}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">{item.nomeAutor || 'N/A'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.isbn || 'N/A'}</div>
                </div>
            );

        case 'exemplar_details':
            return (
                <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">#{item.numeroExemplar}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {item.id}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Valor: R$ {item.valorAquisicao?.toFixed(2) || '0.00'}</div>
                </div>
            );

        case 'condition':
            const conditionColors = {
                'Excelente': 'bg-green-100 text-green-800',
                'Bom': 'bg-blue-100 text-blue-800',
                'Regular': 'bg-yellow-100 text-yellow-800',
                'Ruim': 'bg-orange-100 text-orange-800',
                'Péssimo': 'bg-red-100 text-red-800'
            };
            const conditionColor = conditionColors[item.condicao as keyof typeof conditionColors] || 'bg-gray-100 text-gray-800';
            return (
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${conditionColor}`}>
                    {item.condicao || 'N/A'}
                </span>
            );

        case 'availability':
            return (
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${item.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.disponivel ? '✅ Disponível' : '❌ Indisponível'}
                </span>
            );

        case 'loan':
            return (
                <div className="flex items-center">
                    <div className="ml-4">
                        <div className="text-lg font-semibold text-gray-900">Empréstimo #{item.id}</div>
                        <div className="text-sm text-blue-600 font-medium">{item.nomeUsuario || 'Usuário'}</div>
                    </div>
                </div>
            );

        case 'mono':
            return <div className="text-sm font-mono text-gray-900 dark:text-gray-100">{value}</div>;

        case 'text':
            return <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</div>;

        case 'date':
            return <div className="text-sm text-gray-900 dark:text-gray-100">{value ? new Date(value).toLocaleDateString('pt-BR') : 'N/A'}</div>;

        case 'tag':
            return (
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {value}
                </span>
            );

        case 'status':
            // Verificar se é editora (usa 'ativa') ou outras entidades (usam 'ativo')
            const isActive = value !== undefined ? value : (item.ativo !== undefined ? item.ativo : item.ativa);
            return (
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {isActive ? '✅ Ativo' : '❌ Inativo'}
                </span>
            );

        case 'loan_id':
            return (
                <button
                    onClick={() => navigator.clipboard.writeText(item.id.toString())}
                    className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 px-3 py-1 rounded-full inline-block transition-colors duration-200 cursor-pointer border border-blue-200 dark:border-gray-600 hover:border-blue-300"
                    title="Clique para copiar o ID"
                >
                    #{item.id}
                </button>
            );

        case 'book_with_cover':
            return (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-12">
                        <div className="h-16 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            {item.capaUrl ? (
                                <img
                                    src={item.capaUrl}
                                    alt={item.tituloLivro || 'Livro'}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <span className="text-gray-400 text-xl">📚</span>
                            )}
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.tituloLivro || 'N/A'}</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">{item.nomeAutor || 'N/A'}</div>
                    </div>
                </div>
            );

        case 'user':
            return (
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.nomeUsuario || 'N/A'}</div>
            );

        case 'exemplar':
            return (
                <button
                    onClick={() => navigator.clipboard.writeText(item.numeroExemplar || 'N/A')}
                    className="text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full inline-block transition-colors duration-200 cursor-pointer border border-purple-200 hover:border-purple-300"
                    title="Clique para copiar o número do exemplar"
                >
                    #{item.numeroExemplar || 'N/A'}
                </button>
            );

        case 'loan_dates':
            return (
                <div>
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                        <strong>Empréstimo:</strong> {item.dataEmprestimo ? new Date(item.dataEmprestimo).toLocaleDateString('pt-BR') : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                        <strong>Devolução:</strong> {item.dataPrevistaDevolucao ? new Date(item.dataPrevistaDevolucao).toLocaleDateString('pt-BR') : 'N/A'}
                    </div>
                    {item.dataDevolucaoEfetiva && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <strong>Devolvido:</strong> {new Date(item.dataDevolucaoEfetiva).toLocaleDateString('pt-BR')}
                        </div>
                    )}
                </div>
            );

        case 'loan_status':
            // Usar o status real do empréstimo, não o campo 'ativo'
            const status = item.status || 'Emprestado';
            const isLate = !item.dataDevolucaoEfetiva && new Date() > new Date(item.dataPrevistaDevolucao);

            // Determinar o status baseado no campo 'status' e se está atrasado
            let statusText = status;
            let statusColor = 'bg-blue-100 text-blue-800'; // Padrão

            if (status.toLowerCase().includes('devolvido') || item.dataDevolucaoEfetiva) {
                statusText = 'Devolvido';
                statusColor = 'bg-green-100 text-green-800';
            } else if (status.toLowerCase().includes('emprestado') && isLate) {
                statusText = 'Atrasado';
                statusColor = 'bg-red-100 text-red-800';
            } else if (status.toLowerCase().includes('emprestado')) {
                statusText = 'Emprestado';
                statusColor = 'bg-blue-100 text-blue-800';
            }

            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                    {statusText}
                </span>
            );

        default:
            return <div className="text-sm text-gray-900 dark:text-gray-100">{value}</div>;
    }
};

// Função para renderizar ações
const renderActions = (item: any, actions: string[], onEdit: Function, onDelete: Function, onToggle?: Function) => {
    return (
        <div className="flex space-x-2">
            {actions.includes('edit') && (
                <button
                    onClick={() => onEdit(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-800"
                    style={{ minWidth: '36px' }}
                    title="Editar"
                >
                    <EditIcon size={16} />
                </button>
            )}
            {actions.includes('toggle') && onToggle && (
                <button
                    onClick={() => onToggle(item.id)}
                    className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border ${(item.ativo !== undefined ? item.ativo : item.ativa)
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-700'
                        : 'bg-green-500 hover:bg-green-600 text-white border-green-700'
                        }`}
                    style={{ minWidth: '36px' }}
                    title={(item.ativo !== undefined ? item.ativo : item.ativa) ? 'Desativar' : 'Ativar'}
                >
                    {(item.ativo !== undefined ? item.ativo : item.ativa) ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                </button>
            )}
            {actions.includes('return') && item.status && item.status.toLowerCase().includes('emprestado') && !item.dataDevolucaoEfetiva && (
                <button
                    onClick={() => onToggle && onToggle(item.id)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-700"
                    style={{ minWidth: '36px' }}
                    title="Devolver"
                >
                    <ReturnIcon size={16} />
                </button>
            )}
            {actions.includes('delete') && (
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border"
                    style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        borderColor: '#991b1b',
                        borderWidth: '1px',
                        minWidth: '36px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                        e.currentTarget.style.borderColor = '#7f1d1d';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.borderColor = '#991b1b';
                    }}
                    title="Excluir"
                >
                    <DeleteIcon size={16} />
                </button>
            )}
        </div>
    );
};

// Função principal que gera qualquer tabela automaticamente
export const createSmartTable = (
    data: any[],
    entityType: keyof typeof TABLE_RECIPES,
    onEdit: Function,
    onDelete: Function,
    onToggle?: Function,
    loading = false,
    error: string | null = null,
    onRetry?: () => void
) => {
    const recipe = TABLE_RECIPES[entityType];
    if (!recipe) {
        throw new Error(`Tipo de entidade '${entityType}' não suportado`);
    }

    const columns = recipe.columns.map(field =>
        createIconColumn(field.key, field.label, field.icon, {
            render: (item: any) => renderField(item, field),
            className: 'px-6 py-6'
        })
    );

    return createTable({
        data,
        columns,
        loading,
        error,
        onRetry,
        emptyMessage: `Nenhum ${entityType.slice(0, -1)} encontrado`,
        showActions: true,
        actions: (item: any) => renderActions(item, recipe.actions, onEdit, onDelete, onToggle),
        rowKey: 'id',
        className: 'shadow-2xl border border-blue-100'
    });
};
