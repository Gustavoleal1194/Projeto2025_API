import React, { useState } from 'react';
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
            className="min-h-screen bg-gray-50"
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
            <main className="mt-18 p-8 transition-all duration-300" style={{ marginLeft: isSidebarCollapsed ? '4rem' : '17.5rem' }}>
                {/* Page Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-4 text-gray-800" style={{ color: '#1f2937' }}>
                                {pageTitle}
                            </h1>
                            <p className="text-xl text-gray-600" style={{ color: '#4b5563' }}>
                                {pageSubtitle}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-4">
                                {onRefresh && (
                                    <button
                                        onClick={onRefresh}
                                        disabled={loading}
                                        className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                                                <span className="text-gray-700" style={{ color: '#374151' }}>Atualizando...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>🔄</span>
                                                <span className="text-gray-700" style={{ color: '#374151' }}>Atualizar</span>
                                            </div>
                                        )}
                                    </button>
                                )}
                                {lastUpdate && (
                                    <div>
                                        <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Última atualização</p>
                                        <p className="text-lg font-semibold text-gray-800" style={{ color: '#1f2937' }}>{lastUpdate}</p>
                                    </div>
                                )}
                            </div>
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
