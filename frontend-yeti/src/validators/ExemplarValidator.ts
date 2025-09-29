// Validador centralizado para Exemplares - Sincronizado com backend FluentValidation
export class ExemplarValidator {
    static validateIdLivro(idLivro: number): string {
        if (!idLivro || idLivro === 0) return 'Livro é obrigatório';
        return '';
    }

    static validateNumeroExemplar(numeroExemplar: string): string {
        if (!numeroExemplar || !numeroExemplar.trim()) return 'Número do exemplar é obrigatório';
        if (numeroExemplar.trim().length < 1) return 'Número do exemplar deve ter pelo menos 1 caractere';
        if (numeroExemplar.trim().length > 50) return 'Número do exemplar deve ter no máximo 50 caracteres';
        return '';
    }

    static validateLocalizacao(localizacao: string): string {
        if (localizacao && localizacao.length > 100) return 'Localização deve ter no máximo 100 caracteres';
        return '';
    }

    static validateCondicao(condicao: string): string {
        if (!condicao || !condicao.trim()) return 'Condição é obrigatória';
        const condicoesValidas = ['Bom', 'Regular', 'Ruim', 'Danificado'];
        if (!condicoesValidas.includes(condicao)) return 'Condição inválida';
        return '';
    }

    static validateDataAquisicao(dataAquisicao: string): string {
        if (!dataAquisicao || !dataAquisicao.trim()) return 'Data de aquisição é obrigatória';
        const data = new Date(dataAquisicao);
        if (isNaN(data.getTime())) return 'Data inválida';
        if (data > new Date()) return 'Data não pode ser futura';
        const dataMinima = new Date('1900-01-01');
        if (data < dataMinima) return 'Data muito antiga';
        return '';
    }

    static validateValorAquisicao(valorAquisicao: number): string {
        if (valorAquisicao && valorAquisicao < 0) return 'Valor não pode ser negativo';
        if (valorAquisicao && valorAquisicao > 100000) return 'Valor deve ser menor que R$ 100.000';
        return '';
    }

    static validateFornecedor(fornecedor: string): string {
        if (fornecedor && fornecedor.length > 100) return 'Fornecedor deve ter no máximo 100 caracteres';
        return '';
    }

    static validateObservacoes(observacoes: string): string {
        if (observacoes && observacoes.length > 500) return 'Observações devem ter no máximo 500 caracteres';
        return '';
    }

    // Validação completa do formulário
    static validateForm(formData: any): Record<string, string> {
        const errors: Record<string, string> = {};

        errors.idLivro = this.validateIdLivro(formData.idLivro);
        errors.numeroExemplar = this.validateNumeroExemplar(formData.numeroExemplar);
        errors.localizacao = this.validateLocalizacao(formData.localizacao);
        errors.condicao = this.validateCondicao(formData.condicao);
        errors.dataAquisicao = this.validateDataAquisicao(formData.dataAquisicao);
        errors.valorAquisicao = this.validateValorAquisicao(formData.valorAquisicao);
        errors.fornecedor = this.validateFornecedor(formData.fornecedor);
        errors.observacoes = this.validateObservacoes(formData.observacoes);

        // Remover erros vazios
        Object.keys(errors).forEach(key => {
            if (!errors[key]) delete errors[key];
        });

        return errors;
    }
}
