export class EmprestimoValidator {
    static validateIdUsuario(idUsuario: number): string {
        if (!idUsuario || idUsuario === 0) return 'ID do usuário é obrigatório';
        if (idUsuario < 1) return 'ID do usuário deve ser maior que zero';
        return '';
    }

    static validateIdExemplar(idExemplar: number): string {
        if (!idExemplar || idExemplar === 0) return 'ID do exemplar é obrigatório';
        if (idExemplar < 1) return 'ID do exemplar deve ser maior que zero';
        return '';
    }

    static validateDataEmprestimo(dataEmprestimo: string): string {
        if (!dataEmprestimo || !dataEmprestimo.trim()) return 'Data de empréstimo é obrigatória';

        const data = new Date(dataEmprestimo);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (isNaN(data.getTime())) return 'Data de empréstimo inválida';
        if (data > hoje) return 'Data de empréstimo não pode ser futura';

        // Verificar se não é muito antiga (mais de 1 ano)
        const umAnoAtras = new Date();
        umAnoAtras.setFullYear(hoje.getFullYear() - 1);
        if (data < umAnoAtras) return 'Data de empréstimo muito antiga';

        return '';
    }

    static validateDataPrevistaDevolucao(dataPrevistaDevolucao: string, dataEmprestimo?: string): string {
        if (!dataPrevistaDevolucao || !dataPrevistaDevolucao.trim()) return 'Data de devolução prevista é obrigatória';

        const dataPrevista = new Date(dataPrevistaDevolucao);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (isNaN(dataPrevista.getTime())) return 'Data de devolução prevista inválida';
        if (dataPrevista < hoje) return 'Data de devolução prevista não pode ser no passado';

        // Se temos a data de empréstimo, validar que a devolução é posterior
        if (dataEmprestimo) {
            const dataEmp = new Date(dataEmprestimo);
            if (dataPrevista <= dataEmp) return 'Data de devolução deve ser posterior à data de empréstimo';
        }

        // Verificar se não é muito futura (mais de 1 ano)
        const umAnoFrente = new Date();
        umAnoFrente.setFullYear(hoje.getFullYear() + 1);
        if (dataPrevista > umAnoFrente) return 'Data de devolução prevista muito futura';

        return '';
    }

    static validateObservacoes(observacoes: string): string {
        if (observacoes && observacoes.trim().length > 500) return 'Observações devem ter no máximo 500 caracteres';
        return '';
    }

    static validateForm(formData: any): Record<string, string> {
        const errors: Record<string, string> = {};

        errors.idUsuario = this.validateIdUsuario(formData.idUsuario);
        errors.idExemplar = this.validateIdExemplar(formData.idExemplar);
        errors.dataEmprestimo = this.validateDataEmprestimo(formData.dataEmprestimo);
        errors.dataPrevistaDevolucao = this.validateDataPrevistaDevolucao(formData.dataPrevistaDevolucao, formData.dataEmprestimo);
        errors.observacoes = this.validateObservacoes(formData.observacoes);

        // Remover erros vazios
        Object.keys(errors).forEach(key => {
            if (!errors[key]) {
                delete errors[key];
            }
        });

        return errors;
    }
}
