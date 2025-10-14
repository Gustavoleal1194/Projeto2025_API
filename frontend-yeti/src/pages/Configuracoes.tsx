import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import FilterButton from '../components/Buttons/FilterButton';
import { configuracaoService } from '../services/configuracaoService';
import type { ConfiguracaoSistema, BackupInfo } from '../services/configuracaoService';
import { BookLoader } from '../components/Loading';

const Configuracoes: React.FC = () => {
    const [activeTab, setActiveTab] = useState('sistema');
    const [configuracao, setConfiguracao] = useState<ConfiguracaoSistema | null>(null);
    const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const tabs = [
        { id: 'sistema', label: 'Sistema', icon: '⚙️' },
        { id: 'emprestimo', label: 'Empréstimo', icon: '📚' },
        { id: 'backup', label: 'Backup', icon: '💾' },
        { id: 'notificacoes', label: 'Notificações', icon: '🔔' }
    ];

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            console.log('🔄 Carregando configurações...');

            // Verificar se o usuário está autenticado
            const token = localStorage.getItem('yeti_token');
            if (!token) {
                setMessage({ type: 'error', text: 'Você precisa estar logado para acessar as configurações' });
                return;
            }

            // Verificar se é administrador
            const user = localStorage.getItem('yeti_user');
            if (user) {
                const userData = JSON.parse(user);
                if (userData.role !== 'Admin') {
                    setMessage({ type: 'error', text: 'Apenas administradores podem acessar as configurações' });
                    return;
                }
            }

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const [configData, backupData] = await Promise.all([
                configuracaoService.getConfiguracaoSistema(),
                configuracaoService.getBackupInfo()
            ]);

            console.log('✅ Configurações carregadas:', configData);
            console.log('✅ Backup info carregado:', backupData);

            if (configData && backupData) {
                setConfiguracao(configData);
                setBackupInfo(backupData);
            } else {
                setMessage({ type: 'error', text: 'Dados de configuração não foram carregados corretamente' });
            }

        } catch (error) {
            console.error('❌ Erro ao carregar configurações:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

            if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                setMessage({ type: 'error', text: 'Sessão expirada. Faça login novamente.' });
            } else if (errorMessage.includes('500')) {
                setMessage({ type: 'error', text: 'Erro interno do servidor. Tente novamente mais tarde.' });
            } else {
                setMessage({ type: 'error', text: `Erro ao carregar configurações: ${errorMessage}` });
            }
        } finally {
            setLoading(false);
        }
    };

    const salvarConfiguracao = async () => {
        if (!configuracao) return;

        try {
            setSaving(true);
            const erros = configuracaoService.validarConfiguracao(configuracao);

            if (erros.length > 0) {
                setMessage({ type: 'error', text: erros.join(', ') });
                return;
            }

            await configuracaoService.updateConfiguracaoSistema(configuracao);
            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
        } finally {
            setSaving(false);
        }
    };

    const executarBackup = async () => {
        try {
            setSaving(true);
            await configuracaoService.executarBackup();
            setMessage({ type: 'success', text: 'Backup executado com sucesso!' });
            await carregarDados(); // Recarregar dados do backup
        } catch (error) {
            console.error('Erro ao executar backup:', error);
            setMessage({ type: 'error', text: 'Erro ao executar backup' });
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: keyof ConfiguracaoSistema, value: any) => {
        if (configuracao) {
            setConfiguracao({ ...configuracao, [field]: value });
        }
    };

    if (loading) {
        return (
            <Layout
                pageTitle="Configurações do Sistema"
                pageSubtitle="Carregando configurações..."
                loading={true}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-4">
                        <BookLoader size="lg" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            Carregando configurações...
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            pageTitle="Configurações do Sistema"
            pageSubtitle="Gerencie as configurações e parâmetros do sistema de biblioteca"
            onRefresh={carregarDados}
            loading={saving}
        >
            <div className="space-y-6">
                {/* Message */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex flex-wrap gap-4">
                        {tabs.map((tab) => (
                            <FilterButton
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                variant={activeTab === tab.id ? 'primary' : 'neutral'}
                                className={activeTab === tab.id ? 'transform scale-105' : ''}
                            >
                                {tab.label}
                            </FilterButton>
                        ))}
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                >
                    {activeTab === 'sistema' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Configurações do Sistema
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Configure as informações básicas da biblioteca e parâmetros gerais do sistema.
                            </p>

                            {!configuracao ? (
                                <div className="text-center py-8">
                                    <BookLoader size="lg" />
                                    <p className="text-gray-600 mt-4">Carregando configurações...</p>
                                </div>
                            ) : (

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome da Biblioteca *
                                        </label>
                                        <input
                                            type="text"
                                            value={configuracao.nomeBiblioteca}
                                            onChange={(e) => handleInputChange('nomeBiblioteca', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ex: Biblioteca Municipal"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Endereço *
                                        </label>
                                        <input
                                            type="text"
                                            value={configuracao.endereco}
                                            onChange={(e) => handleInputChange('endereco', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ex: Rua das Flores, 123"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefone *
                                        </label>
                                        <input
                                            type="text"
                                            value={configuracao.telefone}
                                            onChange={(e) => handleInputChange('telefone', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ex: (11) 99999-9999"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={configuracao.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ex: contato@biblioteca.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Horário de Funcionamento
                                        </label>
                                        <input
                                            type="text"
                                            value={configuracao.horarioFuncionamento}
                                            onChange={(e) => handleInputChange('horarioFuncionamento', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ex: 08:00 - 18:00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dias de Funcionamento
                                        </label>
                                        <input
                                            type="text"
                                            value={configuracao.diasFuncionamento}
                                            onChange={(e) => handleInputChange('diasFuncionamento', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ex: Segunda a Sexta"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Máximo de Usuários
                                        </label>
                                        <input
                                            type="number"
                                            value={configuracao.maxUsuarios}
                                            onChange={(e) => handleInputChange('maxUsuarios', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Máximo de Livros
                                        </label>
                                        <input
                                            type="number"
                                            value={configuracao.maxLivros}
                                            onChange={(e) => handleInputChange('maxLivros', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="1"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'emprestimo' && configuracao && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Parâmetros de Empréstimo
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Configure os parâmetros relacionados aos empréstimos de livros.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dias de Empréstimo
                                    </label>
                                    <input
                                        type="number"
                                        value={configuracao.diasEmprestimo}
                                        onChange={(e) => handleInputChange('diasEmprestimo', parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Máximo de Renovações
                                    </label>
                                    <input
                                        type="number"
                                        value={configuracao.maxRenovacoes}
                                        onChange={(e) => handleInputChange('maxRenovacoes', parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Multa por Dia (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={configuracao.multaPorDia}
                                        onChange={(e) => handleInputChange('multaPorDia', parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor Máximo de Multa (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={configuracao.valorMaximoMulta}
                                        onChange={(e) => handleInputChange('valorMaximoMulta', parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dias para Atraso
                                    </label>
                                    <input
                                        type="number"
                                        value={configuracao.diasParaAtraso}
                                        onChange={(e) => handleInputChange('diasParaAtraso', parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dias para Bloqueio
                                    </label>
                                    <input
                                        type="number"
                                        value={configuracao.diasParaBloqueio}
                                        onChange={(e) => handleInputChange('diasParaBloqueio', parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'backup' && backupInfo && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Configurações de Backup
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Gerencie as configurações de backup e recuperação de dados.
                            </p>

                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Status do Backup
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold ${backupInfo.status === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>
                                            {backupInfo.status}
                                        </div>
                                        <div className="text-sm text-gray-600">Status</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {backupInfo.ultimoBackup.tamanho}
                                        </div>
                                        <div className="text-sm text-gray-600">Último Backup</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {backupInfo.configuracao.frequencia}
                                        </div>
                                        <div className="text-sm text-gray-600">Frequência</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {backupInfo.estatisticas.taxaSucesso.toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-gray-600">Taxa de Sucesso</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Frequência do Backup
                                    </label>
                                    <select
                                        value={backupInfo.configuracao.frequencia}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled
                                    >
                                        <option value="diario">Diário</option>
                                        <option value="semanal">Semanal</option>
                                        <option value="mensal">Mensal</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora do Backup
                                    </label>
                                    <input
                                        type="time"
                                        value={backupInfo.configuracao.hora}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Localização do Backup
                                    </label>
                                    <input
                                        type="text"
                                        value={backupInfo.configuracao.localizacao}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Retenção (dias)
                                    </label>
                                    <input
                                        type="number"
                                        value={backupInfo.configuracao.retencao}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <FilterButton
                                    onClick={executarBackup}
                                    disabled={saving}
                                    variant="primary"
                                >
                                    {saving ? 'Executando...' : 'Executar Backup Agora'}
                                </FilterButton>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notificacoes' && configuracao && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Configurações de Notificação
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Configure como e quando enviar notificações aos usuários.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Notificação por Email</h3>
                                        <p className="text-sm text-gray-600">Enviar notificações por email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={configuracao.notificacaoEmail}
                                            onChange={(e) => handleInputChange('notificacaoEmail', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Notificação por SMS</h3>
                                        <p className="text-sm text-gray-600">Enviar notificações por SMS</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={configuracao.notificacaoSMS}
                                            onChange={(e) => handleInputChange('notificacaoSMS', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Notificação de Atraso</h3>
                                        <p className="text-sm text-gray-600">Notificar sobre empréstimos em atraso</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={configuracao.notificacaoAtraso}
                                            onChange={(e) => handleInputChange('notificacaoAtraso', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email para Notificações
                                    </label>
                                    <input
                                        type="email"
                                        value={configuracao.emailNotificacao}
                                        onChange={(e) => handleInputChange('emailNotificacao', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="noreply@biblioteca.com"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                        <FilterButton
                            onClick={() => window.history.back()}
                            variant="neutral"
                        >
                            Cancelar
                        </FilterButton>
                        <FilterButton
                            onClick={salvarConfiguracao}
                            disabled={saving}
                            variant="primary"
                        >
                            {saving ? 'Salvando...' : 'Salvar Configurações'}
                        </FilterButton>
                    </div>
                </motion.div>
            </div >
        </Layout >
    );
};

export default Configuracoes;