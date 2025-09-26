import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { NotificationData } from '../components/NotificationModal';

interface NotificationContextType {
    showNotification: (notification: Omit<NotificationData, 'duration'> & { duration?: number }) => void;
    hideNotification: () => void;
    notification: NotificationData | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationData | null>(null);

    const showNotification = (notificationData: Omit<NotificationData, 'duration'> & { duration?: number }) => {
        setNotification({
            ...notificationData,
            duration: notificationData.duration ?? 5000 // 5 segundos por padrão
        });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification, notification }}>
            {children}
        </NotificationContext.Provider>
    );
};
