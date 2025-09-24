/**
 * PÁGINA MEUS EMPRÉSTIMOS - YETI LIBRARY SYSTEM
 * 
 * Página para usuários visualizarem seu histórico completo de empréstimos
 * Inclui livros atualmente emprestados e histórico de empréstimos
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UsuarioLayout from '../components/Layout/UsuarioLayout';
import meusLivrosService, { type MeuLivro, type FiltrosMeusLivros } from '../services/meusLivrosService';
import { useFavorites } from '../hooks/useFavorites';

const MeusEmprestimos: React.FC = () => {
    // Estados
    const [emprestimos, setEmprestimos] = useState<MeuLivro[]>([]);
    const [emprestimosFiltrados, setEmprestimosFiltrados] = useState<MeuLivro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filtros, setFiltros] = useState<FiltrosMeusLivros>({});
    const [showFiltros, setShowFiltros] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof MeuLivro>('dataEmprestimo');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Hook de favoritos
    const { isFavorite, toggleFavorite } = useFavorites();

    const emprestimosPerPage = 10;

    // Carregar dados
    const loadEmprestimos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await meusLivrosService.listarMeusLivros();
            setEmprestimos(data);
        } catch (err) {
            console.error('Erro ao carregar empréstimos:', err);
            setError('Erro ao carregar empréstimos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmprestimos();
    }, []);

    // Aplicar filtros e busca
    useEffect(() => {
        let filtrados = [...emprestimos];

        // Filtro por status
        if (filtros.status) {
            filtrados = filtrados.filter(emprestimo => emprestimo.status === filtros.status);
        }

        // Filtro por atrasado
        if (filtros.atrasado !== undefined) {
            filtrados = filtrados.filter(emprestimo => emprestimo.estaAtrasado === filtros.atrasado);
        }

        // Filtro por gênero
        if (filtros.genero) {
            filtrados = filtrados.filter(emprestimo =>
                emprestimo.genero.toLowerCase().includes(filtros.genero!.toLowerCase())
            );
        }

        // Filtro por autor
        if (filtros.autor) {
            filtrados = filtrados.filter(emprestimo =>
                emprestimo.nomeAutor.toLowerCase().includes(filtros.autor!.toLowerCase())
            );
        }

        // Busca por termo
        if (searchQuery.trim()) {
            const termo = searchQuery.toLowerCase();
            filtrados = filtrados.filter(emprestimo =>
                emprestimo.titulo.toLowerCase().includes(termo) ||
                emprestimo.nomeAutor.toLowerCase().includes(termo) ||
                emprestimo.genero.toLowerCase().includes(termo) ||
                emprestimo.sinopse.toLowerCase().includes(termo)
            );
        }

        // Ordenação
        filtrados.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            // Tratar valores undefined
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
            if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setEmprestimosFiltrados(filtrados);
        setCurrentPage(1);
    }, [emprestimos, filtros, searchQuery, sortField, sortDirection]);

    // Handlers
    const handleFiltroChange = (campo: keyof FiltrosMeusLivros, valor: any) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limparFiltros = () => {
        setFiltros({});
        setSearchQuery('');
    };

    const handleSort = (campo: keyof MeuLivro) => {
        if (sortField === campo) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(campo);
            setSortDirection('asc');
        }
    };

    const highlightSearchTerm = (text: string, searchTerm: string) => {
        if (!searchTerm.trim()) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    };

    // Paginação
    const totalPages = Math.ceil(emprestimosFiltrados.length / emprestimosPerPage);
    const startIndex = (currentPage - 1) * emprestimosPerPage;
    const endIndex = startIndex + emprestimosPerPage;
    const emprestimosPaginados = emprestimosFiltrados.slice(startIndex, endIndex);

    // Estatísticas
    const estatisticas = {
        total: emprestimos.length,
        ativos: emprestimos.filter(e => e.status === 'Emprestado').length,
        atrasados: emprestimos.filter(e => e.estaAtrasado).length,
        devolvidos: emprestimos.filter(e => e.status === 'Devolvido').length,
        proximosVencimentos: emprestimos.filter(e => {
            const hoje = new Date();
            const dataVencimento = new Date(e.dataPrevistaDevolucao);
            const diffTime = dataVencimento.getTime() - hoje.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return e.status === 'Emprestado' && diffDays >= 0 && diffDays <= 3;
        }).length
    };

    const statsCards = [
        { title: 'Total', value: estatisticas.total.toString(), icon: '📚', color: 'bg-blue-500' },
        { title: 'Ativos', value: estatisticas.ativos.toString(), icon: '📖', color: 'bg-green-500' },
        { title: 'Atrasados', value: estatisticas.atrasados.toString(), icon: '⚠️', color: 'bg-red-500' },
        { title: 'Devolvidos', value: estatisticas.devolvidos.toString(), icon: '✅', color: 'bg-gray-500' },
        { title: 'Próximos Vencimentos', value: estatisticas.proximosVencimentos.toString(), icon: '⏰', color: 'bg-yellow-500' }
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (emprestimo: MeuLivro) => {
        if (emprestimo.estaAtrasado) return 'text-red-600 bg-red-100';
        if (emprestimo.status === 'Emprestado') return 'text-green-600 bg-green-100';
        if (emprestimo.status === 'Devolvido') return 'text-gray-600 bg-gray-100';
        return 'text-blue-600 bg-blue-100';
    };

    const getStatusText = (emprestimo: MeuLivro) => {
        if (emprestimo.estaAtrasado) return 'Atrasado';
        if (emprestimo.status === 'Emprestado') return 'Emprestado';
        if (emprestimo.status === 'Devolvido') return 'Devolvido';
        return emprestimo.status;
    };

    return (
        <UsuarioLayout
            pageTitle="Meus Empréstimos"
            pageSubtitle="Histórico completo dos seus empréstimos"
        >
            <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 shadow-lg border border-gray-200"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-xl`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Header com Filtros */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">Histórico de Empréstimos</h2>
                            <span className="text-gray-600">
                                {emprestimosFiltrados.length} empréstimo{emprestimosFiltrados.length !== 1 ? 's' : ''} encontrado{emprestimosFiltrados.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFiltros(!showFiltros)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                🔍 {showFiltros ? 'Ocultar' : 'Mostrar'} Filtros
                            </button>

                            <button
                                onClick={limparFiltros}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                            >
                                🗑️ Limpar
                            </button>
                        </div>
                    </div>

                    {/* Filtros Avançados */}
                    {showFiltros && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={filtros.status || ''}
                                        onChange={(e) => handleFiltroChange('status', e.target.value || undefined)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Todos</option>
                                        <option value="Emprestado">Emprestado</option>
                                        <option value="Devolvido">Devolvido</option>
                                        <option value="Atrasado">Atrasado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Atraso</label>
                                    <select
                                        value={filtros.atrasado === undefined ? '' : filtros.atrasado.toString()}
                                        onChange={(e) => handleFiltroChange('atrasado', e.target.value === '' ? undefined : e.target.value === 'true')}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Todos</option>
                                        <option value="false">Em dia</option>
                                        <option value="true">Atrasados</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                                    <input
                                        type="text"
                                        value={filtros.genero || ''}
                                        onChange={(e) => handleFiltroChange('genero', e.target.value)}
                                        placeholder="Filtrar por gênero"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                                    <input
                                        type="text"
                                        value={filtros.autor || ''}
                                        onChange={(e) => handleFiltroChange('autor', e.target.value)}
                                        placeholder="Filtrar por autor"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Tabela de Empréstimos */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <p className="text-red-600 text-lg font-medium">{error}</p>
                                <button
                                    onClick={loadEmprestimos}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        </div>
                    ) : emprestimosPaginados.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <p className="text-gray-500 text-lg font-medium">Nenhum empréstimo encontrado</p>
                                <p className="text-gray-400 mt-2">Tente ajustar os filtros ou fazer uma nova busca</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white shadow-2xl border border-blue-100">
                            <table className="min-w-full divide-y divide-blue-100">
                                <thead className="bg-gradient-to-r from-blue-600 to-purple-600" style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)' }}>
                                    <tr>
                                        <th
                                            className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                                            onClick={() => handleSort('titulo')}
                                            style={{ color: '#ffffff' }}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>📚</span>
                                                <span>Livro</span>
                                                {sortField === 'titulo' && (
                                                    <span className="text-yellow-300">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </span>
                                        </th>
                                        <th
                                            className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                                            onClick={() => handleSort('nomeAutor')}
                                            style={{ color: '#ffffff' }}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>👤</span>
                                                <span>Autor</span>
                                                {sortField === 'nomeAutor' && (
                                                    <span className="text-yellow-300">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </span>
                                        </th>
                                        <th
                                            className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                                            onClick={() => handleSort('dataEmprestimo')}
                                            style={{ color: '#ffffff' }}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>📅</span>
                                                <span>Data Empréstimo</span>
                                                {sortField === 'dataEmprestimo' && (
                                                    <span className="text-yellow-300">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </span>
                                        </th>
                                        <th
                                            className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                                            onClick={() => handleSort('dataPrevistaDevolucao')}
                                            style={{ color: '#ffffff' }}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>⏰</span>
                                                <span>Data Devolução</span>
                                                {sortField === 'dataPrevistaDevolucao' && (
                                                    <span className="text-yellow-300">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </span>
                                        </th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                            <span className="flex items-center gap-2">
                                                <span>📊</span>
                                                <span>Status</span>
                                            </span>
                                        </th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                            <span className="flex items-center gap-2">
                                                <span>⚙️</span>
                                                <span>Ações</span>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100 rounded-b-2xl">
                                    {emprestimosPaginados.map((emprestimo, index) => (
                                        <motion.tr
                                            key={emprestimo.emprestimoId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                                        >
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-14 w-14">
                                                        {emprestimo.capaUrl ? (
                                                            <img
                                                                className="h-14 w-14 rounded-lg object-cover shadow-lg"
                                                                src={emprestimo.capaUrl}
                                                                alt={emprestimo.titulo}
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                                    if (nextElement) {
                                                                        nextElement.style.display = 'flex';
                                                                    }
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div
                                                            className={`h-14 w-14 rounded-lg flex items-center justify-center text-white font-bold text-xl ${emprestimo.capaUrl ? 'hidden' : 'flex'
                                                                }`}
                                                            style={{ backgroundColor: `hsl(${emprestimo.id * 137.5 % 360}, 70%, 50%)` }}
                                                        >
                                                            {emprestimo.titulo.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div
                                                            className="text-lg font-semibold text-gray-900"
                                                            dangerouslySetInnerHTML={{
                                                                __html: highlightSearchTerm(emprestimo.titulo, searchQuery)
                                                            }}
                                                        />
                                                        <div className="text-sm text-blue-600 font-medium">
                                                            {emprestimo.nomeAutor && `por ${emprestimo.nomeAutor}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div
                                                    className="text-sm text-gray-900"
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlightSearchTerm(emprestimo.nomeAutor, searchQuery)
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatDate(emprestimo.dataEmprestimo)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatDate(emprestimo.dataPrevistaDevolucao)}
                                                </div>
                                                {emprestimo.status === 'Emprestado' && (
                                                    <div className="text-xs text-gray-500">
                                                        {emprestimo.diasRestantes > 0
                                                            ? `${emprestimo.diasRestantes} dias restantes`
                                                            : emprestimo.estaAtrasado
                                                                ? `${Math.abs(emprestimo.diasRestantes)} dias atrasado`
                                                                : 'Vence hoje'
                                                        }
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(emprestimo)}`}>
                                                    {getStatusText(emprestimo)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleFavorite(emprestimo.id)}
                                                        className={`p-2 rounded-full transition-colors duration-200 ${isFavorite(emprestimo.id)
                                                            ? 'text-red-500 bg-red-100 hover:bg-red-200'
                                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                            }`}
                                                        title={isFavorite(emprestimo.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                                    >
                                                        {isFavorite(emprestimo.id) ? '❤️' : '🤍'}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Próximo
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                                        <span className="font-medium">{Math.min(endIndex, emprestimosFiltrados.length)}</span> de{' '}
                                        <span className="font-medium">{emprestimosFiltrados.length}</span> empréstimos
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Anterior
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Próximo
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UsuarioLayout>
    );
};

export default MeusEmprestimos;
