export class EditoraValidator {
    static validateNome(nome: string): string {
        if (!nome || !nome.trim()) return 'Nome é obrigatório';
        if (nome.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        if (nome.trim().length > 100) return 'Nome deve ter no máximo 100 caracteres';
        return '';
    }

    static validateCNPJ(cnpj: string): string {
        if (!cnpj || !cnpj.trim()) return 'CNPJ é obrigatório';

        const cnpjLimpo = cnpj.replace(/\D/g, '');
        if (cnpjLimpo.length !== 14) return 'CNPJ deve ter 14 dígitos';

        // Verificar se todos os dígitos são iguais
        if (cnpjLimpo.split('').every(digit => digit === cnpjLimpo[0])) return 'CNPJ inválido';

        // Algoritmo de validação do CNPJ
        let soma = 0;
        let peso = 2;

        // Calcular primeiro dígito verificador
        for (let i = 11; i >= 0; i--) {
            soma += parseInt(cnpjLimpo[i]) * peso;
            peso = peso === 9 ? 2 : peso + 1;
        }

        let resto = soma % 11;
        let primeiroDigito = resto < 2 ? 0 : 11 - resto;

        if (parseInt(cnpjLimpo[12]) !== primeiroDigito) return 'CNPJ inválido';

        // Calcular segundo dígito verificador
        soma = 0;
        peso = 2;

        for (let i = 12; i >= 0; i--) {
            soma += parseInt(cnpjLimpo[i]) * peso;
            peso = peso === 9 ? 2 : peso + 1;
        }

        resto = soma % 11;
        let segundoDigito = resto < 2 ? 0 : 11 - resto;

        if (parseInt(cnpjLimpo[13]) !== segundoDigito) return 'CNPJ inválido';

        return '';
    }

    static validateTelefone(telefone: string): string {
        if (!telefone || !telefone.trim()) return '';

        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 10) return 'Telefone deve ter pelo menos 10 dígitos';
        if (telefoneLimpo.length > 11) return 'Telefone deve ter no máximo 11 dígitos';

        return '';
    }

    static validateEmail(email: string): string {
        if (!email || !email.trim()) return 'Email é obrigatório';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return 'Email deve ter um formato válido';
        if (email.trim().length > 100) return 'Email deve ter no máximo 100 caracteres';

        return '';
    }

    static validateEndereco(endereco: string): string {
        if (endereco && endereco.trim().length > 200) return 'Endereço deve ter no máximo 200 caracteres';
        return '';
    }

    static validateCidade(cidade: string): string {
        if (cidade && cidade.trim().length > 100) return 'Cidade deve ter no máximo 100 caracteres';
        return '';
    }

    static validateEstado(estado: string): string {
        if (estado && estado.trim().length > 50) return 'Estado deve ter no máximo 50 caracteres';
        return '';
    }

    static validateCEP(cep: string): string {
        if (!cep || !cep.trim()) return '';

        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return 'CEP deve ter 8 dígitos';

        return '';
    }

    static validatePais(pais: string): string {
        if (pais && pais.trim().length > 50) return 'País deve ter no máximo 50 caracteres';
        return '';
    }

    static validateDataFundacao(dataFundacao: string): string {
        if (!dataFundacao || !dataFundacao.trim()) return '';

        const data = new Date(dataFundacao);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (isNaN(data.getTime())) return 'Data de fundação inválida';
        if (data > hoje) return 'Data de fundação não pode ser futura';

        // Verificar se não é muito antiga (mais de 200 anos)
        const duzentosAnosAtras = new Date();
        duzentosAnosAtras.setFullYear(hoje.getFullYear() - 200);
        if (data < duzentosAnosAtras) return 'Data de fundação muito antiga';

        return '';
    }

    static validateSite(site: string): string {
        if (!site || !site.trim()) return '';

        if (site.trim().length > 200) return 'Site deve ter no máximo 200 caracteres';

        return '';
    }

    static validateForm(formData: any): Record<string, string> {
        const errors: Record<string, string> = {};

        errors.nome = this.validateNome(formData.nome);
        errors.cnpj = this.validateCNPJ(formData.cnpj);
        errors.telefone = this.validateTelefone(formData.telefone);
        errors.email = this.validateEmail(formData.email);
        errors.endereco = this.validateEndereco(formData.endereco);
        errors.cidade = this.validateCidade(formData.cidade);
        errors.estado = this.validateEstado(formData.estado);
        errors.cep = this.validateCEP(formData.cep);
        errors.pais = this.validatePais(formData.pais);
        errors.dataFundacao = this.validateDataFundacao(formData.dataFundacao);
        errors.site = this.validateSite(formData.site);

        // Remover erros vazios
        Object.keys(errors).forEach(key => {
            if (!errors[key]) {
                delete errors[key];
            }
        });

        return errors;
    }
}
