import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    return (
        <aside className="fixed left-0 top-0 h-full bg-blue-900 text-white shadow-2xl z-50 flex flex-col" style={{ width: '17.5rem' }}>
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
            <nav
                className="p-4 flex-1 overflow-y-auto sidebar-scroll"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#93c5fd #1e3a8a'
                }}
            >
                {[
                    { id: 'dashboard', label: 'Dashboard Admin', icon: '🏠' },
                    { id: 'users', label: 'Gerenciar Usuários', icon: '👥' },
                    { id: 'books', label: 'Gerenciar Livros', icon: '📚' },
                    { id: 'exemplares', label: 'Gerenciar Exemplares', icon: '📚' },
                    { id: 'funcionarios', label: 'Gerenciar Funcionários', icon: '👨‍💼' },
                    { id: 'autores', label: 'Gerenciar Autores', icon: '✍️' },
                    { id: 'editores', label: 'Gerenciar Editoras', icon: '🏢' },
                    { id: 'loans', label: 'Empréstimos', icon: '📖' },
                    { id: 'reports', label: 'Relatórios', icon: '📊' },
                    { id: 'settings', label: 'Configurações', icon: '⚙️' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (item.id === 'dashboard') {
                                navigate('/dashboard');
                            } else if (item.id === 'users') {
                                navigate('/gerenciar-usuarios');
                            } else if (item.id === 'books') {
                                navigate('/gerenciar-livros');
                            } else if (item.id === 'exemplares') {
                                navigate('/gerenciar-exemplares');
                            } else if (item.id === 'funcionarios') {
                                navigate('/gerenciar-funcionarios');
                            } else if (item.id === 'autores') {
                                navigate('/gerenciar-autores');
                            } else if (item.id === 'editores') {
                                navigate('/gerenciar-editores');
                            } else if (item.id === 'loans') {
                                navigate('/gerenciar-emprestimos');
                            } else if (item.id === 'reports') {
                                navigate('/relatorios');
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
    );
};

export default Sidebar;
