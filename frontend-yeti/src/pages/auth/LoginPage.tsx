import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { YetiForm } from '../../components/forms/YetiForm';
import { useAuth } from '../../hooks';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuth();

    const handleLogin = async (data: any) => {
        try {
            clearError();
            await login(data.email, data.senha, data.tipoUsuario);
            navigate('/dashboard');
        } catch (error) {
            // Error is handled by the store
        }
    };

    return (
        <div className="min-h-screen">
            <YetiForm
                mode="login"
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
            />

            <div className="text-center mt-4">
                <p className="text-yeti-brown-dark">
                    Não tem uma conta?{' '}
                    <Link
                        to="/register"
                        className="text-yeti-blue-main hover:text-yeti-green-dark font-medium transition-colors"
                    >
                        Criar conta
                    </Link>
                </p>
            </div>
        </div>
    );
};
