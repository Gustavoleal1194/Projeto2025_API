import React from 'react';
import styled from 'styled-components';
import type { LivroResumido } from '../services/explorarLivrosService';

interface BookDetailsCardProps {
  livro: LivroResumido;
  isVisible: boolean;
  onClose: () => void;
}

const BookDetailsCard: React.FC<BookDetailsCardProps> = ({
  livro,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <StyledWrapper>
      <div className="modal-overlay" onClick={onClose}>
        <div className="flip-card" onClick={(e) => e.stopPropagation()}>
          <div className="flip-card-inner">
            {/* Frente - Capa do Livro */}
            <div className="flip-card-front">
              <div className="book-cover">
                {livro.capaUrl ? (
                  <img
                    src={livro.capaUrl}
                    alt={livro.titulo}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="placeholder-cover">
                    <h3>{livro.titulo}</h3>
                    <p>{livro.nomeAutor}</p>
                  </div>
                )}
              </div>
              <p className="title">📚 {livro.titulo}</p>
              <p>Hover para ver detalhes</p>
            </div>

            {/* Verso - Detalhes do Livro */}
            <div className="flip-card-back">
              <p className="title">📖 DETALHES</p>
              <div className="book-details">
                <p><strong>Autor:</strong> {livro.nomeAutor}</p>
                <p><strong>Gênero:</strong> {livro.genero}</p>
                <p><strong>Ano:</strong> {livro.ano}</p>
                <p><strong>Editora:</strong> {livro.nomeEditora}</p>
                <p><strong>Páginas:</strong> {livro.numeroPaginas || 'N/A'}</p>
                <p><strong>Exemplares:</strong> {livro.exemplaresDisponiveis}/{livro.totalExemplares}</p>
                <p><strong>Status:</strong> {livro.temExemplaresDisponiveis ? 'Disponível' : 'Indisponível'}</p>
                <p><strong>Sinopse:</strong></p>
                <p className="sinopse">{livro.sinopse}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .modal-overlay {
    position: fixed;
    top: 4.5rem; /* marginTop do main */
    left: var(--sidebar-width, 17.5rem); /* marginLeft do main */
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
    transition: left 0.3s ease;
  }

  .flip-card {
    background-color: transparent;
    width: 300px;
    height: 400px;
    perspective: 1000px;
    font-family: sans-serif;
  }

  .title {
    font-size: 1.2em;
    font-weight: 900;
    text-align: center;
    margin: 0.5em 0;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front, .flip-card-back {
    box-shadow: 0 8px 14px 0 rgba(59, 130, 246, 0.3);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border: 2px solid #3b82f6;
    border-radius: 1rem;
    padding: 1rem;
  }

  .flip-card-front {
    background: linear-gradient(120deg, #dbeafe 60%, #bfdbfe 88%,
       #93c5fd 40%, rgba(59, 130, 246, 0.6) 48%);
    color: #1e40af;
  }

  .flip-card-back {
    background: linear-gradient(120deg, #3b82f6 30%, #1e40af 88%,
       #1d4ed8 40%, #2563eb 78%);
    color: white;
    transform: rotateY(180deg);
  }

  .book-cover {
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
    border: 2px solid #3b82f6;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .book-cover img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .placeholder-cover {
    text-align: center;
    color: #1e40af;
    padding: 1rem;
  }

  .placeholder-cover h3 {
    font-size: 1em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  .placeholder-cover p {
    font-size: 0.8em;
    margin: 0;
  }

  .book-details {
    text-align: left;
    font-size: 0.9em;
    line-height: 1.4;
  }

  .book-details p {
    margin: 0.3em 0;
  }

  .sinopse {
    font-size: 0.8em !important;
    line-height: 1.3 !important;
    max-height: 4em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    margin-top: 0.5em !important;
  }
`;

export default BookDetailsCard;
