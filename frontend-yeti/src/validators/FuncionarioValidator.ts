export class FuncionarioValidator {
    static validateNome(nome: string): string {
        if (!nome || !nome.trim()) return 'Nome é obrigatório';
        if (nome.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        if (nome.trim().length > 100) return 'Nome deve ter no máximo 100 caracteres';
        return '';
    }

    static validateEmail(email: string): string {
        if (!email || !email.trim()) return 'Email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return 'Email deve ter um formato válido';
        if (email.trim().length > 100) return 'Email deve ter no máximo 100 caracteres';
        return '';
    }

    static validateTelefone(telefone: string): string {
        if (!telefone || !telefone.trim()) return 'Telefone é obrigatório';
        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 10) return 'Telefone deve ter pelo menos 10 dígitos';
        if (telefoneLimpo.length > 11) return 'Telefone deve ter no máximo 11 dígitos';
        return '';
    }

    static validateSenha(senha: string, isEdit: boolean = false): string {
        if (!isEdit && (!senha || !senha.trim())) return 'Senha é obrigatória';
        if (senha && senha.trim().length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        if (senha && senha.trim().length > 50) return 'Senha deve ter no máximo 50 caracteres';
        return '';
    }

    static validateCargo(cargo: string): string {
        if (!cargo || !cargo.trim()) return 'Cargo é obrigatório';
        return '';
    }

    static validateSalario(salario: number): string {
        if (!salario || salario <= 0) return 'Salário deve ser maior que zero';
        if (salario > 999999.99) return 'Salário deve ser menor que R$ 999.999,99';
        return '';
    }

    static validateDataAdmissao(dataAdmissao: string): string {
        if (!dataAdmissao || !dataAdmissao.trim()) return 'Data de admissão é obrigatória';
        
        const data = new Date(dataAdmissao);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (isNaN(data.getTime())) return 'Data de admissão inválida';
        if (data > hoje) return 'Data de admissão não pode ser futura';
        
        // Verificar se não é muito antiga (mais de 50 anos)
        const cinquentaAnosAtras = new Date();
        cinquentaAnosAtras.setFullYear(hoje.getFullYear() - 50);
        if (data < cinquentaAnosAtras) return 'Data de admissão muito antiga';
        
        return '';
    }

    static validateDataDemissao(dataDemissao: string, dataAdmissao: string): string {
        if (!dataDemissao || !dataDemissao.trim()) return ''; // Opcional
        
        const dataDem = new Date(dataDemissao);
        const dataAdm = new Date(dataAdmissao);
        
        if (isNaN(dataDem.getTime())) return 'Data de demissão inválida';
        if (dataDem < dataAdm) return 'Data de demissão deve ser posterior à data de admissão';
        
        return '';
    }

    static validateForm(formData: any, isEdit: boolean = false): Record<string, string> {
        const errors: Record<string, string> = {};

        errors.nome = this.validateNome(formData.nome);
        errors.email = this.validateEmail(formData.email);
        errors.telefone = this.validateTelefone(formData.telefone);
        errors.senha = this.validateSenha(formData.senha, isEdit);
        errors.cargo = this.validateCargo(formData.cargo);
        errors.salario = this.validateSalario(formData.salario);
        errors.dataAdmissao = this.validateDataAdmissao(formData.dataAdmissao);
        errors.dataDemissao = this.validateDataDemissao(formData.dataDemissao, formData.dataAdmissao);

        // Remover erros vazios
        Object.keys(errors).forEach(key => {
            if (!errors[key]) {
                delete errors[key];
            }
        });

        return errors;
    }
}
