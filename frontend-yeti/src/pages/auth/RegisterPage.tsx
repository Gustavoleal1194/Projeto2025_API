import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { YetiForm } from '../../components/forms/YetiForm';
import { useAuth } from '../../hooks';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuth();

    const handleRegister = async (data: any) => {
        try {
            clearError();

            if (data.senha !== data.confirmarSenha) {
                throw new Error('As senhas não coincidem');
            }

            await register(data.nome, data.email, data.senha, data.confirmarSenha, data.tipoUsuario);
            navigate('/dashboard');
        } catch (error: any) {
            // Error is handled by the store or thrown above
        }
    };

    return (
        <div className="min-h-screen">
            <YetiForm
                mode="register"
                onSubmit={handleRegister}
                isLoading={isLoading}
                error={error}
            />

            <div className="text-center mt-4">
                <p className="text-yeti-brown-dark">
                    Já tem uma conta?{' '}
                    <Link
                        to="/login"
                        className="text-yeti-blue-main hover:text-yeti-green-dark font-medium transition-colors"
                    >
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    );
};
