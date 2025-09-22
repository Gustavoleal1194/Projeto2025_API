import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { useAuth } from '../hooks';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-yeti-neutral-white to-yeti-blue-dark">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-yeti-blue-main mb-4">
                        🏔️ Bem-vindo à Yeti Library!
                    </h1>
                    <p className="text-yeti-brown-dark mb-4">
                        Olá, <strong>{user?.nome}</strong>! Você está logado como <strong>{user?.tipoUsuario}</strong>.
                    </p>
                    <div className="bg-yeti-blue-light bg-opacity-20 p-4 rounded-lg">
                        <p className="text-yeti-blue-main">
                            🎉 Sistema de autenticação funcionando perfeitamente!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
