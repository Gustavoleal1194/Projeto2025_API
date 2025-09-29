using FluentValidation;
using Dominio.Dtos;

namespace Projeto2025_API.Validators
{
    public class AutorValidator : AbstractValidator<AutorDTO>
    {
        public AutorValidator()
        {
            // Validações baseadas no formulário GerenciarAutores.tsx
            
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório")
                .Length(2, 100).WithMessage("Nome deve ter entre 2 e 100 caracteres")
                .Matches(@"^[a-zA-ZÀ-ÿ\s]+$").WithMessage("Nome deve conter apenas letras e espaços");

            RuleFor(x => x.Nacionalidade)
                .NotEmpty().WithMessage("Nacionalidade é obrigatória")
                .MaximumLength(50).WithMessage("Nacionalidade deve ter no máximo 50 caracteres");

            RuleFor(x => x.DataNascimento)
                .NotEmpty().WithMessage("Data de nascimento é obrigatória")
                .LessThan(DateTime.Today).WithMessage("Data de nascimento não pode ser futura")
                .GreaterThan(new DateTime(1800, 1, 1)).WithMessage("Data de nascimento deve ser após 1800");

            // Biografia não existe no DTO, removendo validação

            RuleFor(x => x.Website)
                .Must(ValidarUrl).WithMessage("Website deve ser uma URL válida")
                .When(x => !string.IsNullOrEmpty(x.Website));

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email deve ser válido")
                .MaximumLength(255).WithMessage("Email deve ter no máximo 255 caracteres");

            RuleFor(x => x.Telefone)
                .Must(ValidarTelefone).WithMessage("Telefone deve estar no formato (00) 00000-0000")
                .When(x => !string.IsNullOrEmpty(x.Telefone));
        }

        private bool ValidarUrl(string url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            
            return Uri.TryCreate(url, UriKind.Absolute, out Uri? result) &&
                   (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
        }

        private bool ValidarTelefone(string telefone)
        {
            if (string.IsNullOrEmpty(telefone)) return true;
            
            var telefoneRegex = @"^\(\d{2}\)\s\d{4,5}-\d{4}$";
            return System.Text.RegularExpressions.Regex.IsMatch(telefone, telefoneRegex);
        }
    }
}
