// Script para limpar solicitações antigas com "Usuário Atual"
export const limparSolicitacoesAntigas = () => {
    if (typeof window === 'undefined') {
        console.log('❌ Este script deve ser executado no navegador');
        return;
    }

    try {
        const solicitacoes = JSON.parse(localStorage.getItem('yeti_solicitacoes') || '[]');
        console.log('🔍 Solicitações atuais no localStorage:', solicitacoes);

        // Identificar solicitações com "Usuário Atual"
        const solicitacoesComUsuarioAtual = solicitacoes.filter((s: any) =>
            s.nomeUsuario === 'Usuário Atual' || s.nomeUsuario === 'Usuario Atual'
        );

        console.log('🚨 Solicitações com "Usuário Atual" encontradas:', solicitacoesComUsuarioAtual.length);

        if (solicitacoesComUsuarioAtual.length > 0) {
            console.log('📋 Detalhes das solicitações problemáticas:', solicitacoesComUsuarioAtual);

            // Opção 1: Corrigir para "Gustavo Leal"
            const solicitacoesCorrigidas = solicitacoes.map((s: any) => {
                if (s.nomeUsuario === 'Usuário Atual' || s.nomeUsuario === 'Usuario Atual') {
                    return {
                        ...s,
                        nomeUsuario: 'Gustavo Leal'
                    };
                }
                return s;
            });

            localStorage.setItem('yeti_solicitacoes', JSON.stringify(solicitacoesCorrigidas));
            console.log('✅ Solicitações corrigidas para "Gustavo Leal"');

            // Opção 2: Remover completamente (descomente se preferir)
            // const solicitacoesLimpa = solicitacoes.filter((s: any) => 
            //     s.nomeUsuario !== 'Usuário Atual' && s.nomeUsuario !== 'Usuario Atual'
            // );
            // localStorage.setItem('yeti_solicitacoes', JSON.stringify(solicitacoesLimpa));
            // console.log('🗑️ Solicitações com "Usuário Atual" removidas');

            // Forçar reload das notificações
            window.dispatchEvent(new Event('storage'));
            console.log('🔄 Evento de storage disparado para atualizar notificações');

            return solicitacoesCorrigidas;
        } else {
            console.log('✅ Nenhuma solicitação com "Usuário Atual" encontrada');
            return solicitacoes;
        }

    } catch (error) {
        console.error('❌ Erro ao limpar solicitações antigas:', error);
        return [];
    }
};

// Adicionar ao window para acesso global
if (typeof window !== 'undefined') {
    (window as any).limparSolicitacoesAntigas = limparSolicitacoesAntigas;
}
