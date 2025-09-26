import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import NotificationModal from './components/NotificationModal';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import UsuarioDashboard from './pages/UsuarioDashboard';
import ExplorarLivros from './pages/ExplorarLivros';
import MeusLivros from './pages/MeusLivros';
import MeusEmprestimos from './pages/MeusEmprestimos';
import Favoritos from './pages/Favoritos';
import MeuPerfil from './pages/MeuPerfil';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import GerenciarLivros from './pages/GerenciarLivros';
import GerenciarExemplares from './pages/GerenciarExemplares';
import GerenciarFuncionarios from './pages/GerenciarFuncionarios';
import GerenciarAutores from './pages/GerenciarAutores';
import GerenciarEditoras from './pages/GerenciarEditoras';
import GerenciarEmprestimos from './pages/GerenciarEmprestimos';
import GerenciarRelatorios from './pages/GerenciarRelatorios';
import Configuracoes from './pages/Configuracoes';

const AppContent: React.FC = () => {
  const { notification, hideNotification } = useNotification();

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas protegidas para ADMIN */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-usuarios" element={
          <ProtectedRoute requiredRole="admin">
            <GerenciarUsuarios />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-livros" element={
          <ProtectedRoute requiredRole="admin">
            <GerenciarLivros />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-exemplares" element={
          <ProtectedRoute requiredRole="admin">
            <GerenciarExemplares />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-funcionarios" element={
          <ProtectedRoute requiredRole="admin">
            <GerenciarFuncionarios />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-autores" element={
          <ProtectedRoute requiredRole="admin">
            <GerenciarAutores />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-editores" element={
          <ProtectedRoute requiredRole="admin">
            <GerenciarEditoras />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-emprestimos" element={
          <ProtectedRoute requiredRole="admin">
            <GerenciarEmprestimos />
          </ProtectedRoute>
        } />
        <Route path="/relatorios" element={
          <ProtectedRoute requiredRole="admin">
            <GerenciarRelatorios />
          </ProtectedRoute>
        } />
        <Route path="/configuracoes" element={
          <ProtectedRoute requiredRole="admin">
            <Configuracoes />
          </ProtectedRoute>
        } />

        {/* Rotas protegidas para USUÁRIO */}
        <Route path="/usuario-dashboard" element={
          <ProtectedRoute requiredRole="user">
            <UsuarioDashboard />
          </ProtectedRoute>
        } />
        <Route path="/explorar-livros" element={
          <ProtectedRoute requiredRole="user">
            <ExplorarLivros />
          </ProtectedRoute>
        } />
        <Route path="/meus-livros" element={
          <ProtectedRoute requiredRole="user">
            <MeusLivros />
          </ProtectedRoute>
        } />
        <Route path="/meus-emprestimos" element={
          <ProtectedRoute requiredRole="user">
            <MeusEmprestimos />
          </ProtectedRoute>
        } />
        <Route path="/favoritos" element={
          <ProtectedRoute requiredRole="user">
            <Favoritos />
          </ProtectedRoute>
        } />
        <Route path="/meu-perfil" element={
          <ProtectedRoute requiredRole="user">
            <MeuPerfil />
          </ProtectedRoute>
        } />
      </Routes>
      <NotificationModal notification={notification} onClose={hideNotification} />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
};

export default App;