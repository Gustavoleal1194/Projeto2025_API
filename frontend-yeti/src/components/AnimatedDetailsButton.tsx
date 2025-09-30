import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedDetailsButtonProps {
    onClick: () => void;
    className?: string;
    children?: React.ReactNode;
}

const AnimatedDetailsButton: React.FC<AnimatedDetailsButtonProps> = ({
    onClick,
    className = '',
    children = '📖 Ver Detalhes'
}) => {
    return (
        <motion.button
            onClick={onClick}
            className={`
        px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
        text-sm font-medium transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        relative overflow-hidden
        ${className}
      `}
            whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Efeito de brilho que se move */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            {/* Conteúdo do botão */}
            <motion.span
                className="relative z-10 flex items-center gap-2"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.span>

            {/* Partículas flutuantes no hover */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: '50%',
                            y: '50%',
                            scale: 0,
                            opacity: 0
                        }}
                        whileHover={{
                            x: `${50 + (i - 1.5) * 20}%`,
                            y: `${50 + Math.sin(i) * 30}%`,
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                    />
                ))}
            </motion.div>
        </motion.button>
    );
};

export default AnimatedDetailsButton;
