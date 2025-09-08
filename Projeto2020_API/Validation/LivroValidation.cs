using FluentValidation;
using System;

namespace Projeto2025_API.Validation
{
    public class LivroValidation : AbstractValidator<LivroDTO>
    {
        public LivroValidation()
        {
            RuleFor(l => l.Titulo)
                .NotEmpty().WithMessage("O título é obrigatório.")
                .MaximumLength(200).WithMessage("O título deve ter no máximo 200 caracteres.");

            RuleFor(l => l.ISBN)
                .NotEmpty().WithMessage("O ISBN é obrigatório.")
                .MaximumLength(13).WithMessage("O ISBN deve ter no máximo 13 caracteres.");

            RuleFor(l => l.Ano)
                .InclusiveBetween(1500, DateTime.Now.Year)
                .WithMessage($"O ano deve estar entre 1500 e {DateTime.Now.Year}.");

            RuleFor(l => l.IdAutor)
                .GreaterThan(0).WithMessage("O ID do autor é obrigatório.");

            RuleFor(l => l.IdEditora)
                .GreaterThan(0).WithMessage("O ID da editora é obrigatório.");
        }
    }
}
