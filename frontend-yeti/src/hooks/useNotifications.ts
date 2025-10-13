import { useState, useEffect, useCallback } from 'react';
import meusLivrosService from '../services/meusLivrosService';
import { livroService } from '../services/livroService';
import { useNotification } from '../contexts/NotificationContext';

export interface Notification {
    id: string;
    type: 'atraso' | 'vencimento' | 'novo' | 'reserva' | 'sistema';
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    priority: 'high' | 'medium' | 'low';
    actionUrl?: string;
}

export const useNotificationSystem = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    const unreadCount = notifications.filter(n => !n.read).length;

    // Carregar notificações salvas do localStorage
    const loadSavedNotifications = useCallback(() => {
        try {
            const saved = localStorage.getItem('yeti_user_notifications');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((n: any) => ({
                    ...n,
                    createdAt: new Date(n.createdAt)
                }));
            }
        } catch (error) {
            console.error('Erro ao carregar notificações salvas:', error);
        }
        return [];
    }, []);

    // Salvar notificações no localStorage
    const saveNotifications = useCallback((newNotifications: Notification[]) => {
        try {
            localStorage.setItem('yeti_user_notifications', JSON.stringify(newNotifications));
        } catch (error) {
            console.error('Erro ao salvar notificações:', error);
        }
    }, []);

    // Carregar notificações do backend
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);

            // Carregar notificações salvas primeiro
            const savedNotifications = loadSavedNotifications();
            const existingIds = new Set(savedNotifications.map((n: Notification) => n.id));

            // Buscar empréstimos do usuário
            const meusLivros = await meusLivrosService.listarMeusLivros();
            const now = new Date();

            // Começar com as notificações salvas (preservando estado)
            const newNotifications: Notification[] = [...savedNotifications];

            // Filtrar apenas empréstimos ativos (não devolvidos)
            const emprestimosAtivos = meusLivros.filter((meuLivro: any) =>
                meuLivro.status === 'Emprestado' || meuLivro.status === 'Atrasado'
            );

            console.log('📚 Verificando notificações para', emprestimosAtivos.length, 'empréstimos ativos de', meusLivros.length, 'total');

            emprestimosAtivos.forEach((meuLivro: any) => {
                if (meuLivro.dataPrevistaDevolucao) {
                    // Normalizar datas para comparar apenas o dia (sem horário)
                    const hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const dataVencimento = new Date(meuLivro.dataPrevistaDevolucao);
                    const dataVencimentoNormalizada = new Date(dataVencimento.getFullYear(), dataVencimento.getMonth(), dataVencimento.getDate());

                    // Calcular diferença em dias (positivo = atrasado, negativo = ainda não venceu)
                    const diasAtraso = Math.ceil((hoje.getTime() - dataVencimentoNormalizada.getTime()) / (1000 * 60 * 60 * 24));

                    console.log(`📖 ${meuLivro.titulo}:`, {
                        dataVencimento: dataVencimento.toLocaleDateString('pt-BR'),
                        hoje: hoje.toLocaleDateString('pt-BR'),
                        diasAtraso,
                        status: meuLivro.status
                    });

                    if (diasAtraso > 0) {
                        // Livro atrasado
                        const notificationId = `atraso-${meuLivro.emprestimoId}`;
                        if (!existingIds.has(notificationId)) {
                            console.log(`🔴 Livro atrasado: ${meuLivro.titulo} (${diasAtraso} dias)`);
                            newNotifications.push({
                                id: notificationId,
                                type: 'atraso',
                                title: '🔴 Livro Atrasado',
                                message: `"${meuLivro.titulo}" está ${diasAtraso} dia${diasAtraso > 1 ? 's' : ''} atrasado`,
                                read: false,
                                createdAt: new Date(),
                                priority: 'high',
                                actionUrl: '/meus-emprestimos'
                            });
                        }
                    } else if (diasAtraso === 0) {
                        // Vence hoje
                        const notificationId = `vencimento-hoje-${meuLivro.emprestimoId}`;
                        if (!existingIds.has(notificationId)) {
                            console.log(`🟠 Vence hoje: ${meuLivro.titulo}`);
                            newNotifications.push({
                                id: notificationId,
                                type: 'vencimento',
                                title: '🟠 Vence Hoje',
                                message: `"${meuLivro.titulo}" vence hoje!`,
                                read: false,
                                createdAt: new Date(),
                                priority: 'high',
                                actionUrl: '/meus-emprestimos'
                            });
                        }
                    } else if (diasAtraso === -1) {
                        // Vence amanhã
                        const notificationId = `vencimento-amanha-${meuLivro.emprestimoId}`;
                        if (!existingIds.has(notificationId)) {
                            console.log(`🟡 Vence amanhã: ${meuLivro.titulo}`);
                            newNotifications.push({
                                id: notificationId,
                                type: 'vencimento',
                                title: '🟡 Vence Amanhã',
                                message: `"${meuLivro.titulo}" vence amanhã!`,
                                read: false,
                                createdAt: new Date(),
                                priority: 'high',
                                actionUrl: '/meus-emprestimos'
                            });
                        }
                    } else if (diasAtraso === -2) {
                        // Vence em 2 dias
                        const notificationId = `vencimento-2dias-${meuLivro.emprestimoId}`;
                        if (!existingIds.has(notificationId)) {
                            console.log(`🟡 Vence em 2 dias: ${meuLivro.titulo}`);
                            newNotifications.push({
                                id: notificationId,
                                type: 'vencimento',
                                title: '🟡 Vencimento Próximo',
                                message: `"${meuLivro.titulo}" vence em 2 dias`,
                                read: false,
                                createdAt: new Date(),
                                priority: 'medium',
                                actionUrl: '/meus-emprestimos'
                            });
                        }
                    }
                }
            });

            // Verificar novos livros (últimos 7 dias)
            try {
                const novosLivros = await livroService.listar();
                const livrosRecentes = novosLivros.filter((livro: any) => {
                    const dataAdicao = new Date(livro.dataCriacao || '');
                    const diasDiferenca = Math.ceil((now.getTime() - dataAdicao.getTime()) / (1000 * 60 * 60 * 24));
                    return diasDiferenca <= 7;
                });

                if (livrosRecentes.length > 0 && !existingIds.has('novos-livros')) {
                    newNotifications.push({
                        id: 'novos-livros',
                        type: 'novo',
                        title: '🆕 Novos Livros',
                        message: `${livrosRecentes.length} novo${livrosRecentes.length > 1 ? 's' : ''} livro${livrosRecentes.length > 1 ? 's' : ''} adicionado${livrosRecentes.length > 1 ? 's' : ''} à biblioteca`,
                        read: false,
                        createdAt: new Date(),
                        priority: 'low',
                        actionUrl: '/explorar-livros'
                    });
                }
            } catch (error) {
                console.warn('Erro ao carregar novos livros:', error);
            }

            // Notificações do sistema (exemplo)
            if (Math.random() > 0.8) { // 20% de chance de aparecer
                newNotifications.push({
                    id: 'sistema-manutencao',
                    type: 'sistema',
                    title: '⚙️ Manutenção Programada',
                    message: 'Sistema será atualizado hoje às 23:00',
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

            console.log('🔔 Notificações geradas:', newNotifications.length);
            console.log('📋 Lista de notificações:', newNotifications.map(n => ({ type: n.type, title: n.title, message: n.message })));

            // Salvar notificações no localStorage
            saveNotifications(newNotifications);

            setNotifications(newNotifications);
            setLastCheck(now);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
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

    // Carregar notificações salvas na inicialização
    useEffect(() => {
        const savedNotifications = loadSavedNotifications();
        if (savedNotifications.length > 0) {
            setNotifications(savedNotifications);
            console.log('📱 Notificações carregadas do localStorage:', savedNotifications.length);
        }
    }, [loadSavedNotifications]);

    // Carregar notificações na inicialização
    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // Atualizar notificações a cada 5 minutos
    useEffect(() => {
        const interval = setInterval(() => {
            loadNotifications();
        }, 5 * 60 * 1000); // 5 minutos

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
        removeNotification
    };
};

// Export do hook antigo para compatibilidade (usado nas páginas de gerenciamento)
export const useNotifications = () => {
    const { showNotification } = useNotification();

    return {
        handleRequestError: (error: any, message?: string) => {
            console.error('Erro na requisição:', error);
            showNotification({
                type: 'error',
                title: 'Erro',
                message: message || 'Ocorreu um erro na operação',
                duration: 5000
            });
        },
        showCrudSuccess: (action: string, entity?: string) => {
            const actionText = action === 'create' ? 'criado' :
                action === 'update' ? 'atualizado' :
                    action === 'delete' ? 'removido' : 'processado';

            showNotification({
                type: 'success',
                title: 'Sucesso!',
                message: `${entity || 'Item'} ${actionText} com sucesso!`,
                duration: 3000
            });
        }
    };
};