import React from 'react';
import LogoutButton from '../LogoutButton';

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
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold p-2">
                        A
                    </div>
                    <span className="text-gray-700 font-medium">Administrador</span>
                </div>

                {/* Logout Button */}
                <LogoutButton onClick={handleLogout} />
            </div>
        </header>
    );
};

export default Header;
