import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UsuarioDashboard from './pages/UsuarioDashboard';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import GerenciarLivros from './pages/GerenciarLivros';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuario-dashboard" element={<UsuarioDashboard />} />
        <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
        <Route path="/gerenciar-livros" element={<GerenciarLivros />} />
        {/* Add other React routes here */}
      </Routes>
    </Router>
  );
};

export default App;