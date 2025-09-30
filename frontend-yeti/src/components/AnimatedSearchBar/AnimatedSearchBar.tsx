import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface AnimatedSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    placeholder?: string;
    className?: string;
}

const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
    searchQuery,
    setSearchQuery,
    placeholder = "Buscar na estante...",
    className
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        setIsExpanded(true);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    const handleBlur = () => {
        if (!searchQuery.trim()) {
            setIsExpanded(false);
        }
    };

    return (
        <StyledWrapper className={className}>
            <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
                <div className="search-icon" onClick={handleClick}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={handleBlur}
                    className="search-input"
                />
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .search-container {
    position: relative;
    width: 48px;
    height: 48px;
    background: white;
    border-radius: 24px;
    border: 2px solid #60a5fa;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .search-container:hover {
    border-color: #10b981;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    transform: translateY(-1px);
  }

  .search-container.expanded {
    width: 100%;
    border-color: #10b981;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    transform: translateY(-2px);
    cursor: default;
  }

  .search-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #3b82f6;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-container.expanded .search-icon {
    left: 12px;
    color: #10b981;
    transform: translateY(-50%) scale(1.1);
  }

  .search-input {
    width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-size: 16px;
    color: #374151;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
  }

  .search-container.expanded .search-input {
    width: calc(100% - 48px);
    padding: 0 16px 0 48px;
    opacity: 1;
  }

  .search-input::placeholder {
    color: #9ca3af;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .search-container.expanded .search-input::placeholder {
    color: #6b7280;
  }

  /* Animação de pulso no ícone quando expandido */
  .search-container.expanded .search-icon {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* Efeito de onda no container quando expandido */
  .search-container.expanded::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ripple 0.6s ease-out;
  }

  @keyframes ripple {
    to {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
`;

export default AnimatedSearchBar;
