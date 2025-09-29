using FluentValidation;
using Dominio.Dtos;

namespace Projeto2025_API.Validators
{
    public class EmprestimoValidator : AbstractValidator<EmprestimoDTO>
    {
        public EmprestimoValidator()
        {
            // Validações baseadas no formulário GerenciarEmprestimos.tsx
            
            RuleFor(x => x.IdUsuario)
                .NotEmpty().WithMessage("Usuário é obrigatório")
                .GreaterThan(0).WithMessage("Usuário deve ser selecionado");

            RuleFor(x => x.IdExemplar)
                .NotEmpty().WithMessage("Exemplar é obrigatório")
                .GreaterThan(0).WithMessage("Exemplar deve ser selecionado");

            RuleFor(x => x.DataEmprestimo)
                .NotEmpty().WithMessage("Data de empréstimo é obrigatória")
                .LessThanOrEqualTo(DateTime.Today).WithMessage("Data de empréstimo não pode ser futura");

            RuleFor(x => x.DataPrevistaDevolucao)
                .NotEmpty().WithMessage("Data de vencimento é obrigatória")
                .GreaterThan(x => x.DataEmprestimo).WithMessage("Data de vencimento deve ser posterior ao empréstimo");

            RuleFor(x => x.Observacoes)
                .MaximumLength(500).WithMessage("Observações devem ter no máximo 500 caracteres");
        }
    }
}
