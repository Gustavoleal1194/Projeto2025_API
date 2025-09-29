using FluentValidation;
using Dominio.Dtos;

namespace Projeto2025_API.Validators
{
    public class UsuarioValidator : AbstractValidator<UsuarioDTO>
    {
        public UsuarioValidator()
        {
            // COPIAR EXATAMENTE as validações do frontend GerenciarUsuarios.tsx
            
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório")
                .Length(2, 100).WithMessage("Nome deve ter entre 2 e 100 caracteres")
                .Matches(@"^[a-zA-ZÀ-ÿ\s]+$").WithMessage("Nome deve conter apenas letras e espaços");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email inválido")
                .MaximumLength(255).WithMessage("Email deve ter no máximo 255 caracteres");

            RuleFor(x => x.CPF)
                .NotEmpty().WithMessage("CPF é obrigatório")
                .Must(ValidarCPF).WithMessage("CPF inválido");

            RuleFor(x => x.Telefone)
                .Must(ValidarTelefone).WithMessage("Telefone deve estar no formato (00) 00000-0000")
                .When(x => !string.IsNullOrEmpty(x.Telefone));

            RuleFor(x => x.DataNascimento)
                .Must(ValidarDataNascimento).WithMessage("Data de nascimento inválida");

            RuleFor(x => x.Senha)
                .NotEmpty().WithMessage("Senha é obrigatória")
                .MinimumLength(6).WithMessage("A senha deve ter pelo menos 6 caracteres")
                .When(x => x.Id == 0); // Apenas para novos usuários
        }

        // COPIAR EXATAMENTE o algoritmo do frontend
        private bool ValidarCPF(string cpf)
        {
            if (string.IsNullOrEmpty(cpf)) return false;
            
            // Remove caracteres não numéricos
            var cpfLimpo = cpf.Replace(".", "").Replace("-", "");
            
            // Verifica se tem 11 dígitos
            if (cpfLimpo.Length != 11) return false;
            
            // Verifica se não são todos iguais
            if (cpf.All(c => c == cpfLimpo[0])) return false;
            
            // Validação dos dígitos verificadores (algoritmo completo do frontend)
            int soma = 0;
            for (int i = 0; i < 9; i++)
            {
                soma += int.Parse(cpfLimpo[i].ToString()) * (10 - i);
            }
            int resto = 11 - (soma % 11);
            if (resto == 10 || resto == 11) resto = 0;
            if (resto != int.Parse(cpfLimpo[9].ToString())) return false;
            
            soma = 0;
            for (int i = 0; i < 10; i++)
            {
                soma += int.Parse(cpfLimpo[i].ToString()) * (11 - i);
            }
            resto = 11 - (soma % 11);
            if (resto == 10 || resto == 11) resto = 0;
            if (resto != int.Parse(cpfLimpo[10].ToString())) return false;
            
            return true;
        }

        private bool ValidarTelefone(string telefone)
        {
            if (string.IsNullOrEmpty(telefone)) return true;
            
            // Regex do formato (00) 00000-0000 ou (00) 0000-0000
            var telefoneRegex = @"^\(\d{2}\)\s\d{4,5}-\d{4}$";
            return System.Text.RegularExpressions.Regex.IsMatch(telefone, telefoneRegex);
        }

        private bool ValidarDataNascimento(DateTime data)
        {
            var hoje = DateTime.Today;
            var idade = hoje.Year - data.Year;
            
            // Idade válida entre 0 e 120 anos (igual ao frontend)
            return idade >= 0 && idade <= 120;
        }
    }
}
