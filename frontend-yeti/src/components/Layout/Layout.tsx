import React, { useState } from 'react';
import RefreshButton from '../Buttons/RefreshButton';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    pageTitle: string;
    pageSubtitle: string;
    onRefresh?: () => void;
    loading?: boolean;
    lastUpdate?: string;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    pageTitle,
    pageSubtitle,
    onRefresh,
    loading = false,
    lastUpdate
}) => {
    const location = useLocation();

    // Função para mapear rota para activeTab
    const getActiveTabFromPath = (path: string) => {
        if (path === '/dashboard') return 'dashboard';
        if (path === '/gerenciar-usuarios') return 'users';
        if (path === '/gerenciar-livros') return 'books';
        if (path === '/gerenciar-exemplares') return 'exemplares';
        if (path === '/gerenciar-funcionarios') return 'funcionarios';
        if (path === '/gerenciar-autores') return 'autores';
        if (path === '/gerenciar-editores') return 'editores';
        if (path === '/gerenciar-emprestimos') return 'loans';
        if (path === '/emprestimos') return 'loans';
        if (path === '/relatorios') return 'reports';
        if (path === '/configuracoes') return 'settings';
        return 'dashboard'; // fallback
    };

    const [activeTab, setActiveTab] = useState(() => getActiveTabFromPath(location.pathname));
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('yeti_admin_sidebar_collapsed');
        return saved ? JSON.parse(saved) : false;
    });

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('yeti_admin_sidebar_collapsed', JSON.stringify(newState));
    };

    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-gray-950"
            style={{ '--sidebar-width': isSidebarCollapsed ? '4rem' : '17.5rem' } as React.CSSProperties}
        >
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebar}
            />

            {/* Header */}
            <Header isSidebarCollapsed={isSidebarCollapsed} />

            {/* Main Content */}
            <main className="mt-18 p-4 sm:p-6 lg:p-8 transition-all duration-300 text-gray-900 dark:text-gray-100" style={{ marginLeft: isSidebarCollapsed ? '4rem' : '17.5rem' }}>
                {/* Page Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6 sm:mb-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-gray-800 dark:text-gray-100 break-words" style={{ color: '#1f2937' }}>
                                {pageTitle}
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-200 break-words" style={{ color: '#4b5563' }}>
                                {pageSubtitle}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            {onRefresh && (
                                <RefreshButton onClick={onRefresh} text={loading ? 'Atualizando...' : 'Atualizar'} />
                            )}
                            {lastUpdate && (
                                <div className="text-left sm:text-right">
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-200" style={{ color: '#4b5563' }}>Última atualização</p>
                                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-100 break-words" style={{ color: '#1f2937' }}>{lastUpdate}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                {children}
            </main>
        </div>
    );
};

export default Layout;
