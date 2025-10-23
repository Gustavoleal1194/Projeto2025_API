import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import type { Usuario, UsuarioDTO } from '../types/entities';
import { CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';
import { useNotifications } from '../hooks/useNotifications';
import { getPlaceholderByFieldName } from '../components/PlaceholderHelper';
import { UsuarioValidator } from '../validators/UsuarioValidator';
import { LoadingOverlay } from '../components/Loading';
import ModalOverlay from '../components/Modal/ModalOverlay';
import { createSmartTable } from '../utils/tableRecipes';
import RefreshButton from '../components/Buttons/RefreshButton';
import { buildApiUrl, getAuthHeaders } from '../config/api';

interface GerenciarUsuariosProps { }

const GerenciarUsuarios: React.FC<GerenciarUsuariosProps> = () => {
    const { handleRequestError, showCrudSuccess } = useNotifications();

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');
    const [showModal, setShowModal] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
    const [formData, setFormData] = useState<Partial<UsuarioDTO>>({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        dataNascimento: '',
        senha: ''
    });
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [changePassword, setChangePassword] = useState(false);

    // Estados de validação
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Funções de validação usando validador centralizado
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'nome':
                return UsuarioValidator.validateNome(value);
            case 'email':
                return UsuarioValidator.validateEmail(value);
            case 'cpf':
                return UsuarioValidator.validateCPF(value);
            case 'telefone':
                return UsuarioValidator.validateTelefone(value);
            case 'dataNascimento':
                return UsuarioValidator.validateDataNascimento(value);
            case 'senha':
                return UsuarioValidator.validateSenha(value, !!editingUsuario);
            case 'confirmarSenha':
                return UsuarioValidator.validateConfirmarSenha(formData.senha || '', value, !!editingUsuario);
            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        // Quando estiver editando, senha é opcional. Porém, se senha for preenchida, confirmarSenha passa a ser obrigatória.
        const formDataWithConfirm = { ...formData, confirmarSenha } as any;
        if (!!editingUsuario && (!formData.senha || formData.senha.trim() === '')) {
            // Não validar confirmarSenha quando não há alteração de senha
            delete formDataWithConfirm.confirmarSenha;
        }
        const newErrors = UsuarioValidator.validateForm(formDataWithConfirm, !!editingUsuario);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

        // Se mudou a senha, revalidar confirmação de senha
        if (name === 'senha') {
            const confirmarSenhaError = (!value || value.trim() === '') && !!editingUsuario
                ? ''
                : UsuarioValidator.validateConfirmarSenha(value || '', confirmarSenha, !!editingUsuario);
            setErrors(prev => ({
                ...prev,
                confirmarSenha: confirmarSenhaError
            }));
        }
    };

    const handleConfirmarSenhaChange = (value: string) => {
        setConfirmarSenha(value);

        // Validar confirmação de senha
        const error = (!!editingUsuario && (!formData.senha || formData.senha.trim() === ''))
            ? ''
            : UsuarioValidator.validateConfirmarSenha(formData.senha || '', value, !!editingUsuario);
        setErrors(prev => ({
            ...prev,
            confirmarSenha: error
        }));
    };

    // Carregar usuários
    const loadUsuarios = async () => {
        try {
            setLoading(true);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await fetch(buildApiUrl('/api/Usuario'), {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar usuários');
            }

            const data = await response.json();
            setUsuarios(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    // Filtrar usuários
    const filteredUsuarios = usuarios.filter(usuario => {
        const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.cpf.includes(searchTerm);

        const matchesStatus = filterStatus === 'todos' ||
            (filterStatus === 'ativos' && usuario.ativo) ||
            (filterStatus === 'inativos' && !usuario.ativo);

        return matchesSearch && matchesStatus;
    });

    // Abrir modal
    const openModal = (usuario?: Usuario) => {
        if (usuario) {
            setEditingUsuario(usuario);
            setFormData({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf,
                telefone: usuario.telefone,
                dataNascimento: usuario.dataNascimento,
                senha: ''
            });
            setChangePassword(false);
        } else {
            setEditingUsuario(null);
            setFormData({
                nome: '',
                email: '',
                cpf: '',
                telefone: '',
                dataNascimento: '',
                senha: ''
            });
            setChangePassword(true);
        }
        setConfirmarSenha('');
        setErrors({}); // Limpar erros ao abrir modal
        setShowModal(true);

        // Limpar campos após um pequeno delay para evitar autofill
        setTimeout(() => {
            if (!usuario) {
                setFormData({
                    nome: '',
                    email: '',
                    cpf: '',
                    telefone: '',
                    dataNascimento: '',
                    senha: ''
                });
                setConfirmarSenha('');
            }
        }, 100);
    };

    // Fechar modal
    const closeModal = () => {
        setShowModal(false);
        setEditingUsuario(null);
        setErrors({});
        setFormData({
            nome: '',
            email: '',
            cpf: '',
            telefone: '',
            dataNascimento: '',
            senha: ''
        });
        setConfirmarSenha('');
        setChangePassword(false);
    };


    // Funções de formatação
    const formatarCPF = (cpf: string): string => {
        const cpfLimpo = cpf.replace(/\D/g, '');
        return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatarTelefone = (telefone: string): string => {
        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length <= 10) {
            return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    };

    // Salvar usuário
    const saveUsuario = async () => {
        if (isSubmitting) return;

        // Validar formulário antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const url = editingUsuario
                ? buildApiUrl(`/api/Usuario/${editingUsuario.id}`)
                : buildApiUrl('/api/Usuario');

            const method = editingUsuario ? 'PUT' : 'POST';

            // Montar payload: ao editar, só enviar senha se a opção de alterar senha estiver ativa e o campo preenchido
            const payload: any = { ...formData };
            if (editingUsuario && (!changePassword || !payload.senha || (payload.senha as string).trim() === '')) {
                delete payload.senha;
            }

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                const error = new Error(errorText || 'Erro ao salvar usuário');
                (error as any).status = response.status;
                (error as any).message = errorText;
                throw error;
            }

            await loadUsuarios();
            closeModal();

            // Mostrar notificação de sucesso
            showCrudSuccess(editingUsuario ? 'update' : 'create', 'usuário');
        } catch (err) {
            // Usar o sistema de notificações para mostrar erros
            handleRequestError(err, 'Erro ao salvar usuário');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Deletar usuário
    const deleteUsuario = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
            return;
        }

        try {
            const response = await fetch(buildApiUrl(`/api/Usuario/${id}`), {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();

                const error = new Error(errorText || 'Erro ao excluir usuário');
                (error as any).status = response.status;
                (error as any).message = errorText;
                throw error;
            }

            await loadUsuarios();

            // Mostrar notificação de sucesso
            showCrudSuccess('delete', 'usuário');
        } catch (err) {
            handleRequestError(err, 'Erro ao excluir usuário');
        }
    };

    // Toggle status
    const toggleStatus = async (id: number) => {
        try {
            const response = await fetch(buildApiUrl(`/api/Usuario/${id}/toggle-status`), {
                method: 'PUT',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Erro ao alterar status');
            }

            await loadUsuarios();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao alterar status');
        }
    };


    return (
        <Layout
            pageTitle="👥 Gerenciar Usuários"
            pageSubtitle="Gerencie usuários do sistema, visualize e edite informações"
            onRefresh={loadUsuarios}
            loading={loading}
            lastUpdate={new Date().toLocaleString('pt-BR')}
        >
            {/* Loading State */}
            <LoadingOverlay
                isVisible={loading}
                text="Carregando usuários..."
                size="lg"
            />

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
                >
                    <div className="flex items-center">
                        <span className="text-red-500 mr-2">❌</span>
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

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                <span className="text-2xl text-white">👥</span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-2" style={{ color: '#1f2937' }}>Total de Usuários</p>
                        <p className="text-4xl font-bold text-blue-600" style={{ color: '#2563eb' }}>{usuarios.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                                <span className="text-2xl text-white">✅</span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-2" style={{ color: '#1f2937' }}>Usuários Ativos</p>
                        <p className="text-4xl font-bold text-blue-600" style={{ color: '#2563eb' }}>{usuarios.filter(u => u.ativo).length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                                <span className="text-2xl text-white">❌</span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-2" style={{ color: '#1f2937' }}>Usuários Inativos</p>
                        <p className="text-4xl font-bold text-blue-600" style={{ color: '#2563eb' }}>{usuarios.filter(u => !u.ativo).length}</p>
                    </div>
                </div>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-blue-100"
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search */}
                    <div className="flex-1">
                        <label className="block text-lg font-semibold text-gray-800 mb-3" style={{ color: '#1f2937' }}>
                            Buscar Usuários
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Digite nome, email ou CPF..."
                                className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 text-lg transition-all duration-300 bg-blue-50 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="lg:w-64">
                        <label className="block text-lg font-semibold text-gray-700 mb-3">
                            📊 Filtrar por Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                        >
                            <option value="todos">Todos os Usuários</option>
                            <option value="ativos">Apenas Ativos</option>
                            <option value="inativos">Apenas Inativos</option>
                        </select>
                    </div>

                    {/* Add Button */}
                    <div className="flex items-end justify-center">
                        <RefreshButton onClick={() => openModal()} text="Criar Novo Usuário" icon={<span className="text-xl">➕</span>} />
                    </div>
                </div>
            </motion.div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white shadow-2xl border border-blue-100 overflow-hidden"
            >
                {createSmartTable(
                    filteredUsuarios,
                    'usuarios',
                    openModal,
                    deleteUsuario,
                    toggleStatus,
                    loading,
                    error,
                    loadUsuarios
                )}
            </motion.div>

            {/* Modal de Criação/Edição */}
            <ModalOverlay
                isVisible={showModal}
                onClose={closeModal}
                size="md"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {editingUsuario ? '✏️ Editar Usuário' : '➕ Novo Usuário'}
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

                    <form onSubmit={(e) => { e.preventDefault(); saveUsuario(); }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome *</label>
                            <input
                                type="text"
                                value={formData.nome || ''}
                                onChange={(e) => handleFieldChange('nome', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.nome ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                    }`}
                                placeholder={getPlaceholderByFieldName('nome')}
                                autoComplete="off"
                                required
                            />
                            {errors.nome && (
                                <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.email ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                    }`}
                                placeholder={getPlaceholderByFieldName('email')}
                                autoComplete="off"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">CPF *</label>
                            <input
                                type="text"
                                value={formData.cpf || ''}
                                onChange={(e) => {
                                    const cpfFormatado = formatarCPF(e.target.value);
                                    handleFieldChange('cpf', cpfFormatado);
                                }}
                                placeholder={getPlaceholderByFieldName('cpf')}
                                maxLength={14}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.cpf ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                    }`}
                                required
                            />
                            {errors.cpf && (
                                <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                            <input
                                type="text"
                                value={formData.telefone || ''}
                                onChange={(e) => {
                                    const telefoneFormatado = formatarTelefone(e.target.value);
                                    handleFieldChange('telefone', telefoneFormatado);
                                }}
                                placeholder={getPlaceholderByFieldName('telefone')}
                                maxLength={15}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.telefone ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                    }`}
                                required
                            />
                            {errors.telefone && (
                                <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Nascimento *</label>
                            <input
                                type="date"
                                value={formData.dataNascimento || ''}
                                onChange={(e) => handleFieldChange('dataNascimento', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.dataNascimento ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                    }`}
                                placeholder={getPlaceholderByFieldName('datanascimento')}
                                required
                            />
                            {errors.dataNascimento && (
                                <p className="mt-1 text-sm text-red-600">{errors.dataNascimento}</p>
                            )}
                        </div>

                        {!editingUsuario && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Senha *</label>
                                    <input
                                        type="password"
                                        value={formData.senha || ''}
                                        onChange={(e) => handleFieldChange('senha', e.target.value)}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.senha ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                            }`}
                                        placeholder={getPlaceholderByFieldName('senha')}
                                        autoComplete="new-password"
                                        required
                                    />
                                    {errors.senha && (
                                        <p className="mt-1 text-sm text-red-600">{errors.senha}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Senha *</label>
                                    <input
                                        type="password"
                                        value={confirmarSenha}
                                        onChange={(e) => handleConfirmarSenhaChange(e.target.value)}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.confirmarSenha ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                            }`}
                                        placeholder={getPlaceholderByFieldName('confirmarsenha')}
                                        autoComplete="new-password"
                                        required
                                    />
                                    {errors.confirmarSenha && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmarSenha}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {editingUsuario && (
                            <>
                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        id="toggle-change-password"
                                        type="checkbox"
                                        checked={changePassword}
                                        onChange={(e) => {
                                            setChangePassword(e.target.checked);
                                            if (!e.target.checked) {
                                                setFormData(prev => ({ ...prev, senha: '' }));
                                                setConfirmarSenha('');
                                                setErrors(prev => ({ ...prev, senha: '', confirmarSenha: '' }));
                                            }
                                        }}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor="toggle-change-password" className="text-sm font-medium text-gray-700">Alterar senha</label>
                                </div>

                                {changePassword && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nova Senha *</label>
                                            <input
                                                type="password"
                                                value={formData.senha || ''}
                                                onChange={(e) => handleFieldChange('senha', e.target.value)}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.senha ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                                    }`}
                                                placeholder={getPlaceholderByFieldName('senha')}
                                                autoComplete="new-password"
                                                required
                                            />
                                            {errors.senha && (
                                                <p className="mt-1 text-sm text-red-600">{errors.senha}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Nova Senha *</label>
                                            <input
                                                type="password"
                                                value={confirmarSenha}
                                                onChange={(e) => handleConfirmarSenhaChange(e.target.value)}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 ${errors.confirmarSenha ? 'border-red-500 bg-red-50' : 'border-blue-200'
                                                    }`}
                                                placeholder={getPlaceholderByFieldName('confirmarsenha')}
                                                autoComplete="new-password"
                                                required
                                            />
                                            {errors.confirmarSenha && (
                                                <p className="mt-1 text-sm text-red-600">{errors.confirmarSenha}</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

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
                                className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border flex items-center justify-center ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 border-green-700'
                                    }`}
                                style={{ minWidth: '48px', minHeight: '48px' }}
                                title={isSubmitting ? 'Salvando...' : (editingUsuario ? 'Atualizar' : 'Criar')}
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    editingUsuario ? <UpdateIcon size={20} /> : <CreateIcon size={20} />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalOverlay>
        </Layout>
    );
};

export default GerenciarUsuarios;