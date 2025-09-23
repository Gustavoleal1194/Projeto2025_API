import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UsuarioDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    // Dados mockados para demonstração
    const books = [
        {
            id: 1,
            title: "O Senhor dos Anéis",
            author: "J.R.R. Tolkien",
            status: "available",
            description: "Uma épica aventura na Terra Média"
        },
        {
            id: 2,
            title: "Harry Potter",
            author: "J.K. Rowling",
            status: "borrowed",
            description: "A magia de Hogwarts"
        },
        {
            id: 3,
            title: "1984",
            author: "George Orwell",
            status: "available",
            description: "Distopia clássica"
        },
        {
            id: 4,
            title: "Dom Casmurro",
            author: "Machado de Assis",
            status: "reserved",
            description: "Literatura brasileira"
        },
        {
            id: 5,
            title: "Cem Anos de Solidão",
            author: "Gabriel García Márquez",
            status: "available",
            description: "Realismo mágico"
        },
        {
            id: 6,
            title: "O Pequeno Príncipe",
            author: "Antoine de Saint-Exupéry",
            status: "available",
            description: "Fábula atemporal"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-500';
            case 'borrowed':
                return 'bg-yellow-500';
            case 'reserved':
                return 'bg-blue-500';
            case 'overdue':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Disponível';
            case 'borrowed':
                return 'Emprestado';
            case 'reserved':
                return 'Reservado';
            case 'overdue':
                return 'Atrasado';
            default:
                return 'Indisponível';
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
                        Yeti Library System
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    {[
                        { id: 'dashboard', label: 'Meu Dashboard', icon: '🏠' },
                        { id: 'explore', label: 'Explorar Livros', icon: '🔍' },
                        { id: 'books', label: 'Meus Livros', icon: '📚' },
                        { id: 'loans', label: 'Meus Empréstimos', icon: '📖' },
                        { id: 'profile', label: 'Meu Perfil', icon: '👤' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
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
                        placeholder="Buscar na estante..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white border-2 border-blue-400 rounded-full text-gray-700 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                    />
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors duration-300">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        U
                    </div>
                    <span className="text-gray-700 font-medium">Usuário</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="ml-70 mt-18 p-8">
                {/* Bookshelf Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-amber-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                >
                    {/* Wood Texture Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="w-full h-full bg-gradient-to-br from-amber-900 to-amber-700"></div>
                    </div>

                    {/* Bookshelf Title */}
                    <h2 className="text-3xl font-bold text-white mb-8 text-center relative z-10 drop-shadow-lg">
                        Minha Estante Virtual
                    </h2>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                        {books.map((book) => (
                            <motion.div
                                key={book.id}
                                whileHover={{
                                    y: -8,
                                    rotateX: 5,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative"
                            >
                                {/* Book Card */}
                                <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-lg p-6 text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden">
                                    {/* Top Border */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-200"></div>

                                    {/* Book Content */}
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm opacity-90 mb-3">
                                            {book.author}
                                        </p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(book.status)}`}>
                                            {getStatusText(book.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 bg-white border-2 border-green-500 rounded-xl p-6 shadow-2xl min-w-64 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-50"
                                >
                                    <h4 className="text-xl font-bold text-amber-900 mb-2">
                                        {book.title}
                                    </h4>
                                    <p className="text-gray-700 mb-2 font-medium">
                                        {book.author}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                        {book.description}
                                    </p>
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                                        Ver Detalhes
                                    </button>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {[
                        { title: 'Meus Empréstimos', value: '3', icon: '📖', color: 'bg-blue-500' },
                        { title: 'Livros Favoritos', value: '12', icon: '❤️', color: 'bg-red-500' },
                        { title: 'Histórico', value: '47', icon: '📚', color: 'bg-green-500' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center text-2xl`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

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

export default UsuarioDashboard;
