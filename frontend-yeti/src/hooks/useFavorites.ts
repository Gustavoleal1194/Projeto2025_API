/**
 * HOOK DE FAVORITOS - YETI LIBRARY SYSTEM
 * 
 * Hook para gerenciar estado dos livros favoritos
 */

import { useState, useEffect, useCallback } from 'react';
import FavoritosService from '../services/favoritosService';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    // Carrega favoritos do localStorage na inicialização
    useEffect(() => {
        try {
            const favoritos = FavoritosService.getFavoritos();
            setFavorites(favoritos);
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Adiciona um livro aos favoritos
     */
    const addFavorite = useCallback((livroId: number) => {
        try {
            FavoritosService.adicionarFavorito(livroId);
            setFavorites(prev => {
                if (!prev.includes(livroId)) {
                    return [...prev, livroId];
                }
                return prev;
            });
        } catch (error) {
            console.error('Erro ao adicionar favorito:', error);
        }
    }, []);

    /**
     * Remove um livro dos favoritos
     */
    const removeFavorite = useCallback((livroId: number) => {
        try {
            FavoritosService.removerFavorito(livroId);
            setFavorites(prev => prev.filter(id => id !== livroId));
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
        }
    }, []);

    /**
     * Alterna o status de favorito de um livro
     * @returns true se foi adicionado, false se foi removido
     */
    const toggleFavorite = useCallback((livroId: number): boolean => {
        try {
            const isFavorite = favorites.includes(livroId);
            if (isFavorite) {
                removeFavorite(livroId);
                return false;
            } else {
                addFavorite(livroId);
                return true;
            }
        } catch (error) {
            console.error('Erro ao alternar favorito:', error);
            return false;
        }
    }, [favorites, addFavorite, removeFavorite]);

    /**
     * Verifica se um livro é favorito
     */
    const isFavorite = useCallback((livroId: number): boolean => {
        return favorites.includes(livroId);
    }, [favorites]);

    /**
     * Limpa todos os favoritos
     */
    const clearFavorites = useCallback(() => {
        try {
            FavoritosService.limparFavoritos();
            setFavorites([]);
        } catch (error) {
            console.error('Erro ao limpar favoritos:', error);
        }
    }, []);

    /**
     * Obtém quantidade de favoritos
     */
    const getFavoritesCount = useCallback((): number => {
        return favorites.length;
    }, [favorites]);

    return {
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        getFavoritesCount
    };
};

export default useFavorites;
