import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-yeti-blue-main to-yeti-blue-light text-white hover:from-yeti-green-dark hover:to-yeti-green-light focus:ring-yeti-blue-main',
        secondary: 'bg-yeti-green-light text-white hover:bg-yeti-green-dark focus:ring-yeti-green-light',
        outline: 'border-2 border-yeti-blue-main text-yeti-blue-main hover:bg-yeti-blue-main hover:text-white focus:ring-yeti-blue-main',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="yeti-loading mr-2"></div>
                    Carregando...
                </div>
            ) : (
                children
            )}
        </button>
    );
};
