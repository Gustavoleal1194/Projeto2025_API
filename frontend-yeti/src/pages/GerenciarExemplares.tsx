import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { exemplarService } from '../services/exemplarService';
import { livroService } from '../services/livroService';
import type { Exemplar, ExemplarCreateRequest, Livro } from '../constants/entities';
import Layout from '../components/Layout/Layout';
import { CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';
import { useNotifications } from '../hooks/useNotifications';
import { ExemplarValidator } from '../validators/ExemplarValidator';
import { BookLoader } from '../components/Loading';
import { createSmartTable } from '../utils/tableRecipes';

const GerenciarExemplares: React.FC = () => {
    const { handleRequestError, showCrudSuccess } = useNotifications();

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

    // Estados de validação
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Funções de validação usando validador centralizado
    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'idLivro':
                return ExemplarValidator.validateIdLivro(Number(value) || 0);
            case 'numeroExemplar':
                return ExemplarValidator.validateNumeroExemplar(value?.toString() || '');
            case 'localizacao':
                return ExemplarValidator.validateLocalizacao(value?.toString() || '');
            case 'condicao':
                return ExemplarValidator.validateCondicao(value?.toString() || '');
            case 'dataAquisicao':
                return ExemplarValidator.validateDataAquisicao(value?.toString() || '');
            case 'valorAquisicao':
                return ExemplarValidator.validateValorAquisicao(Number(value) || 0);
            case 'fornecedor':
                return ExemplarValidator.validateFornecedor(value?.toString() || '');
            case 'observacoes':
                return ExemplarValidator.validateObservacoes(value?.toString() || '');
            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors = ExemplarValidator.validateForm(formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handler para mudanças nos campos com validação em tempo real
    const handleFieldChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validar campo em tempo real
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Carregar dados
    const loadExemplares = async () => {
        try {
            setLoading(true);
            setError(null);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

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
        setErrors({}); // Limpar erros ao abrir modal
        setIsModalOpen(true);

        // Limpar campos após um pequeno delay para evitar autofill
        setTimeout(() => {
            if (!exemplar) {
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
        }, 100);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingExemplar(null);
        setErrors({}); // Limpar erros ao fechar modal
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
        if (isSubmitting) return;

        // Validar formulário antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            if (editingExemplar) {
                await exemplarService.atualizar({ ...formData, id: editingExemplar.id });
            } else {
                await exemplarService.criar(formData);
            }
            await loadExemplares();
            closeModal();

            // Mostrar notificação de sucesso
            showCrudSuccess(editingExemplar ? 'update' : 'create', 'exemplar');
        } catch (err) {
            handleRequestError(err, 'Erro ao salvar exemplar');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Excluir exemplar
    const deleteExemplar = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este exemplar?')) {
            try {
                await exemplarService.excluir(id);
                await loadExemplares();

                // Mostrar notificação de sucesso
                showCrudSuccess('delete', 'exemplar');
            } catch (err) {
                handleRequestError(err, 'Erro ao excluir exemplar');
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <BookLoader size="lg" />
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Carregando exemplares...
                            </p>
                        </div>
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
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-blue-800"
                            >
                                Criar Novo Exemplar
                                <span className="text-lg bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center">➕</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabela de Exemplares */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white shadow-2xl border border-blue-100 overflow-hidden"
                >
                    {createSmartTable(
                        filteredExemplares,
                        'exemplares',
                        openModal,
                        deleteExemplar,
                        undefined, // Sem toggle para exemplares
                        loading,
                        error,
                        loadExemplares
                    )}
                </motion.div>

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
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-700 flex items-center justify-center"
                                    style={{ minWidth: '36px', minHeight: '36px' }}
                                    title="Fechar"
                                >
                                    <CancelIcon size={16} />
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); saveExemplar(); }} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Livro */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Livro *
                                        </label>
                                        <select
                                            value={formData.idLivro}
                                            onChange={(e) => handleFieldChange('idLivro', parseInt(e.target.value))}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.idLivro ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            required
                                        >
                                            <option value={0}>Selecione um livro</option>
                                            {livros.map(livro => (
                                                <option key={livro.id} value={livro.id}>
                                                    {livro.titulo}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.idLivro && (
                                            <p className="mt-1 text-sm text-red-600">{errors.idLivro}</p>
                                        )}
                                    </div>

                                    {/* Número do Exemplar */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número do Exemplar *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.numeroExemplar}
                                            onChange={(e) => handleFieldChange('numeroExemplar', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.numeroExemplar ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.numeroExemplar && (
                                            <p className="mt-1 text-sm text-red-600">{errors.numeroExemplar}</p>
                                        )}
                                    </div>

                                    {/* Localização */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Localização
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.localizacao}
                                            onChange={(e) => handleFieldChange('localizacao', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.localizacao ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="Ex: Estante A, Prateleira 3"
                                            autoComplete="off"
                                        />
                                        {errors.localizacao && (
                                            <p className="mt-1 text-sm text-red-600">{errors.localizacao}</p>
                                        )}
                                    </div>

                                    {/* Condição */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Condição
                                        </label>
                                        <select
                                            value={formData.condicao}
                                            onChange={(e) => handleFieldChange('condicao', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.condicao ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        >
                                            <option value="Excelente">Excelente</option>
                                            <option value="Bom">Bom</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Ruim">Ruim</option>
                                            <option value="Danificado">Danificado</option>
                                        </select>
                                        {errors.condicao && (
                                            <p className="mt-1 text-sm text-red-600">{errors.condicao}</p>
                                        )}
                                    </div>

                                    {/* Data de Aquisição */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data de Aquisição
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dataAquisicao}
                                            onChange={(e) => handleFieldChange('dataAquisicao', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dataAquisicao ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.dataAquisicao && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dataAquisicao}</p>
                                        )}
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
                                            onChange={(e) => handleFieldChange('valorAquisicao', parseFloat(e.target.value) || 0)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.valorAquisicao ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                        />
                                        {errors.valorAquisicao && (
                                            <p className="mt-1 text-sm text-red-600">{errors.valorAquisicao}</p>
                                        )}
                                    </div>

                                    {/* Fornecedor */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fornecedor
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fornecedor}
                                            onChange={(e) => handleFieldChange('fornecedor', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fornecedor ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="Nome do fornecedor"
                                            autoComplete="off"
                                        />
                                        {errors.fornecedor && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fornecedor}</p>
                                        )}
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
                                            onChange={(e) => handleFieldChange('observacoes', e.target.value)}
                                            rows={3}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.observacoes ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="Observações sobre o exemplar..."
                                        />
                                        {errors.observacoes && (
                                            <p className="mt-1 text-sm text-red-600">{errors.observacoes}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Botões do Modal */}
                                <div className="flex justify-end gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-700 flex items-center justify-center"
                                        style={{ minWidth: '48px', minHeight: '48px' }}
                                        title="Cancelar"
                                    >
                                        <CancelIcon size={20} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-700 flex items-center justify-center"
                                        style={{ minWidth: '48px', minHeight: '48px' }}
                                        title={editingExemplar ? 'Atualizar' : 'Criar'}
                                    >
                                        {isSubmitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            editingExemplar ? <UpdateIcon size={20} /> : <CreateIcon size={20} />
                                        )}
                                    </button>
                                </div>
                            </form>
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
