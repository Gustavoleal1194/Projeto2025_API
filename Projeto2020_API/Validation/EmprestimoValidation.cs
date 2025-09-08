using FluentValidation;
using System;

namespace Projeto2025_API.Validation
{
    public class EmprestimoValidation : AbstractValidator<EmprestimoDTO>
    {
        public EmprestimoValidation()
        {
            RuleFor(e => e.IdLivro)
                .GreaterThan(0).WithMessage("O ID do livro é obrigatório e deve ser maior que zero.");

            RuleFor(e => e.IdUsuario)
                .GreaterThan(0).WithMessage("O ID do usuário é obrigatório e deve ser maior que zero.");

            RuleFor(e => e.DataEmprestimo)
                .NotEmpty().WithMessage("A data do empréstimo é obrigatória.")
                .LessThanOrEqualTo(DateTime.Today).WithMessage("A data do empréstimo não pode ser futura.");

            RuleFor(e => e.DataDevolucao)
                .Must((dto, dataDevolucao) =>
                    dataDevolucao == null || dataDevolucao >= dto.DataEmprestimo
                )
                .WithMessage("A data de devolução não pode ser anterior à data do empréstimo.");
        }
    }
}
