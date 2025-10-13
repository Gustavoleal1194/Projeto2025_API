import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    const [activeTab, setActiveTab] = useState(() => {
        const pathToTab: { [key: string]: string } = {
            '/usuario-dashboard': 'dashboard',
            '/explorar-livros': 'explore',
            '/meus-livros': 'books',
            '/meus-emprestimos': 'loans',
            '/favoritos': 'favorites',
            '/meu-perfil': 'profile'
        };
        return pathToTab[window.location.pathname] || 'dashboard';
    });
    const [internalSearchQuery, setInternalSearchQuery] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('yeti_sidebar_collapsed');
        return saved ? JSON.parse(saved) : false;
    });
    const navigate = useNavigate();

    const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
    const setSearchQuery = onSearchChange || setInternalSearchQuery;


    // Navegar para páginas
    const handleTabChange = (tab: string) => {
        // Atualizar o activeTab imediatamente
        setActiveTab(tab);

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
    // Buscar nome do usuário do localStorage
    const getUserName = () => {
        try {
            const userData = localStorage.getItem('yeti_user');
            if (userData) {
                const user = JSON.parse(userData);
                return user.nome || user.name || user.nomeCompleto || user.fullName || user.username || 'Usuário';
            }
        } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
        }
        return 'Usuário';
    };

    const userName = getUserName();

    const handleLogout = () => {
        localStorage.removeItem('yeti_token');
        localStorage.removeItem('yeti_user');
        window.location.href = '/';
    };

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('yeti_sidebar_collapsed', JSON.stringify(newState));
    };

    return (
        <div
            className="min-h-screen bg-gray-50"
            style={{ '--sidebar-width': isSidebarCollapsed ? '4rem' : '17.5rem' } as React.CSSProperties}
        >
            {/* Sidebar */}
            <UsuarioSidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebar}
            />

            {/* Header */}
            <UsuarioHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                userName={userName}
                onLogout={handleLogout}
                isSidebarCollapsed={isSidebarCollapsed}
            />

            {/* Main Content */}
            <main className="ml-70 mt-18 p-8 transition-all duration-300" style={{ marginLeft: isSidebarCollapsed ? '4rem' : '17.5rem', marginTop: '4.5rem' }}>
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
