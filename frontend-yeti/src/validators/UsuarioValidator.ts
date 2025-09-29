// Validador centralizado para Usuários - Sincronizado com backend FluentValidation
export class UsuarioValidator {
    static validateNome(nome: string): string {
        if (!nome || !nome.trim()) return 'Nome é obrigatório';
        if (nome.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        if (nome.trim().length > 100) return 'Nome deve ter no máximo 100 caracteres';
        return '';
    }

    static validateEmail(email: string): string {
        if (!email || !email.trim()) return 'Email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Email inválido';
        if (email.length > 255) return 'Email deve ter no máximo 255 caracteres';
        return '';
    }

    static validateCPF(cpf: string): string {
        if (!cpf || !cpf.trim()) return 'CPF é obrigatório';
        const cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo.length !== 11) return 'CPF deve ter 11 dígitos';
        if (cpfLimpo.split('').every(digit => digit === cpfLimpo[0])) return 'CPF inválido';

        // Validação dos dígitos verificadores
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo.charAt(9))) return 'CPF inválido';

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo.charAt(10))) return 'CPF inválido';

        return '';
    }

    static validateTelefone(telefone: string): string {
        if (!telefone || !telefone.trim()) return 'Telefone é obrigatório';
        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 10) return 'Telefone deve ter pelo menos 10 dígitos';
        if (telefoneLimpo.length > 11) return 'Telefone deve ter no máximo 11 dígitos';
        return '';
    }

    static validateDataNascimento(data: string): string {
        if (!data || !data.trim()) return 'Data de nascimento é obrigatória';
        const dataNasc = new Date(data);
        if (isNaN(dataNasc.getTime())) return 'Data inválida';
        if (dataNasc > new Date()) return 'Data não pode ser futura';
        const idade = new Date().getFullYear() - dataNasc.getFullYear();
        if (idade < 13) return 'Idade mínima é 13 anos';
        if (idade > 120) return 'Idade máxima é 120 anos';
        return '';
    }

    static validateSenha(senha: string, isEdit: boolean = false): string {
        if (!isEdit && (!senha || !senha.trim())) return 'Senha é obrigatória';
        if (senha && senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        if (senha && senha.length > 100) return 'Senha deve ter no máximo 100 caracteres';
        return '';
    }

    static validateConfirmarSenha(senha: string, confirmarSenha: string, isEdit: boolean = false): string {
        if (!isEdit && (!confirmarSenha || !confirmarSenha.trim())) return 'Confirmação de senha é obrigatória';
        if (confirmarSenha && senha !== confirmarSenha) return 'Senhas não coincidem';
        return '';
    }

    // Validação completa do formulário
    static validateForm(formData: any, isEdit: boolean = false): Record<string, string> {
        const errors: Record<string, string> = {};

        errors.nome = this.validateNome(formData.nome);
        errors.email = this.validateEmail(formData.email);
        errors.cpf = this.validateCPF(formData.cpf);
        errors.telefone = this.validateTelefone(formData.telefone);
        errors.dataNascimento = this.validateDataNascimento(formData.dataNascimento);
        errors.senha = this.validateSenha(formData.senha, isEdit);
        errors.confirmarSenha = this.validateConfirmarSenha(formData.senha, formData.confirmarSenha, isEdit);

        // Remover erros vazios
        Object.keys(errors).forEach(key => {
            if (!errors[key]) delete errors[key];
        });

        return errors;
    }
}
