import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UsuarioLayout from '../components/Layout/UsuarioLayout';
import usuarioLivroService from '../services/usuarioLivroService';
import usuarioEmprestimoService from '../services/usuarioEmprestimoService';
import { useFavorites } from '../hooks/useFavorites';
import type { Livro } from '../types/entities';

const UsuarioDashboard: React.FC = () => {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [livrosFiltrados, setLivrosFiltrados] = useState<Livro[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredBookId, setHoveredBookId] = useState<number | null>(null);
    const [stats, setStats] = useState({
        emprestimosAtivos: 0,
        livrosFavoritos: 0,
        historicoTotal: 0,
        livrosDisponiveis: 0
    });

    // Hook de favoritos
    const { favorites, toggleFavorite, isFavorite, getFavoritesCount } = useFavorites();

    const livrosPerPage = 10;

    // Atualizar estatísticas quando favoritos mudarem
    useEffect(() => {
        setStats(prev => ({
            ...prev,
            livrosFavoritos: getFavoritesCount()
        }));
    }, [favorites, getFavoritesCount]);

    useEffect(() => {
        loadUserData();
    }, []);

    // Filtrar livros baseado na busca
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setLivrosFiltrados(livros);
        } else {
            const filtrados = livros.filter(livro =>
                livro.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (livro.nomeAutor && livro.nomeAutor.toLowerCase().includes(searchQuery.toLowerCase())) ||
                livro.genero.toLowerCase().includes(searchQuery.toLowerCase()) ||
                livro.sinopse.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setLivrosFiltrados(filtrados);
        }
        setCurrentPage(1); // Reset para primeira página quando busca mudar
    }, [searchQuery, livros]);

    // Calcular livros da página atual
    const totalPages = Math.ceil(livrosFiltrados.length / livrosPerPage);
    const startIndex = (currentPage - 1) * livrosPerPage;
    const endIndex = startIndex + livrosPerPage;
    const livrosAtuais = livrosFiltrados.slice(startIndex, endIndex);

    const loadUserData = async () => {
        try {
            // Carregar livros disponíveis
            const livrosData = await usuarioLivroService.listarLivrosDisponiveis();
            setLivros(livrosData);
            setLivrosFiltrados(livrosData);

            // Carregar empréstimos ativos
            const emprestimosData = await usuarioEmprestimoService.listarEmprestimosAtivos();

                // Calcular estatísticas
                setStats({
                    emprestimosAtivos: emprestimosData.length,
                    livrosFavoritos: getFavoritesCount(),
                    historicoTotal: 0, // TODO: Implementar histórico
                    livrosDisponiveis: livrosData.length
                });

            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            setLoading(false);
        }
    };


    const highlightSearchTerm = (text: string, searchTerm: string) => {
        if (!searchTerm.trim()) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    };

    const getBookCoverColor = (livroId: number, index: number) => {
        const colors = [
            'from-amber-600 via-amber-700 to-amber-800',
            'from-red-600 via-red-700 to-red-800',
            'from-blue-600 via-blue-700 to-blue-800',
            'from-green-600 via-green-700 to-green-800',
            'from-purple-600 via-purple-700 to-purple-800',
            'from-indigo-600 via-indigo-700 to-indigo-800',
            'from-pink-600 via-pink-700 to-pink-800',
            'from-teal-600 via-teal-700 to-teal-800',
            'from-orange-600 via-orange-700 to-orange-800',
            'from-cyan-600 via-cyan-700 to-cyan-800',
            'from-lime-600 via-lime-700 to-lime-800',
            'from-rose-600 via-rose-700 to-rose-800',
            'from-violet-600 via-violet-700 to-violet-800',
            'from-emerald-600 via-emerald-700 to-emerald-800',
            'from-sky-600 via-sky-700 to-sky-800',
            'from-fuchsia-600 via-fuchsia-700 to-fuchsia-800'
        ];
        // Usar uma semente baseada no ID do livro para cores consistentes mas aleatórias
        const seed = (livroId || index) * 17 + 31;
        return colors[seed % colors.length];
    };

    if (loading) {
        return (
            <UsuarioLayout pageTitle="Carregando..." pageSubtitle="Aguarde um momento">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </UsuarioLayout>
        );
    }

    return (
        <UsuarioLayout
            pageTitle="Meu Dashboard"
            pageSubtitle="Bem-vindo à sua biblioteca pessoal"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        >
            {/* Bookshelf Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-amber-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden mb-8"
            >
                {/* Wood Texture Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-br from-amber-900 to-amber-700"></div>
                </div>

                {/* Bookshelf Title */}
                <div className="text-center relative z-10 drop-shadow-lg mb-8">
                    <h2 className="text-3xl font-bold text-white">
                        Minha Estante Virtual
                    </h2>
                    {searchQuery.trim() !== '' && (
                        <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                🔍 Buscando: "{searchQuery}"
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    ✕
                                </button>
                            </span>
                        </div>
                    )}
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 relative z-10">
                    {livrosFiltrados.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-white text-lg mb-4">
                                {searchQuery.trim() === '' ? '📚 Sua estante está vazia' : '🔍 Nenhum livro encontrado'}
                            </div>
                            <p className="text-amber-200">
                                {searchQuery.trim() === ''
                                    ? 'Explore nossa biblioteca para encontrar livros interessantes!'
                                    : `Tente buscar por outro termo. Buscamos em: título, autor, gênero e sinopse.`
                                }
                            </p>
                        </div>
                    ) : (
                        livrosAtuais.map((livro, index) => (
                            <motion.div
                                key={livro.id}
                                whileHover={{
                                    y: -8,
                                    rotateY: 5,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative"
                                style={{ perspective: '1000px', zIndex: hoveredBookId === livro.id ? 1000 : 1 }}
                                onMouseEnter={() => setHoveredBookId(livro.id)}
                                onMouseLeave={() => setHoveredBookId(null)}
                            >
                                {/* Book Cover */}
                                <div
                                    className="relative w-full rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform-gpu overflow-hidden"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                                        minHeight: '120px',
                                        maxHeight: '160px'
                                    }}
                                >
                                    {/* Image Container - Adapts to image size */}
                                    <div className="w-full flex items-center justify-center" style={{ minHeight: '80px' }}>
                                        {livro.capaUrl ? (
                                            <img
                                                src={livro.capaUrl}
                                                alt={livro.titulo}
                                                className="w-full h-auto object-contain rounded-lg"
                                                style={{
                                                    maxHeight: '140px',
                                                    width: 'auto'
                                                }}
                                                onError={(e) => {
                                                    // Fallback para cor sólida se a imagem falhar
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = `
                                                        <div class="w-full h-24 bg-gradient-to-br ${getBookCoverColor(livro.id, index)} flex items-center justify-center text-white rounded-lg">
                                                            <div class="text-center p-2">
                                                                <h3 class="text-xs font-bold mb-1 line-clamp-1">${livro.titulo.length > 15 ? livro.titulo.substring(0, 15) + '...' : livro.titulo}</h3>
                                                                <p class="text-xs opacity-90 line-clamp-1">${livro.nomeAutor || 'Autor'}</p>
                                                            </div>
                                                        </div>
                                                    `;
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className={`w-full h-24 bg-gradient-to-br ${getBookCoverColor(livro.id, index)} flex items-center justify-center text-white rounded-lg`}>
                                                <div className="text-center p-2">
                                                    <h3
                                                        className="text-xs font-bold mb-1 line-clamp-1"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightSearchTerm(livro.titulo.length > 15 ? livro.titulo.substring(0, 15) + '...' : livro.titulo, searchQuery)
                                                        }}
                                                    />
                                                    <p
                                                        className="text-xs opacity-90 line-clamp-1"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightSearchTerm(livro.nomeAutor || 'Autor', searchQuery)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Info - Adapts to container */}
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent flex items-end px-2 pb-1 rounded-b-lg">
                                        <div className="text-white text-xs font-semibold truncate w-full">
                                            {livro.titulo.length > 20 ? `${livro.titulo.substring(0, 20)}...` : livro.titulo}
                                        </div>
                                    </div>

                                    {/* Book Spine */}
                                    <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-amber-800 to-amber-900 rounded-l-lg"></div>

                                    {/* Book Pages Effect */}
                                    <div className="absolute right-0 top-0 w-1 h-full bg-white opacity-20"></div>

                                    {/* Book Shine Effect */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white from-10% via-transparent to-transparent opacity-10 rounded-lg"></div>
                                    
                                    {/* Favorite Indicator */}
                                    {isFavorite(livro.id) && (
                                        <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-white text-xs">💖</span>
                                        </div>
                                    )}
                                </div>

                                {/* Detailed Hover Card */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: hoveredBookId === livro.id ? 1 : 0
                                    }}
                                    className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 backdrop-blur-sm rounded-lg p-2 shadow-2xl transition-all duration-300"
                                    style={{ zIndex: 1000 }}
                                    onMouseEnter={() => setHoveredBookId(livro.id)}
                                    onMouseLeave={() => setHoveredBookId(null)}
                                >
                                    <div className="h-full flex flex-col justify-between">
                                        <div className="text-left">
                                            <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">
                                                {livro.titulo}
                                            </h4>
                                            <p className="text-white mb-1 font-medium text-xs opacity-90">
                                                {livro.nomeAutor || 'Autor não informado'}
                                            </p>
                                            <div className="text-xs text-white mb-2 opacity-80">
                                                <p><strong>Gênero:</strong> {livro.genero}</p>
                                                <p><strong>Ano:</strong> {livro.ano}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-1">
                                            <button
                                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded font-semibold transition-colors duration-300 text-xs cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('Ver detalhes:', livro.titulo);
                                                }}
                                            >
                                                📖 Ver
                                            </button>
                                            <button 
                                                className={`flex-1 px-2 py-1 rounded font-semibold transition-colors duration-300 text-xs cursor-pointer ${
                                                    isFavorite(livro.id) 
                                                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const wasAdded = toggleFavorite(livro.id);
                                                    console.log(wasAdded ? 'Adicionado aos favoritos:' : 'Removido dos favoritos:', livro.titulo);
                                                }}
                                            >
                                                {isFavorite(livro.id) ? '💖' : '❤️'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {livrosFiltrados.length > livrosPerPage && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors duration-300"
                        >
                            ← Anterior
                        </button>

                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-lg transition-colors duration-300 ${currentPage === page
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-amber-200 text-amber-800 hover:bg-amber-300'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors duration-300"
                        >
                            Próxima →
                        </button>
                    </div>
                )}

                {/* Info da Paginação */}
                {livrosFiltrados.length > 0 && (
                    <div className="text-center mt-4 text-amber-200 text-sm">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, livrosFiltrados.length)} de {livrosFiltrados.length} livros
                    </div>
                )}
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: 'Empréstimos Ativos', value: stats.emprestimosAtivos.toString(), icon: '📖', color: 'bg-blue-500' },
                    { title: 'Livros Favoritos', value: stats.livrosFavoritos.toString(), icon: '❤️', color: 'bg-red-500' },
                    { title: 'Histórico Total', value: stats.historicoTotal.toString(), icon: '📚', color: 'bg-green-500' },
                    { title: 'Livros Disponíveis', value: stats.livrosDisponiveis.toString(), icon: '📖', color: 'bg-amber-500' }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </UsuarioLayout>
    );
};

export default UsuarioDashboard;