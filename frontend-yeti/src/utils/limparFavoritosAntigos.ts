/**
 * UTILITÁRIO PARA LIMPEZA DE FAVORITOS ANTIGOS
 * 
 * Remove favoritos da chave antiga e migra para o sistema por usuário
 */

import FavoritosService from '../services/favoritosService';

/**
 * Limpa favoritos antigos e migra para o sistema por usuário
 */
export const limparFavoritosAntigos = () => {
    try {
        console.log('🧹 Limpando favoritos antigos...');

        // Migrar favoritos antigos para o usuário atual
        FavoritosService.migrarFavoritosAntigos();

        // Limpar chave antiga se ainda existir
        localStorage.removeItem('yeti_livros_favoritos');

        console.log('✅ Favoritos antigos limpos e migrados');
    } catch (error) {
        console.error('❌ Erro ao limpar favoritos antigos:', error);
    }
};

/**
 * Limpa todos os favoritos (todos os usuários)
 */
export const limparTodosFavoritos = () => {
    try {
        console.log('🧹 Limpando todos os favoritos...');
        FavoritosService.limparTodosFavoritos();
        console.log('✅ Todos os favoritos foram limpos');
    } catch (error) {
        console.error('❌ Erro ao limpar todos os favoritos:', error);
    }
};

/**
 * Mostra informações sobre favoritos no localStorage
 */
export const debugFavoritos = () => {
    console.log('🔍 Debug dos favoritos:');

    const keys = Object.keys(localStorage);
    const favoritosKeys = keys.filter(key => key.startsWith('yeti_livros_favoritos'));

    console.log('📋 Chaves de favoritos encontradas:', favoritosKeys);

    favoritosKeys.forEach(key => {
        const favoritos = localStorage.getItem(key);
        console.log(`📚 ${key}:`, favoritos ? JSON.parse(favoritos) : 'vazio');
    });

    // Verificar chave antiga
    const chaveAntiga = localStorage.getItem('yeti_livros_favoritos');
    if (chaveAntiga) {
        console.log('⚠️ Chave antiga ainda existe:', JSON.parse(chaveAntiga));
    } else {
        console.log('✅ Chave antiga não existe mais');
    }
};

// Executar limpeza automaticamente quando o arquivo for carregado
if (typeof window !== 'undefined') {
    limparFavoritosAntigos();
}
