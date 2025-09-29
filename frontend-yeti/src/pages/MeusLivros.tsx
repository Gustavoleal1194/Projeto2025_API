/**
 * PÁGINA MEUS LIVROS - YETI LIBRARY SYSTEM
 * 
 * Página dedicada para usuários visualizarem seus livros emprestados
 * com funcionalidades de renovação, devolução e histórico
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UsuarioLayout from '../components/Layout/UsuarioLayout';
import meusLivrosService, { type FiltrosMeusLivros, type MeuLivro } from '../services/meusLivrosService';
import { useFavorites } from '../hooks/useFavorites';
import { BookLoader } from '../components/Loading';

const MeusLivros: React.FC = () => {
    const [livros, setLivros] = useState<MeuLivro[]>([]);
    const [livrosFiltrados, setLivrosFiltrados] = useState<MeuLivro[]>([]);
    const [estatisticas, setEstatisticas] = useState({
        total: 0,
        emprestados: 0,
        atrasados: 0,
        devolvidos: 0,
        proximosVencimentos: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filtros, setFiltros] = useState<FiltrosMeusLivros>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredBookId, setHoveredBookId] = useState<number | null>(null);
    const [showFiltros, setShowFiltros] = useState(false);

    // Hook de favoritos
    const { isFavorite, toggleFavorite } = useFavorites();

    const livrosPerPage = 12;

    useEffect(() => {
        loadData();
    }, []);

    // Filtrar livros baseado na busca e filtros
    useEffect(() => {
        let filtrados = livros;

        // Aplicar busca
        if (searchQuery.trim() !== '') {
            const termo = searchQuery.toLowerCase();
            filtrados = filtrados.filter(livro =>
                livro.titulo.toLowerCase().includes(termo) ||
                livro.nomeAutor.toLowerCase().includes(termo) ||
                livro.genero.toLowerCase().includes(termo) ||
                livro.sinopse.toLowerCase().includes(termo)
            );
        }

        // Aplicar filtros
        if (filtros.status) {
            filtrados = filtrados.filter(livro => livro.status === filtros.status);
        }

        if (filtros.atrasado !== undefined) {
            filtrados = filtrados.filter(livro => livro.estaAtrasado === filtros.atrasado);
        }


        if (filtros.genero) {
            filtrados = filtrados.filter(livro =>
                livro.genero.toLowerCase().includes(filtros.genero!.toLowerCase())
            );
        }

        if (filtros.autor) {
            filtrados = filtrados.filter(livro =>
                livro.nomeAutor.toLowerCase().includes(filtros.autor!.toLowerCase())
            );
        }

        setLivrosFiltrados(filtrados);
        setCurrentPage(1);
    }, [searchQuery, filtros, livros]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const [livrosData, statsData] = await Promise.all([
                meusLivrosService.listarMeusLivros(),
                meusLivrosService.obterEstatisticas()
            ]);

            setLivros(livrosData);
            setEstatisticas(statsData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

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


    const highlightSearchTerm = (text: string, searchTerm: string) => {
        if (!searchTerm.trim()) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status: string, estaAtrasado: boolean) => {
        if (estaAtrasado) return 'bg-red-500';
        if (status === 'Emprestado') return 'bg-green-500';
        if (status === 'Devolvido') return 'bg-gray-500';
        return 'bg-blue-500';
    };

    const getStatusText = (status: string, estaAtrasado: boolean) => {
        if (estaAtrasado) return 'Atrasado';
        if (status === 'Emprestado') return 'Emprestado';
        if (status === 'Devolvido') return 'Devolvido';
        return status;
    };

    // Calcular livros da página atual
    const totalPages = Math.ceil(livrosFiltrados.length / livrosPerPage);
    const startIndex = (currentPage - 1) * livrosPerPage;
    const endIndex = startIndex + livrosPerPage;
    const livrosAtuais = livrosFiltrados.slice(startIndex, endIndex);

    if (loading) {
        return (
            <UsuarioLayout pageTitle="Meus Livros" pageSubtitle="Carregando seus empréstimos...">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-4">
                        <BookLoader size="lg" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            Carregando meus livros...
                        </p>
                    </div>
                </div>
            </UsuarioLayout>
        );
    }

    return (
        <UsuarioLayout
            pageTitle="Meus Livros"
            pageSubtitle="Gerencie seus empréstimos e histórico de leitura"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        >
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {[
                    { title: 'Total', value: estatisticas.total.toString(), icon: '📚', color: 'bg-blue-500' },
                    { title: 'Emprestados', value: estatisticas.emprestados.toString(), icon: '📖', color: 'bg-green-500' },
                    { title: 'Atrasados', value: estatisticas.atrasados.toString(), icon: '⚠️', color: 'bg-red-500' },
                    { title: 'Devolvidos', value: estatisticas.devolvidos.toString(), icon: '✅', color: 'bg-gray-500' },
                    { title: 'Próximos Vencimentos', value: estatisticas.proximosVencimentos.toString(), icon: '⏰', color: 'bg-amber-500' }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
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
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Meus Empréstimos</h2>
                        <span className="text-gray-600">
                            {livrosFiltrados.length} livro{livrosFiltrados.length !== 1 ? 's' : ''} encontrado{livrosFiltrados.length !== 1 ? 's' : ''}
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
                        className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filtros.status || ''}
                                onChange={(e) => handleFiltroChange('status', e.target.value || undefined)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos os status</option>
                                <option value="Emprestado">Emprestado</option>
                                <option value="Devolvido">Devolvido</option>
                                <option value="Atrasado">Atrasado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Situação</label>
                            <select
                                value={filtros.atrasado === undefined ? '' : filtros.atrasado.toString()}
                                onChange={(e) => handleFiltroChange('atrasado', e.target.value === '' ? undefined : e.target.value === 'true')}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todas</option>
                                <option value="false">Em dia</option>
                                <option value="true">Atrasados</option>
                            </select>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                            <input
                                type="text"
                                value={filtros.genero || ''}
                                onChange={(e) => handleFiltroChange('genero', e.target.value || undefined)}
                                placeholder="Ex: Romance, Ficção"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                            <input
                                type="text"
                                value={filtros.autor || ''}
                                onChange={(e) => handleFiltroChange('autor', e.target.value || undefined)}
                                placeholder="Nome do autor"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Grid de Livros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {livrosFiltrados.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">
                            {searchQuery.trim() === '' && Object.keys(filtros).length === 0
                                ? '📚 Você ainda não possui livros emprestados'
                                : '🔍 Nenhum livro encontrado com os filtros aplicados'
                            }
                        </div>
                        <p className="text-gray-400">
                            {searchQuery.trim() === '' && Object.keys(filtros).length === 0
                                ? 'Explore nossa biblioteca para encontrar livros interessantes!'
                                : 'Tente ajustar os filtros ou termo de busca.'
                            }
                        </p>
                    </div>
                ) : (
                    livrosAtuais.map((livro, index) => (
                        <motion.div
                            key={`${livro.id}-${livro.emprestimoId}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                            style={{ zIndex: hoveredBookId === livro.id ? 1000 : 1 }}
                            onMouseEnter={() => setHoveredBookId(livro.id)}
                            onMouseLeave={() => setHoveredBookId(null)}
                        >
                            {/* Capa do Livro */}
                            <div className="relative h-64 bg-gray-100 overflow-hidden">
                                {livro.capaUrl ? (
                                    <img
                                        src={livro.capaUrl}
                                        alt={livro.titulo}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `
                                                    <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                                        <div class="text-center p-4">
                                                            <h3 class="text-lg font-bold mb-2">${livro.titulo.length > 30 ? livro.titulo.substring(0, 30) + '...' : livro.titulo}</h3>
                                                            <p class="text-sm opacity-90">${livro.nomeAutor}</p>
                                                        </div>
                                                    </div>
                                                `;
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                        <div className="text-center p-4">
                                            <h3 className="text-lg font-bold mb-2">
                                                {livro.titulo.length > 30 ? livro.titulo.substring(0, 30) + '...' : livro.titulo}
                                            </h3>
                                            <p className="text-sm opacity-90">{livro.nomeAutor}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Indicador de Favorito */}
                                {isFavorite(livro.id) && (
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-sm">💖</span>
                                    </div>
                                )}

                                {/* Status do Empréstimo */}
                                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(livro.status, livro.estaAtrasado)} text-white`}>
                                    {getStatusText(livro.status, livro.estaAtrasado)}
                                </div>

                                {/* Hover Overlay */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: hoveredBookId === livro.id ? 1 : 0
                                    }}
                                    className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                                >
                                    <div className="text-center text-white p-4">
                                        <h4 className="text-lg font-bold mb-2 line-clamp-2">
                                            {livro.titulo}
                                        </h4>
                                        <p className="text-sm mb-3 opacity-90">
                                            {livro.nomeAutor}
                                        </p>
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-300"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('Ver detalhes:', livro.titulo);
                                                }}
                                            >
                                                📖 Detalhes
                                            </button>
                                            <button
                                                className={`px-3 py-1 rounded text-sm transition-colors duration-300 ${isFavorite(livro.id)
                                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const wasAdded = toggleFavorite(livro.id);
                                                    console.log(wasAdded ? 'Adicionado aos favoritos:' : 'Removido dos favoritos:', livro.titulo);
                                                }}
                                            >
                                                {isFavorite(livro.id) ? '💖 Favorito' : '❤️ Favoritar'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Informações do Livro */}
                            <div className="p-4">
                                <h3
                                    className="text-lg font-bold text-gray-800 mb-2 line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightSearchTerm(livro.titulo, searchQuery)
                                    }}
                                />

                                <p
                                    className="text-gray-600 text-sm mb-2"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightSearchTerm(livro.nomeAutor, searchQuery)
                                    }}
                                />

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <span>{livro.genero}</span>
                                    <span>{livro.ano}</span>
                                </div>

                                {/* Informações do Empréstimo */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Emprestado em:</span>
                                        <span className="font-medium">{formatarData(livro.dataEmprestimo)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Devolução prevista:</span>
                                        <span className={`font-medium ${livro.estaAtrasado ? 'text-red-600' : 'text-gray-700'}`}>
                                            {formatarData(livro.dataPrevistaDevolucao)}
                                        </span>
                                    </div>
                                    {livro.estaAtrasado && livro.diasAtraso && (
                                        <div className="flex justify-between text-xs">
                                            <span className="text-red-500">Dias de atraso:</span>
                                            <span className="font-medium text-red-600">{livro.diasAtraso} dias</span>
                                        </div>
                                    )}
                                    {!livro.estaAtrasado && livro.diasRestantes >= 0 && (
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Dias restantes:</span>
                                            <span className={`font-medium ${livro.diasRestantes <= 3 ? 'text-amber-600' : 'text-gray-700'}`}>
                                                {livro.diasRestantes} dias
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Renovações:</span>
                                        <span className="font-medium">{livro.quantidadeRenovacoes}/{livro.maxRenovacoes}</span>
                                    </div>
                                </div>

                                {/* Status do Empréstimo */}
                                <div className="text-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${livro.estaAtrasado
                                        ? 'bg-red-100 text-red-800'
                                        : livro.status === 'Emprestado'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {livro.estaAtrasado ? '⚠️ Atrasado' :
                                            livro.status === 'Emprestado' ? '📖 Emprestado' :
                                                '✅ Devolvido'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Paginação */}
            {livrosFiltrados.length > livrosPerPage && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-300"
                    >
                        ← Anterior
                    </button>

                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg transition-colors duration-300 ${currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-300"
                    >
                        Próxima →
                    </button>
                </div>
            )}

            {/* Info da Paginação */}
            {livrosFiltrados.length > 0 && (
                <div className="text-center mt-4 text-gray-600 text-sm">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, livrosFiltrados.length)} de {livrosFiltrados.length} livros
                </div>
            )}
        </UsuarioLayout>
    );
};

export default MeusLivros;
