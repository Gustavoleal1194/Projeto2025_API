import React from 'react';
import styled from 'styled-components';

type ColorVariant = 'blue' | 'green';

interface ActionButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    text: string;
    title?: string;
    className?: string;
    icon?: React.ReactNode;
    color?: ColorVariant;
    type?: 'button' | 'submit' | 'reset';
}

const palette = {
    blue: { base: '#2563eb', hover: '#1d4ed8', border: '#1d4ed8' },
    green: { base: '#16a34a', hover: '#15803d', border: '#15803d' }
};

const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    disabled = false,
    text,
    title,
    className,
    icon = '➕',
    color = 'blue',
    type = 'button'
}) => {
    const colors = palette[color];
    return (
        <StyledWrapper className={className} data-base={colors.base} data-hover={colors.hover} data-border={colors.border}>
            <button type={type} className="action-btn" onClick={onClick} disabled={disabled} title={title || text}>
                <span className="action-text">{text}</span>
                <span className="action-icon">{icon}</span>
            </button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .action-btn {
    min-width: 40px;
    width: 40px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: attr(data-base color, #2563eb);
    border: 2px solid attr(data-border color, #1d4ed8);
    border-radius: 8px;
    gap: 0;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
    overflow: hidden;
    font-weight: 600;
    box-shadow: 3px 3px attr(data-border color, #1d4ed8);
    transition: all 0.25s ease;
    padding: 0;
  }

  /* Esconder texto em mobile */
  .action-text {
    display: none;
  }

  /* Responsividade */
  @media (min-width: 640px) {
    .action-btn {
      min-width: 180px;
      width: auto;
      height: 44px;
      border-radius: 10px;
      gap: 10px;
      font-size: 16px;
      box-shadow: 4px 4px attr(data-border color, #1d4ed8);
      padding: 0 18px;
    }
    
    .action-text {
      display: block;
    }
  }

  .action-btn:hover { background-color: attr(data-hover color, #1d4ed8); }
  .action-btn:disabled { opacity: .6; cursor: not-allowed; }
  .action-text { text-align: center; }
  .action-icon { display: inline-flex; align-items: center; justify-content: center; }
`;

export default ActionButton;



