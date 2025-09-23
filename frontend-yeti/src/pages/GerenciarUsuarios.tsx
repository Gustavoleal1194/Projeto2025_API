import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        dataNascimento: ''
    });

    // Carregar usuários
    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('yeti_token');
            const response = await fetch('http://localhost:5072/api/usuario', {
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
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
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

    // Abrir modal para criar/editar
    const openModal = (usuario?: Usuario) => {
        if (usuario) {
            setEditingUsuario(usuario);
            setFormData({
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf,
                telefone: usuario.telefone,
                dataNascimento: usuario.dataNascimento ? new Date(usuario.dataNascimento).toISOString().split('T')[0] : ''
            });
        } else {
            setEditingUsuario(null);
            setFormData({
                nome: '',
                email: '',
                cpf: '',
                telefone: '',
                dataNascimento: ''
            });
        }
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
            dataNascimento: ''
        });
    };

    // Salvar usuário
    const saveUsuario = async () => {
        try {
            const token = localStorage.getItem('yeti_token');
            const url = editingUsuario
                ? `http://localhost:5072/api/usuario/${editingUsuario.id}`
                : 'http://localhost:5072/api/usuario';

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
                throw new Error('Erro ao salvar usuário');
            }

            await loadUsuarios();
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar usuário');
        }
    };

    // Deletar usuário
    const deleteUsuario = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        try {
            const token = localStorage.getItem('yeti_token');
            const response = await fetch(`http://localhost:5072/api/usuario/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
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

    // Alternar status ativo/inativo
    const toggleStatus = async (id: number) => {
        try {
            const token = localStorage.getItem('yeti_token');
            const response = await fetch(`http://localhost:5072/api/usuario/${id}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gerencie usuários do sistema, visualize e edite informações
                            </p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Novo Usuário
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filtros e Busca */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Busca */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Nome, email ou CPF..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Filtro de Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todos">Todos</option>
                                <option value="ativos">Ativos</option>
                                <option value="inativos">Inativos</option>
                            </select>
                        </div>

                        {/* Estatísticas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estatísticas
                            </label>
                            <div className="text-sm text-gray-600">
                                <div>Total: {usuarios.length}</div>
                                <div>Ativos: {usuarios.filter(u => u.ativo).length}</div>
                                <div>Inativos: {usuarios.filter(u => !u.ativo).length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Usuários */}
                <div className="bg-white rounded-lg shadow-sm">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 mb-4">{error}</div>
                            <button
                                onClick={loadUsuarios}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuário
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            CPF
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Telefone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsuarios.map((usuario) => (
                                        <motion.tr
                                            key={usuario.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {usuario.nome.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {usuario.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {usuario.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {usuario.cpf}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {usuario.telefone || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${usuario.ativo
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openModal(usuario)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => toggleStatus(usuario.id)}
                                                        className={`${usuario.ativo
                                                            ? 'text-yellow-600 hover:text-yellow-900'
                                                            : 'text-green-600 hover:text-green-900'
                                                            }`}
                                                    >
                                                        {usuario.ativo ? 'Desativar' : 'Ativar'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUsuario(usuario.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Criação/Edição */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); saveUsuario(); }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nome *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nome || ''}
                                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CPF *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cpf || ''}
                                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Telefone
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.telefone || ''}
                                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Data de Nascimento
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dataNascimento || ''}
                                            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                                    >
                                        {editingUsuario ? 'Salvar Alterações' : 'Criar Usuário'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarUsuarios;
