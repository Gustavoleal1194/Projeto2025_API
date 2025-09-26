import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import type { Editora, EditoraForm } from '../types/entities';
import { editoraService } from '../services/editoraService';
import { EditIcon, DeleteIcon, PlayIcon, PauseIcon, CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';

const GerenciarEditoras: React.FC = () => {
    const [editoras, setEditoras] = useState<Editora[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleString('pt-BR'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEditora, setEditingEditora] = useState<Editora | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cidadeFilter, setCidadeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Estados do formulário
    const [formData, setFormData] = useState<EditoraForm>({
        nome: '',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        pais: '',
        dataFundacao: '',
        site: '',
        ativa: true
    });

    // Carregar editoras
    const loadEditoras = async () => {
        try {
            setLoading(true);
            const data = await editoraService.listar();
            setEditoras(data);
            setLastUpdate(new Date().toLocaleString('pt-BR'));
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
                telefone: '',
                email: '',
                endereco: '',
                cidade: '',
                estado: '',
                cep: '',
                pais: '',
                dataFundacao: '',
                site: '',
                ativa: true
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEditora(null);
        setFormData({
            nome: '',
            cnpj: '',
            telefone: '',
            email: '',
            endereco: '',
            cidade: '',
            estado: '',
            cep: '',
            pais: '',
            dataFundacao: '',
            site: '',
            ativa: true
        });
    };

    // Salvar editora
    const saveEditora = async () => {
        try {
            if (editingEditora) {
                await editoraService.atualizar({ ...formData, id: editingEditora.id } as any);
            } else {
                await editoraService.criar(formData);
            }
            await loadEditoras();
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar editora:', error);
        }
    };

    // Excluir editora
    const deleteEditora = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta editora?')) {
            try {
                await editoraService.excluir(id);
                await loadEditoras();
            } catch (error) {
                console.error('Erro ao excluir editora:', error);
            }
        }
    };

    // Toggle status
    const toggleStatus = async (id: number) => {
        try {
            await editoraService.toggleStatus(id);
            await loadEditoras();
        } catch (error) {
            console.error('Erro ao alterar status da editora:', error);
        }
    };

    return (
        <Layout
            pageTitle="Gerenciar Editoras"
            pageSubtitle="Administre as editoras da biblioteca"
            loading={loading}
            onRefresh={loadEditoras}
            lastUpdate={lastUpdate}
        >
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
                    <div className="overflow-x-auto bg-white shadow-2xl border border-blue-100">
                        <table className="min-w-full divide-y divide-blue-100">
                            <thead className="bg-gradient-to-r from-blue-600 to-purple-600" style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>🏢</span>
                                            <span>Nome</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📧</span>
                                            <span>Email</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>🏙️</span>
                                            <span>Cidade</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>Fundação</span>
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
                                {filteredEditoras.map((editora, index) => (
                                    <motion.tr
                                        key={editora.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-blue-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{editora.nome}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{editora.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{editora.cidade}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(editora.dataFundacao).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${editora.ativa
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {editora.ativa ? '✅ Ativa' : '❌ Inativa'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal(editora)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-800"
                                                    style={{ minWidth: '36px' }}
                                                    title="Editar"
                                                >
                                                    <EditIcon size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(editora.id)}
                                                    className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border ${editora.ativa
                                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-700'
                                                        : 'bg-green-500 hover:bg-green-600 text-white border-green-700'
                                                        }`}
                                                    style={{ minWidth: '36px' }}
                                                    title={editora.ativa ? 'Desativar' : 'Ativar'}
                                                >
                                                    {editora.ativa ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => deleteEditora(editora.id)}
                                                    className="p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border"
                                                    style={{
                                                        backgroundColor: '#dc2626',
                                                        color: 'white',
                                                        borderColor: '#991b1b',
                                                        borderWidth: '1px',
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nome */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* CNPJ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ *</label>
                                    <input
                                        type="text"
                                        value={formData.cnpj}
                                        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Telefone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Endereço */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                                    <input
                                        type="text"
                                        value={formData.endereco}
                                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Cidade */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                                    <input
                                        type="text"
                                        value={formData.cidade}
                                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <input
                                        type="text"
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* CEP */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                                    <input
                                        type="text"
                                        value={formData.cep}
                                        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* País */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                    <input
                                        type="text"
                                        value={formData.pais}
                                        onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Data de Fundação */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fundação</label>
                                    <input
                                        type="date"
                                        value={formData.dataFundacao}
                                        onChange={(e) => setFormData({ ...formData, dataFundacao: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Site */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                                    <input
                                        type="url"
                                        value={formData.site}
                                        onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
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
                                    onClick={closeModal}
                                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-700 flex items-center justify-center"
                                    style={{ minWidth: '48px', minHeight: '48px' }}
                                    title="Cancelar"
                                >
                                    <CancelIcon size={20} />
                                </button>
                                <button
                                    onClick={saveEditora}
                                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-700 flex items-center justify-center"
                                    style={{ minWidth: '48px', minHeight: '48px' }}
                                    title={editingEditora ? 'Atualizar' : 'Criar'}
                                >
                                    {editingEditora ? <UpdateIcon size={20} /> : <CreateIcon size={20} />}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GerenciarEditoras;
