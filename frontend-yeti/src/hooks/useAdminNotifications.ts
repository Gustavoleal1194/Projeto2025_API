import { useState, useEffect, useCallback } from 'react';
import { emprestimoService } from '../services/emprestimoService';
import { livroService } from '../services/livroService';
import { usuarioService } from '../services/usuarioService';
import '../utils/debugNotifications'; // Importar debug

export interface AdminNotification {
    id: string;
    type: 'atraso' | 'vencimento' | 'novo' | 'usuario' | 'sistema' | 'solicitacao';
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    priority: 'high' | 'medium' | 'low';
    actionUrl?: string;
    data?: {
        exemplarId?: number;
        usuarioId?: number;
        livroTitulo?: string;
        nomeUsuario?: string;
    };
}

export const useAdminNotifications = () => {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    const unreadCount = notifications.filter(n => !n.read).length;

    // Carregar notificações salvas do localStorage
    const loadSavedNotifications = useCallback(() => {
        try {
            const saved = localStorage.getItem('yeti_admin_notifications');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((n: any) => ({
                    ...n,
                    createdAt: new Date(n.createdAt)
                }));
            }
        } catch (error) {
            console.error('Erro ao carregar notificações admin salvas:', error);
        }
        return [];
    }, []);

    // Salvar notificações no localStorage
    const saveNotifications = useCallback((newNotifications: AdminNotification[]) => {
        try {
            localStorage.setItem('yeti_admin_notifications', JSON.stringify(newNotifications));
        } catch (error) {
            console.error('Erro ao salvar notificações admin:', error);
        }
    }, []);

    // Carregar notificações do backend
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);

            // Carregar notificações salvas primeiro
            const savedNotifications = loadSavedNotifications();
            const existingIds = new Set(savedNotifications.map((n: AdminNotification) => n.id));

            const now = new Date();
            const newNotifications: AdminNotification[] = [...savedNotifications];

            // Carregar notificações de solicitações do localStorage
            const solicitacoesStorage = localStorage.getItem('yeti_solicitacoes');
            if (solicitacoesStorage) {
                try {
                    const solicitacoes = JSON.parse(solicitacoesStorage);
                    const solicitacoesPendentes = solicitacoes.filter((s: any) => s.status === 'pendente');

                    solicitacoesPendentes.forEach((solicitacao: any) => {
                        const notificationId = `solicitacao-${solicitacao.id}`;
                        if (!existingIds.has(notificationId)) {
                            console.log('🔍 Processando solicitação:', {
                                id: solicitacao.id,
                                nomeUsuario: solicitacao.nomeUsuario,
                                livroTitulo: solicitacao.livroTitulo
                            });

                            newNotifications.push({
                                id: notificationId,
                                type: 'solicitacao',
                                title: '📚 Nova Solicitação',
                                message: `"${solicitacao.livroTitulo}" solicitado por ${solicitacao.nomeUsuario}`,
                                read: false,
                                createdAt: new Date(solicitacao.dataSolicitacao),
                                priority: 'high',
                                actionUrl: '/gerenciar-emprestimos',
                                data: {
                                    exemplarId: solicitacao.exemplarId,
                                    usuarioId: solicitacao.usuarioId,
                                    livroTitulo: solicitacao.livroTitulo,
                                    nomeUsuario: solicitacao.nomeUsuario
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.warn('Erro ao carregar solicitações do localStorage:', error);
                }
            }

            // 1. Verificar empréstimos atrasados (todos os usuários)
            try {
                const emprestimosAtrasados = await emprestimoService.listarAtrasados();
                console.log('📚 Empréstimos atrasados encontrados:', emprestimosAtrasados.length);

                emprestimosAtrasados.forEach((emprestimo: any) => {
                    const notificationId = `admin-atraso-${emprestimo.id}`;
                    if (!existingIds.has(notificationId)) {
                        const dataVencimento = new Date(emprestimo.dataPrevistaDevolucao);
                        const hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const dataVencimentoNormalizada = new Date(dataVencimento.getFullYear(), dataVencimento.getMonth(), dataVencimento.getDate());
                        const diasAtraso = Math.ceil((hoje.getTime() - dataVencimentoNormalizada.getTime()) / (1000 * 60 * 60 * 24));

                        newNotifications.push({
                            id: notificationId,
                            type: 'atraso',
                            title: '🔴 Empréstimo Atrasado',
                            message: `"${emprestimo.tituloLivro}" está ${diasAtraso} dia${diasAtraso > 1 ? 's' : ''} atrasado (${emprestimo.nomeUsuario})`,
                            read: false,
                            createdAt: new Date(),
                            priority: 'high',
                            actionUrl: '/gerenciar-emprestimos'
                        });
                    }
                });
            } catch (error) {
                console.warn('Erro ao carregar empréstimos atrasados:', error);
            }

            // 2. Verificar empréstimos que vencem hoje (todos os usuários)
            try {
                const emprestimosAtivos = await emprestimoService.listarAtivos();
                console.log('📚 Empréstimos ativos encontrados:', emprestimosAtivos.length);

                emprestimosAtivos.forEach((emprestimo: any) => {
                    const dataVencimento = new Date(emprestimo.dataPrevistaDevolucao);
                    const hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const dataVencimentoNormalizada = new Date(dataVencimento.getFullYear(), dataVencimento.getMonth(), dataVencimento.getDate());
                    const diasAtraso = Math.ceil((hoje.getTime() - dataVencimentoNormalizada.getTime()) / (1000 * 60 * 60 * 24));

                    if (diasAtraso === 0) {
                        const notificationId = `admin-vencimento-hoje-${emprestimo.id}`;
                        if (!existingIds.has(notificationId)) {
                            newNotifications.push({
                                id: notificationId,
                                type: 'vencimento',
                                title: '🟠 Vence Hoje',
                                message: `"${emprestimo.tituloLivro}" vence hoje (${emprestimo.nomeUsuario})`,
                                read: false,
                                createdAt: new Date(),
                                priority: 'high',
                                actionUrl: '/gerenciar-emprestimos'
                            });
                        }
                    } else if (diasAtraso === -1) {
                        const notificationId = `admin-vencimento-amanha-${emprestimo.id}`;
                        if (!existingIds.has(notificationId)) {
                            newNotifications.push({
                                id: notificationId,
                                type: 'vencimento',
                                title: '🟡 Vence Amanhã',
                                message: `"${emprestimo.tituloLivro}" vence amanhã (${emprestimo.nomeUsuario})`,
                                read: false,
                                createdAt: new Date(),
                                priority: 'medium',
                                actionUrl: '/gerenciar-emprestimos'
                            });
                        }
                    }
                });
            } catch (error) {
                console.warn('Erro ao carregar empréstimos ativos:', error);
            }

            // 3. Verificar novos livros adicionados (últimos 7 dias)
            try {
                const novosLivros = await livroService.listar();
                const livrosRecentes = novosLivros.filter((livro: any) => {
                    const dataAdicao = new Date(livro.dataCriacao || '');
                    const diasDiferenca = Math.ceil((now.getTime() - dataAdicao.getTime()) / (1000 * 60 * 60 * 24));
                    return diasDiferenca <= 7;
                });

                if (livrosRecentes.length > 0 && !existingIds.has('admin-novos-livros')) {
                    newNotifications.push({
                        id: 'admin-novos-livros',
                        type: 'novo',
                        title: '🆕 Novos Livros',
                        message: `${livrosRecentes.length} novo${livrosRecentes.length > 1 ? 's' : ''} livro${livrosRecentes.length > 1 ? 's' : ''} adicionado${livrosRecentes.length > 1 ? 's' : ''} à biblioteca`,
                        read: false,
                        createdAt: new Date(),
                        priority: 'low',
                        actionUrl: '/gerenciar-livros'
                    });
                }
            } catch (error) {
                console.warn('Erro ao carregar novos livros:', error);
            }

            // 4. Verificar novos usuários (últimos 7 dias)
            try {
                const usuarios = await usuarioService.listar();
                const usuariosRecentes = usuarios.filter((usuario: any) => {
                    const dataCriacao = new Date(usuario.dataCriacao || '');
                    const diasDiferenca = Math.ceil((now.getTime() - dataCriacao.getTime()) / (1000 * 60 * 60 * 24));
                    return diasDiferenca <= 7;
                });

                if (usuariosRecentes.length > 0 && !existingIds.has('admin-novos-usuarios')) {
                    newNotifications.push({
                        id: 'admin-novos-usuarios',
                        type: 'usuario',
                        title: '👥 Novos Usuários',
                        message: `${usuariosRecentes.length} novo${usuariosRecentes.length > 1 ? 's' : ''} usuário${usuariosRecentes.length > 1 ? 's' : ''} cadastrado${usuariosRecentes.length > 1 ? 's' : ''}`,
                        read: false,
                        createdAt: new Date(),
                        priority: 'low',
                        actionUrl: '/gerenciar-usuarios'
                    });
                }
            } catch (error) {
                console.warn('Erro ao carregar usuários:', error);
            }

            // 5. Notificações do sistema (exemplo)
            if (Math.random() > 0.7 && !existingIds.has('admin-sistema-backup')) { // 30% de chance de aparecer
                newNotifications.push({
                    id: 'admin-sistema-backup',
                    type: 'sistema',
                    title: '💾 Backup Recomendado',
                    message: 'É recomendado fazer backup dos dados do sistema',
                    read: false,
                    createdAt: new Date(),
                    priority: 'medium',
                    actionUrl: '/configuracoes'
                });
            }

            // Ordenar por prioridade e data
            newNotifications.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                return b.createdAt.getTime() - a.createdAt.getTime();
            });

            console.log('🔔 Notificações de admin geradas:', newNotifications.length);
            console.log('📋 Lista de notificações admin:', newNotifications.map(n => ({ type: n.type, title: n.title, message: n.message })));

            // Debug específico para solicitações
            const solicitacoes = newNotifications.filter(n => n.type === 'solicitacao');
            if (solicitacoes.length > 0) {
                console.log('📚 Solicitações encontradas:', solicitacoes);
            }

            // Salvar notificações no localStorage
            saveNotifications(newNotifications);

            setNotifications(newNotifications);
            setLastCheck(now);
        } catch (error) {
            console.error('Erro ao carregar notificações de admin:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Marcar notificação como lida
    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => {
            const updated = prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            );
            saveNotifications(updated);
            return updated;
        });
    }, [saveNotifications]);

    // Marcar todas como lidas
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => {
            const updated = prev.map(notification => ({ ...notification, read: true }));
            saveNotifications(updated);
            return updated;
        });
    }, [saveNotifications]);

    // Remover notificação
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => {
            const updated = prev.filter(notification => notification.id !== id);
            saveNotifications(updated);
            return updated;
        });
    }, [saveNotifications]);

    // Adicionar notificação de solicitação de empréstimo
    const addSolicitacaoNotification = useCallback((data: {
        exemplarId: number;
        usuarioId: number;
        livroTitulo: string;
        nomeUsuario: string;
    }) => {
        const notification: AdminNotification = {
            id: `solicitacao-${data.exemplarId}-${data.usuarioId}-${Date.now()}`,
            type: 'solicitacao',
            title: '📚 Nova Solicitação',
            message: `"${data.livroTitulo}" solicitado por ${data.nomeUsuario}`,
            read: false,
            createdAt: new Date(),
            priority: 'high',
            actionUrl: '/gerenciar-emprestimos',
            data: data
        };

        setNotifications(prev => [notification, ...prev]);
    }, []);

    // Carregar notificações salvas na inicialização
    useEffect(() => {
        const savedNotifications = loadSavedNotifications();
        if (savedNotifications.length > 0) {
            setNotifications(savedNotifications);
            console.log('📱 Notificações admin carregadas do localStorage:', savedNotifications.length);
        }
    }, [loadSavedNotifications]);

    // Carregar notificações na inicialização
    useEffect(() => {

        loadNotifications();
    }, [loadNotifications]);

    // Escutar mudanças no localStorage para atualizar notificações
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'yeti_solicitacoes' && e.newValue) {
                console.log('🔄 Solicitações atualizadas no localStorage, recarregando notificações...');
                loadNotifications();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [loadNotifications]);

    // Escutar eventos de nova solicitação
    useEffect(() => {
        const handleNovaSolicitacao = (event: CustomEvent) => {
            const solicitacao = event.detail;
            addSolicitacaoNotification({
                exemplarId: solicitacao.exemplarId,
                usuarioId: solicitacao.usuarioId,
                livroTitulo: solicitacao.livroTitulo,
                nomeUsuario: solicitacao.nomeUsuario
            });
        };

        window.addEventListener('novaSolicitacao', handleNovaSolicitacao as EventListener);

        return () => {
            window.removeEventListener('novaSolicitacao', handleNovaSolicitacao as EventListener);
        };
    }, [addSolicitacaoNotification]);

    // Atualizar notificações a cada 3 minutos (mais frequente para admin)
    useEffect(() => {
        const interval = setInterval(() => {
            loadNotifications();
        }, 3 * 60 * 1000); // 3 minutos

        return () => clearInterval(interval);
    }, [loadNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        lastCheck,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
        addSolicitacaoNotification
    };
};
