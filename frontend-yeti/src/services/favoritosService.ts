/**
 * SERVIÇO DE FAVORITOS - YETI LIBRARY SYSTEM
 * 
 * Gerencia livros favoritos usando localStorage
 */

class FavoritosService {
    private static readonly FAVORITOS_KEY = 'yeti_livros_favoritos';

    /**
     * Adiciona um livro aos favoritos
     */
    static adicionarFavorito(livroId: number): void {
        const favoritos = this.getFavoritos();
        if (!favoritos.includes(livroId)) {
            favoritos.push(livroId);
            localStorage.setItem(this.FAVORITOS_KEY, JSON.stringify(favoritos));
        }
    }

    /**
     * Remove um livro dos favoritos
     */
    static removerFavorito(livroId: number): void {
        const favoritos = this.getFavoritos();
        const index = favoritos.indexOf(livroId);
        if (index > -1) {
            favoritos.splice(index, 1);
            localStorage.setItem(this.FAVORITOS_KEY, JSON.stringify(favoritos));
        }
    }

    /**
     * Obtém lista de IDs dos livros favoritos
     */
    static getFavoritos(): number[] {
        const favoritos = localStorage.getItem(this.FAVORITOS_KEY);
        return favoritos ? JSON.parse(favoritos) : [];
    }

    /**
     * Verifica se um livro é favorito
     */
    static isFavorito(livroId: number): boolean {
        return this.getFavoritos().includes(livroId);
    }

    /**
     * Alterna o status de favorito de um livro
     * @returns true se foi adicionado, false se foi removido
     */
    static toggleFavorito(livroId: number): boolean {
        if (this.isFavorito(livroId)) {
            this.removerFavorito(livroId);
            return false;
        } else {
            this.adicionarFavorito(livroId);
            return true;
        }
    }

    /**
     * Limpa todos os favoritos
     */
    static limparFavoritos(): void {
        localStorage.removeItem(this.FAVORITOS_KEY);
    }

    /**
     * Obtém quantidade de favoritos
     */
    static getQuantidadeFavoritos(): number {
        return this.getFavoritos().length;
    }
}

export default FavoritosService;
