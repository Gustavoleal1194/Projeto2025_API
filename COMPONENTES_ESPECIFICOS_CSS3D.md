# 🎨 COMPONENTES ESPECÍFICOS COM IMPLEMENTAÇÃO CSS 3D

## 🎯 **VISÃO GERAL**

Este documento contém a implementação específica de todos os componentes visuais do sistema de biblioteca, com foco especial na estante 3D interativa e demais componentes com animações e efeitos visuais.

---

## 📚 **ESTANTE 3D INTERATIVA**

### **1. Componente Principal - Estante3D.tsx**
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Livro } from '../types/livro';

interface Estante3DProps {
  livros: Livro[];
  onLivroClick: (livro: Livro) => void;
  onLivroHover: (livro: Livro | null) => void;
  livrosPorEstante?: number;
  estanteAtual?: number;
  onEstanteChange?: (estante: number) => void;
}

export const Estante3D: React.FC<Estante3DProps> = ({
  livros,
  onLivroClick,
  onLivroHover,
  livrosPorEstante = 10,
  estanteAtual = 1,
  onEstanteChange
}) => {
  const [hoveredLivro, setHoveredLivro] = useState<Livro | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const estanteRef = useRef<HTMLDivElement>(null);

  const totalEstantes = Math.ceil(livros.length / livrosPorEstante);
  const livrosDaEstante = livros.slice(
    (estanteAtual - 1) * livrosPorEstante,
    estanteAtual * livrosPorEstante
  );

  const handleLivroHover = (livro: Livro | null) => {
    setHoveredLivro(livro);
    onLivroHover(livro);
  };

  const handleEstanteChange = (novaEstante: number) => {
    if (novaEstante >= 1 && novaEstante <= totalEstantes) {
      setIsLoading(true);
      setTimeout(() => {
        onEstanteChange?.(novaEstante);
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <div className="estante-3d-container">
      {/* Header da Estante */}
      <div className="estante-header">
        <h2 className="estante-titulo">Estante {estanteAtual} de {totalEstantes}</h2>
        <div className="estante-controles">
          <button
            onClick={() => handleEstanteChange(estanteAtual - 1)}
            disabled={estanteAtual === 1 || isLoading}
            className="btn-estante btn-anterior"
          >
            ← Anterior
          </button>
          <button
            onClick={() => handleEstanteChange(estanteAtual + 1)}
            disabled={estanteAtual === totalEstantes || isLoading}
            className="btn-estante btn-proximo"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* Container da Estante 3D */}
      <div className="estante-3d-wrapper">
        <motion.div
          ref={estanteRef}
          className="estante-3d"
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="estante-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="loading-spinner"></div>
                <p>Carregando estante...</p>
              </motion.div>
            ) : (
              <motion.div
                key={estanteAtual}
                className="livros-grid"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                {livrosDaEstante.map((livro, index) => (
                  <LivroCard
                    key={livro.id}
                    livro={livro}
                    index={index}
                    onClick={() => onLivroClick(livro)}
                    onHover={(hovered) => handleLivroHover(hovered ? livro : null)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Indicador de Progresso */}
      <div className="estante-progresso">
        <div className="progresso-bar">
          <div 
            className="progresso-fill"
            style={{ width: `${(estanteAtual / totalEstantes) * 100}%` }}
          />
        </div>
        <span className="progresso-texto">
          {livrosDaEstante.length} de {livros.length} livros
        </span>
      </div>
    </div>
  );
};
```

### **2. CSS 3D Específico para Estante**
```css
/* Container Principal */
.estante-3d-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  perspective: 1200px;
  perspective-origin: center center;
}

/* Header da Estante */
.estante-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.estante-titulo {
  font-size: 2rem;
  font-weight: 700;
  color: #2C5F2D;
  margin: 0;
}

.estante-controles {
  display: flex;
  gap: 15px;
}

.btn-estante {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-estante:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-estante:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Wrapper da Estante 3D */
.estante-3d-wrapper {
  position: relative;
  height: 600px;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

/* Estante 3D Principal */
.estante-3d {
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  transform: rotateX(15deg) rotateY(-5deg);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Grid de Livros */
.livros-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
  padding: 40px;
  width: 100%;
  max-width: 1000px;
}

/* Loading da Estante */
.estante-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Progresso da Estante */
.estante-progresso {
  margin-top: 30px;
  text-align: center;
}

.progresso-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progresso-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.5s ease;
}

.progresso-texto {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 1024px) {
  .livros-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
    padding: 30px;
  }
  
  .estante-3d {
    transform: rotateX(10deg) rotateY(-3deg);
  }
}

@media (max-width: 768px) {
  .livros-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
  }
  
  .estante-3d {
    transform: rotateX(5deg) rotateY(-2deg);
  }
  
  .estante-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .estante-titulo {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .livros-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 15px;
  }
  
  .estante-3d {
    transform: rotateX(0deg) rotateY(0deg);
  }
}
```

---

## 📖 **CARTÃO DE LIVRO 3D**

### **3. Componente LivroCard.tsx**
```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Livro } from '../types/livro';
import { FavoritosService } from '../services/FavoritosService';

interface LivroCardProps {
  livro: Livro;
  index: number;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export const LivroCard: React.FC<LivroCardProps> = ({
  livro,
  index,
  onClick,
  onHover
}) => {
  const [isFavorito, setIsFavorito] = useState(FavoritosService.isFavorito(livro.id));
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(false);
  };

  const handleFavoritoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const novoEstado = FavoritosService.toggleFavorito(livro.id);
    setIsFavorito(novoEstado);
  };

  const getStatusColor = () => {
    if (livro.ativo) return 'disponivel';
    return 'indisponivel';
  };

  return (
    <motion.div
      className="livro-card"
      initial={{ opacity: 0, y: 50, rotateY: -90 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Capa do Livro */}
      <div className="livro-capa">
        {livro.capaUrl ? (
          <img 
            src={livro.capaUrl} 
            alt={livro.titulo}
            className="capa-imagem"
          />
        ) : (
          <div className="capa-placeholder">
            <span className="capa-inicial">{livro.titulo.charAt(0)}</span>
          </div>
        )}
        
        {/* Overlay de Status */}
        <div className={`capa-overlay status-${getStatusColor()}`}>
          <span className="status-text">
            {livro.ativo ? 'Disponível' : 'Indisponível'}
          </span>
        </div>

        {/* Botão de Favorito */}
        <button
          className={`favorito-btn ${isFavorito ? 'ativo' : ''}`}
          onClick={handleFavoritoClick}
          aria-label={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      {/* Informações do Livro */}
      <motion.div
        className="livro-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="livro-titulo">{livro.titulo}</h3>
        {livro.subtitulo && (
          <p className="livro-subtitulo">{livro.subtitulo}</p>
        )}
        <p className="livro-autor">{livro.nomeAutor}</p>
        <p className="livro-genero">{livro.genero}</p>
        <div className="livro-ano">{livro.ano}</div>
      </motion.div>

      {/* Efeito de Brilho no Hover */}
      <motion.div
        className="livro-brilho"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};
```

### **4. CSS 3D para LivroCard**
```css
/* Cartão de Livro */
.livro-card {
  position: relative;
  width: 200px;
  height: 300px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 auto;
}

.livro-card:hover {
  transform: translateZ(80px) rotateY(10deg) rotateX(-5deg);
  z-index: 10;
}

/* Capa do Livro */
.livro-capa {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 15px 35px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transform: rotateY(0deg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.livro-card:hover .livro-capa {
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.3);
  transform: rotateY(-5deg);
}

/* Imagem da Capa */
.capa-imagem {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.livro-card:hover .capa-imagem {
  transform: scale(1.1);
}

/* Placeholder da Capa */
.capa-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 3rem;
  font-weight: bold;
}

.capa-inicial {
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Overlay de Status */
.capa-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.livro-card:hover .capa-overlay {
  opacity: 1;
}

.status-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-disponivel .status-text {
  color: #4ade80;
}

.status-indisponivel .status-text {
  color: #f87171;
}

/* Botão de Favorito */
.favorito-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);
}

.livro-card:hover .favorito-btn {
  opacity: 1;
  transform: scale(1);
}

.favorito-btn:hover {
  background: #ff6b6b;
  color: white;
  transform: scale(1.1);
}

.favorito-btn.ativo {
  background: #ff6b6b;
  color: white;
  opacity: 1;
  transform: scale(1);
}

/* Informações do Livro */
.livro-info {
  position: absolute;
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.95);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  min-width: 180px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.livro-titulo {
  font-size: 16px;
  font-weight: 700;
  color: #2C5F2D;
  margin: 0 0 5px 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.livro-subtitulo {
  font-size: 12px;
  color: #666;
  margin: 0 0 5px 0;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.livro-autor {
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.livro-genero {
  font-size: 12px;
  color: #667eea;
  margin: 0 0 5px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.livro-ano {
  font-size: 12px;
  color: #a0aec0;
  margin: 0;
  font-weight: 500;
}

/* Efeito de Brilho */
.livro-brilho {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255,255,255,0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.livro-card:hover .livro-brilho {
  transform: translateX(100%);
}

/* Responsividade */
@media (max-width: 768px) {
  .livro-card {
    width: 150px;
    height: 225px;
  }
  
  .livro-info {
    bottom: -70px;
    padding: 12px;
    min-width: 140px;
  }
  
  .livro-titulo {
    font-size: 14px;
  }
  
  .livro-autor {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .livro-card {
    width: 120px;
    height: 180px;
  }
  
  .livro-info {
    bottom: -60px;
    padding: 10px;
    min-width: 110px;
  }
  
  .livro-titulo {
    font-size: 12px;
  }
  
  .livro-autor {
    font-size: 11px;
  }
}
```

---

## 🔍 **BARRA DE BUSCA AVANÇADA**

### **5. Componente SearchBar.tsx**
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, SortAsc } from 'lucide-react';

interface SearchBarProps {
  onSearch: (termo: string) => void;
  onFilterChange: (filtros: SearchFilters) => void;
  suggestions: string[];
  isLoading?: boolean;
}

interface SearchFilters {
  genero?: string;
  autor?: string;
  editora?: string;
  anoMin?: number;
  anoMax?: number;
  disponivel?: boolean;
  ordenarPor?: 'titulo' | 'autor' | 'ano' | 'genero';
  ordem?: 'asc' | 'desc';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterChange,
  suggestions,
  isLoading = false
}) => {
  const [termo, setTermo] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState<SearchFilters>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (termo.length >= 2) {
        onSearch(termo);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [termo, onSearch]);

  const handleSuggestionClick = (suggestion: string) => {
    setTermo(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const novosFiltros = { ...filtros, [key]: value };
    setFiltros(novosFiltros);
    onFilterChange(novosFiltros);
  };

  const clearFilters = () => {
    setFiltros({});
    onFilterChange({});
  };

  return (
    <div className="search-bar-container">
      {/* Barra de Busca Principal */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Buscar livros, autores, editoras..."
            className="search-input"
          />
          {termo && (
            <button
              onClick={() => setTermo('')}
              className="clear-btn"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-btn ${showFilters ? 'ativo' : ''}`}
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Sugestões */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className="suggestions-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros Avançados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filters-grid">
              {/* Filtro por Gênero */}
              <div className="filter-group">
                <label>Gênero</label>
                <input
                  type="text"
                  value={filtros.genero || ''}
                  onChange={(e) => handleFilterChange('genero', e.target.value)}
                  placeholder="Ex: Ficção, Romance..."
                />
              </div>

              {/* Filtro por Autor */}
              <div className="filter-group">
                <label>Autor</label>
                <input
                  type="text"
                  value={filtros.autor || ''}
                  onChange={(e) => handleFilterChange('autor', e.target.value)}
                  placeholder="Nome do autor..."
                />
              </div>

              {/* Filtro por Editora */}
              <div className="filter-group">
                <label>Editora</label>
                <input
                  type="text"
                  value={filtros.editora || ''}
                  onChange={(e) => handleFilterChange('editora', e.target.value)}
                  placeholder="Nome da editora..."
                />
              </div>

              {/* Filtro por Ano */}
              <div className="filter-group">
                <label>Ano</label>
                <div className="year-range">
                  <input
                    type="number"
                    value={filtros.anoMin || ''}
                    onChange={(e) => handleFilterChange('anoMin', parseInt(e.target.value))}
                    placeholder="De"
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                  <span>até</span>
                  <input
                    type="number"
                    value={filtros.anoMax || ''}
                    onChange={(e) => handleFilterChange('anoMax', parseInt(e.target.value))}
                    placeholder="Até"
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              {/* Filtro de Disponibilidade */}
              <div className="filter-group">
                <label>Disponibilidade</label>
                <select
                  value={filtros.disponivel === undefined ? '' : filtros.disponivel.toString()}
                  onChange={(e) => handleFilterChange('disponivel', e.target.value === '' ? undefined : e.target.value === 'true')}
                >
                  <option value="">Todos</option>
                  <option value="true">Disponíveis</option>
                  <option value="false">Indisponíveis</option>
                </select>
              </div>

              {/* Ordenação */}
              <div className="filter-group">
                <label>Ordenar por</label>
                <div className="sort-controls">
                  <select
                    value={filtros.ordenarPor || ''}
                    onChange={(e) => handleFilterChange('ordenarPor', e.target.value || undefined)}
                  >
                    <option value="">Selecionar...</option>
                    <option value="titulo">Título</option>
                    <option value="autor">Autor</option>
                    <option value="ano">Ano</option>
                    <option value="genero">Gênero</option>
                  </select>
                  <button
                    onClick={() => handleFilterChange('ordem', filtros.ordem === 'asc' ? 'desc' : 'asc')}
                    className="sort-btn"
                  >
                    <SortAsc size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="filters-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                Limpar Filtros
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### **6. CSS para SearchBar**
```css
/* Container da Barra de Busca */
.search-bar-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 30px;
}

/* Barra de Busca Principal */
.search-bar {
  display: flex;
  gap: 15px;
  align-items: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  padding: 15px 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  border-color: #667eea;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
}

/* Wrapper do Input */
.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  color: #a0aec0;
  margin-right: 12px;
  transition: color 0.3s ease;
}

.search-bar:focus-within .search-icon {
  color: #667eea;
}

/* Input de Busca */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #2d3748;
  background: transparent;
}

.search-input::placeholder {
  color: #a0aec0;
}

/* Botão de Limpar */
.clear-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #f7fafc;
  color: #4a5568;
}

/* Botão de Filtros */
.filter-btn {
  background: #f7fafc;
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-btn:hover {
  background: #edf2f7;
  color: #2d3748;
}

.filter-btn.ativo {
  background: #667eea;
  color: white;
}

/* Dropdown de Sugestões */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border: 1px solid #e2e8f0;
  z-index: 50;
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: none;
  text-align: left;
  color: #4a5568;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f7fafc;
}

.suggestion-item:hover {
  background: #f7fafc;
  color: #2d3748;
}

.suggestion-item:last-child {
  border-bottom: none;
}

/* Painel de Filtros */
.filters-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border: 1px solid #e2e8f0;
  margin-top: 15px;
  overflow: hidden;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 25px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

.filter-group input,
.filter-group select {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #4a5568;
  transition: border-color 0.3s ease;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.year-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.year-range span {
  color: #a0aec0;
  font-size: 14px;
}

.sort-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sort-controls select {
  flex: 1;
}

.sort-btn {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn:hover {
  background: #edf2f7;
  color: #2d3748;
}

.filters-actions {
  padding: 20px 25px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}

.clear-filters-btn {
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-filters-btn:hover {
  background: #c53030;
}

/* Responsividade */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    gap: 10px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .year-range {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-controls {
    flex-direction: column;
  }
}
```

---

## 🎯 **RESUMO DOS COMPONENTES IMPLEMENTADOS**

### **Componentes 3D Criados:**
✅ **Estante3D** - Estante interativa com CSS 3D  
✅ **LivroCard** - Cartão de livro com animações  
✅ **SearchBar** - Busca avançada com filtros  
✅ **Navegação** - Controles de estante  
✅ **Loading** - Estados de carregamento  
✅ **Progresso** - Indicador de progresso  

### **Características Técnicas:**
- ✅ **CSS 3D Transforms** para efeitos visuais
- ✅ **Framer Motion** para animações suaves
- ✅ **Responsividade** completa
- ✅ **Acessibilidade** com ARIA labels
- ✅ **Performance** otimizada
- ✅ **Interatividade** avançada

**Todos os componentes estão prontos para implementação e integração com a API!** 🚀
