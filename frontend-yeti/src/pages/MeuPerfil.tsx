/**
 * PÁGINA MEU PERFIL - YETI LIBRARY SYSTEM
 * 
 * Página para usuários visualizarem e editarem seu perfil
 * Inclui informações pessoais e estatísticas de uso
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UsuarioLayout from '../components/Layout/UsuarioLayout';
import usuarioPerfilService from '../services/usuarioPerfilService';
import type { UsuarioDTO } from '../types/entities';

interface EstatisticasUsuario {
    totalEmprestimos: number;
    emprestimosAtivos: number;
    emprestimosAtrasados: number;
    totalFavoritos: number;
}

const MeuPerfil: React.FC = () => {
    // Estados
    const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
    const [estatisticas, setEstatisticas] = useState<EstatisticasUsuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editando, setEditando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    // Estados do formulário de edição
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        dataNascimento: ''
    });

    // Carregar dados do perfil
    const loadPerfil = async () => {
        try {
            setLoading(true);
            setError(null);

            const [dadosUsuario, dadosEstatisticas] = await Promise.all([
                usuarioPerfilService.obterMeuPerfil(),
                usuarioPerfilService.obterEstatisticasUsuario()
            ]);

            setUsuario(dadosUsuario);
            setEstatisticas(dadosEstatisticas);

            // Preencher formulário
            setFormData({
                nome: dadosUsuario.nome || '',
                email: dadosUsuario.email || '',
                telefone: dadosUsuario.telefone || '',
                cpf: dadosUsuario.cpf || '',
                dataNascimento: dadosUsuario.dataNascimento ?
                    new Date(dadosUsuario.dataNascimento).toISOString().split('T')[0] : ''
            });
        } catch (err) {
            console.error('Erro ao carregar perfil:', err);
            setError('Erro ao carregar dados do perfil');
        } finally {
            setLoading(false);
        }
    };

    // Carregar dados na montagem
    useEffect(() => {
        loadPerfil();
    }, []);

    // Salvar alterações
    const handleSalvar = async () => {
        try {
            setSalvando(true);
            setError(null);

            const dadosAtualizados = await usuarioPerfilService.atualizarPerfil(formData);
            setUsuario(dadosAtualizados);
            setEditando(false);
        } catch (err) {
            console.error('Erro ao salvar perfil:', err);
            setError('Erro ao salvar alterações');
        } finally {
            setSalvando(false);
        }
    };

    // Cancelar edição
    const handleCancelar = () => {
        if (usuario) {
            setFormData({
                nome: usuario.nome || '',
                email: usuario.email || '',
                telefone: usuario.telefone || '',
                cpf: usuario.cpf || '',
                dataNascimento: usuario.dataNascimento ?
                    new Date(usuario.dataNascimento).toISOString().split('T')[0] : ''
            });
        }
        setEditando(false);
        setError(null);
    };

    // Renderizar campo de edição
    const renderCampo = (label: string, campo: keyof typeof formData, tipo: string = 'text') => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            {editando ? (
                <input
                    type={tipo}
                    value={formData[campo]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [campo]: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {usuario?.[campo] || 'Não informado'}
                </p>
            )}
        </div>
    );

    if (loading) {
        return (
            <UsuarioLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando seu perfil...</p>
                    </div>
                </div>
            </UsuarioLayout>
        );
    }

    if (error && !usuario) {
        return (
            <UsuarioLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-600 text-lg font-medium mb-2">Erro ao carregar perfil</p>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={loadPerfil}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </UsuarioLayout>
        );
    }

    return (
        <UsuarioLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meu Perfil</h1>
                        <p className="text-gray-600">
                            Gerencie suas informações pessoais e visualize suas estatísticas
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {editando ? (
                            <>
                                <button
                                    onClick={handleSalvar}
                                    disabled={salvando}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-300"
                                >
                                    {salvando ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    onClick={handleCancelar}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                                >
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditando(true)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                    >
                        <p className="text-red-800">{error}</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informações Pessoais */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="text-3xl">👤</span>
                                Informações Pessoais
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderCampo('Nome Completo', 'nome')}
                                {renderCampo('E-mail', 'email', 'email')}
                                {renderCampo('Telefone', 'telefone', 'tel')}
                                {renderCampo('CPF', 'cpf')}
                                {renderCampo('Data de Nascimento', 'dataNascimento', 'date')}
                            </div>

                            {/* Informações adicionais */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status da Conta
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${usuario?.ativo
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {usuario?.ativo ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Idade
                                        </label>
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {usuario?.dataNascimento ?
                                                `${usuarioPerfilService.calcularIdade(usuario.dataNascimento)} anos` :
                                                'Não informado'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Estatísticas */}
                    <div className="space-y-6">
                        {/* Card de Estatísticas */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">📊</span>
                                Suas Estatísticas
                            </h3>

                            {estatisticas ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📚</span>
                                            <span className="text-sm font-medium text-gray-700">Total de Empréstimos</span>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {estatisticas.totalEmprestimos}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📖</span>
                                            <span className="text-sm font-medium text-gray-700">Empréstimos Ativos</span>
                                        </div>
                                        <span className="text-2xl font-bold text-green-600">
                                            {estatisticas.emprestimosAtivos}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">⚠️</span>
                                            <span className="text-sm font-medium text-gray-700">Empréstimos Atrasados</span>
                                        </div>
                                        <span className="text-2xl font-bold text-red-600">
                                            {estatisticas.emprestimosAtrasados}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">❤️</span>
                                            <span className="text-sm font-medium text-gray-700">Livros Favoritos</span>
                                        </div>
                                        <span className="text-2xl font-bold text-pink-600">
                                            {estatisticas.totalFavoritos}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    Carregando estatísticas...
                                </p>
                            )}
                        </motion.div>

                        {/* Card de Ações Rápidas */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">⚡</span>
                                Ações Rápidas
                            </h3>

                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.href = '/meus-livros'}
                                    className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-300"
                                >
                                    <span className="text-xl">📚</span>
                                    <span className="font-medium text-gray-700">Meus Livros</span>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/meus-emprestimos'}
                                    className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-300"
                                >
                                    <span className="text-xl">📖</span>
                                    <span className="font-medium text-gray-700">Meus Empréstimos</span>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/favoritos'}
                                    className="w-full flex items-center gap-3 p-3 text-left bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors duration-300"
                                >
                                    <span className="text-xl">❤️</span>
                                    <span className="font-medium text-gray-700">Meus Favoritos</span>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/explorar-livros'}
                                    className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-300"
                                >
                                    <span className="text-xl">🔍</span>
                                    <span className="font-medium text-gray-700">Explorar Livros</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </UsuarioLayout>
    );
};

export default MeuPerfil;
