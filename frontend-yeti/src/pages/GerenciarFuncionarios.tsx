import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { funcionarioService } from '../services/funcionarioService';
import type { Funcionario, FuncionarioForm } from '../types/entities';
import { CARGO_FUNCIONARIO } from '../constants/entities';
import { EditIcon, DeleteIcon, PlayIcon, PauseIcon, CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';

const GerenciarFuncionarios: React.FC = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleString('pt-BR'));

    // Estados do formulário
    const [formData, setFormData] = useState<FuncionarioForm>({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        cargo: '',
        salario: 0,
        dataAdmissao: '',
        dataDemissao: '',
        ativo: true
    });

    // Estados dos filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [cargoFilter, setCargoFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Carregar funcionários
    const loadFuncionarios = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await funcionarioService.listar();
            setFuncionarios(data);
            setFilteredFuncionarios(data);
            setLastUpdate(new Date().toLocaleString('pt-BR'));
        } catch (err) {
            setError('Erro ao carregar funcionários');
            console.error('Erro ao carregar funcionários:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFuncionarios();
    }, []);

    // Filtrar funcionários
    useEffect(() => {
        let filtered = funcionarios;

        if (searchTerm) {
            filtered = filtered.filter(funcionario =>
                funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                funcionario.telefone.includes(searchTerm)
            );
        }

        if (cargoFilter) {
            filtered = filtered.filter(funcionario => funcionario.cargo === cargoFilter);
        }

        if (statusFilter) {
            const isActive = statusFilter === 'ativo';
            filtered = filtered.filter(funcionario => funcionario.ativo === isActive);
        }

        setFilteredFuncionarios(filtered);
    }, [funcionarios, searchTerm, cargoFilter, statusFilter]);

    // Abrir modal
    const openModal = (funcionario?: Funcionario) => {
        if (funcionario) {
            setEditingFuncionario(funcionario);
            setFormData({
                nome: funcionario.nome,
                email: funcionario.email,
                telefone: funcionario.telefone,
                senha: '',
                cargo: funcionario.cargo,
                salario: funcionario.salario,
                dataAdmissao: funcionario.dataAdmissao.split('T')[0],
                dataDemissao: funcionario.dataDemissao ? funcionario.dataDemissao.split('T')[0] : '',
                ativo: funcionario.ativo
            });
        } else {
            setEditingFuncionario(null);
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                senha: '',
                cargo: '',
                salario: 0,
                dataAdmissao: '',
                dataDemissao: '',
                ativo: true
            });
        }
        setIsModalOpen(true);
    };

    // Fechar modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFuncionario(null);
        setFormData({
            nome: '',
            email: '',
            telefone: '',
            senha: '',
            cargo: '',
            salario: 0,
            dataAdmissao: '',
            dataDemissao: '',
            ativo: true
        });
    };

    // Salvar funcionário
    const saveFuncionario = async () => {
        try {
            console.log('Dados do formulário:', formData);

            // Preparar dados para envio no formato PascalCase que o backend espera
            const dadosParaEnvio = {
                Id: editingFuncionario?.id || 0,
                Nome: formData.nome,
                Email: formData.email,
                Telefone: formData.telefone,
                Senha: formData.senha,
                Cargo: formData.cargo,
                Salario: Number(formData.salario),
                DataAdmissao: formData.dataAdmissao,
                DataDemissao: formData.dataDemissao || null,
                Ativo: formData.ativo
            } as any; // Usar any para contornar o problema de tipos

            console.log('Dados preparados para envio:', dadosParaEnvio);

            if (editingFuncionario) {
                console.log('Atualizando funcionário:', editingFuncionario.id);
                await funcionarioService.atualizar(dadosParaEnvio);
            } else {
                console.log('Criando novo funcionário');
                await funcionarioService.criar(dadosParaEnvio);
            }
            await loadFuncionarios();
            closeModal();
        } catch (err) {
            console.error('Erro ao salvar funcionário:', err);
            alert(`Erro ao salvar funcionário: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    };

    // Excluir funcionário
    const deleteFuncionario = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
            try {
                await funcionarioService.excluir(id);
                await loadFuncionarios();
            } catch (err) {
                console.error('Erro ao excluir funcionário:', err);
                alert('Erro ao excluir funcionário');
            }
        }
    };

    // Toggle status
    const toggleStatus = async (id: number) => {
        try {
            await funcionarioService.toggleStatus(id);
            await loadFuncionarios();
        } catch (err) {
            console.error('Erro ao alterar status:', err);
            alert('Erro ao alterar status do funcionário');
        }
    };

    // Estatísticas
    const totalFuncionarios = funcionarios.length;
    const funcionariosAtivos = funcionarios.filter(f => f.ativo).length;
    const funcionariosInativos = funcionarios.filter(f => !f.ativo).length;
    const mediaSalarial = funcionarios.length > 0
        ? funcionarios.reduce((sum, f) => sum + f.salario, 0) / funcionarios.length
        : 0;

    return (
        <Layout
            pageTitle="Gerenciar Funcionários"
            pageSubtitle="Administre os funcionários da biblioteca"
            loading={loading}
            onRefresh={loadFuncionarios}
            lastUpdate={lastUpdate}
        >
            <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-600">{totalFuncionarios}</p>
                                <p className="text-gray-600 font-medium">Total de Funcionários</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-green-600">{funcionariosAtivos}</p>
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
                                <p className="text-3xl font-bold text-red-600">{funcionariosInativos}</p>
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
                                <p className="text-3xl font-bold text-purple-600">R$ {mediaSalarial.toFixed(2)}</p>
                                <p className="text-gray-600 font-medium">Média Salarial</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">💰</span>
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
                                🔍 Buscar Funcionários
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por nome, email ou telefone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 text-base transition-all duration-300 bg-blue-50 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Filtro por Cargo */}
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                💼 Filtrar por Cargo
                            </label>
                            <select
                                value={cargoFilter}
                                onChange={(e) => setCargoFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                            >
                                <option value="">Todos os cargos</option>
                                {Object.values(CARGO_FUNCIONARIO).map(cargo => (
                                    <option key={cargo} value={cargo}>{cargo}</option>
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
                            Criar Novo Funcionário
                            <span className="text-lg bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center">➕</span>
                        </button>
                    </div>
                </div>

                {/* Tabela de Funcionários */}
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
                                            <span>👤</span>
                                            <span>Nome</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📞</span>
                                            <span>Telefone</span>
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
                                            <span>💼</span>
                                            <span>Cargo</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>💰</span>
                                            <span>Salário</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ color: '#ffffff' }}>
                                        <span className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>Admissão</span>
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
                            <tbody className="bg-white divide-y divide-blue-100 rounded-b-2xl">
                                {filteredFuncionarios.map((funcionario, index) => (
                                    <motion.tr
                                        key={funcionario.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-blue-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{funcionario.nome}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{funcionario.telefone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{funcionario.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {funcionario.cargo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {funcionario.salario.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${funcionario.ativo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {funcionario.ativo ? '✅ Ativo' : '❌ Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal(funcionario)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-800"
                                                    style={{ minWidth: '36px' }}
                                                    title="Editar"
                                                >
                                                    <EditIcon size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(funcionario.id)}
                                                    className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border ${funcionario.ativo
                                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-700'
                                                        : 'bg-green-500 hover:bg-green-600 text-white border-green-700'
                                                        }`}
                                                    style={{ minWidth: '36px' }}
                                                    title={funcionario.ativo ? 'Desativar' : 'Ativar'}
                                                >
                                                    {funcionario.ativo ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => deleteFuncionario(funcionario.id)}
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
                        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {editingFuncionario ? 'Editar Funcionário' : 'Criar Novo Funcionário'}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                                    <input
                                        type="password"
                                        value={formData.senha}
                                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={!editingFuncionario}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                                    <select
                                        value={formData.cargo}
                                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Selecione um cargo</option>
                                        {Object.values(CARGO_FUNCIONARIO).map(cargo => (
                                            <option key={cargo} value={cargo}>{cargo}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Salário</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.salario}
                                        onChange={(e) => setFormData({ ...formData, salario: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Admissão</label>
                                    <input
                                        type="date"
                                        value={formData.dataAdmissao}
                                        onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Demissão (opcional)</label>
                                    <input
                                        type="date"
                                        value={formData.dataDemissao}
                                        onChange={(e) => setFormData({ ...formData, dataDemissao: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.ativo}
                                            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Funcionário ativo</span>
                                    </label>
                                </div>
                            </div>

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
                                    onClick={saveFuncionario}
                                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-700 flex items-center justify-center"
                                    style={{ minWidth: '48px', minHeight: '48px' }}
                                    title={editingFuncionario ? 'Atualizar' : 'Criar'}
                                >
                                    {editingFuncionario ? <UpdateIcon size={20} /> : <CreateIcon size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GerenciarFuncionarios;
