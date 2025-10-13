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
    height: 40px;
    padding: 0 16px;
    border-radius: 10px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    color: var(--font-color);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px var(--main-color);
    transition: all 0.2s ease-in-out;
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


