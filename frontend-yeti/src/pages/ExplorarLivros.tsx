/**
 * PÁGINA EXPLORAR LIVROS - YETI LIBRARY SYSTEM
 * 
 * Página dedicada para leitores explorarem livros disponíveis
 * com filtros, busca e informações relevantes
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UsuarioLayout from '../components/Layout/UsuarioLayout';
import explorarLivrosService, { type FiltrosExploracao, type LivroResumido } from '../services/explorarLivrosService';
import { useFavorites } from '../hooks/useFavorites';

const ExplorarLivros: React.FC = () => {
    const [livros, setLivros] = useState<LivroResumido[]>([]);
    const [livrosFiltrados, setLivrosFiltrados] = useState<LivroResumido[]>([]);
    const [generos, setGeneros] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filtros, setFiltros] = useState<FiltrosExploracao>({});
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

        if (filtros.editora) {
            filtrados = filtrados.filter(livro => 
                livro.nomeEditora.toLowerCase().includes(filtros.editora!.toLowerCase())
            );
        }

        if (filtros.anoMin) {
            filtrados = filtrados.filter(livro => livro.ano >= filtros.anoMin!);
        }

        if (filtros.anoMax) {
            filtrados = filtrados.filter(livro => livro.ano <= filtros.anoMax!);
        }

        if (filtros.disponivel !== undefined) {
            filtrados = filtrados.filter(livro => 
                filtros.disponivel ? livro.temExemplaresDisponiveis : !livro.temExemplaresDisponiveis
            );
        }

        setLivrosFiltrados(filtrados);
        setCurrentPage(1);
    }, [searchQuery, filtros, livros]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [livrosData, generosData] = await Promise.all([
                explorarLivrosService.listarLivrosDisponiveis(),
                explorarLivrosService.listarGeneros()
            ]);
            
            setLivros(livrosData);
            setGeneros(generosData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (campo: keyof FiltrosExploracao, valor: any) => {
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

    // Calcular livros da página atual
    const totalPages = Math.ceil(livrosFiltrados.length / livrosPerPage);
    const startIndex = (currentPage - 1) * livrosPerPage;
    const endIndex = startIndex + livrosPerPage;
    const livrosAtuais = livrosFiltrados.slice(startIndex, endIndex);

    if (loading) {
        return (
            <UsuarioLayout pageTitle="Explorar Livros" pageSubtitle="Carregando biblioteca...">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </UsuarioLayout>
        );
    }

    return (
        <UsuarioLayout 
            pageTitle="Explorar Livros" 
            pageSubtitle="Descubra novos mundos através da leitura"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        >
            {/* Header com Filtros */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Explorar Biblioteca</h2>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                            <select
                                value={filtros.genero || ''}
                                onChange={(e) => handleFiltroChange('genero', e.target.value || undefined)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos os gêneros</option>
                                {generos.map(genero => (
                                    <option key={genero} value={genero}>{genero}</option>
                                ))}
                            </select>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Editora</label>
                            <input
                                type="text"
                                value={filtros.editora || ''}
                                onChange={(e) => handleFiltroChange('editora', e.target.value || undefined)}
                                placeholder="Nome da editora"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidade</label>
                            <select
                                value={filtros.disponivel === undefined ? '' : filtros.disponivel.toString()}
                                onChange={(e) => handleFiltroChange('disponivel', e.target.value === '' ? undefined : e.target.value === 'true')}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos</option>
                                <option value="true">Disponíveis</option>
                                <option value="false">Indisponíveis</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ano Mínimo</label>
                            <input
                                type="number"
                                value={filtros.anoMin || ''}
                                onChange={(e) => handleFiltroChange('anoMin', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="Ex: 2000"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ano Máximo</label>
                            <input
                                type="number"
                                value={filtros.anoMax || ''}
                                onChange={(e) => handleFiltroChange('anoMax', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="Ex: 2024"
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
                                ? '📚 Nenhum livro encontrado na biblioteca'
                                : '🔍 Nenhum livro encontrado com os filtros aplicados'
                            }
                        </div>
                        <p className="text-gray-400">
                            {searchQuery.trim() === '' && Object.keys(filtros).length === 0 
                                ? 'A biblioteca ainda não possui livros cadastrados.'
                                : 'Tente ajustar os filtros ou termo de busca.'
                            }
                        </p>
                    </div>
                ) : (
                    livrosAtuais.map((livro, index) => (
                        <motion.div
                            key={livro.id}
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

                                {/* Indicador de Disponibilidade */}
                                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                    livro.temExemplaresDisponiveis 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-red-500 text-white'
                                }`}>
                                    {livro.temExemplaresDisponiveis ? 'Disponível' : 'Indisponível'}
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
                                                📖 Ver Detalhes
                                            </button>
                                            <button 
                                                className={`px-3 py-1 rounded text-sm transition-colors duration-300 ${
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
                                
                                <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                                    {livro.sinopse}
                                </p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                        {livro.exemplaresDisponiveis}/{livro.totalExemplares} exemplares
                                    </span>
                                    {livro.numeroPaginas && (
                                        <span>{livro.numeroPaginas} páginas</span>
                                    )}
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
                                className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
                                    currentPage === page
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

export default ExplorarLivros;
