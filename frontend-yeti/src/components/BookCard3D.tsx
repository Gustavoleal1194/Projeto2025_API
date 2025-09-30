import React from 'react';
import styled from 'styled-components';
import type { Livro } from '../types/entities';
import AnimatedHeartButton from './AnimatedHeartButton';

interface BookCard3DProps {
  livro: Livro;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onHover: (id: number | null) => void;
}

const BookCard3D: React.FC<BookCard3DProps> = ({
  livro,
  isFavorite,
  onToggleFavorite,
  onHover
}) => {

  return (
    <StyledWrapper livro={livro}>
      <div className="parent">
        <div
          className="card"
          onMouseEnter={() => onHover(livro.id)}
          onMouseLeave={() => onHover(null)}
          onClick={() => onToggleFavorite(livro.id)}
        >
          <div className="content-box">
            <span className="card-title">
              {livro.titulo.length > 20 ? `${livro.titulo.substring(0, 20)}...` : livro.titulo}
            </span>
            <p className="card-content">
              {livro.nomeAutor || 'Autor não informado'}
            </p>
            <p className="card-content">
              {livro.subtitulo || 'Subtítulo não informado'}
            </p>
            <div className="see-more">
              <AnimatedHeartButton
                isFavorite={isFavorite}
                onToggle={() => onToggleFavorite(livro.id)}
                size="sm"
                className="mx-auto"
              />
            </div>
          </div>
          <div className="date-box">
            <span className="month">{livro.genero?.toUpperCase() || 'GÊNERO'}</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ livro: Livro }>`
  .parent {
    width: 200px;
    height: 320px;
    padding: 10px;
    perspective: 1000px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 640px) {
    .parent {
      width: 180px;
      height: 280px;
      padding: 8px;
    }
  }

  @media (max-width: 480px) {
    .parent {
      width: 160px;
      height: 250px;
      padding: 6px;
    }
  }

  .card {
    padding-top: 20px;
    border: 3px solid #3b82f6;
    transform-style: preserve-3d;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 25%, #3b82f6 50%, #1e40af 75%, #3b82f6 100%),
      repeating-linear-gradient(45deg, #3b82f6 -6.25% 6.25%, #1e40af 0 18.75%);
    background-size: 60px 60px;
    background-position: 0 0, 0 0;
    background-color: #3b82f6;
    width: 100%;
    height: 100%;
    min-height: 100%;
    box-shadow: rgba(59, 130, 246, 0.4) 0px 30px 30px -10px;
    transition: all 0.5s ease-in-out;
    position: relative;
    cursor: pointer;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    background-position: -100px 100px, -100px 100px;
    transform: rotate3d(0.5, 1, 0, 30deg);
  }

  .content-box {
    background: ${props => props.livro.capaUrl
    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${props.livro.capaUrl}), linear-gradient(135deg, #3b82f6, #1e40af)`
    : 'rgba(4, 193, 250, 0.732)'
  };
    background-size: contain, contain, cover;
    background-position: center, center, center;
    background-repeat: no-repeat, no-repeat, no-repeat;
    transition: all 0.5s ease-in-out;
    padding: 20px 15px 15px 15px;
    transform-style: preserve-3d;
    height: calc(100% - 80px);
    min-height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    border-top: 3px solid #1e40af;
    border-bottom: 3px solid #1e40af;
    margin: 10px 0;
    flex: 1;
  }

  .content-box::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    height: 6px;
    background: linear-gradient(90deg, #3b82f6, #1e40af, #3b82f6);
    border-radius: 3px 3px 0 0;
  }

  .content-box::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: -3px;
    right: -3px;
    height: 6px;
    background: linear-gradient(90deg, #3b82f6, #1e40af, #3b82f6);
    border-radius: 0 0 3px 3px;
  }

  .content-box .card-title {
    display: inline-block;
    color: white;
    font-size: 16px;
    font-weight: 900;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 50px);
    line-height: 1.2;
    margin-bottom: 8px;
  }

  @media (max-width: 640px) {
    .content-box .card-title {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .content-box .card-title {
      font-size: 12px;
    }
  }

  .content-box .card-title:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .content-box .card-content {
    margin-top: 5px;
    font-size: 10px;
    font-weight: 700;
    color: #f2f2f2;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 30px);
    line-height: 1.3;
  }

  @media (max-width: 640px) {
    .content-box .card-content {
      font-size: 9px;
    }
  }

  @media (max-width: 480px) {
    .content-box .card-content {
      font-size: 8px;
    }
  }

  .content-box .card-content:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .content-box .see-more {
    margin-top: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 20px);
  }

  .content-box .see-more:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .date-box {
    position: absolute;
    top: 15px;
    right: 15px;
    height: auto;
    min-width: 60px;
    max-width: 100px;
    background: linear-gradient(135deg, #3b82f6, #1e40af);
    border: 2px solid #1e40af;
    padding: 8px 6px;
    transform: translate3d(0px, 0px, 80px);
    box-shadow: rgba(59, 130, 246, 0.4) 0px 17px 10px -10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .date-box span {
    display: block;
    text-align: center;
  }

  .date-box .month {
    color: white;
    font-size: 8px;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    text-align: center;
    line-height: 1.1;
    word-wrap: break-word;
    hyphens: auto;
  }

  @media (max-width: 640px) {
    .date-box .month {
      font-size: 7px;
    }
  }

  @media (max-width: 480px) {
    .date-box .month {
      font-size: 6px;
    }
  }

`;

export default BookCard3D;
