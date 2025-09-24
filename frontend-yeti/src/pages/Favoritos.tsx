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

const Favoritos: React.FC = () => {
    // Estados
    const [livrosFavoritos, setLivrosFavoritos] = useState<LivroResumido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'titulo' | 'autor' | 'ano'>('titulo');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Hook de favoritos
    const { favorites, toggleFavorite } = useFavorites();

    // Configurações de paginação
    const ITEMS_PER_PAGE = 12;

    // Carregar livros favoritos
    const loadLivrosFavoritos = async () => {
        try {
            setLoading(true);
            setError(null);

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

    // Função para destacar termo de busca
    const highlightSearchTerm = (text: string, term: string) => {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    };

    // Renderizar card de livro
    const renderLivroCard = (livro: LivroResumido, index: number) => (
        <motion.div
            key={livro.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
        >
            <div className="relative">
                {/* Imagem do livro */}
                <div className="aspect-[3/4] rounded-t-xl overflow-hidden">
                    {livro.capaUrl ? (
                        <img
                            src={livro.capaUrl}
                            alt={livro.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                    parent.innerHTML = `
                                        <div class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                            <span class="text-white font-bold text-4xl">📚</span>
                                        </div>
                                    `;
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-4xl">📚</span>
                        </div>
                    )}
                </div>

                {/* Botão de favorito */}
                <button
                    onClick={() => toggleFavorite(livro.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 group/fav"
                    title={FavoritosService.isFavorito(livro.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                    <span className={`text-xl transition-colors duration-300 ${FavoritosService.isFavorito(livro.id)
                            ? 'text-red-500 group-hover/fav:text-white'
                            : 'text-gray-400 group-hover/fav:text-white'
                        }`}>
                        {FavoritosService.isFavorito(livro.id) ? '❤️' : '🤍'}
                    </span>
                </button>
            </div>

            {/* Informações do livro */}
            <div className="p-4">
                <h3
                    className="font-bold text-lg text-gray-900 mb-2 line-clamp-2"
                    dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(livro.titulo, searchQuery)
                    }}
                />
                <p
                    className="text-gray-600 text-sm mb-1"
                    dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(`por ${livro.nomeAutor}`, searchQuery)
                    }}
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{livro.ano}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {livro.genero}
                    </span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <UsuarioLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meus Favoritos</h1>
                        <p className="text-gray-600">
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
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Carregando seus favoritos...</p>
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
            </div>
        </UsuarioLayout>
    );
};

export default Favoritos;
