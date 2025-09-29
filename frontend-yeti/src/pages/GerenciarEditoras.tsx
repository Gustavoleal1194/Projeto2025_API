import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import type { Editora, EditoraForm } from '../types/entities';
import { editoraService } from '../services/editoraService';
import { CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';
import { useNotifications } from '../hooks/useNotifications';
import { EditoraValidator } from '../validators/EditoraValidator';
import { BookLoader } from '../components/Loading';
import { createSmartTable } from '../utils/tableRecipes';

const GerenciarEditoras: React.FC = () => {
    const { handleRequestError, showCrudSuccess } = useNotifications();

    const [editoras, setEditoras] = useState<Editora[]>([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEditora, setEditingEditora] = useState<Editora | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cidadeFilter, setCidadeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Estados do formulário
    const [formData, setFormData] = useState<EditoraForm>({
        nome: '',
        cnpj: '',
        telefone: null,
        email: '',
        endereco: null,
        cidade: null,
        estado: null,
        cep: null,
        pais: null,
        dataFundacao: new Date().toISOString().split('T')[0], // Data de hoje por padrão
        site: null,
        ativa: true
    });

    // Estados de validação
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Funções de validação usando validador centralizado
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'nome':
                return EditoraValidator.validateNome(value);
            case 'cnpj':
                return EditoraValidator.validateCNPJ(value);
            case 'telefone':
                return EditoraValidator.validateTelefone(value);
            case 'email':
                return EditoraValidator.validateEmail(value);
            case 'endereco':
                return EditoraValidator.validateEndereco(value);
            case 'cidade':
                return EditoraValidator.validateCidade(value);
            case 'estado':
                return EditoraValidator.validateEstado(value);
            case 'cep':
                return EditoraValidator.validateCEP(value);
            case 'pais':
                return EditoraValidator.validatePais(value);
            case 'dataFundacao':
                return EditoraValidator.validateDataFundacao(value);
            case 'site':
                return EditoraValidator.validateSite(value);
            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors = EditoraValidator.validateForm(formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handler para mudanças nos campos com validação em tempo real
    const handleFieldChange = (name: string, value: string) => {
        // Para dataFundacao, sempre manter como string (não converter para null)
        const processedValue = (name === 'dataFundacao') ? value : (value.trim() === '' ? null : value);
        setFormData(prev => ({ ...prev, [name]: processedValue }));

        // Validar campo em tempo real
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Carregar editoras
    const loadEditoras = async () => {
        try {
            setLoading(true);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const data = await editoraService.listar();
            setEditoras(data);
        } catch (error) {
            console.error('Erro ao carregar editoras:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEditoras();
    }, []);

    // Filtrar editoras
    const filteredEditoras = editoras.filter(editora => {
        const matchesSearch = editora.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            editora.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            editora.cidade.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCidade = !cidadeFilter || editora.cidade === cidadeFilter;
        const matchesStatus = !statusFilter ||
            (statusFilter === 'ativa' && editora.ativa) ||
            (statusFilter === 'inativa' && !editora.ativa);

        return matchesSearch && matchesCidade && matchesStatus;
    });

    // Estatísticas
    const totalEditoras = editoras.length;
    const editorasAtivas = editoras.filter(e => e.ativa).length;
    const editorasInativas = editoras.filter(e => !e.ativa).length;
    const cidadesUnicas = [...new Set(editoras.map(e => e.cidade))];

    // Modal
    const openModal = (editora?: Editora) => {
        if (editora) {
            setEditingEditora(editora);
            setFormData({
                nome: editora.nome,
                cnpj: editora.cnpj,
                telefone: editora.telefone,
                email: editora.email,
                endereco: editora.endereco,
                cidade: editora.cidade,
                estado: editora.estado,
                cep: editora.cep,
                pais: editora.pais,
                dataFundacao: editora.dataFundacao.split('T')[0],
                site: editora.site,
                ativa: editora.ativa
            });
        } else {
            setEditingEditora(null);
            setFormData({
                nome: '',
                cnpj: '',
                telefone: null,
                email: '',
                endereco: null,
                cidade: null,
                estado: null,
                cep: null,
                pais: null,
                dataFundacao: new Date().toISOString().split('T')[0], // Data de hoje por padrão
                site: null,
                ativa: true
            });
        }
        setErrors({}); // Limpar erros ao abrir modal
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEditora(null);
        setErrors({}); // Limpar erros ao fechar modal
        setFormData({
            nome: '',
            cnpj: '',
            telefone: null,
            email: '',
            endereco: null,
            cidade: null,
            estado: null,
            cep: null,
            pais: null,
            dataFundacao: new Date().toISOString().split('T')[0], // Data de hoje por padrão
            site: null,
            ativa: true
        });
    };

    // Salvar editora
    const saveEditora = async () => {
        if (isSubmitting) return;

        // Validar formulário antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            if (editingEditora) {
                await editoraService.atualizar({ ...formData, id: editingEditora.id } as any);
            } else {
                await editoraService.criar(formData);
            }
            await loadEditoras();
            closeModal();

            // Mostrar notificação de sucesso
            showCrudSuccess(editingEditora ? 'update' : 'create', 'editora');
        } catch (error) {
            handleRequestError(error, 'Erro ao salvar editora');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Excluir editora
    const deleteEditora = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta editora?')) {
            try {
                await editoraService.excluir(id);
                await loadEditoras();

                // Mostrar notificação de sucesso
                showCrudSuccess('delete', 'editora');
            } catch (error) {
                handleRequestError(error, 'Erro ao excluir editora');
            }
        }
    };

    // Toggle status
    const toggleStatus = async (id: number) => {
        try {
            const token = localStorage.getItem('yeti_token');
            const response = await fetch(`http://localhost:5072/api/Editora/${id}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao alterar status');
            }

            await loadEditoras();
            showCrudSuccess('update', 'editora');
        } catch (err) {
            handleRequestError(err, 'Erro ao alterar status da editora');
        }
    };


    return (
        <Layout
            pageTitle="Gerenciar Editoras"
            pageSubtitle="Administre as editoras da biblioteca"
            loading={loading}
            onRefresh={loadEditoras}
        >
            {/* Loading State */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <BookLoader size="lg" />
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Carregando editoras...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Content */}
            <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-600">{totalEditoras}</p>
                                <p className="text-gray-600 font-medium">Total de Editoras</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🏢</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-green-600">{editorasAtivas}</p>
                                <p className="text-gray-600 font-medium">Ativas</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-red-600">{editorasInativas}</p>
                                <p className="text-gray-600 font-medium">Inativas</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">❌</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-purple-600">{cidadesUnicas.length}</p>
                                <p className="text-gray-600 font-medium">Cidades</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🌍</span>
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
                                🔍 Buscar Editoras
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por nome, email ou cidade..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 text-base transition-all duration-300 bg-blue-50 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Filtro por Cidade */}
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                🏙️ Filtrar por Cidade
                            </label>
                            <select
                                value={cidadeFilter}
                                onChange={(e) => setCidadeFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                            >
                                <option value="">Todas as cidades</option>
                                {cidadesUnicas.map(cidade => (
                                    <option key={cidade} value={cidade}>{cidade}</option>
                                ))}
                            </select>
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
                                <option value="ativa">Ativas</option>
                                <option value="inativa">Inativas</option>
                            </select>
                        </div>
                    </div>

                    {/* Botão Criar */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-blue-800"
                        >
                            Criar Nova Editora
                            <span className="text-lg bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center">➕</span>
                        </button>
                    </div>
                </div>

                {/* Tabela de Editoras */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white shadow-2xl border border-blue-100 overflow-hidden"
                >
                    {createSmartTable(
                        filteredEditoras,
                        'editoras',
                        openModal,
                        deleteEditora,
                        toggleStatus,
                        loading,
                        error,
                        loadEditoras
                    )}
                </motion.div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingEditora ? 'Editar Editora' : 'Criar Nova Editora'}
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

                            <form onSubmit={(e) => { e.preventDefault(); saveEditora(); }} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nome */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                                        <input
                                            type="text"
                                            value={formData.nome}
                                            onChange={(e) => handleFieldChange('nome', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nome ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.nome && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                                        )}
                                    </div>

                                    {/* CNPJ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ *</label>
                                        <input
                                            type="text"
                                            value={formData.cnpj}
                                            onChange={(e) => handleFieldChange('cnpj', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.cnpj ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.cnpj && (
                                            <p className="mt-1 text-sm text-red-600">{errors.cnpj}</p>
                                        )}
                                    </div>

                                    {/* Telefone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                        <input
                                            type="tel"
                                            value={formData.telefone || ''}
                                            onChange={(e) => handleFieldChange('telefone', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.telefone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                        />
                                        {errors.telefone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Endereço */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                                        <input
                                            type="text"
                                            value={formData.endereco || ''}
                                            onChange={(e) => handleFieldChange('endereco', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.endereco ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                        />
                                        {errors.endereco && (
                                            <p className="mt-1 text-sm text-red-600">{errors.endereco}</p>
                                        )}
                                    </div>

                                    {/* Cidade */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                                        <input
                                            type="text"
                                            value={formData.cidade || ''}
                                            onChange={(e) => handleFieldChange('cidade', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.cidade ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                        />
                                        {errors.cidade && (
                                            <p className="mt-1 text-sm text-red-600">{errors.cidade}</p>
                                        )}
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                        <input
                                            type="text"
                                            value={formData.estado || ''}
                                            onChange={(e) => handleFieldChange('estado', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.estado ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                        />
                                        {errors.estado && (
                                            <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
                                        )}
                                    </div>

                                    {/* CEP */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                                        <input
                                            type="text"
                                            value={formData.cep || ''}
                                            onChange={(e) => handleFieldChange('cep', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.cep ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                        />
                                        {errors.cep && (
                                            <p className="mt-1 text-sm text-red-600">{errors.cep}</p>
                                        )}
                                    </div>

                                    {/* País */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                        <input
                                            type="text"
                                            value={formData.pais || ''}
                                            onChange={(e) => handleFieldChange('pais', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.pais ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                        />
                                        {errors.pais && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pais}</p>
                                        )}
                                    </div>

                                    {/* Data de Fundação */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fundação</label>
                                        <input
                                            type="date"
                                            value={formData.dataFundacao}
                                            onChange={(e) => handleFieldChange('dataFundacao', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dataFundacao ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.dataFundacao && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dataFundacao}</p>
                                        )}
                                    </div>

                                    {/* Site */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                                        <input
                                            type="url"
                                            value={formData.site || ''}
                                            onChange={(e) => handleFieldChange('site', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.site ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                        />
                                        {errors.site && (
                                            <p className="mt-1 text-sm text-red-600">{errors.site}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="md:col-span-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.ativa}
                                                onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Ativa</span>
                                        </label>
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
                                        title={editingEditora ? 'Atualizar' : 'Criar'}
                                    >
                                        {isSubmitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            editingEditora ? <UpdateIcon size={20} /> : <CreateIcon size={20} />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GerenciarEditoras;
