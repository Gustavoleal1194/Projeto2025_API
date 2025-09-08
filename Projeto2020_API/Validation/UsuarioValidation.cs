using FluentValidation;

namespace Projeto2025_API.Validation
{
    public class UsuarioValidation : AbstractValidator<UsuarioDTO>
    {
        public UsuarioValidation()
        {
            RuleFor(u => u.Nome)
                .NotEmpty().WithMessage("O nome do usuário é obrigatório.")
                .MinimumLength(2).WithMessage("O nome deve ter no mínimo 2 caracteres.")
                .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

            RuleFor(u => u.Email)
                .NotEmpty().WithMessage("O email é obrigatório.")
                .EmailAddress().WithMessage("O email informado não é válido.");

            RuleFor(u => u.Telefone)
                .NotEmpty().WithMessage("O telefone é obrigatório.")
                .MinimumLength(8).WithMessage("O telefone deve ter no mínimo 8 caracteres.")
                .MaximumLength(20).WithMessage("O telefone deve ter no máximo 20 caracteres. ");
        }
    }
}
