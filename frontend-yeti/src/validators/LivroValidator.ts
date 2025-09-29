// Validador centralizado para Livros - Sincronizado com backend FluentValidation
export class LivroValidator {
    static validateTitulo(titulo: string): string {
        if (!titulo || !titulo.trim()) return 'Título é obrigatório';
        if (titulo.trim().length < 2) return 'Título deve ter pelo menos 2 caracteres';
        if (titulo.trim().length > 200) return 'Título deve ter no máximo 200 caracteres';
        return '';
    }

    static validateSubtitulo(subtitulo: string): string {
        if (subtitulo && subtitulo.trim().length > 200) return 'Subtítulo deve ter no máximo 200 caracteres';
        return '';
    }

    static validateISBN(isbn: string): string {
        if (!isbn || !isbn.trim()) return 'ISBN é obrigatório';
        const isbnLimpo = isbn.replace(/\D/g, '');
        if (isbnLimpo.length !== 10 && isbnLimpo.length !== 13) return 'ISBN deve ter 10 ou 13 dígitos';
        return '';
    }

    static validateAno(ano: number): string {
        if (!ano) return 'Ano é obrigatório';
        const anoAtual = new Date().getFullYear();
        if (ano < 1000) return 'Ano deve ser maior que 1000';
        if (ano > anoAtual + 1) return `Ano deve ser menor que ${anoAtual + 2}`;
        return '';
    }

    static validateEdicao(edicao: number): string {
        if (edicao && edicao < 1) return 'Edição deve ser maior que zero';
        return '';
    }

    static validateNumeroPaginas(numeroPaginas: number): string {
        if (numeroPaginas && numeroPaginas <= 0) return 'Número de páginas deve ser maior que zero';
        if (numeroPaginas && numeroPaginas > 10000) return 'Número de páginas deve ser menor que 10000';
        return '';
    }

    static validateIdioma(idioma: string): string {
        if (idioma && idioma.length > 50) return 'Idioma deve ter no máximo 50 caracteres';
        return '';
    }

    static validateGenero(genero: string): string {
        if (!genero || !genero.trim()) return 'Gênero é obrigatório';
        if (genero.trim().length > 100) return 'Gênero deve ter no máximo 100 caracteres';
        return '';
    }

    static validateSinopse(sinopse: string): string {
        if (!sinopse || !sinopse.trim()) return 'Sinopse é obrigatória';
        if (sinopse.trim().length < 10) return 'Sinopse deve ter pelo menos 10 caracteres';
        if (sinopse.trim().length > 2000) return 'Sinopse deve ter no máximo 2000 caracteres';
        return '';
    }

    static validatePreco(preco: number): string {
        if (preco && preco < 0) return 'Preço não pode ser negativo';
        if (preco && preco > 10000) return 'Preço deve ser menor que R$ 10.000';
        return '';
    }

    static validateCapaUrl(capaUrl: string): string {
        if (capaUrl && capaUrl.length > 500) return 'URL da capa deve ter no máximo 500 caracteres';
        if (capaUrl && !this.isValidUrl(capaUrl)) return 'URL da capa inválida';
        return '';
    }

    static validateCodigoBarras(codigoBarras: string): string {
        if (codigoBarras && codigoBarras.length > 50) return 'Código de barras deve ter no máximo 50 caracteres';
        return '';
    }

    static validateIdAutor(idAutor: number): string {
        if (!idAutor || idAutor === 0) return 'Autor é obrigatório';
        return '';
    }

    static validateIdEditora(idEditora: number): string {
        if (!idEditora || idEditora === 0) return 'Editora é obrigatória';
        return '';
    }

    private static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Validação completa do formulário
    static validateForm(formData: any): Record<string, string> {
        const errors: Record<string, string> = {};

        errors.titulo = this.validateTitulo(formData.titulo);
        errors.subtitulo = this.validateSubtitulo(formData.subtitulo);
        errors.isbn = this.validateISBN(formData.isbn);
        errors.ano = this.validateAno(formData.ano);
        errors.edicao = this.validateEdicao(formData.edicao);
        errors.numeroPaginas = this.validateNumeroPaginas(formData.numeroPaginas);
        errors.idioma = this.validateIdioma(formData.idioma);
        errors.genero = this.validateGenero(formData.genero);
        errors.sinopse = this.validateSinopse(formData.sinopse);
        errors.preco = this.validatePreco(formData.preco);
        errors.capaUrl = this.validateCapaUrl(formData.capaUrl);
        errors.codigoBarras = this.validateCodigoBarras(formData.codigoBarras);
        errors.idAutor = this.validateIdAutor(formData.idAutor);
        errors.idEditora = this.validateIdEditora(formData.idEditora);

        // Remover erros vazios
        Object.keys(errors).forEach(key => {
            if (!errors[key]) delete errors[key];
        });

        return errors;
    }
}
