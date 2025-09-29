import React from 'react';
import { BookLoader } from './';

interface LoadingSpinnerProps {
    type?: 'book' | 'circular' | 'dots';
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    type = 'book',
    size = 'md',
    text = 'Carregando...',
    className = ''
}) => {
    const renderLoader = () => {
        switch (type) {
            case 'book':
                return <BookLoader size={size} className={className} />;

            case 'circular':
                return (
                    <div className={`flex justify-center items-center ${className}`}>
                        <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'
                            }`} />
                    </div>
                );

            case 'dots':
                return (
                    <div className={`flex justify-center items-center space-x-1 ${className}`}>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                );

            default:
                return <BookLoader size={size} className={className} />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            {renderLoader()}
            {text && (
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {text}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
