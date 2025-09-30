import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import UsuarioSidebar from './UsuarioSidebar';
import UsuarioHeader from './UsuarioHeader';

interface UsuarioLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
    pageSubtitle?: string;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

const UsuarioLayout: React.FC<UsuarioLayoutProps> = ({
    children,
    pageTitle = "Meu Dashboard",
    pageSubtitle = "Bem-vindo à sua biblioteca pessoal",
    searchQuery: externalSearchQuery,
    onSearchChange
}) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [internalSearchQuery, setInternalSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
    const setSearchQuery = onSearchChange || setInternalSearchQuery;

    // Mapear rotas para tabs
    useEffect(() => {
        const pathToTab: { [key: string]: string } = {
            '/usuario-dashboard': 'dashboard',
            '/explorar-livros': 'explore',
            '/meus-livros': 'books',
            '/meus-emprestimos': 'loans',
            '/favoritos': 'favorites',
            '/meu-perfil': 'profile'
        };

        const currentTab = pathToTab[location.pathname] || 'dashboard';
        setActiveTab(currentTab);
    }, [location.pathname]);

    // Navegar para páginas
    const handleTabChange = (tab: string) => {
        const tabToPath: { [key: string]: string } = {
            'dashboard': '/usuario-dashboard',
            'explore': '/explorar-livros',
            'books': '/meus-livros',
            'loans': '/meus-emprestimos',
            'favorites': '/favoritos',
            'profile': '/meu-perfil'
        };

        const path = tabToPath[tab];
        if (path) {
            navigate(path);
        }
    };

    // Mock user data - será substituído por dados reais da API
    const userName = "Gustavo Leal";
    const userInitial = "G";

    const handleLogout = () => {
        localStorage.removeItem('yeti_token');
        localStorage.removeItem('yeti_user');
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <UsuarioSidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
            />

            {/* Header */}
            <UsuarioHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                userName={userName}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="ml-70 mt-18 p-8" style={{ marginLeft: '17.5rem', marginTop: '4.5rem' }}>
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {pageTitle}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {pageSubtitle}
                    </p>
                </motion.div>

                {/* Page Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default UsuarioLayout;
