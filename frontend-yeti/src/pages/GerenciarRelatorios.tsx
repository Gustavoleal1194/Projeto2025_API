import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { emprestimoService } from '../services/emprestimoService';
import { livroService } from '../services/livroService';
import { usuarioService } from '../services/usuarioService';
import { exemplarService } from '../services/exemplarService';
import { autorService } from '../services/autorService';
import { editoraService } from '../services/editoraService';
import { funcionarioService } from '../services/funcionarioService';
import type { Emprestimo, Usuario, Exemplar, Autor, Editora, Funcionario } from '../types/entities';
import type { Livro } from '../constants/entities';
import RefreshButton from '../components/Buttons/RefreshButton';
import PrintButton from '../components/Buttons/PrintButton';

const GerenciarRelatorios: React.FC = () => {
    // Estados principais
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
    const [livros, setLivros] = useState<Livro[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [exemplares, setExemplares] = useState<Exemplar[]>([]);
    const [autores, setAutores] = useState<Autor[]>([]);
    const [editoras, setEditoras] = useState<Editora[]>([]);
    const [, setFuncionarios] = useState<Funcionario[]>([]);

    // Estados de filtros
    const [periodoFiltro, setPeriodoFiltro] = useState('30'); // 7, 30, 90 dias
    const [tipoRelatorio, setTipoRelatorio] = useState('geral'); // geral, emprestimos, usuarios, livros
    const [loading, setLoading] = useState(true);

    // Carregar dados
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [
                emprestimosData,
                livrosData,
                usuariosData,
                exemplaresData,
                autoresData,
                editorasData,
                funcionariosData
            ] = await Promise.all([
                emprestimoService.listar(),
                livroService.listar(),
                usuarioService.listar(),
                exemplarService.listar(),
                autorService.listar(),
                editoraService.listar(),
                funcionarioService.listar()
            ]);

            setEmprestimos(emprestimosData);
            setLivros(livrosData);
            setUsuarios(usuariosData);
            setExemplares(exemplaresData);
            setAutores(autoresData);
            setEditoras(editorasData);
            setFuncionarios(funcionariosData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    // Funções de cálculo de estatísticas
    const getEmprestimosPorPeriodo = () => {
        const hoje = new Date();
        const dias = parseInt(periodoFiltro);
        const dataInicio = new Date(hoje.getTime() - (dias * 24 * 60 * 60 * 1000));

        return emprestimos.filter(emp => {
            const dataEmprestimo = new Date(emp.dataEmprestimo);
            return dataEmprestimo >= dataInicio;
        });
    };

    const getLivrosMaisEmprestados = () => {
        const emprestimosPorPeriodo = getEmprestimosPorPeriodo();
        const contador: { [key: string]: { livro: Livro, count: number } } = {};

        emprestimosPorPeriodo.forEach(emp => {
            const livro = livros.find(l => l.id === emp.idExemplar);
            if (livro) {
                const key = livro.titulo;
                if (contador[key]) {
                    contador[key].count++;
                } else {
                    contador[key] = { livro, count: 1 };
                }
            }
        });

        return Object.values(contador)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    };

    const getUsuariosMaisAtivos = () => {
        const emprestimosPorPeriodo = getEmprestimosPorPeriodo();
        const contador: { [key: string]: { usuario: Usuario, count: number } } = {};

        emprestimosPorPeriodo.forEach(emp => {
            const usuario = usuarios.find(u => u.id === emp.idUsuario);
            if (usuario) {
                const key = usuario.nome;
                if (contador[key]) {
                    contador[key].count++;
                } else {
                    contador[key] = { usuario, count: 1 };
                }
            }
        });

        return Object.values(contador)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    };

    const getAtrasos = () => {
        return emprestimos.filter(emp => emp.status === 'Emprestado' && emp.estaAtrasado);
    };

    const getExemplaresPorCondicao = () => {
        const contador: { [key: string]: number } = {};
        exemplares.forEach(ex => {
            contador[ex.condicao] = (contador[ex.condicao] || 0) + 1;
        });
        return contador;
    };

    const getLivrosPorEditora = () => {
        const contador: { [key: string]: { editora: Editora, count: number } } = {};
        livros.forEach(livro => {
            const editora = editoras.find(e => e.id === livro.idEditora);
            if (editora) {
                const key = editora.nome;
                if (contador[key]) {
                    contador[key].count++;
                } else {
                    contador[key] = { editora, count: 1 };
                }
            }
        });
        return Object.values(contador).sort((a, b) => b.count - a.count);
    };


    // Estatísticas gerais
    const emprestimosPorPeriodo = getEmprestimosPorPeriodo();
    const livrosMaisEmprestados = getLivrosMaisEmprestados();
    const usuariosMaisAtivos = getUsuariosMaisAtivos();
    const atrasos = getAtrasos();
    const exemplaresPorCondicao = getExemplaresPorCondicao();
    const livrosPorEditora = getLivrosPorEditora();

    // Função para exportar relatório
    const exportarRelatorio = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const dataAtual = new Date().toLocaleDateString('pt-BR');
            const horaAtual = new Date().toLocaleTimeString('pt-BR');
            const periodoTexto = periodoFiltro === '7' ? '7 dias' : periodoFiltro === '30' ? '30 dias' : '90 dias';

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Relatório Yeti Library - ${dataAtual}</title>
                        <style>
                            @page {
                                margin: 1cm;
                                size: A4;
                            }
                            * {
                                box-sizing: border-box;
                            }
                            body { 
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                                margin: 0; 
                                padding: 20px;
                                color: #333;
                                line-height: 1.6;
                            }
                            .header { 
                                text-align: center; 
                                margin-bottom: 40px;
                                border-bottom: 3px solid #2563eb;
                                padding-bottom: 20px;
                            }
                            .header h1 { 
                                color: #1e40af; 
                                margin: 0; 
                                font-size: 28px;
                                font-weight: bold;
                            }
                            .header .subtitle {
                                color: #64748b;
                                margin: 10px 0;
                                font-size: 16px;
                            }
                            .header .info {
                                background: #f1f5f9;
                                padding: 15px;
                                border-radius: 8px;
                                margin-top: 15px;
                                display: inline-block;
                            }
                            .section { 
                                margin-bottom: 35px; 
                                page-break-inside: avoid;
                            }
                            .section h2 { 
                                color: #1e40af; 
                                border-bottom: 2px solid #e2e8f0; 
                                padding-bottom: 8px;
                                margin-bottom: 20px;
                                font-size: 20px;
                            }
                            .section h3 {
                                color: #475569;
                                margin: 20px 0 10px 0;
                                font-size: 16px;
                            }
                            .stats-grid {
                                display: grid;
                                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                                gap: 20px;
                                margin: 20px 0;
                            }
                            .stat-card {
                                background: #f8fafc;
                                border: 1px solid #e2e8f0;
                                border-radius: 8px;
                                padding: 20px;
                                text-align: center;
                            }
                            .stat-number {
                                font-size: 32px;
                                font-weight: bold;
                                color: #1e40af;
                                margin: 0;
                            }
                            .stat-label {
                                color: #64748b;
                                margin: 5px 0 0 0;
                                font-size: 14px;
                            }
                            .table { 
                                width: 100%; 
                                border-collapse: collapse; 
                                margin-top: 15px;
                                font-size: 14px;
                            }
                            .table th, .table td { 
                                border: 1px solid #d1d5db; 
                                padding: 12px 8px; 
                                text-align: left; 
                            }
                            .table th { 
                                background-color: #f1f5f9; 
                                font-weight: bold;
                                color: #374151;
                            }
                            .table tbody tr:nth-child(even) {
                                background-color: #f9fafb;
                            }
                            .ranking-item {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 12px;
                                border-bottom: 1px solid #e5e7eb;
                                background: #f8fafc;
                                margin: 5px 0;
                                border-radius: 6px;
                            }
                            .ranking-number {
                                background: #3b82f6;
                                color: white;
                                width: 30px;
                                height: 30px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                margin-right: 15px;
                            }
                            .ranking-content {
                                flex: 1;
                            }
                            .ranking-count {
                                background: #10b981;
                                color: white;
                                padding: 4px 12px;
                                border-radius: 20px;
                                font-weight: bold;
                                font-size: 14px;
                            }
                            .footer {
                                margin-top: 50px;
                                text-align: center;
                                color: #64748b;
                                font-size: 12px;
                                border-top: 1px solid #e2e8f0;
                                padding-top: 20px;
                            }
                            .alert-box {
                                background: #fef2f2;
                                border: 1px solid #fecaca;
                                color: #dc2626;
                                padding: 15px;
                                border-radius: 8px;
                                margin: 20px 0;
                            }
                            .success-box {
                                background: #f0fdf4;
                                border: 1px solid #bbf7d0;
                                color: #16a34a;
                                padding: 15px;
                                border-radius: 8px;
                                margin: 20px 0;
                            }
                            @media print {
                                body { margin: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>📊 Relatório Yeti Library</h1>
                            <div class="subtitle">Sistema de Gestão de Biblioteca</div>
                            <div class="info">
                                <strong>Período de Análise:</strong> Últimos ${periodoTexto}<br>
                                <strong>Gerado em:</strong> ${dataAtual} às ${horaAtual}<br>
                                <strong>Relatório:</strong> ${tipoRelatorio === 'geral' ? 'Visão Geral' : tipoRelatorio === 'emprestimos' ? 'Empréstimos' : tipoRelatorio === 'usuarios' ? 'Usuários' : 'Livros'}
                            </div>
                        </div>

                        <div class="section">
                            <h2>📈 Resumo Executivo</h2>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-number">${emprestimosPorPeriodo.length}</div>
                                    <div class="stat-label">Empréstimos (${periodoTexto})</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">${emprestimos.filter(e => e.status === 'Emprestado' && !e.estaAtrasado).length}</div>
                                    <div class="stat-label">Empréstimos Ativos</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">${atrasos.length}</div>
                                    <div class="stat-label">Empréstimos Atrasados</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">${livros.length}</div>
                                    <div class="stat-label">Total de Livros</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">${usuarios.length}</div>
                                    <div class="stat-label">Total de Usuários</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">${exemplares.length}</div>
                                    <div class="stat-label">Total de Exemplares</div>
                                </div>
                            </div>
                        </div>

                        ${livrosMaisEmprestados.length > 0 ? `
                        <div class="section">
                            <h2>🏆 Livros Mais Emprestados</h2>
                            ${livrosMaisEmprestados.slice(0, 10).map((item, index) => `
                                <div class="ranking-item">
                                    <div style="display: flex; align-items: center;">
                                        <div class="ranking-number">${index + 1}</div>
                                        <div class="ranking-content">
                                            <strong>${item.livro.titulo}</strong><br>
                                            <small>${autores.find(a => a.id === item.livro.idAutor)?.nome || 'Autor não encontrado'}</small>
                                        </div>
                                    </div>
                                    <div class="ranking-count">${item.count}x</div>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}

                        ${usuariosMaisAtivos.length > 0 ? `
                        <div class="section">
                            <h2>👥 Usuários Mais Ativos</h2>
                            ${usuariosMaisAtivos.slice(0, 10).map((item, index) => `
                                <div class="ranking-item">
                                    <div style="display: flex; align-items: center;">
                                        <div class="ranking-number">${index + 1}</div>
                                        <div class="ranking-content">
                                            <strong>${item.usuario.nome}</strong><br>
                                            <small>${item.usuario.email}</small>
                                        </div>
                                    </div>
                                    <div class="ranking-count">${item.count}x</div>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}

                        <div class="section">
                            <h2>📊 Status dos Exemplares</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Condição</th>
                                        <th>Quantidade</th>
                                        <th>Percentual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${Object.entries(exemplaresPorCondicao).map(([condicao, count]) => `
                                        <tr>
                                            <td><strong>${condicao}</strong></td>
                                            <td>${count}</td>
                                            <td>${((count / exemplares.length) * 100).toFixed(1)}%</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        ${livrosPorEditora.length > 0 ? `
                        <div class="section">
                            <h2>🏢 Livros por Editora</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Posição</th>
                                        <th>Editora</th>
                                        <th>Quantidade de Livros</th>
                                        <th>Percentual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${livrosPorEditora.slice(0, 10).map((item, index) => `
                                        <tr>
                                            <td><strong>#${index + 1}</strong></td>
                                            <td>${item.editora.nome}</td>
                                            <td>${item.count}</td>
                                            <td>${((item.count / livros.length) * 100).toFixed(1)}%</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ` : ''}

                        ${atrasos.length > 0 ? `
                        <div class="section">
                            <h2>⚠️ Empréstimos Atrasados</h2>
                            <div class="alert-box">
                                <strong>Atenção:</strong> Existem ${atrasos.length} empréstimos em atraso que precisam de atenção imediata.
                            </div>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuário</th>
                                        <th>Livro</th>
                                        <th>Data Prevista</th>
                                        <th>Dias de Atraso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${atrasos.slice(0, 20).map(emprestimo => `
                                        <tr>
                                            <td><strong>#${emprestimo.id}</strong></td>
                                            <td>${emprestimo.nomeUsuario}</td>
                                            <td>${emprestimo.tituloLivro}</td>
                                            <td>${new Date(emprestimo.dataPrevistaDevolucao).toLocaleDateString('pt-BR')}</td>
                                            <td><strong style="color: #dc2626;">${emprestimo.diasAtraso} dias</strong></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ` : `
                        <div class="section">
                            <div class="success-box">
                                <strong>✅ Excelente!</strong> Não há empréstimos em atraso no momento.
                            </div>
                        </div>
                        `}

                        <div class="footer">
                            <p><strong>Yeti Library System</strong> - Relatório gerado automaticamente</p>
                            <p>Este relatório contém informações confidenciais e deve ser tratado com segurança.</p>
                            <p>Para mais informações, acesse o sistema administrativo.</p>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    if (loading) {
        return (
            <Layout
                pageTitle="Relatórios e Estatísticas"
                pageSubtitle="Análise completa do sistema de biblioteca"
                loading={true}
            >
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-xl text-gray-600">Carregando relatórios...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            pageTitle="Relatórios e Estatísticas"
            pageSubtitle="Análise completa do sistema de biblioteca"
            onRefresh={loadAllData}
            lastUpdate={new Date().toLocaleString('pt-BR')}
        >
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">

                    {/* Filtros */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-lg mb-8"
                    >
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex-1 min-w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📅 Período de Análise
                                </label>
                                <select
                                    value={periodoFiltro}
                                    onChange={(e) => setPeriodoFiltro(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                >
                                    <option value="7">Últimos 7 dias</option>
                                    <option value="30">Últimos 30 dias</option>
                                    <option value="90">Últimos 90 dias</option>
                                </select>
                            </div>

                            <div className="flex-1 min-w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📋 Tipo de Relatório
                                </label>
                                <select
                                    value={tipoRelatorio}
                                    onChange={(e) => setTipoRelatorio(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300"
                                >
                                    <option value="geral">Visão Geral</option>
                                    <option value="emprestimos">Empréstimos</option>
                                    <option value="usuarios">Usuários</option>
                                    <option value="livros">Livros</option>
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <RefreshButton onClick={loadAllData} text="Atualizar" />
                                <PrintButton onClick={exportarRelatorio} text="Imprimir" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Cards de Estatísticas */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-blue-600">{emprestimosPorPeriodo.length}</p>
                                    <p className="text-gray-600 font-medium">Empréstimos ({periodoFiltro}d)</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">📚</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-green-600">{emprestimos.filter(e => e.status === 'Emprestado' && !e.estaAtrasado).length}</p>
                                    <p className="text-gray-600 font-medium">Ativos</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">✅</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-red-600">{atrasos.length}</p>
                                    <p className="text-gray-600 font-medium">Atrasados</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-purple-600">{livros.length}</p>
                                    <p className="text-gray-600 font-medium">Livros</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">📖</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Relatórios Principais */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Livros Mais Emprestados */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-lg mb-4"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                🏆 Livros Mais Emprestados
                            </h2>
                            <div className="space-y-4 mx-auto">
                                {livrosMaisEmprestados.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.livro.titulo}</p>
                                                <p className="text-sm text-gray-600">{autores.find(a => a.id === item.livro.idAutor)?.nome || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                            {item.count}x
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Usuários Mais Ativos */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-lg mb-4"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                👥 Usuários Mais Ativos
                            </h2>
                            <div className="space-y-4">
                                {usuariosMaisAtivos.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-green-600">#{index + 1}</span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.usuario.nome}</p>
                                                <p className="text-sm text-gray-600">{item.usuario.email}</p>
                                            </div>
                                        </div>
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                                            {item.count}x
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Status dos Exemplares */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-lg mb-4"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                📊 Status dos Exemplares
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(exemplaresPorCondicao).map(([condicao, count]) => (
                                    <div key={condicao} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <span className="font-semibold text-gray-900">{condicao}</span>
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Livros por Editora */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                🏢 Livros por Editora
                            </h2>
                            <div className="space-y-4">
                                {livrosPorEditora.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-orange-600">#{index + 1}</span>
                                            <span className="font-semibold text-gray-900">{item.editora.nome}</span>
                                        </div>
                                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Relatório de Atrasos */}
                    {atrasos.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                ⚠️ Empréstimos Atrasados
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-red-50">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Usuário</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Livro</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Data Prevista</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">Dias Atraso</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {atrasos.slice(0, 10).map((emprestimo) => (
                                            <tr key={emprestimo.id} className="hover:bg-red-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                                                    #{emprestimo.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {emprestimo.nomeUsuario}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {emprestimo.tituloLivro}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(emprestimo.dataPrevistaDevolucao).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                                                        {emprestimo.diasAtraso} dias
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default GerenciarRelatorios;
