import React from 'react';
import styled from 'styled-components';

interface BookLoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const BookLoader: React.FC<BookLoaderProps> = ({ size = 'md', className = '' }) => {
    const sizeMultiplier = {
        sm: 0.7,
        md: 1,
        lg: 1.3
    };

    const multiplier = sizeMultiplier[size];

    return (
        <StyledWrapper className={className} $multiplier={multiplier}>
            <div className="book">
                <div className="book__pg-shadow" />
                <div className="book__pg" />
                <div className="book__pg book__pg--2" />
                <div className="book__pg book__pg--3" />
                <div className="book__pg book__pg--4" />
                <div className="book__pg book__pg--5" />
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div<{ $multiplier: number }>`
  .book,
  .book__pg-shadow,
  .book__pg {
    animation: cover 5s ease-in-out infinite;
  }
  .book {
    background-color: hsl(268, 90%, 65%);
    border-radius: ${props => 0.25 * props.$multiplier}em;
    box-shadow:
      0 ${props => 0.25 * props.$multiplier}em ${props => 0.5 * props.$multiplier}em hsla(0, 0%, 0%, 0.3),
      0 0 0 ${props => 0.25 * props.$multiplier}em hsl(278, 100%, 57%) inset;
    padding: ${props => 0.25 * props.$multiplier}em;
    perspective: ${props => 37.5 * props.$multiplier}em;
    position: relative;
    width: ${props => 8 * props.$multiplier}em;
    height: ${props => 6 * props.$multiplier}em;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;
  }
  .book__pg-shadow,
  .book__pg {
    position: absolute;
    left: ${props => 0.25 * props.$multiplier}em;
    width: calc(50% - ${props => 0.25 * props.$multiplier}em);
  }
  .book__pg-shadow {
    animation-name: shadow;
    background-image: linear-gradient(
      -45deg,
      hsla(0, 0%, 0%, 0) 50%,
      hsla(0, 0%, 0%, 0.3) 50%
    );
    filter: blur(${props => 0.25 * props.$multiplier}em);
    top: calc(100% - ${props => 0.25 * props.$multiplier}em);
    height: ${props => 3.75 * props.$multiplier}em;
    transform: scaleY(0);
    transform-origin: 100% 0%;
  }
  .book__pg {
    animation-name: pg1;
    background-color: hsl(223, 10%, 100%);
    background-image: linear-gradient(
      90deg,
      hsla(223, 10%, 90%, 0) 87.5%,
      hsl(223, 10%, 90%)
    );
    height: calc(100% - ${props => 0.5 * props.$multiplier}em);
    transform-origin: 100% 50%;
  }
  .book__pg--2,
  .book__pg--3,
  .book__pg--4 {
    background-image: repeating-linear-gradient(
        hsl(223, 10%, 10%) 0 ${props => 0.125 * props.$multiplier}em,
        hsla(223, 10%, 10%, 0) ${props => 0.125 * props.$multiplier}em ${props => 0.5 * props.$multiplier}em
      ),
      linear-gradient(90deg, hsla(223, 10%, 90%, 0) 87.5%, hsl(223, 10%, 90%));
    background-repeat: no-repeat;
    background-position: center;
    background-size:
      ${props => 2.5 * props.$multiplier}em ${props => 4.125 * props.$multiplier}em,
      100% 100%;
  }
  .book__pg--2 {
    animation-name: pg2;
  }
  .book__pg--3 {
    animation-name: pg3;
  }
  .book__pg--4 {
    animation-name: pg4;
  }
  .book__pg--5 {
    animation-name: pg5;
  }

  /* Dark theme */
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: hsl(223, 10%, 30%);
      --fg: hsl(223, 10%, 90%);
    }
  }

  /* Animations */
  @keyframes cover {
    from,
    5%,
    45%,
    55%,
    95%,
    to {
      animation-timing-function: ease-out;
      background-color: hsl(278, 84%, 67%);
    }
    10%,
    40%,
    60%,
    90% {
      animation-timing-function: ease-in;
      background-color: hsl(271, 90%, 45%);
    }
  }
  @keyframes shadow {
    from,
    10.01%,
    20.01%,
    30.01%,
    40.01% {
      animation-timing-function: ease-in;
      transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
    }
    5%,
    15%,
    25%,
    35%,
    45%,
    55%,
    65%,
    75%,
    85%,
    95% {
      animation-timing-function: ease-out;
      transform: translate3d(0, 0, 1px) scaleY(0.2) rotateY(90deg);
    }
    10%,
    20%,
    30%,
    40%,
    50%,
    to {
      animation-timing-function: ease-out;
      transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
    }
    50.01%,
    60.01%,
    70.01%,
    80.01%,
    90.01% {
      animation-timing-function: ease-in;
      transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
    }
    60%,
    70%,
    80%,
    90%,
    to {
      animation-timing-function: ease-out;
      transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
    }
  }
  @keyframes pg1 {
    from,
    to {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0.4deg);
    }
    10%,
    15% {
      animation-timing-function: ease-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(180deg);
    }
    20%,
    80% {
      animation-timing-function: ease-in;
      background-color: hsl(223, 10%, 45%);
      transform: translate3d(0, 0, 1px) rotateY(180deg);
    }
    85%,
    90% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(180deg);
    }
  }
  @keyframes pg2 {
    from,
    to {
      animation-timing-function: ease-in;
      background-color: hsl(223, 10%, 45%);
      transform: translate3d(0, 0, 1px) rotateY(0.3deg);
    }
    5%,
    10% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0.3deg);
    }
    20%,
    25% {
      animation-timing-function: ease-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(179.9deg);
    }
    30%,
    70% {
      animation-timing-function: ease-in;
      background-color: hsl(223, 10%, 45%);
      transform: translate3d(0, 0, 1px) rotateY(179.9deg);
    }
    75%,
    80% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(179.9deg);
    }
    90%,
    95% {
      animation-timing-function: ease-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0.3deg);
    }
  }
  @keyframes pg3 {
    from,
    10%,
    90%,
    to {
      animation-timing-function: ease-in;
      background-color: hsl(223, 10%, 45%);
      transform: translate3d(0, 0, 1px) rotateY(0.2deg);
    }
    15%,
    20% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0.2deg);
    }
    30%,
    35% {
      animation-timing-function: ease-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(179.8deg);
    }
    40%,
    60% {
      animation-timing-function: ease-in;
      background-color: hsl(223, 10%, 45%);
      transform: translate3d(0, 0, 1px) rotateY(179.8deg);
    }
    65%,
    70% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(179.8deg);
    }
    80%,
    85% {
      animation-timing-function: ease-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0.2deg);
    }
  }
  @keyframes pg4 {
    from,
    20%,
    80%,
    to {
      animation-timing-function: ease-in;
      background-color: hsl(223, 10%, 45%);
      transform: translate3d(0, 0, 1px) rotateY(0.1deg);
    }
    25%,
    30% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0.1deg);
    }
    40%,
    45% {
      animation-timing-function: ease-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(179.7deg);
    }
    50% {
      animation-timing-function: ease-in;
      background-color: hsl(223, 10%, 45%);
      transform: translate3d(0, 0, 1px) rotateY(179.7deg);
    }
    55%,
    60% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(179.7deg);
    }
    70%,
    75% {
      animation-timing-function: ease-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0.1deg);
    }
  }
  @keyframes pg5 {
    from,
    30%,
    70%,
    to {
      animation-timing-function: ease-in;
      background-color: hsl(223, 10%, 45%);
      transform: translate3d(0, 0, 1px) rotateY(0);
    }
    35%,
    40% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0deg);
    }
    50% {
      animation-timing-function: ease-in-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(179.6deg);
    }
    60%,
    65% {
      animation-timing-function: ease-out;
      background-color: hsl(223, 10%, 100%);
      transform: translate3d(0, 0, 1px) rotateY(0);
    }
  }
`;

export default BookLoader;