using FluentValidation;
using Dominio.Dtos;

namespace Projeto2025_API.Validators
{
    public class EditoraValidator : AbstractValidator<EditoraDTO>
    {
        public EditoraValidator()
        {
            // Validações baseadas no formulário GerenciarEditoras.tsx
            
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório")
                .Length(2, 100).WithMessage("Nome deve ter entre 2 e 100 caracteres");

            RuleFor(x => x.CNPJ)
                .NotEmpty().WithMessage("CNPJ é obrigatório")
                .Must(ValidarCNPJ).WithMessage("CNPJ inválido");

            RuleFor(x => x.Telefone)
                .Must(ValidarTelefone).WithMessage("Telefone deve estar no formato (00) 00000-0000")
                .When(x => !string.IsNullOrEmpty(x.Telefone));

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email deve ser válido")
                .MaximumLength(255).WithMessage("Email deve ter no máximo 255 caracteres");

            RuleFor(x => x.Endereco)
                .NotEmpty().WithMessage("Endereço é obrigatório")
                .MaximumLength(200).WithMessage("Endereço deve ter no máximo 200 caracteres");

            RuleFor(x => x.Cidade)
                .NotEmpty().WithMessage("Cidade é obrigatória")
                .MaximumLength(100).WithMessage("Cidade deve ter no máximo 100 caracteres");

            RuleFor(x => x.Estado)
                .NotEmpty().WithMessage("Estado é obrigatório")
                .Length(2).WithMessage("Estado deve ter 2 caracteres")
                .Matches(@"^[A-Z]{2}$").WithMessage("Estado deve ser uma sigla válida");

            RuleFor(x => x.CEP)
                .NotEmpty().WithMessage("CEP é obrigatório")
                .Must(ValidarCEP).WithMessage("CEP deve estar no formato 00000-000");

            RuleFor(x => x.Pais)
                .NotEmpty().WithMessage("País é obrigatório")
                .MaximumLength(50).WithMessage("País deve ter no máximo 50 caracteres");

            RuleFor(x => x.DataFundacao)
                .NotEmpty().WithMessage("Data de fundação é obrigatória")
                .LessThan(DateTime.Today).WithMessage("Data de fundação não pode ser futura")
                .GreaterThan(new DateTime(1800, 1, 1)).WithMessage("Data de fundação deve ser após 1800");

            RuleFor(x => x.Site)
                .Must(ValidarUrl).WithMessage("Site deve ser uma URL válida")
                .When(x => !string.IsNullOrEmpty(x.Site));
        }

        private bool ValidarCNPJ(string cnpj)
        {
            if (string.IsNullOrEmpty(cnpj)) return false;
            
            var cnpjLimpo = cnpj.Replace(".", "").Replace("/", "").Replace("-", "");
            
            if (cnpjLimpo.Length != 14) return false;
            
            if (cnpjLimpo.All(c => c == cnpjLimpo[0])) return false;
            
            // Validação básica de CNPJ (pode ser expandida)
            return true;
        }

        private bool ValidarTelefone(string telefone)
        {
            if (string.IsNullOrEmpty(telefone)) return true;
            
            var telefoneRegex = @"^\(\d{2}\)\s\d{4,5}-\d{4}$";
            return System.Text.RegularExpressions.Regex.IsMatch(telefone, telefoneRegex);
        }

        private bool ValidarCEP(string cep)
        {
            if (string.IsNullOrEmpty(cep)) return false;
            
            var cepRegex = @"^\d{5}-\d{3}$";
            return System.Text.RegularExpressions.Regex.IsMatch(cep, cepRegex);
        }

        private bool ValidarUrl(string url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            
            return Uri.TryCreate(url, UriKind.Absolute, out Uri? result) &&
                   (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
        }
    }
}
