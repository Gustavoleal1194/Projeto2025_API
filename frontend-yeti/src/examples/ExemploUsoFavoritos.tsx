/**
 * EXEMPLO DE USO DO SISTEMA DE FAVORITOS
 * 
 * Este arquivo demonstra como usar o sistema de favoritos
 * em diferentes componentes da aplicação
 */

import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import FavoritosService from '../services/favoritosService';

// Exemplo 1: Componente simples com botão de favoritar
export const BotaoFavoritar: React.FC<{ livroId: number; livroTitulo: string }> = ({ 
    livroId, 
    livroTitulo 
}) => {
    const { isFavorite, toggleFavorite } = useFavorites();

    const handleToggle = () => {
        const wasAdded = toggleFavorite(livroId);
        console.log(wasAdded ? 'Adicionado aos favoritos:' : 'Removido dos favoritos:', livroTitulo);
    };

    return (
        <button
            onClick={handleToggle}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                isFavorite(livroId) 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
        >
            {isFavorite(livroId) ? '💖 Favorito' : '❤️ Favoritar'}
        </button>
    );
};

// Exemplo 2: Lista de livros favoritos
export const ListaFavoritos: React.FC = () => {
    const { favorites, removeFavorite, clearFavorites } = useFavorites();

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Meus Favoritos ({favorites.length})</h2>
                {favorites.length > 0 && (
                    <button
                        onClick={clearFavorites}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Limpar Todos
                    </button>
                )}
            </div>
            
            {favorites.length === 0 ? (
                <p className="text-gray-500">Nenhum livro favoritado ainda.</p>
            ) : (
                <div className="space-y-2">
                    {favorites.map(livroId => (
                        <div key={livroId} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                            <span>Livro ID: {livroId}</span>
                            <button
                                onClick={() => removeFavorite(livroId)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remover
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Exemplo 3: Uso direto do serviço (sem hook)
export const ExemploServicoDireto: React.FC = () => {
    const handleAdicionarFavorito = (livroId: number) => {
        FavoritosService.adicionarFavorito(livroId);
        console.log('Favorito adicionado:', livroId);
    };

    const handleRemoverFavorito = (livroId: number) => {
        FavoritosService.removerFavorito(livroId);
        console.log('Favorito removido:', livroId);
    };

    const handleVerificarFavorito = (livroId: number) => {
        const isFav = FavoritosService.isFavorito(livroId);
        console.log(`Livro ${livroId} é favorito:`, isFav);
    };

    const handleObterFavoritos = () => {
        const favoritos = FavoritosService.getFavoritos();
        console.log('Lista de favoritos:', favoritos);
    };

    return (
        <div className="p-4 space-y-2">
            <h3 className="text-lg font-bold">Exemplo de Uso Direto do Serviço</h3>
            <div className="space-x-2">
                <button onClick={() => handleAdicionarFavorito(1)} className="px-3 py-1 bg-green-500 text-white rounded">
                    Adicionar Livro 1
                </button>
                <button onClick={() => handleRemoverFavorito(1)} className="px-3 py-1 bg-red-500 text-white rounded">
                    Remover Livro 1
                </button>
                <button onClick={() => handleVerificarFavorito(1)} className="px-3 py-1 bg-blue-500 text-white rounded">
                    Verificar Livro 1
                </button>
                <button onClick={handleObterFavoritos} className="px-3 py-1 bg-purple-500 text-white rounded">
                    Ver Todos
                </button>
            </div>
        </div>
    );
};

// Exemplo 4: Estatísticas de favoritos
export const EstatisticasFavoritos: React.FC = () => {
    const { getFavoritesCount } = useFavorites();
    const totalFavoritos = getFavoritesCount();

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">Estatísticas de Favoritos</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{totalFavoritos}</div>
                    <div className="text-sm text-gray-600">Total de Favoritos</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                        {totalFavoritos > 0 ? 'Ativo' : 'Vazio'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                </div>
            </div>
        </div>
    );
};
