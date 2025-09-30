/**
 * PÁGINA FAVORITOS - YETI LIBRARY SYSTEM
 * 
 * Página para usuários visualizarem seus livros favoritos
 * Integra com o sistema de favoritos usando localStorage
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UsuarioLayout from '../components/Layout/UsuarioLayout';
import explorarLivrosService, { type LivroResumido } from '../services/explorarLivrosService';
import FavoritosService from '../services/favoritosService';
import { useFavorites } from '../hooks/useFavorites';
import { BookLoader } from '../components/Loading';
import BookCardYeti from '../components/BookCardYeti';
import BookDetailsCard from '../components/BookDetailsCard';

const Favoritos: React.FC = () => {
    // Estados
    const [livrosFavoritos, setLivrosFavoritos] = useState<LivroResumido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'titulo' | 'autor' | 'ano'>('titulo');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedBook, setSelectedBook] = useState<LivroResumido | null>(null);
    const [showBookDetails, setShowBookDetails] = useState(false);

    // Hook de favoritos
    const { favorites, toggleFavorite } = useFavorites();

    // Configurações de paginação
    const ITEMS_PER_PAGE = 12;

    // Carregar livros favoritos
    const loadLivrosFavoritos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Obter IDs dos favoritos
            const favoritosIds = FavoritosService.getFavoritos();

            if (favoritosIds.length === 0) {
                setLivrosFavoritos([]);
                return;
            }

            // Buscar todos os livros disponíveis
            const todosLivros = await explorarLivrosService.listarLivrosDisponiveis();

            // Filtrar apenas os favoritos
            const livrosFiltrados = todosLivros.filter(livro =>
                favoritosIds.includes(livro.id)
            );

            setLivrosFavoritos(livrosFiltrados);
        } catch (err) {
            console.error('Erro ao carregar favoritos:', err);
            setError('Erro ao carregar livros favoritos');
        } finally {
            setLoading(false);
        }
    };

    // Carregar dados na montagem do componente
    useEffect(() => {
        loadLivrosFavoritos();
    }, []);

    // Recarregar quando favoritos mudarem
    useEffect(() => {
        loadLivrosFavoritos();
    }, [favorites]);

    // Filtrar e ordenar livros
    const livrosFiltrados = livrosFavoritos
        .filter(livro =>
            livro.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            livro.nomeAutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            livro.genero.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortField) {
                case 'titulo':
                    aValue = a.titulo.toLowerCase();
                    bValue = b.titulo.toLowerCase();
                    break;
                case 'autor':
                    aValue = a.nomeAutor.toLowerCase();
                    bValue = b.nomeAutor.toLowerCase();
                    break;
                case 'ano':
                    aValue = a.ano;
                    bValue = b.ano;
                    break;
                default:
                    aValue = a.titulo.toLowerCase();
                    bValue = b.titulo.toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    // Paginação
    const totalPages = Math.ceil(livrosFiltrados.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const livrosPaginados = livrosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Função de ordenação
    const handleSort = (field: 'titulo' | 'autor' | 'ano') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Função para abrir detalhes do livro
    const handleVerDetalhes = (livro: LivroResumido) => {
        setSelectedBook(livro);
        setShowBookDetails(true);
    };

    // Função para fechar detalhes do livro
    const handleCloseDetails = () => {
        setShowBookDetails(false);
        setSelectedBook(null);
    };

    // Renderizar card de livro
    const renderLivroCard = (livro: LivroResumido, index: number) => (
        <motion.div
            key={livro.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
        >
            <BookCardYeti
                livro={livro}
                isFavorite={FavoritosService.isFavorito(livro.id)}
                onToggleFavorite={(id) => {
                    const wasAdded = toggleFavorite(id);
                    console.log(wasAdded ? 'Adicionado aos favoritos:' : 'Removido dos favoritos:', livro.titulo);
                }}
                onVerDetalhes={handleVerDetalhes}
                searchQuery={searchQuery}
            />
        </motion.div>
    );

    return (
        <UsuarioLayout
            pageTitle="Meus Favoritos"
            pageSubtitle="Livros que você adicionou aos favoritos"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        >
            <div className="p-6 space-y-6">
                {/* Contador de Favoritos */}
                <div className="flex justify-end">
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                        <p className="text-blue-700 font-medium">
                            {livrosFiltrados.length} livro{livrosFiltrados.length !== 1 ? 's' : ''} favorito{livrosFiltrados.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Filtros e Ordenação */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Filtros e Ordenação</h2>
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={sortField}
                                onChange={(e) => handleSort(e.target.value as 'titulo' | 'autor' | 'ano')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="titulo">Ordenar por Título</option>
                                <option value="autor">Ordenar por Autor</option>
                                <option value="ano">Ordenar por Ano</option>
                            </select>

                            <button
                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                {sortDirection === 'asc' ? '↑ Crescente' : '↓ Decrescente'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conteúdo Principal */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center space-y-4">
                            <BookLoader size="lg" />
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Carregando favoritos...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-600 text-lg font-medium mb-2">Erro ao carregar favoritos</p>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={loadLivrosFavoritos}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                ) : livrosFiltrados.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                {searchQuery ? 'Nenhum favorito encontrado' : 'Nenhum livro favorito ainda'}
                            </p>
                            <p className="text-gray-400">
                                {searchQuery
                                    ? 'Tente ajustar sua busca'
                                    : 'Explore livros e adicione aos favoritos clicando no coração'
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Grid de Livros */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {livrosPaginados.map((livro, index) => renderLivroCard(livro, index))}
                        </div>

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                    Anterior
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg transition-colors duration-300 ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Modal de Detalhes do Livro */}
                {selectedBook && (
                    <BookDetailsCard
                        livro={selectedBook}
                        isVisible={showBookDetails}
                        onClose={handleCloseDetails}
                    />
                )}
            </div>
        </UsuarioLayout>
    );
};

export default Favoritos;
