/**
 * SERVIÇO DE FAVORITOS - YETI LIBRARY SYSTEM
 * 
 * Gerencia livros favoritos usando localStorage
 */

class FavoritosService {
    private static readonly FAVORITOS_KEY_PREFIX = 'yeti_livros_favoritos_';

    /**
     * Obtém a chave específica do usuário logado
     */
    private static getFavoritosKey(): string {
        const userData = localStorage.getItem('yeti_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const userId = user.id || user.userId || user.idUsuario || 'default';
                return `${this.FAVORITOS_KEY_PREFIX}${userId}`;
            } catch (error) {
                console.error('Erro ao obter ID do usuário:', error);
            }
        }
        return `${this.FAVORITOS_KEY_PREFIX}default`;
    }

    /**
     * Adiciona um livro aos favoritos
     */
    static adicionarFavorito(livroId: number): void {
        const favoritos = this.getFavoritos();
        if (!favoritos.includes(livroId)) {
            favoritos.push(livroId);
            localStorage.setItem(this.getFavoritosKey(), JSON.stringify(favoritos));
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
            localStorage.setItem(this.getFavoritosKey(), JSON.stringify(favoritos));
        }
    }

    /**
     * Obtém lista de IDs dos livros favoritos
     */
    static getFavoritos(): number[] {
        const favoritos = localStorage.getItem(this.getFavoritosKey());
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
        localStorage.removeItem(this.getFavoritosKey());
    }

    /**
     * Obtém quantidade de favoritos
     */
    static getQuantidadeFavoritos(): number {
        return this.getFavoritos().length;
    }

    /**
     * Migra favoritos da chave antiga para a nova chave específica do usuário
     */
    static migrarFavoritosAntigos(): void {
        const chaveAntiga = 'yeti_livros_favoritos';
        const favoritosAntigos = localStorage.getItem(chaveAntiga);

        if (favoritosAntigos) {
            try {
                const favoritos = JSON.parse(favoritosAntigos);
                if (Array.isArray(favoritos) && favoritos.length > 0) {
                    // Salvar na nova chave específica do usuário
                    localStorage.setItem(this.getFavoritosKey(), JSON.stringify(favoritos));
                    // Remover a chave antiga
                    localStorage.removeItem(chaveAntiga);
                    console.log('✅ Favoritos migrados para o usuário atual');
                }
            } catch (error) {
                console.error('Erro ao migrar favoritos antigos:', error);
            }
        }
    }

    /**
     * Limpa favoritos de todos os usuários (método de limpeza geral)
     */
    static limparTodosFavoritos(): void {
        // Remove todas as chaves que começam com o prefixo
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.FAVORITOS_KEY_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        // Remove também a chave antiga se existir
        localStorage.removeItem('yeti_livros_favoritos');
    }
}

export default FavoritosService;
