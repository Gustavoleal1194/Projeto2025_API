import React from 'react';
import styled from 'styled-components';

interface LoginButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    text?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
    onClick,
    disabled = false,
    className,
    text = "Login"
}) => {
    return (
        <StyledWrapper className={className}>
            <button
                onClick={onClick}
                disabled={disabled}
                data-alt={text}
            >
                <i>L</i>
                <i>o</i>
                <i>g</i>
                <i>i</i>
                <i>n</i>
            </button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    position: relative;
    padding: 0 20px;
    font-size: 18px;
    text-transform: uppercase;
    border: 0;
    box-shadow: hsl(210deg 87% 36%) 0px 7px 0px 0px;
    background-color: hsl(210deg 100% 44%);
    border-radius: 12px;
    overflow: hidden;
    transition: 31ms cubic-bezier(.5, .7, .4, 1);
    cursor: pointer;
    width: 100%;
    min-width: 200px;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: hsl(210deg 87% 36%) 0px 4px 0px 0px;
  }

  button:before {
    content: attr(data-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
    font-size: 15px;
    font-weight: bold;
    color: white;
    letter-spacing: 4px;
    opacity: 1;
  }

  button:active:not(:disabled) {
    box-shadow: none;
    transform: translateY(7px);
    transition: 35ms cubic-bezier(.5, .7, .4, 1);
  }

  button:hover:not(:disabled):before {
    transition: all .0s;
    transform: translateY(100%);
    opacity: 0;
  }

  button i {
    color: white;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 4px;
    font-style: normal;
    transition: all 0.2s ease;
    transform: translateY(-20px);
    opacity: 0;
  }

  button:hover:not(:disabled) i {
    transition: all .2s ease;
    transform: translateY(0px);
    opacity: 1;
  }

  button:hover:not(:disabled) i:nth-child(1) {
    transition-delay: 0.045s;
  }

  button:hover:not(:disabled) i:nth-child(2) {
    transition-delay: calc(0.045s * 2);
  }

  button:hover:not(:disabled) i:nth-child(3) {
    transition-delay: calc(0.045s * 3);
  }

  button:hover:not(:disabled) i:nth-child(4) {
    transition-delay: calc(0.045s * 4);
  }

  button:hover:not(:disabled) i:nth-child(5) {
    transition-delay: calc(0.045s * 5);
  }`;

export default LoginButton;
