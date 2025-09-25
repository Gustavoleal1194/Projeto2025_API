import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import type { Livro, LivroCreateRequest } from '../constants/entities';
import livroService from '../services/livroService';
import { EditIcon, DeleteIcon, CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';

const GerenciarLivros: React.FC = () => {
    // Estados principais
    const [livros, setLivros] = useState<Livro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    // Estados do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLivro, setEditingLivro] = useState<Livro | null>(null);

    // Estados do formulário
    const [formData, setFormData] = useState<LivroCreateRequest>({
        titulo: '',
        subtitulo: '',
        isbn: '',
        ano: new Date().getFullYear(),
        edicao: 1,
        numeroPaginas: 0,
        idioma: 'Português',
        genero: '',
        sinopse: '',
        preco: 0,
        capaUrl: '',
        codigoBarras: '',
        idAutor: 0,
        idEditora: 0
    });

    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGenero, setFilterGenero] = useState('');
    const [filterDisponibilidade, setFilterDisponibilidade] = useState('todos');

    // Carregar dados
    const loadLivros = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await livroService.listar();
            setLivros(data);
            setLastUpdate(new Date().toLocaleString('pt-BR'));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar livros');
        } finally {
            setLoading(false);
        }
    };

    // Carregar dados na inicialização
    useEffect(() => {
        loadLivros();
    }, []);

    // Filtrar livros
    const filteredLivros = livros.filter(livro => {
        const matchesSearch = livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            livro.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (livro.nomeAutor && livro.nomeAutor.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesGenero = !filterGenero || livro.genero.toLowerCase().includes(filterGenero.toLowerCase());

        const matchesDisponibilidade = filterDisponibilidade === 'todos' ||
            (filterDisponibilidade === 'disponiveis' && livro.ativo) ||
            (filterDisponibilidade === 'indisponiveis' && !livro.ativo);

        return matchesSearch && matchesGenero && matchesDisponibilidade;
    });

    // Abrir modal para criar/editar
    const openModal = (livro?: Livro) => {
        if (livro) {
            setEditingLivro(livro);
            setFormData({
                titulo: livro.titulo,
                subtitulo: livro.subtitulo || '',
                isbn: livro.isbn,
                ano: livro.ano,
                edicao: livro.edicao,
                numeroPaginas: livro.numeroPaginas,
                idioma: livro.idioma,
                genero: livro.genero,
                sinopse: livro.sinopse || '',
                preco: livro.preco,
                capaUrl: livro.capaUrl || '',
                codigoBarras: livro.codigoBarras || '',
                idAutor: livro.idAutor,
                idEditora: livro.idEditora
            });
        } else {
            setEditingLivro(null);
            setFormData({
                titulo: '',
                subtitulo: '',
                isbn: '',
                ano: new Date().getFullYear(),
                edicao: 1,
                numeroPaginas: 0,
                idioma: 'Português',
                genero: '',
                sinopse: '',
                preco: 0,
                capaUrl: '',
                codigoBarras: '',
                idAutor: 0,
                idEditora: 0
            });
        }
        setIsModalOpen(true);
    };

    // Fechar modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLivro(null);
        setFormData({
            titulo: '',
            subtitulo: '',
            isbn: '',
            ano: new Date().getFullYear(),
            edicao: 1,
            numeroPaginas: 0,
            idioma: 'Português',
            genero: '',
            sinopse: '',
            preco: 0,
            capaUrl: '',
            codigoBarras: '',
            idAutor: 0,
            idEditora: 0
        });
    };

    // Salvar livro
    const saveLivro = async () => {
        try {
            if (editingLivro) {
                await livroService.atualizar({ ...formData, id: editingLivro.id });
            } else {
                await livroService.criar(formData);
            }
            await loadLivros();
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar livro');
        }
    };

    // Excluir livro
    const deleteLivro = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este livro?')) {
            try {
                await livroService.excluir(id);
                await loadLivros();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao excluir livro');
            }
        }
    };


    // Estatísticas
    const totalLivros = livros.length;
    const livrosDisponiveis = livros.filter(l => l.ativo).length;
    const livrosIndisponiveis = livros.filter(l => !l.ativo).length;
    const livrosComExemplares = livros.filter(l => l.totalExemplares > 0).length;

    return (
        <Layout
            pageTitle="Gerenciar Livros"
            pageSubtitle="Gerencie o catálogo de livros da biblioteca"
            onRefresh={loadLivros}
            loading={loading}
            lastUpdate={lastUpdate}
        >
            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                >
                    <div className="flex items-center">
                        <span className="text-xl mr-2">⚠️</span>
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-blue-600">{totalLivros}</p>
                            <p className="text-gray-600 font-medium">Total de Livros</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-green-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-green-600">{livrosDisponiveis}</p>
                            <p className="text-gray-600 font-medium">Disponíveis</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-red-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-red-600">{livrosIndisponiveis}</p>
                            <p className="text-gray-600 font-medium">Indisponíveis</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">❌</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-purple-600">{livrosComExemplares}</p>
                            <p className="text-gray-600 font-medium">Com Exemplares</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filtros e Busca */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Busca */}
                    <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por título, ISBN ou autor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 text-base transition-all duration-300 bg-blue-50 placeholder-gray-500"
                        />
                    </div>

                    {/* Filtro por Gênero */}
                    <div className="flex-1">
                        <select
                            value={filterGenero}
                            onChange={(e) => setFilterGenero(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                        >
                            <option value="">Todos os gêneros</option>
                            <option value="Romance">Romance</option>
                            <option value="Ficção">Ficção</option>
                            <option value="Terror">Terror</option>
                            <option value="Aventura">Aventura</option>
                            <option value="Drama">Drama</option>
                            <option value="Comédia">Comédia</option>
                            <option value="Ação">Ação</option>
                            <option value="Suspense">Suspense</option>
                            <option value="Fantasia">Fantasia</option>
                            <option value="Ficção Científica">Ficção Científica</option>
                        </select>
                    </div>

                    {/* Filtro por Disponibilidade */}
                    <div className="flex-1">
                        <select
                            value={filterDisponibilidade}
                            onChange={(e) => setFilterDisponibilidade(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                        >
                            <option value="todos">Todos os status</option>
                            <option value="disponiveis">Apenas disponíveis</option>
                            <option value="indisponiveis">Apenas indisponíveis</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Botão Criar Livro */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
            >
                <div className="flex justify-center">
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-blue-800"
                    >
                        <span>Criar Novo Livro</span>
                        <span className="text-lg bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center">➕</span>
                    </button>
                </div>
            </motion.div>

            {/* Tabela de Livros */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white shadow-2xl border border-blue-100 overflow-hidden"
            >
                <div className="overflow-x-auto bg-white shadow-2xl border border-blue-100">
                    <table className="min-w-full divide-y divide-blue-100">
                        <thead className="bg-gradient-to-r from-blue-600 to-purple-600" style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)' }}>
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                    <span className="flex items-center gap-2">
                                        <span>📚</span>
                                        <span>Capa</span>
                                    </span>
                                </th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                    <span className="flex items-center gap-2">
                                        <span>📖</span>
                                        <span>Título</span>
                                    </span>
                                </th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                    <span className="flex items-center gap-2">
                                        <span>✍️</span>
                                        <span>Autor</span>
                                    </span>
                                </th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                    <span className="flex items-center gap-2">
                                        <span>🏷️</span>
                                        <span>Gênero</span>
                                    </span>
                                </th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                    <span className="flex items-center gap-2">
                                        <span>🔢</span>
                                        <span>ISBN</span>
                                    </span>
                                </th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                    <span className="flex items-center gap-2">
                                        <span>⚡</span>
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
                        <tbody className="divide-y divide-gray-200">
                            {filteredLivros.map((livro) => (
                                <motion.tr
                                    key={livro.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                            {livro.capaUrl ? (
                                                <img
                                                    src={livro.capaUrl}
                                                    alt={livro.titulo}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xl">📚</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-semibold text-gray-900">{livro.titulo}</div>
                                            {livro.subtitulo && (
                                                <div className="text-sm text-gray-500">{livro.subtitulo}</div>
                                            )}
                                            <div className="text-sm text-gray-400">Ano: {livro.ano}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{livro.nomeAutor || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                            {livro.genero}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 font-mono text-sm">{livro.isbn}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${livro.ativo
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {livro.ativo ? 'Ativo' : 'Indisponível'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openModal(livro)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-800"
                                                style={{ minWidth: '36px' }}
                                                title="Editar"
                                            >
                                                <EditIcon size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteLivro(livro.id)}
                                                className="text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border"
                                                style={{
                                                    backgroundColor: '#dc2626',
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
                                                <DeleteIcon size={16} className="text-white" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal de Criação/Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingLivro ? 'Editar Livro' : 'Criar Novo Livro'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-700 flex items-center justify-center"
                                style={{ minWidth: '36px', minHeight: '36px' }}
                                title="Fechar"
                            >
                                <CancelIcon size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Título */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
                                <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* Subtítulo */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtítulo</label>
                                <input
                                    type="text"
                                    value={formData.subtitulo}
                                    onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                />
                            </div>

                            {/* ISBN */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN *</label>
                                <input
                                    type="text"
                                    value={formData.isbn}
                                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* Ano */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ano *</label>
                                <input
                                    type="number"
                                    value={formData.ano}
                                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* Edição */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Edição</label>
                                <input
                                    type="number"
                                    value={formData.edicao}
                                    onChange={(e) => setFormData({ ...formData, edicao: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                />
                            </div>

                            {/* Número de Páginas */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Número de Páginas *</label>
                                <input
                                    type="number"
                                    value={formData.numeroPaginas}
                                    onChange={(e) => setFormData({ ...formData, numeroPaginas: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* Idioma */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Idioma</label>
                                <input
                                    type="text"
                                    value={formData.idioma}
                                    onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                />
                            </div>

                            {/* Gênero */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Gênero *</label>
                                <input
                                    type="text"
                                    value={formData.genero}
                                    onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* Preço */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Preço</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.preco}
                                    onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                />
                            </div>

                            {/* Código de Barras */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Código de Barras</label>
                                <input
                                    type="text"
                                    value={formData.codigoBarras}
                                    onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                />
                            </div>

                            {/* URL da Capa */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">URL da Capa</label>
                                <input
                                    type="url"
                                    value={formData.capaUrl}
                                    onChange={(e) => setFormData({ ...formData, capaUrl: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                />
                            </div>

                            {/* ID do Autor */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ID do Autor *</label>
                                <input
                                    type="number"
                                    value={formData.idAutor}
                                    onChange={(e) => setFormData({ ...formData, idAutor: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* ID da Editora */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ID da Editora *</label>
                                <input
                                    type="number"
                                    value={formData.idEditora}
                                    onChange={(e) => setFormData({ ...formData, idEditora: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            {/* Sinopse */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Sinopse</label>
                                <textarea
                                    value={formData.sinopse}
                                    onChange={(e) => setFormData({ ...formData, sinopse: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Botões do Modal */}
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-700 flex items-center justify-center"
                                style={{ minWidth: '48px', minHeight: '48px' }}
                                title="Cancelar"
                            >
                                <CancelIcon size={20} />
                            </button>
                            <button
                                onClick={saveLivro}
                                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-700 flex items-center justify-center"
                                style={{ minWidth: '48px', minHeight: '48px' }}
                                title={editingLivro ? 'Atualizar' : 'Criar'}
                            >
                                {editingLivro ? <UpdateIcon size={20} /> : <CreateIcon size={20} />}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </Layout>
    );
};

export default GerenciarLivros;
