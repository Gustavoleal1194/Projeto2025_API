import React from 'react';
import styled from 'styled-components';

type Variant = 'primary' | 'success';

interface PaginationButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    title?: string;
    className?: string;
    variant?: Variant;
    isActive?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
    onClick,
    disabled = false,
    children,
    title,
    className,
    variant = 'primary',
    isActive = false,
    type = 'button'
}) => {
    return (
        <StyledWrapper className={className}>
            <button
                type={type}
                className="button"
                data-variant={variant}
                data-active={isActive ? 'true' : 'false'}
                onClick={onClick}
                disabled={disabled}
                title={typeof children === 'string' ? children : title}
            >
                <span className="button__text">{children}</span>
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .button {
    /* base (azul) */
    --font-color: #ffffff;
    --bg-color-sub: #1d4ed8; /* blue-700 */
    --bg-color: #2563eb;     /* blue-600 */
    --main-color: #1d4ed8;   /* border/shadow */

    position: relative;
    height: 36px;
    min-width: 36px;
    padding: 0 14px;
    border-radius: 10px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    color: var(--font-color);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px var(--main-color);
    transition: all 0.2s ease-in-out;
  }

  /* variante verde */
  .button[data-variant='success'] {
    --bg-color-sub: #059669; /* emerald-600 */
    --bg-color: #10b981;     /* emerald-500 */
    --main-color: #059669;   /* emerald-600 */
  }

  /* estado ativo (página atual) */
  .button[data-active='true'] {
    filter: brightness(0.95);
    outline: 3px solid rgba(37, 99, 235, 0.25);
  }

  .button:hover:not(:disabled) {
    background-color: var(--bg-color-sub);
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px var(--main-color);
  }

  .button:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 0 0 var(--main-color);
  }

  .button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button__text {
    line-height: 1;
  }
`;

export default PaginationButton;


