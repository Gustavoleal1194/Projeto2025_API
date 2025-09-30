import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import type { Autor, AutorForm } from '../types/entities';
import { autorService } from '../services/autorService';
import { CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';
import { useNotifications } from '../hooks/useNotifications';
import { AutorValidator } from '../validators/AutorValidator';
import { LoadingOverlay } from '../components/Loading';
import ModalOverlay from '../components/Modal/ModalOverlay';
import { createSmartTable } from '../utils/tableRecipes';

const GerenciarAutores: React.FC = () => {
    const { handleRequestError, showCrudSuccess } = useNotifications();

    const [autores, setAutores] = useState<Autor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAutor, setEditingAutor] = useState<Autor | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [nacionalidadeFilter, setNacionalidadeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Estados do formulário
    const [formData, setFormData] = useState<AutorForm>({
        nome: '',
        nomeCompleto: '',
        nomeArtistico: '',
        nacionalidade: '',
        paisOrigem: '',
        dataNascimento: '',
        website: '',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        pais: '',
        ativo: true
    });

    // Estados de validação
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Funções de validação usando validador centralizado
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'nome':
                return AutorValidator.validateNome(value);
            case 'nomeCompleto':
                return AutorValidator.validateNomeCompleto(value);
            case 'nomeArtistico':
                return AutorValidator.validateNomeArtistico(value);
            case 'nacionalidade':
                return AutorValidator.validateNacionalidade(value);
            case 'paisOrigem':
                return AutorValidator.validatePaisOrigem(value);
            case 'dataNascimento':
                return AutorValidator.validateDataNascimento(value);
            case 'website':
                return AutorValidator.validateWebsite(value);
            case 'email':
                return AutorValidator.validateEmail(value);
            case 'telefone':
                return AutorValidator.validateTelefone(value);
            case 'endereco':
                return AutorValidator.validateEndereco(value);
            case 'cidade':
                return AutorValidator.validateCidade(value);
            case 'estado':
                return AutorValidator.validateEstado(value);
            case 'cep':
                return AutorValidator.validateCEP(value);
            case 'pais':
                return AutorValidator.validatePais(value);
            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors = AutorValidator.validateForm(formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Carregar autores
    const loadAutores = async () => {
        try {
            setLoading(true);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const data = await autorService.listar();
            setAutores(data);
        } catch (error) {
            console.error('Erro ao carregar autores:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAutores();
    }, []);

    // Filtrar autores
    const filteredAutores = autores.filter(autor => {
        const matchesSearch = autor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            autor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            autor.nacionalidade.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesNacionalidade = !nacionalidadeFilter || autor.nacionalidade === nacionalidadeFilter;
        const matchesStatus = !statusFilter ||
            (statusFilter === 'ativo' && autor.ativo) ||
            (statusFilter === 'inativo' && !autor.ativo);

        return matchesSearch && matchesNacionalidade && matchesStatus;
    });

    // Estatísticas
    const totalAutores = autores.length;
    const autoresAtivos = autores.filter(a => a.ativo).length;
    const autoresInativos = autores.filter(a => !a.ativo).length;
    const nacionalidadesUnicas = [...new Set(autores.map(a => a.nacionalidade))];

    // Modal
    const openModal = (autor?: Autor) => {
        if (autor) {
            setEditingAutor(autor);
            setFormData({
                nome: autor.nome,
                nomeCompleto: autor.nomeCompleto,
                nomeArtistico: autor.nomeArtistico,
                nacionalidade: autor.nacionalidade,
                paisOrigem: autor.paisOrigem,
                dataNascimento: autor.dataNascimento.split('T')[0],
                website: autor.website,
                email: autor.email,
                telefone: autor.telefone,
                endereco: autor.endereco,
                cidade: autor.cidade,
                estado: autor.estado,
                cep: autor.cep,
                pais: autor.pais,
                ativo: autor.ativo
            });
        } else {
            setEditingAutor(null);
            setFormData({
                nome: '',
                nomeCompleto: '',
                nomeArtistico: '',
                nacionalidade: '',
                paisOrigem: '',
                dataNascimento: '',
                website: '',
                email: '',
                telefone: '',
                endereco: '',
                cidade: '',
                estado: '',
                cep: '',
                pais: '',
                ativo: true
            });
        }
        setErrors({}); // Limpar erros ao abrir modal
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAutor(null);
        setErrors({});
        setFormData({
            nome: '',
            nomeCompleto: '',
            nomeArtistico: '',
            nacionalidade: '',
            paisOrigem: '',
            dataNascimento: '',
            website: '',
            email: '',
            telefone: '',
            endereco: '',
            cidade: '',
            estado: '',
            cep: '',
            pais: '',
            ativo: true
        });
    };

    // Handler para mudanças nos campos com validação em tempo real
    const handleFieldChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validar campo em tempo real
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Salvar autor
    const saveAutor = async () => {
        if (isSubmitting) return;

        // Validar formulário antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            if (editingAutor) {
                await autorService.atualizar({ ...formData, id: editingAutor.id } as any);
            } else {
                await autorService.criar(formData);
            }
            await loadAutores();
            closeModal();

            // Mostrar notificação de sucesso
            showCrudSuccess(editingAutor ? 'update' : 'create', 'autor');
        } catch (error) {
            handleRequestError(error, 'Erro ao salvar autor');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Excluir autor
    const deleteAutor = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este autor?')) {
            try {
                await autorService.excluir(id);
                await loadAutores();

                // Mostrar notificação de sucesso
                showCrudSuccess('delete', 'autor');
            } catch (error) {
                handleRequestError(error, 'Erro ao excluir autor');
            }
        }
    };

    // Toggle status
    const toggleStatus = async (id: number) => {
        try {
            const token = localStorage.getItem('yeti_token');
            const response = await fetch(`http://localhost:5072/api/Autor/${id}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao alterar status');
            }

            await loadAutores();
            showCrudSuccess('update', 'autor');
        } catch (err) {
            handleRequestError(err, 'Erro ao alterar status do autor');
        }
    };


    return (
        <Layout
            pageTitle="Gerenciar Autores"
            pageSubtitle="Administre os autores da biblioteca"
            loading={loading}
            onRefresh={loadAutores}
        >
            {/* Loading State */}
            <LoadingOverlay
                isVisible={loading}
                text="Carregando autores..."
                size="lg"
            />

            {/* Page Content */}
            <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-600">{totalAutores}</p>
                                <p className="text-gray-600 font-medium">Total de Autores</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✍️</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-green-600">{autoresAtivos}</p>
                                <p className="text-gray-600 font-medium">Ativos</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-red-600">{autoresInativos}</p>
                                <p className="text-gray-600 font-medium">Inativos</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">❌</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-purple-600">{nacionalidadesUnicas.length}</p>
                                <p className="text-gray-600 font-medium">Nacionalidades</p>
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
                                🔍 Buscar Autores
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por nome, email ou nacionalidade..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 text-base transition-all duration-300 bg-blue-50 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Filtro por Nacionalidade */}
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                🌍 Filtrar por Nacionalidade
                            </label>
                            <select
                                value={nacionalidadeFilter}
                                onChange={(e) => setNacionalidadeFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                            >
                                <option value="">Todas as nacionalidades</option>
                                {nacionalidadesUnicas.map(nacionalidade => (
                                    <option key={nacionalidade} value={nacionalidade}>{nacionalidade}</option>
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
                                <option value="ativo">Ativos</option>
                                <option value="inativo">Inativos</option>
                            </select>
                        </div>
                    </div>

                    {/* Botão Criar */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-blue-800"
                        >
                            Criar Novo Autor
                            <span className="text-lg bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center">➕</span>
                        </button>
                    </div>
                </div>

                {/* Tabela de Autores */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white shadow-2xl border border-blue-100 overflow-hidden"
                >
                    {createSmartTable(
                        filteredAutores,
                        'autores',
                        openModal,
                        deleteAutor,
                        toggleStatus,
                        loading,
                        error,
                        loadAutores
                    )}
                </motion.div>

                {/* Modal */}
                <ModalOverlay
                    isVisible={isModalOpen}
                    onClose={closeModal}
                    size="xl"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingAutor ? 'Editar Autor' : 'Criar Novo Autor'}
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

                        <form onSubmit={(e) => { e.preventDefault(); saveAutor(); }} className="space-y-4">
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

                                {/* Nome Completo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={formData.nomeCompleto}
                                        onChange={(e) => handleFieldChange('nomeCompleto', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nomeCompleto ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        autoComplete="off"
                                    />
                                    {errors.nomeCompleto && (
                                        <p className="mt-1 text-sm text-red-600">{errors.nomeCompleto}</p>
                                    )}
                                </div>

                                {/* Nome Artístico */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Artístico</label>
                                    <input
                                        type="text"
                                        value={formData.nomeArtistico}
                                        onChange={(e) => handleFieldChange('nomeArtistico', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nomeArtistico ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        autoComplete="off"
                                    />
                                    {errors.nomeArtistico && (
                                        <p className="mt-1 text-sm text-red-600">{errors.nomeArtistico}</p>
                                    )}
                                </div>

                                {/* Nacionalidade */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nacionalidade *</label>
                                    <input
                                        type="text"
                                        value={formData.nacionalidade}
                                        onChange={(e) => handleFieldChange('nacionalidade', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nacionalidade ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        autoComplete="off"
                                        required
                                    />
                                    {errors.nacionalidade && (
                                        <p className="mt-1 text-sm text-red-600">{errors.nacionalidade}</p>
                                    )}
                                </div>

                                {/* País de Origem */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">País de Origem</label>
                                    <input
                                        type="text"
                                        value={formData.paisOrigem}
                                        onChange={(e) => handleFieldChange('paisOrigem', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.paisOrigem ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        autoComplete="off"
                                    />
                                    {errors.paisOrigem && (
                                        <p className="mt-1 text-sm text-red-600">{errors.paisOrigem}</p>
                                    )}
                                </div>

                                {/* Data de Nascimento */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento *</label>
                                    <input
                                        type="date"
                                        value={formData.dataNascimento}
                                        onChange={(e) => handleFieldChange('dataNascimento', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dataNascimento ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        required
                                    />
                                    {errors.dataNascimento && (
                                        <p className="mt-1 text-sm text-red-600">{errors.dataNascimento}</p>
                                    )}
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => handleFieldChange('website', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.website ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        autoComplete="off"
                                    />
                                    {errors.website && (
                                        <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleFieldChange('email', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        autoComplete="off"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Telefone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        value={formData.telefone}
                                        onChange={(e) => handleFieldChange('telefone', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.telefone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        autoComplete="off"
                                    />
                                    {errors.telefone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                                    )}
                                </div>

                                {/* Endereço */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                                    <input
                                        type="text"
                                        value={formData.endereco}
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
                                        value={formData.cidade}
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
                                        value={formData.estado}
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
                                        value={formData.cep}
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
                                        value={formData.pais}
                                        onChange={(e) => handleFieldChange('pais', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.pais ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        autoComplete="off"
                                    />
                                    {errors.pais && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pais}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.ativo}
                                            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Ativo</span>
                                    </label>
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
                                    title={editingAutor ? 'Atualizar' : 'Criar'}
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        editingAutor ? <UpdateIcon size={20} /> : <CreateIcon size={20} />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </ModalOverlay>
            </div>
        </Layout>
    );
};

export default GerenciarAutores;
