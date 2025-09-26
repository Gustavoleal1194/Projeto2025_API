import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NotificationData {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number; // em milissegundos, 0 = não fecha automaticamente
}

interface NotificationModalProps {
    notification: NotificationData | null;
    onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose }) => {
    // Fechar automaticamente após a duração especificada
    React.useEffect(() => {
        if (notification && notification.duration && notification.duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, notification.duration);

            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    // Fechar com a tecla ESC
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && notification) {
                onClose();
            }
        };

        if (notification) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [notification, onClose]);

    const getIcon = () => {
        switch (notification?.type) {
            case 'success':
                return (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'warning':
                return (
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                );
            case 'info':
                return (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const getColors = () => {
        switch (notification?.type) {
            case 'success':
                return {
                    bg: 'bg-white',
                    border: 'border-green-500',
                    title: 'text-green-800',
                    message: 'text-gray-700',
                    close: 'text-gray-400 hover:text-gray-600',
                    button: 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                };
            case 'error':
                return {
                    bg: 'bg-white',
                    border: 'border-red-500',
                    title: 'text-red-800',
                    message: 'text-gray-700',
                    close: 'text-gray-400 hover:text-gray-600',
                    button: 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                };
            case 'warning':
                return {
                    bg: 'bg-white',
                    border: 'border-yellow-500',
                    title: 'text-yellow-800',
                    message: 'text-gray-700',
                    close: 'text-gray-400 hover:text-gray-600',
                    button: 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600'
                };
            case 'info':
                return {
                    bg: 'bg-white',
                    border: 'border-blue-500',
                    title: 'text-blue-800',
                    message: 'text-gray-700',
                    close: 'text-gray-400 hover:text-gray-600',
                    button: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                };
            default:
                return {
                    bg: 'bg-white',
                    border: 'border-gray-500',
                    title: 'text-gray-800',
                    message: 'text-gray-700',
                    close: 'text-gray-400 hover:text-gray-600',
                    button: 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600'
                };
        }
    };

    if (!notification) return null;

    const colors = getColors();

    return (
        <AnimatePresence>
            {/* Backdrop escuro */}
            <div
                className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`max-w-lg w-full ${colors.bg} ${colors.border} border-2 rounded-xl shadow-2xl p-6`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>
                        <div className="ml-4 w-0 flex-1">
                            <h3 className={`text-lg font-semibold ${colors.title}`}>
                                {notification.title}
                            </h3>
                            <div className={`mt-2 text-base ${colors.message}`}>
                                <p>{notification.message}</p>
                            </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                type="button"
                                className={`inline-flex ${colors.close} transition-colors duration-200 hover:scale-110`}
                                onClick={onClose}
                            >
                                <span className="sr-only">Fechar</span>
                                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Botão de fechar mais proeminente */}
                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-6 py-2 ${colors.button} border-2 rounded-lg font-medium transition-all duration-200 hover:scale-105`}
                        >
                            Fechar
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default NotificationModal;
