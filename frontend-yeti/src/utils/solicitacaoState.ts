// Sistema de estado para gerenciar dados de solicitação entre componentes
import React from 'react';

export interface SolicitacaoData {
    exemplarId: number;
    usuarioId: number;
    livroTitulo: string;
    nomeUsuario: string;
    abrirModal?: boolean;
}

class SolicitacaoStateManager {
    private static instance: SolicitacaoStateManager;
    private listeners: ((data: SolicitacaoData | null) => void)[] = [];

    static getInstance(): SolicitacaoStateManager {
        if (!SolicitacaoStateManager.instance) {
            SolicitacaoStateManager.instance = new SolicitacaoStateManager();
        }
        return SolicitacaoStateManager.instance;
    }

    // Definir dados da solicitação para abrir modal
    setSolicitacaoData(data: SolicitacaoData): void {
        console.log('📋 Definindo dados da solicitação:', data);

        // Salvar no localStorage para persistência
        localStorage.setItem('yeti_solicitacao_modal', JSON.stringify(data));
        console.log('💾 Dados salvos no localStorage');

        // Notificar listeners
        this.listeners.forEach(listener => listener(data));
        console.log('📢 Notificando', this.listeners.length, 'listeners');

        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('solicitacaoModal', { detail: data }));
        console.log('🎯 Evento customizado disparado');
    }

    // Obter dados da solicitação
    getSolicitacaoData(): SolicitacaoData | null {
        try {
            const stored = localStorage.getItem('yeti_solicitacao_modal');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    // Limpar dados da solicitação
    clearSolicitacaoData(): void {
        console.log('🗑️ Limpando dados da solicitação');
        localStorage.removeItem('yeti_solicitacao_modal');
        this.listeners.forEach(listener => listener(null));
    }

    // Adicionar listener para mudanças
    addListener(listener: (data: SolicitacaoData | null) => void): () => void {
        this.listeners.push(listener);

        // Retornar função para remover listener
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
}

export const solicitacaoState = SolicitacaoStateManager.getInstance();

// Hook para usar o estado da solicitação
export const useSolicitacaoState = () => {
    const [solicitacaoData, setSolicitacaoData] = React.useState<SolicitacaoData | null>(
        solicitacaoState.getSolicitacaoData()
    );

    React.useEffect(() => {
        const removeListener = solicitacaoState.addListener((data) => {
            setSolicitacaoData(data);
        });

        // Escutar evento customizado
        const handleSolicitacaoModal = (event: CustomEvent) => {
            setSolicitacaoData(event.detail);
        };

        window.addEventListener('solicitacaoModal', handleSolicitacaoModal as EventListener);

        return () => {
            removeListener();
            window.removeEventListener('solicitacaoModal', handleSolicitacaoModal as EventListener);
        };
    }, []);

    return {
        solicitacaoData,
        setSolicitacaoData: (data: SolicitacaoData) => solicitacaoState.setSolicitacaoData(data),
        clearSolicitacaoData: () => solicitacaoState.clearSolicitacaoData()
    };
};

// Adicionar ao window para acesso global
if (typeof window !== 'undefined') {
    (window as any).solicitacaoState = solicitacaoState;
}
