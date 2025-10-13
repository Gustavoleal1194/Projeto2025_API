import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import RefreshButton from '../components/Buttons/RefreshButton';
import type { Emprestimo, EmprestimoForm } from '../types/entities';
import { emprestimoService } from '../services/emprestimoService';
import { CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';
import { useNotifications } from '../hooks/useNotifications';
import { EmprestimoValidator } from '../validators/EmprestimoValidator';
import { LoadingOverlay } from '../components/Loading';
import { createSmartTable } from '../utils/tableRecipes';
import { useSolicitacaoState } from '../utils/solicitacaoState';

const GerenciarEmprestimos: React.FC = () => {
    const { handleRequestError, showCrudSuccess } = useNotifications();
    const { solicitacaoData, clearSolicitacaoData } = useSolicitacaoState();

    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmprestimo, setEditingEmprestimo] = useState<Emprestimo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const [isDevolucaoModalOpen, setIsDevolucaoModalOpen] = useState(false);
    const [emprestimoIdDevolucao, setEmprestimoIdDevolucao] = useState('');

    // Estados do formulário
    const [formData, setFormData] = useState<EmprestimoForm>({
        idUsuario: 0,
        idExemplar: 0,
        dataEmprestimo: '',
        dataPrevistaDevolucao: '',
        observacoes: ''
    });

    // Estados de validação
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Funções de validação usando validador centralizado
    const validateField = (name: string, value: string | number): string => {
        switch (name) {
            case 'idUsuario':
                return EmprestimoValidator.validateIdUsuario(Number(value));
            case 'idExemplar':
                return EmprestimoValidator.validateIdExemplar(Number(value));
            case 'dataEmprestimo':
                return EmprestimoValidator.validateDataEmprestimo(String(value));
            case 'dataPrevistaDevolucao':
                return EmprestimoValidator.validateDataPrevistaDevolucao(String(value), formData.dataEmprestimo);
            case 'observacoes':
                return EmprestimoValidator.validateObservacoes(String(value));
            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        console.log('🔍 Validando formulário com dados:', formData);
        const newErrors = EmprestimoValidator.validateForm(formData);
        console.log('❌ Erros de validação encontrados:', newErrors);
        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        console.log('✅ Formulário válido:', isValid);
        return isValid;
    };

    // Handler para mudanças nos campos com validação em tempo real
    const handleFieldChange = (name: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validar campo em tempo real
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Carregar empréstimos
    const loadEmprestimos = async () => {
        try {
            setLoading(true);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const data = await emprestimoService.listar();
            setEmprestimos(data);
        } catch (error) {
            console.error('Erro ao carregar empréstimos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmprestimos();
    }, []);

    // Detectar dados de solicitação e abrir modal automaticamente
    useEffect(() => {
        if (solicitacaoData && solicitacaoData.abrirModal) {
            console.log('📚 Dados de solicitação detectados, abrindo modal:', solicitacaoData);

            // Pré-preencher formulário com dados da solicitação
            const hoje = new Date();
            const dataPrevista = new Date();
            dataPrevista.setDate(hoje.getDate() + 14); // 14 dias a partir de hoje

            // Usar data de ontem para empréstimo para passar na validação
            const dataEmprestimo = new Date();
            dataEmprestimo.setDate(hoje.getDate() - 1);

            const novoFormData = {
                idUsuario: solicitacaoData.usuarioId,
                idExemplar: solicitacaoData.exemplarId,
                dataEmprestimo: dataEmprestimo.toISOString().split('T')[0],
                dataPrevistaDevolucao: dataPrevista.toISOString().split('T')[0],
                observacoes: `Solicitação de empréstimo para "${solicitacaoData.livroTitulo}" solicitado por ${solicitacaoData.nomeUsuario}`
            };

            console.log('📝 Pré-preenchendo formulário com:', novoFormData);
            setFormData(novoFormData);

            // Limpar erros
            setErrors({});

            // Abrir modal com um pequeno delay para garantir que o estado seja atualizado
            setTimeout(() => {
                console.log('🚀 Abrindo modal de empréstimo...');
                setIsModalOpen(true);

                // Limpar dados APÓS abrir o modal para evitar loop
                setTimeout(() => {
                    clearSolicitacaoData();
                }, 200);
            }, 100);
        }
    }, [solicitacaoData]);

    // Filtrar empréstimos
    const filteredEmprestimos = emprestimos.filter(emprestimo => {
        const matchesSearch = emprestimo.nomeUsuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emprestimo.tituloLivro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emprestimo.status?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter ||
            (statusFilter === 'Emprestado' && emprestimo.status === 'Emprestado' && !emprestimo.estaAtrasado) ||
            (statusFilter === 'Devolvido' && emprestimo.status === 'Devolvido') ||
            (statusFilter === 'Atrasado' && emprestimo.status === 'Emprestado' && emprestimo.estaAtrasado);
        const matchesTipo = !tipoFilter ||
            (tipoFilter === 'ativo' && emprestimo.status === 'Emprestado' && !emprestimo.estaAtrasado) ||
            (tipoFilter === 'devolvido' && emprestimo.status === 'Devolvido') ||
            (tipoFilter === 'atrasado' && emprestimo.status === 'Emprestado' && emprestimo.estaAtrasado);

        return matchesSearch && matchesStatus && matchesTipo;
    });

    // Estatísticas
    const totalEmprestimos = emprestimos.length;
    const emprestimosAtivos = emprestimos.filter(e => e.status === 'Emprestado' && !e.estaAtrasado).length;
    const emprestimosDevolvidos = emprestimos.filter(e => e.status === 'Devolvido').length;
    const emprestimosAtrasados = emprestimos.filter(e => e.status === 'Emprestado' && e.estaAtrasado).length;

    // Modal
    const openModal = (emprestimo?: Emprestimo) => {
        if (emprestimo) {
            setEditingEmprestimo(emprestimo);
            setFormData({
                idUsuario: emprestimo.idUsuario,
                idExemplar: emprestimo.idExemplar,
                dataEmprestimo: emprestimo.dataEmprestimo.split('T')[0],
                dataPrevistaDevolucao: emprestimo.dataPrevistaDevolucao.split('T')[0],
                observacoes: emprestimo.observacoes || ''
            });
        } else {
            setEditingEmprestimo(null);
            const hoje = new Date();
            const dataPrevista = new Date();
            dataPrevista.setDate(hoje.getDate() + 14); // 14 dias a partir de hoje

            setFormData({
                idUsuario: 0,
                idExemplar: 0,
                dataEmprestimo: hoje.toISOString().split('T')[0], // Data atual
                dataPrevistaDevolucao: dataPrevista.toISOString().split('T')[0], // 14 dias a partir de hoje
                observacoes: ''
            });
        }
        setErrors({}); // Limpar erros ao abrir modal
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEmprestimo(null);
        setErrors({}); // Limpar erros ao fechar modal
        const hoje = new Date();
        const dataPrevista = new Date();
        dataPrevista.setDate(hoje.getDate() + 14); // 14 dias a partir de hoje

        setFormData({
            idUsuario: 0,
            idExemplar: 0,
            dataEmprestimo: hoje.toISOString().split('T')[0], // Data atual
            dataPrevistaDevolucao: dataPrevista.toISOString().split('T')[0], // 14 dias a partir de hoje
            observacoes: ''
        });
    };


    // Salvar empréstimo
    const saveEmprestimo = async () => {
        if (isSubmitting) return;

        console.log('💾 Iniciando salvamento de empréstimo...');
        console.log('📋 Dados do formulário:', formData);

        // Validar formulário antes de enviar
        if (!validateForm()) {
            console.log('❌ Validação falhou');
            return;
        }

        try {
            setIsSubmitting(true);
            console.log('🔄 Enviando dados...');

            // Preparar dados para envio
            const dadosParaEnvio = { ...formData };
            console.log('📤 Dados preparados para envio:', dadosParaEnvio);

            // Se for um novo empréstimo, usar a data/hora atual
            if (!editingEmprestimo) {
                const agora = new Date();
                dadosParaEnvio.dataEmprestimo = agora.toISOString();

                // Se a data prevista não foi definida, usar 14 dias a partir de agora
                if (!dadosParaEnvio.dataPrevistaDevolucao) {
                    const dataPrevista = new Date();
                    dataPrevista.setDate(agora.getDate() + 14);
                    dadosParaEnvio.dataPrevistaDevolucao = dataPrevista.toISOString();
                } else {
                    // Converter a data do formulário para ISO string com hora
                    const dataPrevista = new Date(dadosParaEnvio.dataPrevistaDevolucao + 'T23:59:59');
                    dadosParaEnvio.dataPrevistaDevolucao = dataPrevista.toISOString();
                }
            } else {
                // Para edição, manter as datas como estão, mas garantir que sejam ISO strings
                if (dadosParaEnvio.dataEmprestimo && !dadosParaEnvio.dataEmprestimo.includes('T')) {
                    dadosParaEnvio.dataEmprestimo = new Date(dadosParaEnvio.dataEmprestimo + 'T00:00:00').toISOString();
                }
                if (dadosParaEnvio.dataPrevistaDevolucao && !dadosParaEnvio.dataPrevistaDevolucao.includes('T')) {
                    dadosParaEnvio.dataPrevistaDevolucao = new Date(dadosParaEnvio.dataPrevistaDevolucao + 'T23:59:59').toISOString();
                }
            }

            if (editingEmprestimo) {
                console.log('✏️ Atualizando empréstimo existente...');
                await emprestimoService.atualizar({ ...dadosParaEnvio, id: editingEmprestimo.id } as any);
            } else {
                console.log('➕ Criando novo empréstimo...');
                await emprestimoService.criar(dadosParaEnvio);
            }

            console.log('✅ Empréstimo salvo com sucesso!');
            await loadEmprestimos();
            closeModal();

            // Mostrar notificação de sucesso
            showCrudSuccess(editingEmprestimo ? 'update' : 'create', 'empréstimo');
        } catch (error) {
            console.error('❌ Erro ao salvar empréstimo:', error);
            handleRequestError(error, 'Erro ao salvar empréstimo');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Excluir empréstimo
    const deleteEmprestimo = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este empréstimo?')) {
            try {
                await emprestimoService.excluir(id);
                await loadEmprestimos();

                // Mostrar notificação de sucesso
                showCrudSuccess('delete', 'empréstimo');
            } catch (error) {
                handleRequestError(error, 'Erro ao excluir empréstimo');
            }
        }
    };

    // Devolver empréstimo
    const devolverEmprestimo = async (id: number) => {
        try {
            await emprestimoService.devolver(id);
            await loadEmprestimos();

            // Mostrar notificação de sucesso
            showCrudSuccess('update', 'empréstimo');
        } catch (error) {
            handleRequestError(error, 'Erro ao devolver empréstimo');
        }
    };

    return (
        <Layout
            pageTitle="Gerenciar Empréstimos"
            pageSubtitle="Administre os empréstimos da biblioteca"
            loading={loading}
            onRefresh={loadEmprestimos}
        >
            {/* Loading State */}
            <LoadingOverlay
                isVisible={loading}
                text="Carregando empréstimos..."
                size="lg"
            />

            {/* Page Content */}
            <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-600">{totalEmprestimos}</p>
                                <p className="text-gray-600 font-medium">Total de Empréstimos</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📖</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-green-600">{emprestimosAtivos}</p>
                                <p className="text-gray-600 font-medium">Empréstimos Ativos</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-yellow-600">{emprestimosAtrasados}</p>
                                <p className="text-gray-600 font-medium">Atrasados</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-purple-600">{emprestimosDevolvidos}</p>
                                <p className="text-gray-600 font-medium">Devolvidos</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📚</span>
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
                                🔍 Buscar Empréstimos
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por usuário, livro ou status..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 text-base transition-all duration-300 bg-blue-50 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Filtro por Status */}
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                ⚡ Filtrar por Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                            >
                                <option value="">Todos os status</option>
                                <option value="Emprestado">Emprestado</option>
                                <option value="Devolvido">Devolvido</option>
                                <option value="Atrasado">Atrasado</option>
                            </select>
                        </div>

                        {/* Filtro por Tipo */}
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                📋 Filtrar por Tipo
                            </label>
                            <select
                                value={tipoFilter}
                                onChange={(e) => setTipoFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                            >
                                <option value="">Todos os tipos</option>
                                <option value="ativo">Ativos</option>
                                <option value="devolvido">Devolvidos</option>
                                <option value="atrasado">Atrasados</option>
                            </select>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-8 flex justify-center gap-4">
                        <RefreshButton onClick={() => openModal()} text="Criar Novo Empréstimo" icon={<span className="text-xl">➕</span>} />

                        <RefreshButton onClick={() => setIsDevolucaoModalOpen(true)} text="Devolução de Empréstimo" variant="success" icon={<span className="text-xl">📚</span>} />
                    </div>
                </div>

                {/* Tabela de Empréstimos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white shadow-2xl border border-blue-100 overflow-hidden"
                >
                    {createSmartTable(
                        filteredEmprestimos,
                        'emprestimos',
                        openModal,
                        deleteEmprestimo,
                        devolverEmprestimo, // Função de devolução
                        loading,
                        error,
                        loadEmprestimos
                    )}
                </motion.div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ left: '17.5rem' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingEmprestimo ? 'Editar Empréstimo' : 'Criar Novo Empréstimo'}
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

                            <form onSubmit={(e) => { e.preventDefault(); saveEmprestimo(); }} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Usuário ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ID do Usuário *</label>
                                        <input
                                            type="number"
                                            value={formData.idUsuario || ''}
                                            onChange={(e) => handleFieldChange('idUsuario', parseInt(e.target.value) || 0)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.idUsuario ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.idUsuario && (
                                            <p className="mt-1 text-sm text-red-600">{errors.idUsuario}</p>
                                        )}
                                    </div>

                                    {/* Exemplar ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ID do Exemplar *</label>
                                        <input
                                            type="number"
                                            value={formData.idExemplar || ''}
                                            onChange={(e) => handleFieldChange('idExemplar', parseInt(e.target.value) || 0)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.idExemplar ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.idExemplar && (
                                            <p className="mt-1 text-sm text-red-600">{errors.idExemplar}</p>
                                        )}
                                    </div>

                                    {/* Data de Empréstimo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Empréstimo *</label>
                                        <input
                                            type="date"
                                            value={formData.dataEmprestimo}
                                            onChange={(e) => handleFieldChange('dataEmprestimo', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dataEmprestimo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            required
                                        />
                                        {errors.dataEmprestimo && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dataEmprestimo}</p>
                                        )}
                                    </div>

                                    {/* Data de Devolução Prevista */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Devolução Prevista *</label>
                                        <input
                                            type="date"
                                            value={formData.dataPrevistaDevolucao}
                                            onChange={(e) => handleFieldChange('dataPrevistaDevolucao', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dataPrevistaDevolucao ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            required
                                        />
                                        {errors.dataPrevistaDevolucao && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dataPrevistaDevolucao}</p>
                                        )}
                                    </div>

                                    {/* Observações */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                                        <textarea
                                            value={formData.observacoes}
                                            onChange={(e) => handleFieldChange('observacoes', e.target.value)}
                                            rows={3}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.observacoes ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="Observações sobre o empréstimo..."
                                            autoComplete="off"
                                        />
                                        {errors.observacoes && (
                                            <p className="mt-1 text-sm text-red-600">{errors.observacoes}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Botões */}
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
                                        title={editingEmprestimo ? 'Atualizar' : 'Criar'}
                                    >
                                        {isSubmitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            editingEmprestimo ? <UpdateIcon size={20} /> : <CreateIcon size={20} />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Modal de Devolução de Empréstimo */}
                {isDevolucaoModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ left: '17.5rem' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    📚 Devolução de Empréstimo
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsDevolucaoModalOpen(false);
                                        setEmprestimoIdDevolucao('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold bg-red-100 hover:bg-red-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID do Empréstimo *
                                </label>
                                <input
                                    type="number"
                                    value={emprestimoIdDevolucao}
                                    onChange={(e) => setEmprestimoIdDevolucao(e.target.value)}
                                    placeholder="Digite o ID do empréstimo"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Digite o ID do empréstimo que deseja devolver
                                </p>
                            </div>

                            {/* Botões */}
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setIsDevolucaoModalOpen(false);
                                        setEmprestimoIdDevolucao('');
                                    }}
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all duration-300 border-2 border-red-600 hover:border-red-700 flex items-center gap-2"
                                    style={{ minWidth: '36px' }}
                                >
                                    <CancelIcon size={16} />
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

        </Layout>
    );
};

export default GerenciarEmprestimos;
