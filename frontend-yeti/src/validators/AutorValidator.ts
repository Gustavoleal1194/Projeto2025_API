export class AutorValidator {
    static validateNome(nome: string): string {
        if (!nome || !nome.trim()) return 'Nome é obrigatório';
        if (nome.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        if (nome.trim().length > 100) return 'Nome deve ter no máximo 100 caracteres';
        return '';
    }

    static validateNomeCompleto(nomeCompleto: string): string {
        if (nomeCompleto && nomeCompleto.trim().length > 200) return 'Nome completo deve ter no máximo 200 caracteres';
        return '';
    }

    static validateNomeArtistico(nomeArtistico: string): string {
        if (nomeArtistico && nomeArtistico.trim().length > 100) return 'Nome artístico deve ter no máximo 100 caracteres';
        return '';
    }

    static validateNacionalidade(nacionalidade: string): string {
        if (!nacionalidade || !nacionalidade.trim()) return 'Nacionalidade é obrigatória';
        if (nacionalidade.trim().length < 2) return 'Nacionalidade deve ter pelo menos 2 caracteres';
        if (nacionalidade.trim().length > 50) return 'Nacionalidade deve ter no máximo 50 caracteres';
        return '';
    }

    static validatePaisOrigem(paisOrigem: string): string {
        if (paisOrigem && paisOrigem.trim().length > 50) return 'País de origem deve ter no máximo 50 caracteres';
        return '';
    }

    static validateDataNascimento(dataNascimento: string): string {
        if (!dataNascimento || !dataNascimento.trim()) return 'Data de nascimento é obrigatória';

        const data = new Date(dataNascimento);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (isNaN(data.getTime())) return 'Data de nascimento inválida';
        if (data > hoje) return 'Data de nascimento não pode ser futura';

        // Verificar se não é muito antiga (mais de 150 anos)
        const centoCinquentaAnosAtras = new Date();
        centoCinquentaAnosAtras.setFullYear(hoje.getFullYear() - 150);
        if (data < centoCinquentaAnosAtras) return 'Data de nascimento muito antiga';

        return '';
    }

    static validateWebsite(website: string): string {
        if (!website || !website.trim()) return '';

        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(website.trim())) return 'Website deve começar com http:// ou https://';
        if (website.trim().length > 200) return 'Website deve ter no máximo 200 caracteres';

        return '';
    }

    static validateEmail(email: string): string {
        if (!email || !email.trim()) return '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return 'Email deve ter um formato válido';
        if (email.trim().length > 100) return 'Email deve ter no máximo 100 caracteres';

        return '';
    }

    static validateTelefone(telefone: string): string {
        if (!telefone || !telefone.trim()) return '';

        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 10) return 'Telefone deve ter pelo menos 10 dígitos';
        if (telefoneLimpo.length > 11) return 'Telefone deve ter no máximo 11 dígitos';

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

    static validateForm(formData: any): Record<string, string> {
        const errors: Record<string, string> = {};

        errors.nome = this.validateNome(formData.nome);
        errors.nomeCompleto = this.validateNomeCompleto(formData.nomeCompleto);
        errors.nomeArtistico = this.validateNomeArtistico(formData.nomeArtistico);
        errors.nacionalidade = this.validateNacionalidade(formData.nacionalidade);
        errors.paisOrigem = this.validatePaisOrigem(formData.paisOrigem);
        errors.dataNascimento = this.validateDataNascimento(formData.dataNascimento);
        errors.website = this.validateWebsite(formData.website);
        errors.email = this.validateEmail(formData.email);
        errors.telefone = this.validateTelefone(formData.telefone);
        errors.endereco = this.validateEndereco(formData.endereco);
        errors.cidade = this.validateCidade(formData.cidade);
        errors.estado = this.validateEstado(formData.estado);
        errors.cep = this.validateCEP(formData.cep);
        errors.pais = this.validatePais(formData.pais);

        // Remover erros vazios
        Object.keys(errors).forEach(key => {
            if (!errors[key]) {
                delete errors[key];
            }
        });

        return errors;
    }
}
