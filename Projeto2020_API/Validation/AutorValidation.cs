using FluentValidation;

namespace Projeto2025_API.Validation
{
    public class AutorValidation : AbstractValidator<AutorDTO>
    {
        public AutorValidation()
        {
            RuleFor(p => p.Nome)
                .NotEmpty().WithMessage("O nome do autor é obrigatório.")
                .MinimumLength(2).WithMessage("O nome deve ter no mínimo 2 caracteres.")
                .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

            RuleFor(p => p.Nacionalidade)
                .NotEmpty().WithMessage("A nacionalidade é obrigatória.")
                .MaximumLength(50).WithMessage("A nacionalidade deve ter no máximo 50 caracteres.");

            RuleFor(p => p.DataNascimento)
                .NotEmpty().WithMessage("A data de nascimento é obrigatória.")
                .LessThan(DateTime.Today).WithMessage("A data de nascimento deve ser anterior à data atual.");

          
        }
    }
}
