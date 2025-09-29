using FluentValidation;
using Dominio.Dtos;

namespace Projeto2025_API.Validators
{
    public class FuncionarioValidator : AbstractValidator<FuncionarioDTO>
    {
        public FuncionarioValidator()
        {
            // Validações baseadas no formulário GerenciarFuncionarios.tsx
            
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório")
                .Length(2, 100).WithMessage("Nome deve ter entre 2 e 100 caracteres")
                .Matches(@"^[a-zA-ZÀ-ÿ\s]+$").WithMessage("Nome deve conter apenas letras e espaços");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email deve ser válido")
                .MaximumLength(255).WithMessage("Email deve ter no máximo 255 caracteres");

            RuleFor(x => x.Telefone)
                .Must(ValidarTelefone).WithMessage("Telefone deve estar no formato (00) 00000-0000")
                .When(x => !string.IsNullOrEmpty(x.Telefone));

            RuleFor(x => x.Senha)
                .NotEmpty().WithMessage("Senha é obrigatória")
                .MinimumLength(6).WithMessage("A senha deve ter pelo menos 6 caracteres")
                .When(x => x.Id == 0); // Apenas para novos funcionários

            RuleFor(x => x.Cargo)
                .NotEmpty().WithMessage("Cargo é obrigatório")
                .MaximumLength(50).WithMessage("Cargo deve ter no máximo 50 caracteres");

            RuleFor(x => x.Salario)
                .NotEmpty().WithMessage("Salário é obrigatório")
                .GreaterThan(0).WithMessage("Salário deve ser maior que 0");

            RuleFor(x => x.DataAdmissao)
                .NotEmpty().WithMessage("Data de admissão é obrigatória")
                .LessThanOrEqualTo(DateTime.Today).WithMessage("Data de admissão não pode ser futura");

            RuleFor(x => x.DataDemissao)
                .GreaterThan(x => x.DataAdmissao).WithMessage("Data de demissão deve ser posterior à admissão")
                .When(x => x.DataDemissao.HasValue);
        }

        private bool ValidarTelefone(string telefone)
        {
            if (string.IsNullOrEmpty(telefone)) return true;
            
            var telefoneRegex = @"^\(\d{2}\)\s\d{4,5}-\d{4}$";
            return System.Text.RegularExpressions.Regex.IsMatch(telefone, telefoneRegex);
        }
    }
}
