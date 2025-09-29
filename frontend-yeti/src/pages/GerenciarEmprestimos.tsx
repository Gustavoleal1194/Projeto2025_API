import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import type { Emprestimo, EmprestimoForm } from '../types/entities';
import { emprestimoService } from '../services/emprestimoService';
import { EditIcon, DeleteIcon, ReturnIcon, RefreshIcon, CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';
import { useNotifications } from '../hooks/useNotifications';
import { EmprestimoValidator } from '../validators/EmprestimoValidator';

const GerenciarEmprestimos: React.FC = () => {
    const { showError, handleRequestError, showCrudSuccess } = useNotifications();

    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleString('pt-BR'));
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
        const newErrors = EmprestimoValidator.validateForm(formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            const data = await emprestimoService.listar();
            setEmprestimos(data);
            setLastUpdate(new Date().toLocaleString('pt-BR'));
        } catch (error) {
            console.error('Erro ao carregar empréstimos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmprestimos();
    }, []);

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

        // Validar formulário antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            // Preparar dados para envio
            const dadosParaEnvio = { ...formData };

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
                await emprestimoService.atualizar({ ...dadosParaEnvio, id: editingEmprestimo.id } as any);
            } else {
                await emprestimoService.criar(dadosParaEnvio);
            }
            await loadEmprestimos();
            closeModal();

            // Mostrar notificação de sucesso
            showCrudSuccess(editingEmprestimo ? 'update' : 'create', 'empréstimo');
        } catch (error) {
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

    // Renovar empréstimo
    const renovarEmprestimo = async (id: number) => {
        try {
            await emprestimoService.renovar(id);
            await loadEmprestimos();

            // Mostrar notificação de sucesso
            showCrudSuccess('update', 'empréstimo');
        } catch (error) {
            handleRequestError(error, 'Erro ao renovar empréstimo');
        }
    };

    // Devolver empréstimo por ID
    const devolverEmprestimoPorId = async () => {
        if (!emprestimoIdDevolucao || isNaN(parseInt(emprestimoIdDevolucao))) {
            showError('Validação Falhou', 'Por favor, insira um ID de empréstimo válido.');
            return;
        }

        try {
            await emprestimoService.devolverEmprestimoPorId(parseInt(emprestimoIdDevolucao));
            await loadEmprestimos();
            setIsDevolucaoModalOpen(false);
            setEmprestimoIdDevolucao('');

            // Mostrar notificação de sucesso
            showCrudSuccess('update', 'empréstimo');
        } catch (error) {
            handleRequestError(error, 'Erro ao devolver empréstimo');
        }
    };

    // Copiar ID do empréstimo para área de transferência
    const copiarIdEmprestimo = (id: number) => {
        navigator.clipboard.writeText(id.toString()).then(() => {
            alert(`ID ${id} copiado para a área de transferência!`);
        }).catch(() => {
            alert(`ID: ${id}`);
        });
    };

    // Copiar número do exemplar para área de transferência
    const copiarNumeroExemplar = (numero: string) => {
        navigator.clipboard.writeText(numero).then(() => {
            alert(`Exemplar ${numero} copiado para a área de transferência!`);
        }).catch(() => {
            alert(`Exemplar: ${numero}`);
        });
    };

    return (
        <Layout
            pageTitle="Gerenciar Empréstimos"
            pageSubtitle="Administre os empréstimos da biblioteca"
            loading={loading}
            onRefresh={loadEmprestimos}
            lastUpdate={lastUpdate}
        >
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
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-blue-800"
                        >
                            Criar Novo Empréstimo
                            <span className="text-lg bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center">➕</span>
                        </button>

                        <button
                            onClick={() => setIsDevolucaoModalOpen(true)}
                            className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-black"
                            style={{ backgroundColor: '#15803d', color: 'white', borderColor: '#000000', borderWidth: '1px' }}
                        >
                            Devolução de Empréstimo
                            <span className="text-lg bg-white text-green-700 rounded-full w-6 h-6 flex items-center justify-center">📚</span>
                        </button>
                    </div>
                </div>

                {/* Tabela de Empréstimos */}
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>🔢</span>
                                            <span>ID</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>👤</span>
                                            <span>Usuário</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📚</span>
                                            <span>Livro</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>🔢</span>
                                            <span>Exemplar</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>Empréstimo</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>⏰</span>
                                            <span>Devolução</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>⚡</span>
                                            <span>Status</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>⚙️</span>
                                            <span>Ações</span>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-blue-100">
                                {filteredEmprestimos.map((emprestimo, index) => (
                                    <motion.tr
                                        key={emprestimo.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-blue-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => copiarIdEmprestimo(emprestimo.id)}
                                                className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full inline-block transition-colors duration-200 cursor-pointer border border-blue-200 hover:border-blue-300"
                                                title="Clique para copiar o ID"
                                            >
                                                #{emprestimo.id}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{emprestimo.nomeUsuario || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{emprestimo.tituloLivro || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => copiarNumeroExemplar(emprestimo.numeroExemplar || 'N/A')}
                                                className="text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full inline-block transition-colors duration-200 cursor-pointer border border-purple-200 hover:border-purple-300"
                                                title="Clique para copiar o número do exemplar"
                                            >
                                                #{emprestimo.numeroExemplar || 'N/A'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(emprestimo.dataEmprestimo).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(emprestimo.dataPrevistaDevolucao).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${emprestimo.status === 'Emprestado' && !emprestimo.estaAtrasado ? 'bg-green-100 text-green-800' :
                                                emprestimo.status === 'Devolvido' ? 'bg-blue-100 text-blue-800' :
                                                    emprestimo.status === 'Emprestado' && emprestimo.estaAtrasado ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {emprestimo.status === 'Emprestado' && !emprestimo.estaAtrasado ? '📚 Emprestado' :
                                                    emprestimo.status === 'Devolvido' ? '✅ Devolvido' :
                                                        emprestimo.status === 'Emprestado' && emprestimo.estaAtrasado ? '⚠️ Atrasado' :
                                                            emprestimo.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal(emprestimo)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-800"
                                                    style={{ minWidth: '36px' }}
                                                    title="Editar"
                                                >
                                                    <EditIcon size={16} />
                                                </button>
                                                {emprestimo.status === 'Emprestado' && (
                                                    <>
                                                        <button
                                                            onClick={() => devolverEmprestimo(emprestimo.id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-700"
                                                            style={{ minWidth: '36px' }}
                                                            title="Devolver"
                                                        >
                                                            <ReturnIcon size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => renovarEmprestimo(emprestimo.id)}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-yellow-700"
                                                            style={{ minWidth: '36px' }}
                                                            title="Renovar"
                                                        >
                                                            <RefreshIcon size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteEmprestimo(emprestimo.id)}
                                                    className="p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2"
                                                    style={{
                                                        backgroundColor: '#dc2626',
                                                        color: 'white',
                                                        borderColor: '#991b1b',
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
                                                    <DeleteIcon size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                                <button
                                    onClick={devolverEmprestimoPorId}
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-all duration-300 border-2 border-green-600 hover:border-green-700 flex items-center gap-2"
                                    style={{ minWidth: '36px' }}
                                >
                                    <ReturnIcon size={16} />
                                    Devolver
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
