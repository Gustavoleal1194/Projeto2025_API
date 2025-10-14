import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import DashboardService from '../services/dashboardService';
import { LoadingOverlay } from '../components/Loading';
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
                loadDashboardData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Loading mínimo de 1.5s para melhor UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Carregar todos os dados do dashboard usando o serviço
            const data = await DashboardService.getAllDashboardData();

            // Atualizar estados com dados reais
            setDashboardData(data.resumo);
            setRecentActivities(data.atividades);
            setOverdueBooks(data.livrosAtrasados);
            setTopBooks(data.livrosPopulares);
            setMonthlyStats(data.estatisticasMensais);
            setSystemAlerts(data.alertas);


        } catch (error) {
            console.error('❌ Erro ao carregar dados do dashboard:', error);
            setError('Erro ao carregar dados do dashboard. Verifique sua conexão com a API.');

            // Em caso de erro, manter dados padrão (já inicializados com 0/vazio)
        } finally {
            setIsLoading(false);
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



    // Dados para gráfico real (SVG) usando monthlyStats
    const chartData = monthlyStats.slice(0, 12);
    const maxValue = chartData.length > 0
        ? Math.max(1, ...chartData.map(s => Math.max(s.emprestimos, s.devolucoes)))
        : 1;
    const paddingX = 40;
    const paddingY = 30;
    const chartHeight = 260;
    const innerHeight = chartHeight - paddingY * 2;
    // Largura baseada no número de meses para uma boa densidade de barras
    const baseGroupWidth = 56; // espaço por mês (duas barras + gap)
    const chartWidth = paddingX * 2 + Math.max(baseGroupWidth * chartData.length, 480);
    const innerWidth = chartWidth - paddingX * 2;
    const groupWidth = chartData.length > 0 ? innerWidth / chartData.length : 0;
    const barWidth = Math.max(8, (groupWidth - 12) / 2);

    return (
        <Layout
            pageTitle="Painel Administrativo"
            pageSubtitle="Gerencie sua biblioteca digital com eficiência"
            onRefresh={loadDashboardData}
            loading={isLoading}
            lastUpdate={new Date().toLocaleString('pt-BR')}
        >
            {/* Loading State */}
            <LoadingOverlay
                isVisible={isLoading}
                text="Carregando dados do dashboard..."
                size="lg"
            />

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
                        className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-[4px] gap-y-8 mb-8">
                {/* Recent Activities */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Atividades Recentes</h3>
                        <button
                            onClick={() => navigate('/gerenciar-emprestimos')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                            Ver todas
                        </button>
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
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
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
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
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
                {/* Monthly Statistics Chart (SVG real) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Estatísticas Mensais</h3>
                    <div>
                        {chartData.length > 0 ? (
                            <svg className="w-full" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                                {/* Grid horizontal */}
                                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                                    const y = paddingY + innerHeight * (1 - t);
                                    const value = Math.round(maxValue * t);
                                    return (
                                        <g key={i}>
                                            <line x1={paddingX} y1={y} x2={paddingX + innerWidth} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
                                            <text x={paddingX - 8} y={y + 4} textAnchor="end" className="fill-gray-400" style={{ fontSize: 10 }}>{value}</text>
                                        </g>
                                    );
                                })}

                                {/* Barras */}
                                {chartData.map((d, idx) => {
                                    const groupX = paddingX + idx * groupWidth + 4;
                                    const hLoan = (d.emprestimos / maxValue) * innerHeight;
                                    const hRet = (d.devolucoes / maxValue) * innerHeight;
                                    const xLoan = groupX;
                                    const xRet = groupX + barWidth + 4;
                                    const yLoan = paddingY + (innerHeight - hLoan);
                                    const yRet = paddingY + (innerHeight - hRet);
                                    return (
                                        <g key={idx}>
                                            <rect x={xLoan} y={yLoan} width={barWidth} height={hLoan} fill="#3b82f6" rx={3} />
                                            <rect x={xRet} y={yRet} width={barWidth} height={hRet} fill="#10b981" rx={3} />
                                            {/* Label do mês */}
                                            <text x={groupX + barWidth} y={paddingY + innerHeight + 14} textAnchor="middle" className="fill-gray-600" style={{ fontSize: 10 }}>{d.month}</text>
                                        </g>
                                    );
                                })}
                            </svg>
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
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mt-8 mb-16"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Livros Mais Emprestados</h3>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver ranking</button>
                    </div>
                    <div className="space-y-4">
                        {topBooks.length > 0 ? (
                            topBooks.map((book, index) => (
                                <div key={book.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-5 h-12 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
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
                        { label: 'Novo Livro', icon: '📚', color: 'bg-blue-500', action: () => navigate('/gerenciar-livros') },
                        { label: 'Novo Usuário', icon: '👤', color: 'bg-green-500', action: () => navigate('/gerenciar-usuarios') },
                        { label: 'Novo Empréstimo', icon: '📖', color: 'bg-yellow-500', action: () => navigate('/gerenciar-emprestimos') },
                        { label: 'Adicionar Exemplar', icon: '📚', color: 'bg-orange-500', action: () => navigate('/gerenciar-exemplares') },
                        { label: 'Adicionar Funcionário', icon: '👨‍💼', color: 'bg-indigo-500', action: () => navigate('/gerenciar-funcionarios') },
                        { label: 'Relatórios', icon: '📊', color: 'bg-purple-500', action: () => navigate('/relatorios') }
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



        </Layout>
    );
};

export default Dashboard;
