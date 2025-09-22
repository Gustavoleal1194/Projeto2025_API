import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-yeti-brown-dark">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-yeti-blue-light focus:ring-yeti-blue-main focus:border-yeti-blue-main'
                    }
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-yeti-brown-dark">{helperText}</p>
            )}
        </div>
    );
};
