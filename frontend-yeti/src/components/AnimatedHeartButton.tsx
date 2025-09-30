import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHeartButtonProps {
    isFavorite: boolean;
    onToggle: () => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const AnimatedHeartButton: React.FC<AnimatedHeartButtonProps> = ({
    isFavorite,
    onToggle,
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-10 h-10 text-xl',
        lg: 'w-12 h-12 text-2xl'
    };

    return (
        <motion.button
            onClick={onToggle}
            className={`
        ${sizeClasses[size]}
        ${className}
        flex items-center justify-center
        rounded-full
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isFavorite
                    ? 'bg-white hover:bg-gray-100 text-red-500'
                    : 'bg-transparent hover:bg-red-50 border-2 border-red-500 text-red-500'
                }
      `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={false}
            animate={{
                scale: isFavorite ? [1, 1.2, 1] : 1,
            }}
            transition={{
                duration: 0.3,
                ease: "easeInOut"
            }}
        >
            <motion.div
                key={isFavorite ? 'filled' : 'outline'}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                }}
            >
                {isFavorite ? (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        💖
                    </motion.span>
                ) : (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        🤍
                    </motion.span>
                )}
            </motion.div>

            {/* Efeito de partículas quando adiciona aos favoritos */}
            {isFavorite && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-red-400 rounded-full"
                            initial={{
                                x: 0,
                                y: 0,
                                scale: 0,
                                opacity: 1
                            }}
                            animate={{
                                x: Math.cos(i * 60 * Math.PI / 180) * 30,
                                y: Math.sin(i * 60 * Math.PI / 180) * 30,
                                scale: [0, 1, 0],
                                opacity: [1, 0.8, 0]
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 0.1,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </motion.button>
    );
};

export default AnimatedHeartButton;
