import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'user';
    fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole = 'user'
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('yeti_token');

                if (!token) {
                    setIsAuthenticated(false);
                    setUserRole(null);
                    setIsLoading(false);
                    return;
                }

                // Decodificar o token JWT para obter o role
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role || 'Usuario';

                // Normalizar o role para minúsculo para comparação
                const normalizedRole = role.toLowerCase();

                setUserRole(normalizedRole);
                setIsAuthenticated(true);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao decodificar token:', error);
                localStorage.removeItem('yeti_token');
                localStorage.removeItem('yeti_user');
                setIsAuthenticated(false);
                setUserRole(null);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    // Se não está autenticado, redirecionar para login
    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    // Se está autenticado mas não tem o role necessário
    if (requiredRole === 'admin' && userRole !== 'admin') {
        return <Navigate to="/usuario-dashboard" replace />;
    }

    if (requiredRole === 'user' && userRole === 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // Se passou em todas as verificações, renderizar o componente
    return <>{children}</>;
};

export default ProtectedRoute;
