import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface SolicitarEmprestimoButtonProps {
    exemplarId: number;
    livroTitulo: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    className?: string;
}

const SolicitarEmprestimoButton: React.FC<SolicitarEmprestimoButtonProps> = ({
    exemplarId,
    livroTitulo,
    onSuccess,
    onError,
    className
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRequested, setIsRequested] = useState(false);

    const handleSolicitar = async () => {
        try {
            setIsLoading(true);

            // Aqui você pode implementar a lógica de solicitação
            // Por enquanto, vou simular uma solicitação
            await new Promise(resolve => setTimeout(resolve, 1000));

            // TODO: Implementar chamada para API de solicitação
            // await emprestimoService.solicitarEmprestimo(exemplarId);

            console.log(`📚 Solicitação de empréstimo para: ${livroTitulo} (Exemplar: ${exemplarId})`);

            setIsRequested(true);
            onSuccess?.();

            // Reset após 3 segundos
            setTimeout(() => {
                setIsRequested(false);
            }, 3000);

        } catch (error) {
            console.error('Erro ao solicitar empréstimo:', error);
            onError?.(error instanceof Error ? error.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledWrapper className={className}>
            <motion.button
                className={`solicitar-btn ${isRequested ? 'requested' : ''}`}
                onClick={handleSolicitar}
                disabled={isLoading || isRequested}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
            >
                {isLoading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Solicitando...</span>
                    </div>
                ) : isRequested ? (
                    <div className="success-state">
                        <span className="check-icon">✓</span>
                        <span>Solicitado!</span>
                    </div>
                ) : (
                    <div className="normal-state">
                        <span className="book-icon">📚</span>
                        <span>Solicitar Empréstimo</span>
                    </div>
                )}
            </motion.button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .solicitar-btn {
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 32px;
  }

  .solicitar-btn:not(.requested) {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  .solicitar-btn:not(.requested):hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
    transform: translateY(-1px);
  }

  .solicitar-btn:not(.requested):active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  .solicitar-btn.requested {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  }

  .solicitar-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }

  .loading-spinner {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .spinner {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .success-state {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .check-icon {
    font-size: 14px;
    font-weight: bold;
  }

  .normal-state {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .book-icon {
    font-size: 14px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsividade */
  @media (max-width: 768px) {
    .solicitar-btn {
      font-size: 11px;
      padding: 6px 10px;
      min-height: 28px;
    }
  }
`;

export default SolicitarEmprestimoButton;
