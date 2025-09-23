import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardService from '../services/dashboardService';
import type {
    DashboardData,
    Activity,
    OverdueBook,
    TopBook,
    MonthlyStat,
    SystemAlert
} from '../types/entities';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Estados para dados da API
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalUsuarios: 0,
        totalLivros: 0,
        totalExemplares: 0,
        emprestimosAtivos: 0,
        livrosAtrasados: 0,
        funcionariosAtivos: 0,
        usuariosOnline: 0,
        livrosDisponiveis: 0
    });

    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
    const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([]);
    const [topBooks, setTopBooks] = useState<TopBook[]>([]);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
    const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Carregar dados reais da API
        loadDashboardData();
    }, []);

    // Monitorar mudanças no token para recarregar dados
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'yeti_token' && e.newValue) {
                console.log('🔄 Token detectado, recarregando dados do dashboard...');
                loadDashboardData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const loadDashboardData = async () => {
        try {
            console.log('🚀 Iniciando carregamento dos dados do dashboard...');
            setIsLoading(true);
            setError(null);

            // Carregar todos os dados do dashboard usando o serviço
            console.log('📡 Chamando DashboardService.getAllDashboardData()...');
            const data = await DashboardService.getAllDashboardData();
            console.log('📊 Dados recebidos do serviço:', data);

            // Atualizar estados com dados reais
            console.log('🔄 Atualizando estados...');
            setDashboardData(data.resumo);
            setRecentActivities(data.atividades);
            setOverdueBooks(data.livrosAtrasados);
            setTopBooks(data.livrosPopulares);
            setMonthlyStats(data.estatisticasMensais);
            setSystemAlerts(data.alertas);

            console.log('✅ Estados atualizados com sucesso!');

        } catch (error) {
            console.error('❌ Erro ao carregar dados do dashboard:', error);
            setError('Erro ao carregar dados do dashboard. Verifique sua conexão com a API.');

            // Em caso de erro, manter dados padrão (já inicializados com 0/vazio)
            console.log('⚠️ Usando dados padrão devido ao erro na API');
        } finally {
            setIsLoading(false);
            console.log('🏁 Carregamento finalizado');
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'loan': return '📖';
            case 'return': return '↩️';
            case 'reserve': return '🔒';
            case 'add': return '➕';
            case 'renew': return '🔄';
            default: return '📝';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'loan': return 'text-green-600';
            case 'return': return 'text-blue-600';
            case 'reserve': return 'text-yellow-600';
            case 'add': return 'text-purple-600';
            case 'renew': return 'text-orange-600';
            default: return 'text-gray-600';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('yeti_token');
        localStorage.removeItem('yeti_user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 w-70 h-full bg-blue-900 text-white shadow-2xl z-50">
                {/* Logo Container */}
                <div className="p-8 text-center border-b border-blue-700">
                    <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-blue-400">
                        <img
                            src="/images/logo.png"
                            alt="Yeti Library"
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <h1 className="text-xl font-bold uppercase tracking-wider">
                        Yeti Library Admin
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    {[
                        { id: 'dashboard', label: 'Dashboard Admin', icon: '🏠' },
                        { id: 'users', label: 'Gerenciar Usuários', icon: '👥' },
                        { id: 'books', label: 'Gerenciar Livros', icon: '📚' },
                        { id: 'exemplares', label: 'Gerenciar Exemplares', icon: '📚' },
                        { id: 'funcionarios', label: 'Gerenciar Funcionários', icon: '👨‍💼' },
                        { id: 'loans', label: 'Empréstimos', icon: '📖' },
                        { id: 'reports', label: 'Relatórios', icon: '📊' },
                        { id: 'settings', label: 'Configurações', icon: '⚙️' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'users') {
                                    navigate('/gerenciar-usuarios');
                                } else {
                                    setActiveTab(item.id);
                                }
                            }}
                            className={`w-full flex items-center p-4 mb-2 rounded-lg transition-all duration-300 ${activeTab === item.id
                                ? 'bg-amber-200 text-amber-900 border-l-4 border-green-600'
                                : 'hover:bg-blue-800 hover:border-l-4 hover:border-green-400'
                                }`}
                        >
                            <span className="text-2xl mr-3">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Top Bar */}
            <header className="fixed top-0 right-0 left-70 h-18 bg-white border-b border-blue-400 flex items-center justify-between px-8 z-40">
                {/* Search Container */}
                <div className="flex-1 max-w-lg relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar usuários, livros, empréstimos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white border-2 border-blue-400 rounded-full text-gray-700 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                    />
                </div>

                {/* Admin Profile */}
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors duration-300">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                        A
                    </div>
                    <span className="text-gray-700 font-medium">Administrador</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="ml-70 mt-18 p-8">
                {/* Loading State */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-lg font-medium text-gray-700">Carregando dados...</span>
                        </div>
                    </div>
                )}

                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-2xl"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">Painel Administrativo</h1>
                            <p className="text-xl opacity-90">Gerencie sua biblioteca digital com eficiência</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={loadDashboardData}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Atualizando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>🔄</span>
                                            <span>Atualizar</span>
                                        </div>
                                    )}
                                </button>
                                <div>
                                    <p className="text-sm opacity-75">Última atualização</p>
                                    <p className="text-lg font-semibold">{new Date().toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                    >
                        <div className="flex items-center">
                            <div className="text-red-500 mr-3">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: 'Total de Usuários',
                            value: dashboardData.totalUsuarios.toLocaleString(),
                            icon: '👥',
                            color: 'bg-blue-500',
                            change: '+12%',
                            subtitle: `${dashboardData.usuariosOnline} online agora`,
                            trend: 'up'
                        },
                        {
                            title: 'Livros Cadastrados',
                            value: dashboardData.totalLivros.toLocaleString(),
                            icon: '📚',
                            color: 'bg-green-500',
                            change: '+8%',
                            subtitle: `${dashboardData.totalExemplares.toLocaleString()} exemplares`,
                            trend: 'up'
                        },
                        {
                            title: 'Empréstimos Ativos',
                            value: dashboardData.emprestimosAtivos.toString(),
                            icon: '📖',
                            color: 'bg-yellow-500',
                            change: '+5%',
                            subtitle: `${dashboardData.livrosDisponiveis.toLocaleString()} disponíveis`,
                            trend: 'up'
                        },
                        {
                            title: 'Livros Atrasados',
                            value: dashboardData.livrosAtrasados.toString(),
                            icon: '⚠️',
                            color: 'bg-red-500',
                            change: '-2%',
                            subtitle: `${dashboardData.funcionariosAtivos} funcionários ativos`,
                            trend: 'down'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">vs mês anterior</span>
                                    </div>
                                </div>
                                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Recent Activities */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Atividades Recentes</h3>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver todas</button>
                        </div>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className={`text-2xl ${getActivityColor(activity.type)}`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                                            <p className="text-sm text-gray-600">{activity.action}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{activity.time}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📊</div>
                                    <p>Nenhuma atividade recente</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Overdue Books */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Livros Atrasados</h3>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {overdueBooks.length} atrasados
                            </span>
                        </div>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {overdueBooks.length > 0 ? (
                                overdueBooks.map((book) => (
                                    <div key={book.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{book.title}</p>
                                            <p className="text-sm text-gray-600">{book.user}</p>
                                            <p className="text-xs text-gray-500">Exemplar: {book.exemplar}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-red-600">{book.daysOverdue} dias</p>
                                            <p className="text-xs text-red-500">Multa: R$ {book.multa.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">✅</div>
                                    <p>Nenhum livro atrasado</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* System Alerts */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Alertas do Sistema</h3>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {systemAlerts.length} alertas
                            </span>
                        </div>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {systemAlerts.length > 0 ? (
                                systemAlerts.map((alert) => (
                                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${alert.type === 'error' ? 'bg-red-50 border-red-400' :
                                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                                            alert.type === 'success' ? 'bg-green-50 border-green-400' :
                                                'bg-blue-50 border-blue-400'
                                        }`}>
                                        <div className="flex items-start">
                                            <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${alert.priority === 'high' ? 'bg-red-500' :
                                                alert.priority === 'medium' ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                                }`}></div>
                                            <p className="text-sm text-gray-700">{alert.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">🔔</div>
                                    <p>Nenhum alerta do sistema</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Monthly Statistics Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Estatísticas Mensais</h3>
                        <div className="space-y-4">
                            {monthlyStats.length > 0 ? (
                                monthlyStats.map((stat, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600 w-12">{stat.month}</span>
                                        <div className="flex-1 mx-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${(stat.emprestimos / 200) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500 w-12 text-right">{stat.emprestimos}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${(stat.devolucoes / 200) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500 w-12 text-right">{stat.devolucoes}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📈</div>
                                    <p>Nenhum dado estatístico</p>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-center mt-4 space-x-6">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-600">Empréstimos</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-600">Devoluções</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Top Books */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Livros Mais Emprestados</h3>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver ranking</button>
                        </div>
                        <div className="space-y-4">
                            {topBooks.length > 0 ? (
                                topBooks.map((book, index) => (
                                    <div key={book.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{book.title}</p>
                                            <p className="text-sm text-gray-600">{book.author}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{book.emprestimos} empréstimos</p>
                                            <div className="flex items-center">
                                                <span className="text-yellow-500">★</span>
                                                <span className="text-xs text-gray-500 ml-1">{book.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📚</div>
                                    <p>Nenhum dado de popularidade</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[
                            { label: 'Novo Livro', icon: '📚', color: 'bg-blue-500', action: () => setActiveTab('books') },
                            { label: 'Novo Usuário', icon: '👤', color: 'bg-green-500', action: () => setActiveTab('users') },
                            { label: 'Novo Empréstimo', icon: '📖', color: 'bg-yellow-500', action: () => setActiveTab('loans') },
                            { label: 'Adicionar Exemplar', icon: '📚', color: 'bg-orange-500', action: () => setActiveTab('exemplares') },
                            { label: 'Adicionar Funcionário', icon: '👨‍💼', color: 'bg-indigo-500', action: () => setActiveTab('funcionarios') },
                            { label: 'Relatórios', icon: '📊', color: 'bg-purple-500', action: () => setActiveTab('reports') }
                        ].map((action, index) => (
                            <button
                                key={index}
                                onClick={action.action}
                                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center text-2xl mb-2`}>
                                    {action.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>


                {/* Logout Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg"
                    >
                        Fazer Logout
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
