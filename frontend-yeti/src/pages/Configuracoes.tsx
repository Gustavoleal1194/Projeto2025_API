import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';

const Configuracoes: React.FC = () => {
    return (
        <Layout
            pageTitle="Configurações do Sistema"
            pageSubtitle="Painel administrativo em desenvolvimento"
        >
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-2xl mx-auto p-8"
                >
                    {/* Ícone de Desenvolvimento */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-8"
                    >
                        <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-6xl">⚙️</span>
                        </div>
                    </motion.div>

                    {/* Título Principal */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-gray-900 mb-4"
                    >
                        Em Desenvolvimento
                    </motion.h1>

                    {/* Subtítulo */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-gray-600 mb-8"
                    >
                        Esta funcionalidade está sendo desenvolvida
                    </motion.p>

                    {/* Card de Informações */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-3xl mr-3">🚧</span>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Configurações do Sistema
                            </h2>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Em breve você poderá gerenciar todas as configurações do sistema de biblioteca,
                            incluindo parâmetros de empréstimo, configurações gerais e muito mais.
                        </p>

                        {/* Lista de Funcionalidades Futuras */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-2xl mr-3">⚙️</span>
                                <span className="text-gray-700 font-medium">Configurações Gerais</span>
                            </div>
                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                <span className="text-2xl mr-3">📚</span>
                                <span className="text-gray-700 font-medium">Parâmetros de Empréstimo</span>
                            </div>
                            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                                <span className="text-2xl mr-3">👥</span>
                                <span className="text-gray-700 font-medium">Gestão de Usuários</span>
                            </div>
                            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                                <span className="text-2xl mr-3">🔒</span>
                                <span className="text-gray-700 font-medium">Segurança e Backup</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card de Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-3xl mr-3">⏳</span>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Status do Desenvolvimento
                            </h3>
                        </div>

                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-sm text-gray-700">Em Desenvolvimento</span>
                            </div>
                            <div className="text-gray-400">•</div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Sistema Funcionando</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Botão de Voltar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8"
                    >
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-gray-700 hover:border-gray-800"
                        >
                            ← Voltar
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Configuracoes;
