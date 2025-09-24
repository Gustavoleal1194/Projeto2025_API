import React from 'react';

interface HeaderProps {
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            // Fallback: limpar localStorage e redirecionar
            localStorage.removeItem('yeti_token');
            localStorage.removeItem('yeti_user');
            window.location.href = '/';
        }
    };

    return (
        <header className="fixed top-0 right-0 h-18 bg-white border-b border-blue-400 flex items-center justify-between px-8 z-40" style={{ left: '17.5rem' }}>
            {/* Empty space for balance */}
            <div></div>

            {/* Admin Profile & Actions */}
            <div className="flex items-center gap-4">
                {/* Admin Profile */}
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors duration-300">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                        A
                    </div>
                    <span className="text-gray-700 font-medium">Administrador</span>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                </button>
            </div>
        </header>
    );
};

export default Header;
