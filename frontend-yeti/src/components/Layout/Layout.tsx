import React, { useState, useEffect } from 'react';
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
    const [activeTab, setActiveTab] = useState('dashboard');

    // Detectar a rota atual e definir o activeTab
    useEffect(() => {
        const path = location.pathname;
        if (path === '/dashboard') {
            setActiveTab('dashboard');
        } else if (path === '/gerenciar-usuarios') {
            setActiveTab('users');
        } else if (path === '/gerenciar-livros') {
            setActiveTab('books');
        } else if (path === '/gerenciar-exemplares') {
            setActiveTab('exemplares');
        } else if (path === '/gerenciar-funcionarios') {
            setActiveTab('funcionarios');
        } else if (path === '/gerenciar-autores') {
            setActiveTab('autores');
        } else if (path === '/gerenciar-editores') {
            setActiveTab('editores');
        } else if (path === '/emprestimos') {
            setActiveTab('loans');
        } else if (path === '/relatorios') {
            setActiveTab('reports');
        } else if (path === '/configuracoes') {
            setActiveTab('settings');
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="mt-18 p-8" style={{ marginLeft: '17.5rem' }}>
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
