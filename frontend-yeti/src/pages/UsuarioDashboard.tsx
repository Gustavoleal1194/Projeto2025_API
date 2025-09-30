import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UsuarioLayout from '../components/Layout/UsuarioLayout';
import Bookshelf3D from '../components/Bookshelf3D';
import BookCard3D from '../components/BookCard3D';
import usuarioLivroService from '../services/usuarioLivroService';
import usuarioEmprestimoService from '../services/usuarioEmprestimoService';
import { useFavorites } from '../hooks/useFavorites';
import type { Livro } from '../types/entities';
import { BookLoader } from '../components/Loading';
import EstantePattern from '../components/EstantePattern';

const UsuarioDashboard: React.FC = () => {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [livrosFiltrados, setLivrosFiltrados] = useState<Livro[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [view3D, setView3D] = useState(false);
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
            setLoading(true);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

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




    if (loading) {
        return (
            <UsuarioLayout pageTitle="Carregando..." pageSubtitle="Aguarde um momento">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-4">
                        <BookLoader size="lg" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            Carregando dashboard...
                        </p>
                    </div>
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
            {/* Estante Virtual - Toggle entre 2D e 3D */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                {/* Header com controles */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Minha Estante Virtual
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {searchQuery.trim() !== '' ? `🔍 Buscando: "${searchQuery}"` : `${livrosFiltrados.length} livro${livrosFiltrados.length !== 1 ? 's' : ''} na estante`}
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Toggle de visualização */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setView3D(false)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${!view3D
                                    ? 'bg-white text-gray-800 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                📚 2D
                            </button>
                            <button
                                onClick={() => setView3D(true)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${view3D
                                    ? 'bg-white text-gray-800 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                🎯 3D (BETA)
                            </button>
                        </div>

                        {/* Botão de limpar busca */}
                        {searchQuery.trim() !== '' && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                            >
                                ✕ Limpar
                            </button>
                        )}
                    </div>
                </div>

                {/* Renderização condicional */}
                {view3D ? (
                    <Bookshelf3D
                        livros={livrosFiltrados}
                        searchQuery={searchQuery}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                    />
                ) : (
                    <div className="relative rounded-2xl overflow-hidden bg-gray-900 min-h-[1200px]">
                        {/* Padrão de fundo da estante 2D */}
                        <div className="absolute inset-0 z-0">
                            <EstantePattern />
                        </div>

                        {/* Estante 2D com fundo */}
                        <div className="relative z-10 p-8 min-h-[1200px]">

                            {/* Snow Effect Overlay */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: 'linear-gradient(to top, rgba(255, 255, 255, 0.2) 0%, transparent 100%)'
                                }}
                            />

                            {/* Bookshelf Title */}
                            <div className="text-center relative z-10 drop-shadow-lg mb-8">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg text-white">
                                    ❄️ Minha Estante Yeti ❄️
                                </h2>
                                {searchQuery.trim() !== '' && (
                                    <div className="mt-2">
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                            style={{
                                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                                color: '#dbeafe',
                                                border: '1px solid rgba(59, 130, 246, 0.3)'
                                            }}
                                        >
                                            🔍 Buscando: "{searchQuery}"
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="ml-2 hover:opacity-80"
                                                style={{ color: '#60a5fa' }}
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Books Grid 3D */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 relative z-10 justify-items-center items-stretch">
                                {livrosFiltrados.length === 0 ? (
                                    <div className="col-span-full text-center py-12">
                                        <div className="text-white text-lg mb-4">
                                            {searchQuery.trim() === '' ? '📚 Sua estante está vazia' : '🔍 Nenhum livro encontrado'}
                                        </div>
                                        <p className="text-blue-200">
                                            {searchQuery.trim() === ''
                                                ? '❄️ Explore nossa biblioteca Yeti para encontrar livros interessantes!'
                                                : `🔍 Tente buscar por outro termo. Buscamos em: título, autor, gênero e sinopse.`
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    livrosAtuais.map((livro, index) => (
                                        <motion.div
                                            key={livro.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="w-full h-full flex items-center justify-center"
                                        >
                                            <BookCard3D
                                                livro={livro}
                                                isFavorite={isFavorite(livro.id)}
                                                onToggleFavorite={toggleFavorite}
                                                onHover={() => { }}
                                            />
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
                                <div className="text-center mt-4 text-white text-sm">
                                    Mostrando {startIndex + 1} a {Math.min(endIndex, livrosFiltrados.length)} de {livrosFiltrados.length} livros
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: 'Empréstimos Ativos', value: stats.emprestimosAtivos.toString(), icon: '📖', color: 'bg-blue-500' },
                    { title: 'Livros Favoritos', value: stats.livrosFavoritos.toString(), icon: '❤️', color: 'bg-red-500' },
                    { title: 'Histórico Total', value: stats.historicoTotal.toString(), icon: '📚', color: 'bg-green-500' },
                    { title: 'Livros Disponíveis', value: stats.livrosDisponiveis.toString(), icon: '📖', color: 'bg-green-500' }
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