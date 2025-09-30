import React from 'react';
import { motion } from 'framer-motion';

interface ModalOverlayProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnOverlayClick?: boolean;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({
    isVisible,
    onClose,
    children,
    size = 'md',
    closeOnOverlayClick = true
}) => {
    if (!isVisible) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300"
            style={{
                left: 'var(--sidebar-width, 17.5rem)',
                top: '4.5rem'
            }}
            onClick={closeOnOverlayClick ? onClose : undefined}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`bg-white rounded-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default ModalOverlay;
