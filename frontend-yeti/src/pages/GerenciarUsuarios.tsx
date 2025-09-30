import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import type { Usuario, UsuarioDTO } from '../types/entities';
import { CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';
import { useNotifications } from '../hooks/useNotifications';
import { getPlaceholderByFieldName } from '../components/PlaceholderHelper';
import { UsuarioValidator } from '../validators/UsuarioValidator';
import { BookLoader } from '../components/Loading';
import { createSmartTable } from '../utils/tableRecipes';

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
        const formDataWithConfirm = { ...formData, confirmarSenha };
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
            const confirmarSenhaError = UsuarioValidator.validateConfirmarSenha(value, confirmarSenha, !!editingUsuario);
            setErrors(prev => ({
                ...prev,
                confirmarSenha: confirmarSenhaError
            }));
        }
    };

    const handleConfirmarSenhaChange = (value: string) => {
        setConfirmarSenha(value);

        // Validar confirmação de senha
        const error = UsuarioValidator.validateConfirmarSenha(formData.senha || '', value, !!editingUsuario);
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

            const token = localStorage.getItem('yeti_token');
            const response = await fetch('http://localhost:5072/api/Usuario', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
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

            const token = localStorage.getItem('yeti_token');
            const url = editingUsuario
                ? `http://localhost:5072/api/Usuario/${editingUsuario.id}`
                : 'http://localhost:5072/api/Usuario';

            const method = editingUsuario ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
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
            const token = localStorage.getItem('yeti_token');
            const response = await fetch(`http://localhost:5072/api/Usuario/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
            const token = localStorage.getItem('yeti_token');
            const response = await fetch(`http://localhost:5072/api/Usuario/${id}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ left: '17.5rem' }}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <BookLoader size="lg" />
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Carregando usuários...
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-blue-800"
                        >
                            Criar Novo Usuário
                            <span className="text-lg bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center">➕</span>
                        </button>
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
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4" style={{ left: '17.5rem' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md"
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
                    </motion.div>
                </div>
            )}
        </Layout>
    );
};

export default GerenciarUsuarios;