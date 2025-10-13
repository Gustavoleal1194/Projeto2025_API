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
import BookCardYeti from '../components/BookCardYeti';
import FilterButton from '../components/Buttons/FilterButton';
import PaginationButton from '../components/Buttons/PaginationButton';

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
                    { title: 'Próximos Vencimentos', value: estatisticas.proximosVencimentos.toString(), icon: '⏰', color: 'bg-yellow-400' }
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
                            <div
                                className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-xl`}
                                style={stat.title === 'Próximos Vencimentos' ? { backgroundColor: '#fbbf24' } : {}}
                            >
                                <span className="flex items-center justify-center w-full h-full">{stat.icon}</span>
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
                        <FilterButton onClick={() => setShowFiltros(!showFiltros)}>
                            🔍 {showFiltros ? 'Ocultar' : 'Mostrar'} Filtros
                        </FilterButton>
                        <FilterButton onClick={limparFiltros} variant="neutral">🗑️ Limpar</FilterButton>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch justify-items-stretch">
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
                        >
                            <BookCardYeti
                                livro={{
                                    id: livro.id,
                                    titulo: livro.titulo,
                                    nomeAutor: livro.nomeAutor,
                                    genero: livro.genero,
                                    ano: livro.ano,
                                    capaUrl: livro.capaUrl,
                                    sinopse: livro.sinopse,
                                    nomeEditora: livro.nomeEditora,
                                    numeroPaginas: livro.numeroPaginas,
                                    exemplaresDisponiveis: 0,
                                    totalExemplares: 0,
                                    temExemplaresDisponiveis: false,
                                    // Dados específicos do empréstimo
                                    status: livro.status,
                                    estaAtrasado: livro.estaAtrasado,
                                    dataEmprestimo: livro.dataEmprestimo,
                                    dataPrevistaDevolucao: livro.dataPrevistaDevolucao,
                                    diasAtraso: livro.diasAtraso,
                                    diasRestantes: livro.diasRestantes,
                                    quantidadeRenovacoes: livro.quantidadeRenovacoes,
                                    maxRenovacoes: livro.maxRenovacoes
                                }}
                                isFavorite={isFavorite(livro.id)}
                                onToggleFavorite={toggleFavorite}
                                onVerDetalhes={() => console.log('Ver detalhes:', livro.titulo)}
                            />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Paginação */}
            {livrosFiltrados.length > livrosPerPage && (
                <div className="flex justify-between items-center mt-8">
                    <PaginationButton onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Anterior</PaginationButton>
                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <PaginationButton key={page} onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                                {page}
                            </PaginationButton>
                        ))}
                    </div>
                    <PaginationButton onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</PaginationButton>
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
