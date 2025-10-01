import React from 'react';
import styled from 'styled-components';

interface RefreshButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  text?: string;
  title?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  variant?: 'primary' | 'success';
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  disabled = false,
  text = 'Atualizar',
  title,
  className,
  type = 'button',
  icon,
  variant = 'primary'
}) => {
  const DefaultIcon = (
    <svg className="svg" height={48} viewBox="0 0 48 48" width={48} xmlns="http://www.w3.org/2000/svg">
      <path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z" />
      <path d="M0 0h48v48h-48z" fill="none" />
    </svg>
  );

  return (
    <StyledWrapper className={className}>
      {/* O atributo data-variant está corretamente aqui */}
      <button type={type} className="button" data-variant={variant} onClick={onClick} disabled={disabled} title={title || text}>
        <span className="button__text">{text}</span>
        <span className="button__icon">
          {icon ?? DefaultIcon}
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Estilos Padrão (Azul) - Se nenhum data-variant for definido ou for 'primary' */
  .button {
    /* Paleta azul do projeto (Padrão) */
    --font-color: #ffffff; /* texto branco */
    --bg-color-sub: #1d4ed8; /* blue-700 */
    --bg-color: #2563eb; /* blue-600 */
    --main-color: #1d4ed8; /* usado para borda/sombra e ícone */
    
    position: relative;
    width: 150px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    
    /* Usando as variáveis definidas */
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    background-color: var(--bg-color);
    
    border-radius: 10px;
    overflow: hidden;
    padding-right: 44px; /* reserva espaço do ícone à direita */
  }

  /* 🎯 MODIFICAÇÃO PRINCIPAL: Estilos para a variante 'success' (Verde) */
  .button[data-variant="success"] {
    /* Paleta verde (Ex: Tailwind Emerald) */
    --bg-color-sub: #059669; /* emerald-600 - para hover e área do ícone */
    --bg-color: #10b981; /* emerald-500 - cor principal */
    --main-color: #059669; /* emerald-600 - para borda/sombra */
  }

  /* Os estilos restantes usam as variáveis de cor, então funcionarão */
  /* corretamente para azul e verde */

  .button, .button__icon, .button__text {
    transition: all 0.3s;
  }

  .button .button__text {
    color: var(--font-color);
    font-weight: 600;
    width: 100%;
    text-align: center;
  }

  .button .button__icon {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 44px;
    background-color: var(--bg-color-sub);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button .svg {
    width: 22px;
    height: 22px;
    display: block;
    fill: #ffffff; 
  }

  .button:hover {
    background: var(--bg-color-sub);
  }

  .button:hover .button__text {
    color: transparent;
  }

  .button:hover .button__icon {
    left: 0; 
    right: 0;
    width: 100%;
  }

  .button:active {
    transform: translate(3px, 3px);
    box-shadow: 0px 0px var(--main-color);
  }
`;

export default RefreshButton;