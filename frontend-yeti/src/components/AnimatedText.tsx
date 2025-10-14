import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface AnimatedTextProps {
    text: string;
    className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "" }) => {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationKey(prev => prev + 1);
        }, 3000); // Repete a cada 3 segundos

        return () => clearInterval(interval);
    }, []);

    return (
        <StyledWrapper className={className}>
            <div className="animated-text" data-text={text} key={animationKey}>
                <span className="actual-text">&nbsp;{text}&nbsp;</span>
                <span
                    aria-hidden="true"
                    className="hover-text animate"
                >
                    &nbsp;{text}&nbsp;
                </span>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .animated-text {
        --border-right: 6px;
        --text-stroke-color: rgba(59, 130, 246, 0.6);
        --animation-color: #3b82f6;
        --fs-size: 1.125rem;
        letter-spacing: 1px;
        text-decoration: none;
        font-size: var(--fs-size);
        font-family: "Source Sans Pro", sans-serif;
        position: relative;
        text-transform: uppercase;
        color: transparent;
        -webkit-text-stroke: 1px var(--text-stroke-color);
        font-weight: 700;
        display: inline-block;
        white-space: nowrap;
        overflow: visible;
    }

    .actual-text {
        display: inline-block;
    }

    .hover-text {
        position: absolute;
        box-sizing: border-box;
        content: attr(data-text);
        color: var(--animation-color);
        width: 0%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-right: var(--border-right) solid var(--animation-color);
        overflow: hidden;
        transition: width 1.5s ease-in-out;
        -webkit-text-stroke: 1px var(--animation-color);
        white-space: nowrap;
    }

    @keyframes textFill {
        0% {
            width: 0%;
        }
        100% {
            width: 100%;
        }
    }

    .hover-text.animate {
        width: 100%;
        filter: drop-shadow(0 0 8px var(--animation-color));
        animation: textFill 1.5s ease-in-out forwards;
    }


    /* Dark mode colors */
    .dark & .animated-text {
        --text-stroke-color: rgba(96, 165, 250, 0.6);
        --animation-color: #60a5fa;
    }
`;

export default AnimatedText;
