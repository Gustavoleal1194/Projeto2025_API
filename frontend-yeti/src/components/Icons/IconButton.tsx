import React from 'react';

interface IconButtonProps {
    onClick: () => void;
    title: string;
    className?: string;
    children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({
    onClick,
    title,
    className = '',
    children
}) => {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${className}`}
            title={title}
        >
            {children}
        </button>
    );
};

export default IconButton;
