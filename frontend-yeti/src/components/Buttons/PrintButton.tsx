import React from 'react';
import styled from 'styled-components';

interface PrintButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  text?: string;
  title?: string;
  className?: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({
  onClick,
  disabled = false,
  text = 'Print',
  title,
  className
}) => {
  return (
    <StyledWrapper className={className}>
      <button className="print-btn" onClick={onClick} disabled={disabled} title={title || text}>
        <span className="printer-wrapper">
          <span className="printer-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 92 75">
              <path strokeWidth={5} stroke="black" d="M12 37.5H80C85.2467 37.5 89.5 41.7533 89.5 47V69C89.5 70.933 87.933 72.5 86 72.5H6C4.067 72.5 2.5 70.933 2.5 69V47C2.5 41.7533 6.75329 37.5 12 37.5Z" />
              <mask fill="white" id="path-2-inside-1_30_7">
                <path d="M12 12C12 5.37258 17.3726 0 24 0H57C70.2548 0 81 10.7452 81 24V29H12V12Z" />
              </mask>
              <path mask="url(#path-2-inside-1_30_7)" fill="black" d="M7 12C7 2.61116 14.6112 -5 24 -5H57C73.0163 -5 86 7.98374 86 24H76C76 13.5066 67.4934 5 57 5H24C20.134 5 17 8.13401 17 12H7ZM81 29H12H81ZM7 29V12C7 2.61116 14.6112 -5 24 -5V5C20.134 5 17 8.13401 17 12V29H7ZM57 -5C73.0163 -5 86 7.98374 86 24V29H76V24C76 13.5066 67.4934 5 57 5V-5Z" />
              <circle fill="black" r={3} cy={49} cx={78} />
            </svg>
          </span>
          <span className="printer-page-wrapper">
            <span className="printer-page" />
          </span>
        </span>
        {text}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .print-btn {
    width: 40px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #16a34a; /* green-600 */
    border: 2px solid #15803d; /* green-700 */
    border-radius: 8px;
    gap: 0;
    font-size: 12px;
    color: #ffffff;
    cursor: pointer;
    overflow: hidden;
    font-weight: 600;
    box-shadow: 3px 3px #15803d; /* sombra verde */
    transition: all 0.3s;
  }

  /* Esconder texto em mobile */
  .print-btn span:not(.printer-wrapper) {
    display: none;
  }

  /* Responsividade */
  @media (min-width: 640px) {
    .print-btn {
      width: 150px;
      height: 40px;
      border-radius: 10px;
      gap: 10px;
      font-size: 16px;
      box-shadow: 4px 4px #15803d;
    }
    
    .print-btn span:not(.printer-wrapper) {
      display: block;
    }
  }
  .printer-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 100%;
  }
  .printer-container {
    height: 50%;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .printer-container svg {
    width: 100%;
    height: auto;
    transform: translateY(4px);
  }
  .printer-container svg path { stroke: #ffffff; fill: #ffffff; }
  .printer-container svg circle { fill: #ffffff; }
  .printer-page-wrapper {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .printer-page {
    width: 70%;
    height: 10px;
    border: 1px solid #ffffff;
    background-color: #ffffff;
    transform: translateY(0px);
    transition: all 0.3s;
    transform-origin: top;
  }
  .print-btn:hover .printer-page {
    height: 16px;
    background-color: #dcfce7; /* green-100 */
  }
  .print-btn:hover {
    background-color: #15803d; /* green-700 */
  }`;

export default PrintButton;


