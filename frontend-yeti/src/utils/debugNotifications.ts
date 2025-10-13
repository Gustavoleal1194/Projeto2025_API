// Utilitário para debug de notificações
export const debugNotifications = {
    // Verificar solicitações no localStorage
    verificarSolicitacoes: () => {
        const solicitacoes = localStorage.getItem('yeti_solicitacoes');
        console.log('📊 Solicitações no localStorage:', solicitacoes ? JSON.parse(solicitacoes) : 'Nenhuma');
        return solicitacoes ? JSON.parse(solicitacoes) : [];
    },

    // Limpar todas as solicitações (para teste)
    limparSolicitacoes: () => {
        localStorage.removeItem('yeti_solicitacoes');
        console.log('🗑️ Solicitações limpas do localStorage');
    },

    // Corrigir solicitações existentes com nome correto
    corrigirSolicitacoes: () => {
        const solicitacoes = JSON.parse(localStorage.getItem('yeti_solicitacoes') || '[]');
        console.log('🔍 Solicitações antes da correção:', solicitacoes);

        const solicitacoesCorrigidas = solicitacoes.map((s: any) => ({
            ...s,
            nomeUsuario: 'Gustavo Leal'
        }));

        localStorage.setItem('yeti_solicitacoes', JSON.stringify(solicitacoesCorrigidas));
        console.log('🔧 Solicitações corrigidas com nome "Gustavo Leal":', solicitacoesCorrigidas);

        // Forçar reload das notificações
        window.dispatchEvent(new Event('storage'));

        return solicitacoesCorrigidas;
    },

    // Limpar solicitações antigas com "Usuário Atual" e manter apenas as corretas
    limparSolicitacoesAntigas: () => {
        const solicitacoes = JSON.parse(localStorage.getItem('yeti_solicitacoes') || '[]');
        console.log('🔍 Solicitações atuais:', solicitacoes);

        // Filtrar apenas solicitações com nome correto
        const solicitacoesCorretas = solicitacoes.filter((s: any) =>
            s.nomeUsuario && s.nomeUsuario !== 'Usuário Atual' && s.nomeUsuario !== 'Usuario Atual'
        );

        console.log('🧹 Removendo solicitações com "Usuário Atual":',
            solicitacoes.length - solicitacoesCorretas.length);

        localStorage.setItem('yeti_solicitacoes', JSON.stringify(solicitacoesCorretas));
        console.log('✅ Solicitações limpas, mantendo apenas:', solicitacoesCorretas);

        // Forçar reload das notificações
        window.dispatchEvent(new Event('storage'));

        return solicitacoesCorretas;
    },

    // Criar uma solicitação de teste
    criarSolicitacaoTeste: () => {
        const solicitacoes = JSON.parse(localStorage.getItem('yeti_solicitacoes') || '[]');

        // Obter dados do usuário logado
        let nomeUsuario = 'Gustavo Leal'; // Nome padrão baseado na interface
        let usuarioId = 1;

        try {
            const userData = localStorage.getItem('yeti_user');
            if (userData) {
                const user = JSON.parse(userData);
                nomeUsuario = user.nome || user.name || user.nomeCompleto || user.fullName || 'Gustavo Leal';
                usuarioId = user.id || user.userId || 1;
            }
        } catch (error) {
            console.warn('Erro ao obter dados do usuário para teste:', error);
        }

        const novaSolicitacao = {
            id: `teste-${Date.now()}`,
            exemplarId: 999,
            usuarioId,
            livroTitulo: 'Livro de Teste',
            nomeUsuario,
            dataSolicitacao: new Date().toISOString(),
            status: 'pendente'
        };

        solicitacoes.push(novaSolicitacao);
        localStorage.setItem('yeti_solicitacoes', JSON.stringify(solicitacoes));
        console.log('🧪 Solicitação de teste criada:', novaSolicitacao);
        return novaSolicitacao;
    },

    // Forçar reload das notificações
    forcarReload: () => {
        window.dispatchEvent(new Event('storage'));
        console.log('🔄 Evento de storage disparado');
    }
};

// Adicionar ao window para acesso global
if (typeof window !== 'undefined') {
    (window as any).debugNotifications = debugNotifications;
}
