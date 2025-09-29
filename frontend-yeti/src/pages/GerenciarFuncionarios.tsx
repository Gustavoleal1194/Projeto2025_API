import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { funcionarioService } from '../services/funcionarioService';
import type { Funcionario, FuncionarioForm } from '../types/entities';
import { CARGO_FUNCIONARIO } from '../constants/entities';
import { CancelIcon, CreateIcon, UpdateIcon } from '../components/Icons';
import { useNotifications } from '../hooks/useNotifications';
import { FuncionarioValidator } from '../validators/FuncionarioValidator';
import { BookLoader } from '../components/Loading';
import { createSmartTable } from '../utils/tableRecipes';

const GerenciarFuncionarios: React.FC = () => {
    const { handleRequestError, showCrudSuccess } = useNotifications();

    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);

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

    // Estados de validação
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Funções de validação usando validador centralizado
    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'nome':
                return FuncionarioValidator.validateNome(value?.toString() || '');
            case 'email':
                return FuncionarioValidator.validateEmail(value?.toString() || '');
            case 'telefone':
                return FuncionarioValidator.validateTelefone(value?.toString() || '');
            case 'senha':
                return FuncionarioValidator.validateSenha(value?.toString() || '', !!editingFuncionario);
            case 'cargo':
                return FuncionarioValidator.validateCargo(value?.toString() || '');
            case 'salario':
                return FuncionarioValidator.validateSalario(Number(value) || 0);
            case 'dataAdmissao':
                return FuncionarioValidator.validateDataAdmissao(value?.toString() || '');
            case 'dataDemissao':
                return FuncionarioValidator.validateDataDemissao(value?.toString() || '', formData.dataAdmissao);
            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors = FuncionarioValidator.validateForm(formData, !!editingFuncionario);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handler para mudanças nos campos com validação em tempo real
    const handleFieldChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validar campo em tempo real
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Carregar funcionários
    const loadFuncionarios = async () => {
        try {
            setLoading(true);
            setError(null);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const data = await funcionarioService.listar();
            setFuncionarios(data);
            setFilteredFuncionarios(data);
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
        setErrors({}); // Limpar erros ao abrir modal
        setIsModalOpen(true);

        // Limpar campos após um pequeno delay para evitar autofill
        setTimeout(() => {
            if (!funcionario) { // Only clear for new funcionario creation
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
        }, 100);
    };

    // Fechar modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFuncionario(null);
        setErrors({}); // Limpar erros ao fechar modal
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
        if (isSubmitting) return;

        // Validar formulário antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            // Preparar dados para envio no formato PascalCase que o backend espera
            const dadosParaEnvio: any = {
                Id: editingFuncionario?.id ?? 0,
                Nome: formData.nome,
                Email: formData.email,
                Telefone: formData.telefone,
                Cargo: formData.cargo,
                Salario: Number(formData.salario),
                DataAdmissao: formData.dataAdmissao,
                DataDemissao: formData.dataDemissao || null,
                Ativo: formData.ativo
            };

            // Só incluir senha se estiver preenchida (para edição) ou se for criação
            if (formData.senha && formData.senha.trim() !== '') {
                dadosParaEnvio.Senha = formData.senha;
            }

            if (editingFuncionario) {
                await funcionarioService.atualizar(editingFuncionario.id, dadosParaEnvio);
            } else {
                dadosParaEnvio.Senha = formData.senha;
                await funcionarioService.criar(dadosParaEnvio);
            }
            await loadFuncionarios();
            closeModal();

            // Mostrar notificação de sucesso
            showCrudSuccess(editingFuncionario ? 'update' : 'create', 'funcionário');
        } catch (err) {
            handleRequestError(err, 'Erro ao salvar funcionário');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Excluir funcionário
    const deleteFuncionario = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
            try {
                await funcionarioService.excluir(id);
                await loadFuncionarios();

                // Mostrar notificação de sucesso
                showCrudSuccess('delete', 'funcionário');
            } catch (err) {
                handleRequestError(err, 'Erro ao excluir funcionário');
            }
        }
    };

    // Toggle status
    const toggleStatus = async (id: number) => {
        try {
            await funcionarioService.toggleStatus(id);
            await loadFuncionarios();

            // Mostrar notificação de sucesso
            showCrudSuccess('update', 'funcionário');
        } catch (err) {
            handleRequestError(err, 'Erro ao alterar status do funcionário');
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
        >
            {/* Loading State */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <BookLoader size="lg" />
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Carregando funcionários...
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
                    {createSmartTable(
                        filteredFuncionarios,
                        'funcionarios',
                        openModal,
                        deleteFuncionario,
                        toggleStatus,
                        loading,
                        error,
                        loadFuncionarios
                    )}
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

                            <form onSubmit={(e) => { e.preventDefault(); saveFuncionario(); }} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                                        <input
                                            type="text"
                                            value={formData.nome}
                                            onChange={(e) => handleFieldChange('nome', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nome ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.nome && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                                        <input
                                            type="tel"
                                            value={formData.telefone}
                                            onChange={(e) => handleFieldChange('telefone', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.telefone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.telefone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Senha {!editingFuncionario && '*'}
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.senha}
                                            onChange={(e) => handleFieldChange('senha', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.senha ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="new-password"
                                            required={!editingFuncionario}
                                        />
                                        {errors.senha && (
                                            <p className="mt-1 text-sm text-red-600">{errors.senha}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cargo *</label>
                                        <select
                                            value={formData.cargo}
                                            onChange={(e) => handleFieldChange('cargo', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.cargo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            required
                                        >
                                            <option value="">Selecione um cargo</option>
                                            {Object.values(CARGO_FUNCIONARIO).map(cargo => (
                                                <option key={cargo} value={cargo}>{cargo}</option>
                                            ))}
                                        </select>
                                        {errors.cargo && (
                                            <p className="mt-1 text-sm text-red-600">{errors.cargo}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Salário *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.salario}
                                            onChange={(e) => handleFieldChange('salario', parseFloat(e.target.value) || 0)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.salario ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            autoComplete="off"
                                            required
                                        />
                                        {errors.salario && (
                                            <p className="mt-1 text-sm text-red-600">{errors.salario}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Admissão *</label>
                                        <input
                                            type="date"
                                            value={formData.dataAdmissao}
                                            onChange={(e) => handleFieldChange('dataAdmissao', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dataAdmissao ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            required
                                        />
                                        {errors.dataAdmissao && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dataAdmissao}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Demissão (opcional)</label>
                                        <input
                                            type="date"
                                            value={formData.dataDemissao}
                                            onChange={(e) => handleFieldChange('dataDemissao', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dataDemissao ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.dataDemissao && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dataDemissao}</p>
                                        )}
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
                                        title={editingFuncionario ? 'Atualizar' : 'Criar'}
                                    >
                                        {isSubmitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            editingFuncionario ? <UpdateIcon size={20} /> : <CreateIcon size={20} />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GerenciarFuncionarios;
