import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UsuarioDashboard from './pages/UsuarioDashboard';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import GerenciarLivros from './pages/GerenciarLivros';
import GerenciarExemplares from './pages/GerenciarExemplares';
import GerenciarFuncionarios from './pages/GerenciarFuncionarios';
import GerenciarAutores from './pages/GerenciarAutores';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuario-dashboard" element={<UsuarioDashboard />} />
        <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
        <Route path="/gerenciar-livros" element={<GerenciarLivros />} />
        <Route path="/gerenciar-exemplares" element={<GerenciarExemplares />} />
        <Route path="/gerenciar-funcionarios" element={<GerenciarFuncionarios />} />
        <Route path="/gerenciar-autores" element={<GerenciarAutores />} />
        {/* Add other React routes here */}
      </Routes>
    </Router>
  );
};

export default App;