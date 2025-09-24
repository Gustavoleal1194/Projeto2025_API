import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import type { Usuario, UsuarioDTO } from '../types/entities';

interface GerenciarUsuariosProps { }

const GerenciarUsuarios: React.FC<GerenciarUsuariosProps> = () => {

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

    // Carregar usuários
    const loadUsuarios = async () => {
        try {
            setLoading(true);
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
        setShowModal(true);
    };

    // Fechar modal
    const closeModal = () => {
        setShowModal(false);
        setEditingUsuario(null);
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

    // Funções de validação
    const validarEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validarCPF = (cpf: string): boolean => {
        // Remove caracteres não numéricos
        const cpfLimpo = cpf.replace(/\D/g, '');

        // Verifica se tem 11 dígitos
        if (cpfLimpo.length !== 11) return false;

        // Verifica se não são todos iguais
        if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

        // Validação dos dígitos verificadores
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo.charAt(10))) return false;

        return true;
    };

    const validarDataNascimento = (data: string): boolean => {
        if (!data) return true; // Data é opcional
        const dataNasc = new Date(data);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNasc.getFullYear();
        return idade >= 0 && idade <= 120; // Idade válida entre 0 e 120 anos
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
        try {
            // Validar campos obrigatórios
            if (!formData.nome?.trim()) {
                throw new Error('Nome é obrigatório');
            }
            if (!formData.email?.trim()) {
                throw new Error('Email é obrigatório');
            }
            if (!formData.cpf?.trim()) {
                throw new Error('CPF é obrigatório');
            }

            // Validar formato do email
            if (!validarEmail(formData.email)) {
                throw new Error('Email inválido');
            }

            // Validar CPF
            if (!validarCPF(formData.cpf)) {
                throw new Error('CPF inválido');
            }

            // Validar data de nascimento
            if (formData.dataNascimento && !validarDataNascimento(formData.dataNascimento)) {
                throw new Error('Data de nascimento inválida');
            }

            // Validar senhas se for criação de novo usuário
            if (!editingUsuario) {
                if (!formData.senha || formData.senha.length < 6) {
                    throw new Error('A senha deve ter pelo menos 6 caracteres');
                }
                if (formData.senha !== confirmarSenha) {
                    throw new Error('As senhas não coincidem');
                }
            }

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
                throw new Error(errorText || 'Erro ao salvar usuário');
            }

            await loadUsuarios();
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar usuário');
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
                throw new Error('Erro ao excluir usuário');
            }

            await loadUsuarios();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-lg font-medium text-gray-700">Carregando usuários...</span>
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-2 border-blue-700 hover:border-blue-800"
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
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-4 text-lg text-gray-600">Carregando usuários...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-red-500 text-xl mb-4">❌ {error}</div>
                        <button
                            onClick={loadUsuarios}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-2xl border border-blue-100">
                        <table className="min-w-full divide-y divide-blue-100">
                            <thead className="bg-gradient-to-r from-blue-600 to-purple-600" style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)' }}>
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>👤</span>
                                            <span>Usuário</span>
                                        </span>
                                    </th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📧</span>
                                            <span>Email</span>
                                        </span>
                                    </th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📄</span>
                                            <span>CPF</span>
                                        </span>
                                    </th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📱</span>
                                            <span>Telefone</span>
                                        </span>
                                    </th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📊</span>
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
                            <tbody className="bg-white divide-y divide-blue-100 rounded-b-2xl">
                                {filteredUsuarios.map((usuario, index) => (
                                    <motion.tr
                                        key={usuario.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                                    >
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-14 w-14">
                                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                                                        <span className="text-xl font-bold text-white">
                                                            {usuario.nome.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">{usuario.nome}</div>
                                                    <div className="text-sm text-blue-600 font-medium">
                                                        ID: {usuario.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{usuario.email}</div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-900">{usuario.cpf}</div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-900">{usuario.telefone}</div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${usuario.ativo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {usuario.ativo ? '✅ Ativo' : '❌ Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal(usuario)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-blue-700"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(usuario.id)}
                                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${usuario.ativo
                                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600'
                                                        : 'bg-green-500 hover:bg-green-600 text-white border-green-600'
                                                        }`}
                                                >
                                                    {usuario.ativo ? '⏸️ Desativar' : '▶️ Ativar'}
                                                </button>
                                                <button
                                                    onClick={() => deleteUsuario(usuario.id)}
                                                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border-2"
                                                    style={{
                                                        backgroundColor: '#dc2626',
                                                        color: 'white',
                                                        borderColor: '#991b1b'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#b91c1c';
                                                        e.currentTarget.style.borderColor = '#7f1d1d';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#dc2626';
                                                        e.currentTarget.style.borderColor = '#991b1b';
                                                    }}
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
                )}
            </motion.div>

            {/* Modal de Criação/Edição */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
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
                                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full border-2 border-red-400 hover:border-red-500 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                                    title="Fechar"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); saveUsuario(); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        value={formData.nome || ''}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">CPF</label>
                                    <input
                                        type="text"
                                        value={formData.cpf || ''}
                                        onChange={(e) => {
                                            const cpfFormatado = formatarCPF(e.target.value);
                                            setFormData({ ...formData, cpf: cpfFormatado });
                                        }}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="text"
                                        value={formData.telefone || ''}
                                        onChange={(e) => {
                                            const telefoneFormatado = formatarTelefone(e.target.value);
                                            setFormData({ ...formData, telefone: telefoneFormatado });
                                        }}
                                        placeholder="(00) 00000-0000"
                                        maxLength={15}
                                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        value={formData.dataNascimento || ''}
                                        onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                    />
                                </div>

                                {!editingUsuario && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                                            <input
                                                type="password"
                                                value={formData.senha || ''}
                                                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                                placeholder="Mínimo 6 caracteres"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Senha</label>
                                            <input
                                                type="password"
                                                value={confirmarSenha}
                                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                                placeholder="Digite a senha novamente"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors duration-200 border-2 border-red-500 hover:border-red-600"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors duration-200 border-2 border-black hover:border-gray-800"
                                    >
                                        {editingUsuario ? 'Atualizar' : 'Criar'}
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