import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UsuarioDashboard from './pages/UsuarioDashboard';
import ExplorarLivros from './pages/ExplorarLivros';
import MeusLivros from './pages/MeusLivros';
import MeusEmprestimos from './pages/MeusEmprestimos';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import GerenciarLivros from './pages/GerenciarLivros';
import GerenciarExemplares from './pages/GerenciarExemplares';
import GerenciarFuncionarios from './pages/GerenciarFuncionarios';
import GerenciarAutores from './pages/GerenciarAutores';
import GerenciarEditoras from './pages/GerenciarEditoras';
import GerenciarEmprestimos from './pages/GerenciarEmprestimos';
import GerenciarRelatorios from './pages/GerenciarRelatorios';
import Configuracoes from './pages/Configuracoes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuario-dashboard" element={<UsuarioDashboard />} />
        <Route path="/explorar-livros" element={<ExplorarLivros />} />
        <Route path="/meus-livros" element={<MeusLivros />} />
        <Route path="/meus-emprestimos" element={<MeusEmprestimos />} />
        <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
        <Route path="/gerenciar-livros" element={<GerenciarLivros />} />
        <Route path="/gerenciar-exemplares" element={<GerenciarExemplares />} />
        <Route path="/gerenciar-funcionarios" element={<GerenciarFuncionarios />} />
        <Route path="/gerenciar-autores" element={<GerenciarAutores />} />
        <Route path="/gerenciar-editores" element={<GerenciarEditoras />} />
        <Route path="/gerenciar-emprestimos" element={<GerenciarEmprestimos />} />
        <Route path="/relatorios" element={<GerenciarRelatorios />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        {/* Add other React routes here */}
      </Routes>
    </Router>
  );
};

export default App;