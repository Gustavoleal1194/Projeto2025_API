import { useNotification } from '../contexts/NotificationContext';
import { ErrorMapper } from '../utils/errorMapper';

/**
 * HOOK DE NOTIFICAÇÕES - YETI LIBRARY SYSTEM
 * 
 * Hook personalizado para facilitar o uso das notificações
 * com métodos específicos para sucesso e erro
 */

export const useNotifications = () => {
    const { showNotification, hideNotification, notification } = useNotification();

    /**
     * Mostra notificação de sucesso
     */
    const showSuccess = (title: string, message: string, duration?: number) => {
        showNotification({
            type: 'success',
            title,
            message,
            duration: duration ?? 0 // Não fecha automaticamente - usuário deve fechar manualmente
        });
    };

    /**
     * Mostra notificação de erro
     */
    const showError = (title: string, message: string, duration?: number) => {
        showNotification({
            type: 'error',
            title,
            message,
            duration: duration ?? 0 // Não fecha automaticamente para erros
        });
    };

    /**
     * Mostra notificação de aviso
     */
    const showWarning = (title: string, message: string, duration?: number) => {
        showNotification({
            type: 'warning',
            title,
            message,
            duration: duration ?? 0 // Não fecha automaticamente
        });
    };

    /**
     * Mostra notificação de informação
     */
    const showInfo = (title: string, message: string, duration?: number) => {
        showNotification({
            type: 'info',
            title,
            message,
            duration: duration ?? 0 // Não fecha automaticamente
        });
    };

    /**
     * Trata erros de requisição HTTP automaticamente
     */
    const handleRequestError = (error: any, defaultMessage?: string) => {
        console.error('Erro na requisição:', error);

        // Se for um erro de fetch com status
        if (error.status) {
            const { title, message } = ErrorMapper.mapHttpError(error.status, error.message);
            showError(title, message);
            return;
        }

        // Se for um erro do backend mapeado
        if (error.message) {
            const { title, message } = ErrorMapper.mapBackendError(error);
            showError(title, message);
            return;
        }

        // Erro genérico
        showError(
            'Erro',
            defaultMessage || 'Ocorreu um erro inesperado. Tente novamente.'
        );
    };

    /**
     * Trata erros de validação do frontend
     */
    const handleValidationError = (error: Error) => {
        showError('Validação Falhou', error.message);
    };

    /**
     * Mostra sucesso para operações CRUD
     */
    const showCrudSuccess = (operation: 'create' | 'update' | 'delete', entity: string) => {
        const messages = {
            create: `Novo ${entity} criado com sucesso!`,
            update: `${entity} atualizado com sucesso!`,
            delete: `${entity} excluído com sucesso!`
        };

        showSuccess('Operação Realizada', messages[operation]);
    };

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideNotification,
        notification,
        handleRequestError,
        handleValidationError,
        showCrudSuccess
    };
};
