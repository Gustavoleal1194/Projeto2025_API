import React from 'react';
import styled from 'styled-components';

type Variant = 'primary' | 'neutral' | 'danger' | 'success';

interface FilterButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  title?: string;
  className?: string;
  variant?: Variant;
  type?: 'button' | 'submit' | 'reset';
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  disabled = false,
  children,
  title,
  className,
  variant = 'primary',
  type = 'button'
}) => {
  // Determinar o ícone baseado no texto do botão
  const getIcon = () => {
    if (typeof children === 'string') {
      const text = children.toLowerCase();
      if (text.includes('filtros') || text.includes('mostrar') || text.includes('ocultar')) {
        return '🔍';
      } else if (text.includes('limpar')) {
        return '🗑️';
      }
    }
    return '🔍'; // fallback
  };

  const icon = getIcon();

  const DefaultIcon = (
    <span className="icon-text">
      {icon === '🔍' ? '🔍' : icon === '🗑️' ? '🗑️' : '🔍'}
    </span>
  );

  return (
    <StyledWrapper className={className}>
      <button
        type={type}
        className="button"
        data-variant={variant}
        onClick={onClick}
        disabled={disabled}
        title={typeof children === 'string' ? children : title}
      >
        <span className="button__text">{children}</span>
        <span className="button__icon">
          {DefaultIcon}
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    /* base azul */
    --font-color: #ffffff;
    --bg-color: #2563eb;   /* blue-600 */
    --main-color: #1d4ed8; /* blue-700 */
    position: relative;
    width: 40px;
    height: 32px;
    padding: 0;
    border-radius: 8px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    color: var(--font-color);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px var(--main-color);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    overflow: hidden;
    font-size: 12px;
  }

  /* Esconder texto em mobile */
  .button .button__text {
    display: none;
  }

  .button .button__icon {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: var(--main-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button .icon-text {
    font-size: 16px;
    color: white;
    display: block;
  }

  /* Responsividade */
  @media (min-width: 640px) {
    .button {
      width: 180px;
      height: 40px;
      padding: 0 20px;
      border-radius: 10px;
      box-shadow: 4px 4px var(--main-color);
      font-size: 14px;
      justify-content: flex-start;
    }
    
    .button .button__text {
      display: block;
    }
    
    .button .button__icon {
      width: 44px;
      left: auto;
      right: 0;
    }
    
    .button .icon-text {
      font-size: 18px;
    }
  }

  .button[data-variant='neutral'] {
    --bg-color: #6b7280;   /* gray-500 */
    --main-color: #4b5563; /* gray-600 */
  }

  .button[data-variant='success'] {
    --bg-color: #10b981;   /* emerald-500 */
    --main-color: #059669; /* emerald-600 */
  }

  .button[data-variant='danger'] {
    --bg-color: #ef4444;   /* red-500 */
    --main-color: #dc2626; /* red-600 */
  }

  .button:hover:not(:disabled) {
    filter: brightness(0.95);
    transform: translate(-1px, -1px);
    box-shadow: 6px 6px var(--main-color);
  }

  .button:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 0 0 var(--main-color);
  }

  .button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default FilterButton;


