import React from 'react';
import { BookLoader } from './';

interface LoadingOverlayProps {
    isVisible: boolean;
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isVisible,
    text = 'Carregando...',
    size = 'lg'
}) => {
    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300"
            style={{
                left: 'var(--sidebar-width, 17.5rem)',
                top: '4.5rem'
            }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl">
                <div className="flex flex-col items-center space-y-4">
                    <BookLoader size={size} />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
