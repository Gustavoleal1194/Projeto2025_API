import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { LivroResumido } from '../services/explorarLivrosService';
import AnimatedHeartButton from './AnimatedHeartButton';
import AnimatedDetailsButton from './AnimatedDetailsButton';
import SolicitarEmprestimoButton from './Buttons/SolicitarEmprestimoButton';
import { exemplarService } from '../services/exemplarService';

// Interface estendida para incluir informações de empréstimo
interface LivroComEmprestimo extends LivroResumido {
  status?: string;
  estaAtrasado?: boolean;
  dataEmprestimo?: string;
  dataPrevistaDevolucao?: string;
  diasAtraso?: number;
  diasRestantes?: number;
  quantidadeRenovacoes?: number;
  maxRenovacoes?: number;
}

interface BookCardYetiProps {
  livro: LivroComEmprestimo;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onVerDetalhes: (livro: LivroComEmprestimo) => void;
  onSolicitarEmprestimo?: (exemplarId: number, livroTitulo: string) => void;
  searchQuery?: string;
  showSolicitarButton?: boolean;
}

const BookCardYeti: React.FC<BookCardYetiProps> = ({
  livro,
  isFavorite,
  onToggleFavorite,
  onVerDetalhes,
  onSolicitarEmprestimo,
  searchQuery = '',
  showSolicitarButton = false
}) => {
  const [exemplaresDisponiveis, setExemplaresDisponiveis] = useState<any[]>([]);
  const [exemplarSelecionado, setExemplarSelecionado] = useState<any>(null);
  const [carregandoExemplares, setCarregandoExemplares] = useState(false);

  // Buscar exemplares disponíveis quando o componente for montado
  useEffect(() => {
    if (showSolicitarButton && livro.temExemplaresDisponiveis) {
      buscarExemplaresDisponiveis();
    }
  }, [showSolicitarButton, livro.id]);

  const buscarExemplaresDisponiveis = async () => {
    try {
      setCarregandoExemplares(true);
      console.log('🔍 Buscando exemplares disponíveis para o livro:', livro.id);

      const exemplares = await exemplarService.listarDisponiveisPorLivro(livro.id);
      console.log('📚 Exemplares encontrados:', exemplares);

      setExemplaresDisponiveis(exemplares);

      // Selecionar o primeiro exemplar disponível automaticamente
      if (exemplares.length > 0) {
        setExemplarSelecionado(exemplares[0]);
        console.log('✅ Exemplar selecionado:', exemplares[0]);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar exemplares disponíveis:', error);
    } finally {
      setCarregandoExemplares(false);
    }
  };

  const highlightSearchTerm = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
  };

  return (
    <StyledWrapper>
      <div className="card">
        {/* Capa do Livro */}
        <div className="book-cover">
          {livro.capaUrl ? (
            <img
              src={livro.capaUrl}
              alt={livro.titulo}
              className="cover-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="placeholder-cover">
                      <h3>${livro.titulo.length > 20 ? livro.titulo.substring(0, 20) + '...' : livro.titulo}</h3>
                      <p>${livro.nomeAutor}</p>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="placeholder-cover">
              <h3>{livro.titulo.length > 20 ? livro.titulo.substring(0, 20) + '...' : livro.titulo}</h3>
              <p>{livro.nomeAutor}</p>
            </div>
          )}
        </div>

        {/* Informações do Livro */}
        <div className="book-info">
          <h3
            className="book-title"
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerm(livro.titulo, searchQuery)
            }}
          />

          <p
            className="book-author"
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerm(livro.nomeAutor, searchQuery)
            }}
          />

          <div className="book-meta">
            <span className="genre">{livro.genero}</span>
            <span className="year">{livro.ano}</span>
          </div>

          <p className="book-synopsis">
            {livro.sinopse.length > 80 ? livro.sinopse.substring(0, 80) + '...' : livro.sinopse}
          </p>

          <div className="book-stats">
            <span className="exemplares">
              {livro.exemplaresDisponiveis}/{livro.totalExemplares} exemplares
            </span>
            {livro.numeroPaginas && (
              <span className="pages">{livro.numeroPaginas} páginas</span>
            )}
          </div>
        </div>

        {/* Botão de Solicitar Empréstimo */}
        {showSolicitarButton && livro.temExemplaresDisponiveis && (
          <div className="solicitar-container">
            {carregandoExemplares ? (
              <div className="loading-exemplares">
                <span>Carregando exemplares...</span>
              </div>
            ) : exemplarSelecionado ? (
              <SolicitarEmprestimoButton
                exemplarId={exemplarSelecionado.id} // Usando ID real do exemplar
                livroTitulo={livro.titulo}
                onSuccess={() => onSolicitarEmprestimo?.(exemplarSelecionado.id, livro.titulo)}
              />
            ) : exemplaresDisponiveis.length === 0 ? (
              <div className="sem-exemplares">
                <span>Nenhum exemplar disponível</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="action-buttons">
          <AnimatedDetailsButton
            onClick={() => onVerDetalhes(livro)}
          />
          <AnimatedHeartButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite(livro.id)}
            size="sm"
          />
        </div>

        {/* Indicador de Disponibilidade */}
        <div className={`availability ${livro.status
          ? (livro.estaAtrasado ? 'atrasado' : livro.status === 'Emprestado' ? 'emprestado' : 'devolvido')
          : (livro.temExemplaresDisponiveis ? 'available' : 'unavailable')
          }`}>
          {livro.status || (livro.temExemplaresDisponiveis ? 'Disponível' : 'Indisponível')}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 100%;
    height: 420px; /* altura fixa para alinhar todos os cards */
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    gap: 12px;
    border-radius: 12px;
    cursor: pointer;
    color: white;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: -5px; /* expansão uniforme para o brilho externo */
    margin: auto;
    border-radius: 16px;
    background: linear-gradient(-45deg, #3b82f6 0%, #1e40af 50%, #60a5fa 100%);
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
    opacity: 0.7;
  }

  .book-cover {
    width: 100%;
    height: 180px;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }

  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .placeholder-cover {
    text-align: center;
    padding: 16px;
    color: white;
  }

  .placeholder-cover h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .placeholder-cover p {
    font-size: 14px;
    opacity: 0.9;
  }

  .book-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .book-title {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
    color: white;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* limita a 1 linha */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-author {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
    color: #e0e7ff;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 4px 0;
  }

  .genre, .year {
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: white;
  }

  .book-synopsis {
    font-size: 13px;
    line-height: 1.4;
    opacity: 0.8;
    margin: 4px 0;
    color: #e0e7ff;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* limita a 3 linhas para evitar crescimento vertical */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    opacity: 0.7;
    margin-top: auto;
  }

  .exemplares, .pages {
    color: #c7d2fe;
  }

  .solicitar-container {
    margin: 8px 0;
    padding: 0 8px;
  }

  .loading-exemplares {
    text-align: center;
    padding: 8px;
    font-size: 12px;
    color: #c7d2fe;
    opacity: 0.8;
  }

  .sem-exemplares {
    text-align: center;
    padding: 8px;
    font-size: 12px;
    color: #fca5a5;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 6px;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 8px;
  }

  .availability {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .availability.available {
    background: rgba(34, 197, 94, 0.9);
    color: white;
  }

  .availability.unavailable {
    background: rgba(239, 68, 68, 0.9);
    color: white;
  }

  .availability.emprestado {
    background: rgba(251, 191, 36, 0.9);
    color: white;
  }

  .availability.devolvido {
    background: rgba(34, 197, 94, 0.9);
    color: white;
  }

  .availability.atrasado {
    background: rgba(239, 68, 68, 0.9);
    color: white;
  }

  .card:hover::after {
    filter: blur(30px);
    opacity: 0.9;
  }

  .card:hover::before {
    transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  }

  .card:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    .card {
      height: 400px; /* altura ajustada em telas menores */
    }
  }
`;

export default BookCardYeti;
