using FluentValidation;

namespace Projeto2025_API.Validation
{
    public class EditoraValidation : AbstractValidator<EditoraDTO>
    {
        public EditoraValidation()
        {
            RuleFor(e => e.Nome)
                .NotEmpty().WithMessage("O nome da editora é obrigatório.")
                .MinimumLength(2).WithMessage("O nome deve ter no mínimo 2 caracteres.")
                .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

            RuleFor(e => e.Endereco)
                .NotEmpty().WithMessage("O endereço da editora é obrigatório.")
                .MaximumLength(200).WithMessage("O endereço deve ter no máximo 200 caracteres.");

            
        }
    }
}
