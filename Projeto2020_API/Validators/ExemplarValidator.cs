using FluentValidation;
using Dominio.Dtos;

namespace Projeto2025_API.Validators
{
    public class ExemplarValidator : AbstractValidator<ExemplarDTO>
    {
        public ExemplarValidator()
        {
            // Validações baseadas no formulário GerenciarExemplares.tsx
            
            RuleFor(x => x.IdLivro)
                .NotEmpty().WithMessage("Livro é obrigatório")
                .GreaterThan(0).WithMessage("Livro deve ser selecionado");

            RuleFor(x => x.NumeroExemplar)
                .NotEmpty().WithMessage("Número do exemplar é obrigatório")
                .MaximumLength(50).WithMessage("Número do exemplar deve ter no máximo 50 caracteres");

            RuleFor(x => x.Localizacao)
                .MaximumLength(100).WithMessage("Localização deve ter no máximo 100 caracteres");

            RuleFor(x => x.Condicao)
                .NotEmpty().WithMessage("Condição é obrigatória")
                .Must(ValidarCondicao).WithMessage("Condição deve ser: Bom, Regular ou Ruim");

            RuleFor(x => x.DataAquisicao)
                .NotEmpty().WithMessage("Data de aquisição é obrigatória")
                .LessThanOrEqualTo(DateTime.Today).WithMessage("Data de aquisição não pode ser futura");

            RuleFor(x => x.ValorAquisicao)
                .NotEmpty().WithMessage("Valor de aquisição é obrigatório")
                .GreaterThanOrEqualTo(0).WithMessage("Valor de aquisição deve ser maior ou igual a 0");

            RuleFor(x => x.Fornecedor)
                .MaximumLength(100).WithMessage("Fornecedor deve ter no máximo 100 caracteres");

            RuleFor(x => x.Observacoes)
                .MaximumLength(500).WithMessage("Observações devem ter no máximo 500 caracteres");
        }

        private bool ValidarCondicao(string condicao)
        {
            if (string.IsNullOrEmpty(condicao)) return false;
            
            var condicoesValidas = new[] { "Bom", "Regular", "Ruim" };
            return condicoesValidas.Contains(condicao);
        }
    }
}
