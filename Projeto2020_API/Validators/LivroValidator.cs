using FluentValidation;
using Dominio.Dtos;

namespace Projeto2025_API.Validators
{
    public class LivroValidator : AbstractValidator<LivroDTO>
    {
        public LivroValidator()
        {
            // Validações baseadas no formulário GerenciarLivros.tsx
            
            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("Título é obrigatório")
                .MaximumLength(200).WithMessage("Título deve ter no máximo 200 caracteres");

            RuleFor(x => x.Subtitulo)
                .MaximumLength(200).WithMessage("Subtítulo deve ter no máximo 200 caracteres");

            RuleFor(x => x.ISBN)
                .NotEmpty().WithMessage("ISBN é obrigatório")
                .MaximumLength(20).WithMessage("ISBN deve ter no máximo 20 caracteres");

            RuleFor(x => x.Ano)
                .NotEmpty().WithMessage("Ano é obrigatório")
                .InclusiveBetween(1000, DateTime.Now.Year).WithMessage("Ano deve ser válido");

            RuleFor(x => x.Edicao)
                .NotEmpty().WithMessage("Edição é obrigatória")
                .GreaterThan(0).WithMessage("Edição deve ser maior que 0");

            RuleFor(x => x.NumeroPaginas)
                .NotEmpty().WithMessage("Número de páginas é obrigatório")
                .GreaterThan(0).WithMessage("Número de páginas deve ser maior que 0");

            RuleFor(x => x.Idioma)
                .NotEmpty().WithMessage("Idioma é obrigatório")
                .MaximumLength(50).WithMessage("Idioma deve ter no máximo 50 caracteres");

            RuleFor(x => x.Genero)
                .NotEmpty().WithMessage("Gênero é obrigatório")
                .MaximumLength(50).WithMessage("Gênero deve ter no máximo 50 caracteres");

            RuleFor(x => x.Sinopse)
                .MaximumLength(2000).WithMessage("Sinopse deve ter no máximo 2000 caracteres");

            RuleFor(x => x.Preco)
                .NotEmpty().WithMessage("Preço é obrigatório")
                .GreaterThanOrEqualTo(0).WithMessage("Preço deve ser maior ou igual a 0");

            RuleFor(x => x.CapaUrl)
                .Must(ValidarUrl).WithMessage("URL da capa deve ser válida")
                .When(x => !string.IsNullOrEmpty(x.CapaUrl));

            RuleFor(x => x.CodigoBarras)
                .MaximumLength(50).WithMessage("Código de barras deve ter no máximo 50 caracteres");

            RuleFor(x => x.IdAutor)
                .NotEmpty().WithMessage("Autor é obrigatório")
                .GreaterThan(0).WithMessage("Autor deve ser selecionado");

            RuleFor(x => x.IdEditora)
                .NotEmpty().WithMessage("Editora é obrigatória")
                .GreaterThan(0).WithMessage("Editora deve ser selecionada");
        }

        private bool ValidarUrl(string url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            
            return Uri.TryCreate(url, UriKind.Absolute, out Uri? result) &&
                   (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
        }
    }
}
