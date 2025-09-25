import React from 'react';
import { LogoutIcon } from '../Icons';

interface UsuarioHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    userName: string;
    userInitial: string;
    onLogout: () => void;
}

const UsuarioHeader: React.FC<UsuarioHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    userName,
    userInitial,
    onLogout
}) => {
    return (
        <header className="fixed top-0 right-0 h-18 bg-white border-b border-blue-400 flex items-center justify-between px-8 z-40" style={{ left: '17.5rem' }}>
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

            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors duration-300">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold p-2">
                        {userInitial}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-700 font-medium text-sm">{userName}</span>
                        <span className="text-gray-500 text-xs">Usuário</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    style={{ minWidth: '36px' }}
                    title="Sair"
                >
                    <LogoutIcon size={16} />
                </button>
            </div>
        </header>
    );
};

export default UsuarioHeader;
