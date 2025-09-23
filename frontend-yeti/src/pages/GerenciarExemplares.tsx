import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { exemplarService } from '../services/exemplarService';
import { livroService } from '../services/livroService';
import type { Exemplar, ExemplarCreateRequest, Livro } from '../constants/entities';
import Layout from '../components/Layout/Layout';

const GerenciarExemplares: React.FC = () => {
    // Estados principais
    const [exemplares, setExemplares] = useState<Exemplar[]>([]);
    const [livros, setLivros] = useState<Livro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    // Estados do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExemplar, setEditingExemplar] = useState<Exemplar | null>(null);
    const [formData, setFormData] = useState<ExemplarCreateRequest>({
        idLivro: 0,
        numeroExemplar: '',
        localizacao: '',
        condicao: 'Bom',
        disponivel: true,
        ativo: true,
        dataAquisicao: new Date().toISOString().split('T')[0],
        valorAquisicao: 0,
        fornecedor: '',
        observacoes: ''
    });

    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLivro, setFilterLivro] = useState('');
    const [filterCondicao, setFilterCondicao] = useState('');
    const [filterDisponibilidade, setFilterDisponibilidade] = useState('todos');

    // Carregar dados
    const loadExemplares = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await exemplarService.listar();
            setExemplares(data);
            setLastUpdate(new Date().toLocaleString('pt-BR'));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar exemplares');
        } finally {
            setLoading(false);
        }
    };

    const loadLivros = async () => {
        try {
            const data = await livroService.listar();
            setLivros(data);
        } catch (err) {
            console.error('Erro ao carregar livros:', err);
        }
    };

    // Carregar dados na inicialização
    useEffect(() => {
        loadExemplares();
        loadLivros();
    }, []);

    // Filtrar exemplares
    const filteredExemplares = exemplares.filter(exemplar => {
        const matchesSearch = exemplar.numeroExemplar.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exemplar.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exemplar.tituloLivro && exemplar.tituloLivro.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLivro = !filterLivro || exemplar.idLivro.toString() === filterLivro;

        const matchesCondicao = !filterCondicao || exemplar.condicao.toLowerCase().includes(filterCondicao.toLowerCase());

        const matchesDisponibilidade = filterDisponibilidade === 'todos' ||
            (filterDisponibilidade === 'disponiveis' && exemplar.disponivel) ||
            (filterDisponibilidade === 'indisponiveis' && !exemplar.disponivel);

        return matchesSearch && matchesLivro && matchesCondicao && matchesDisponibilidade;
    });

    // Estatísticas
    const totalExemplares = exemplares.length;
    const exemplaresDisponiveis = exemplares.filter(e => e.disponivel).length;
    const exemplaresIndisponiveis = exemplares.filter(e => !e.disponivel).length;
    const exemplaresAtivos = exemplares.filter(e => e.ativo).length;

    // Modal functions
    const openModal = (exemplar?: Exemplar) => {
        if (exemplar) {
            setEditingExemplar(exemplar);
            setFormData({
                idLivro: exemplar.idLivro,
                numeroExemplar: exemplar.numeroExemplar,
                localizacao: exemplar.localizacao,
                condicao: exemplar.condicao,
                disponivel: exemplar.disponivel,
                ativo: exemplar.ativo,
                dataAquisicao: exemplar.dataAquisicao.split('T')[0],
                valorAquisicao: exemplar.valorAquisicao,
                fornecedor: exemplar.fornecedor,
                observacoes: exemplar.observacoes
            });
        } else {
            setEditingExemplar(null);
            setFormData({
                idLivro: 0,
                numeroExemplar: '',
                localizacao: '',
                condicao: 'Bom',
                disponivel: true,
                ativo: true,
                dataAquisicao: new Date().toISOString().split('T')[0],
                valorAquisicao: 0,
                fornecedor: '',
                observacoes: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingExemplar(null);
        setFormData({
            idLivro: 0,
            numeroExemplar: '',
            localizacao: '',
            condicao: 'Bom',
            disponivel: true,
            ativo: true,
            dataAquisicao: new Date().toISOString().split('T')[0],
            valorAquisicao: 0,
            fornecedor: '',
            observacoes: ''
        });
    };

    // Salvar exemplar
    const saveExemplar = async () => {
        try {
            if (editingExemplar) {
                await exemplarService.atualizar({ ...formData, id: editingExemplar.id });
            } else {
                await exemplarService.criar(formData);
            }
            await loadExemplares();
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar exemplar');
        }
    };

    // Excluir exemplar
    const deleteExemplar = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este exemplar?')) {
            try {
                await exemplarService.excluir(id);
                await loadExemplares();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao excluir exemplar');
            }
        }
    };


    if (loading) {
        return (
            <Layout
                pageTitle="Gerenciar Exemplares"
                pageSubtitle="Carregando exemplares..."
                loading={true}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando exemplares...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            pageTitle="Gerenciar Exemplares"
            pageSubtitle="Gerencie todos os exemplares da biblioteca"
            onRefresh={loadExemplares}
            lastUpdate={lastUpdate}
        >
            <div className="p-6 space-y-6">

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-600">{totalExemplares}</p>
                                <p className="text-gray-600 font-medium">Total de Exemplares</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📚</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-green-600">{exemplaresDisponiveis}</p>
                                <p className="text-gray-600 font-medium">Disponíveis</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-red-600">{exemplaresIndisponiveis}</p>
                                <p className="text-gray-600 font-medium">Indisponíveis</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">❌</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-purple-600">{exemplaresAtivos}</p>
                                <p className="text-gray-600 font-medium">Ativos</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📖</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Busca */}
                        <div className="lg:col-span-2">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                🔍 Buscar Exemplares
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por número, localização ou livro..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 text-base transition-all duration-300 bg-blue-50 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Filtro por Livro */}
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                📖 Filtrar por Livro
                            </label>
                            <select
                                value={filterLivro}
                                onChange={(e) => setFilterLivro(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                            >
                                <option value="">Todos os livros</option>
                                {livros.map(livro => (
                                    <option key={livro.id} value={livro.id}>
                                        {livro.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro por Condição */}
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                🏷️ Filtrar por Condição
                            </label>
                            <select
                                value={filterCondicao}
                                onChange={(e) => setFilterCondicao(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                            >
                                <option value="">Todas as condições</option>
                                <option value="Excelente">Excelente</option>
                                <option value="Bom">Bom</option>
                                <option value="Regular">Regular</option>
                                <option value="Ruim">Ruim</option>
                                <option value="Danificado">Danificado</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        {/* Filtro por Disponibilidade */}
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                📊 Filtrar por Disponibilidade
                            </label>
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

                        {/* Botão Criar */}
                        <div className="flex items-end justify-center">
                            <button
                                onClick={() => openModal()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-2 border-blue-700 hover:border-blue-800"
                            >
                                Criar Novo Exemplar
                                <span className="text-lg bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center">➕</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabela de Exemplares */}
                <div className="bg-white shadow-2xl border border-blue-100 overflow-hidden">
                    <div className="overflow-x-auto bg-white shadow-2xl border border-blue-100">
                        <table className="min-w-full divide-y divide-blue-100">
                            <thead className="bg-gradient-to-r from-blue-600 to-purple-600" style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)' }}>
                                <tr>
                                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        📚 Livro
                                    </th>
                                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        🔢 Número
                                    </th>
                                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        📍 Localização
                                    </th>
                                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        🏷️ Condição
                                    </th>
                                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        ⚡ Status
                                    </th>
                                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        💰 Valor
                                    </th>
                                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        ⚙️ Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-blue-100 rounded-b-2xl">
                                {filteredExemplares.map((exemplar, index) => (
                                    <motion.tr
                                        key={exemplar.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                                    >
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-14 w-14">
                                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                                                        <span className="text-xl font-bold text-white">📚</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {exemplar.tituloLivro || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-blue-600 font-medium">
                                                        {exemplar.nomeAutor || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {exemplar.numeroExemplar}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {exemplar.localizacao || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${exemplar.condicao === 'Excelente' ? 'bg-green-100 text-green-800' :
                                                exemplar.condicao === 'Bom' ? 'bg-blue-100 text-blue-800' :
                                                    exemplar.condicao === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                                                        exemplar.condicao === 'Ruim' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}>
                                                {exemplar.condicao}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${exemplar.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {exemplar.disponivel ? '✅ Disponível' : '❌ Indisponível'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                R$ {exemplar.valorAquisicao.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal(exemplar)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-blue-700"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => deleteExemplar(exemplar.id)}
                                                    style={{
                                                        backgroundColor: '#dc2626',
                                                        color: '#ffffff',
                                                        borderColor: '#dc2626'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#b91c1c';
                                                        e.currentTarget.style.borderColor = '#b91c1c';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#dc2626';
                                                        e.currentTarget.style.borderColor = '#dc2626';
                                                    }}
                                                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border-2"
                                                >
                                                    🗑️ Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {editingExemplar ? 'Editar Exemplar' : 'Criar Novo Exemplar'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold bg-red-100 hover:bg-red-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Livro */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Livro *
                                    </label>
                                    <select
                                        value={formData.idLivro}
                                        onChange={(e) => setFormData({ ...formData, idLivro: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value={0}>Selecione um livro</option>
                                        {livros.map(livro => (
                                            <option key={livro.id} value={livro.id}>
                                                {livro.titulo}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Número do Exemplar */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número do Exemplar *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.numeroExemplar}
                                        onChange={(e) => setFormData({ ...formData, numeroExemplar: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Localização */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Localização
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.localizacao}
                                        onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ex: Estante A, Prateleira 3"
                                    />
                                </div>

                                {/* Condição */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Condição
                                    </label>
                                    <select
                                        value={formData.condicao}
                                        onChange={(e) => setFormData({ ...formData, condicao: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Excelente">Excelente</option>
                                        <option value="Bom">Bom</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Ruim">Ruim</option>
                                        <option value="Danificado">Danificado</option>
                                    </select>
                                </div>

                                {/* Data de Aquisição */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Data de Aquisição
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dataAquisicao}
                                        onChange={(e) => setFormData({ ...formData, dataAquisicao: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Valor de Aquisição */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor de Aquisição (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.valorAquisicao}
                                        onChange={(e) => setFormData({ ...formData, valorAquisicao: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Fornecedor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fornecedor
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fornecedor}
                                        onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nome do fornecedor"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.disponivel}
                                                onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                                                className="mr-2"
                                            />
                                            Disponível
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.ativo}
                                                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                                                className="mr-2"
                                            />
                                            Ativo
                                        </label>
                                    </div>
                                </div>

                                {/* Observações */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Observações
                                    </label>
                                    <textarea
                                        value={formData.observacoes}
                                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Observações sobre o exemplar..."
                                    />
                                </div>
                            </div>

                            {/* Botões do Modal */}
                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors duration-200 border-2 border-red-500 hover:border-red-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveExemplar}
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors duration-200 border-2 border-black hover:border-gray-800"
                                >
                                    {editingExemplar ? 'Atualizar' : 'Criar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GerenciarExemplares;
