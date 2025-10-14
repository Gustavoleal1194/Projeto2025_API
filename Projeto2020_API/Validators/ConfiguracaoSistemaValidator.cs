using FluentValidation;
using Dominio.Dtos;

namespace Projeto2025_API.Validators
{
    /// <summary>
    /// Validador para configurações do sistema
    /// </summary>
    public class ConfiguracaoSistemaValidator : AbstractValidator<ConfiguracaoSistemaRequestDTO>
    {
        public ConfiguracaoSistemaValidator()
        {
            // Validações das configurações gerais do sistema
            RuleFor(x => x.NomeBiblioteca)
                .NotEmpty().WithMessage("Nome da biblioteca é obrigatório")
                .MaximumLength(200).WithMessage("Nome da biblioteca deve ter no máximo 200 caracteres")
                .Matches(@"^[a-zA-ZÀ-ÿ0-9\s\-\.]+$").WithMessage("Nome da biblioteca contém caracteres inválidos");

            RuleFor(x => x.Endereco)
                .NotEmpty().WithMessage("Endereço é obrigatório")
                .MaximumLength(500).WithMessage("Endereço deve ter no máximo 500 caracteres");

            RuleFor(x => x.Telefone)
                .NotEmpty().WithMessage("Telefone é obrigatório")
                .Must(ValidarTelefone).WithMessage("Telefone deve estar no formato (00) 00000-0000");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email inválido")
                .MaximumLength(255).WithMessage("Email deve ter no máximo 255 caracteres");

            RuleFor(x => x.HorarioFuncionamento)
                .NotEmpty().WithMessage("Horário de funcionamento é obrigatório")
                .MaximumLength(100).WithMessage("Horário de funcionamento deve ter no máximo 100 caracteres");

            RuleFor(x => x.DiasFuncionamento)
                .NotEmpty().WithMessage("Dias de funcionamento são obrigatórios")
                .MaximumLength(100).WithMessage("Dias de funcionamento devem ter no máximo 100 caracteres");

            // Validações dos limites do sistema
            RuleFor(x => x.MaxUsuarios)
                .GreaterThan(0).WithMessage("Máximo de usuários deve ser maior que 0")
                .LessThanOrEqualTo(100000).WithMessage("Máximo de usuários não pode ser maior que 100.000");

            RuleFor(x => x.MaxLivros)
                .GreaterThan(0).WithMessage("Máximo de livros deve ser maior que 0")
                .LessThanOrEqualTo(1000000).WithMessage("Máximo de livros não pode ser maior que 1.000.000");

            RuleFor(x => x.MaxExemplares)
                .GreaterThan(0).WithMessage("Máximo de exemplares deve ser maior que 0")
                .LessThanOrEqualTo(10000000).WithMessage("Máximo de exemplares não pode ser maior que 10.000.000");

            RuleFor(x => x.MaxEmprestimosPorUsuario)
                .GreaterThan(0).WithMessage("Máximo de empréstimos por usuário deve ser maior que 0")
                .LessThanOrEqualTo(50).WithMessage("Máximo de empréstimos por usuário não pode ser maior que 50");

            // Validações dos parâmetros de empréstimo
            RuleFor(x => x.MaxRenovacoes)
                .GreaterThanOrEqualTo(0).WithMessage("Máximo de renovações deve ser maior ou igual a 0")
                .LessThanOrEqualTo(10).WithMessage("Máximo de renovações não pode ser maior que 10");

            RuleFor(x => x.DiasEmprestimo)
                .GreaterThan(0).WithMessage("Dias de empréstimo deve ser maior que 0")
                .LessThanOrEqualTo(365).WithMessage("Dias de empréstimo não pode ser maior que 365");

            RuleFor(x => x.MultaPorDia)
                .GreaterThanOrEqualTo(0).WithMessage("Multa por dia deve ser maior ou igual a 0")
                .LessThanOrEqualTo(100).WithMessage("Multa por dia não pode ser maior que 100");

            RuleFor(x => x.ValorMaximoMulta)
                .GreaterThanOrEqualTo(0).WithMessage("Valor máximo de multa deve ser maior ou igual a 0")
                .LessThanOrEqualTo(1000).WithMessage("Valor máximo de multa não pode ser maior que 1000");

            RuleFor(x => x.DiasParaAtraso)
                .GreaterThanOrEqualTo(0).WithMessage("Dias para atraso deve ser maior ou igual a 0")
                .LessThanOrEqualTo(30).WithMessage("Dias para atraso não pode ser maior que 30");

            RuleFor(x => x.DiasParaBloqueio)
                .GreaterThanOrEqualTo(0).WithMessage("Dias para bloqueio deve ser maior ou igual a 0")
                .LessThanOrEqualTo(365).WithMessage("Dias para bloqueio não pode ser maior que 365");

            RuleFor(x => x.DiasAntecedenciaRenovacao)
                .GreaterThanOrEqualTo(0).WithMessage("Dias de antecedência para renovação deve ser maior ou igual a 0")
                .LessThanOrEqualTo(30).WithMessage("Dias de antecedência para renovação não pode ser maior que 30");

            RuleFor(x => x.DiasAntecedenciaReserva)
                .GreaterThanOrEqualTo(0).WithMessage("Dias de antecedência para reserva deve ser maior ou igual a 0")
                .LessThanOrEqualTo(30).WithMessage("Dias de antecedência para reserva não pode ser maior que 30");

            RuleFor(x => x.DiasValidadeReserva)
                .GreaterThan(0).WithMessage("Dias de validade da reserva deve ser maior que 0")
                .LessThanOrEqualTo(30).WithMessage("Dias de validade da reserva não pode ser maior que 30");

            // Validações das configurações de notificação
            RuleFor(x => x.EmailNotificacao)
                .NotEmpty().WithMessage("Email de notificação é obrigatório")
                .EmailAddress().WithMessage("Email de notificação inválido")
                .MaximumLength(255).WithMessage("Email de notificação deve ter no máximo 255 caracteres");

            RuleFor(x => x.TemplateEmail)
                .NotEmpty().WithMessage("Template de email é obrigatório")
                .MaximumLength(100).WithMessage("Template de email deve ter no máximo 100 caracteres");

            RuleFor(x => x.TemplateSMS)
                .NotEmpty().WithMessage("Template de SMS é obrigatório")
                .MaximumLength(100).WithMessage("Template de SMS deve ter no máximo 100 caracteres");

            // Validações das configurações de backup
            RuleFor(x => x.FrequenciaBackup)
                .NotEmpty().WithMessage("Frequência de backup é obrigatória")
                .Must(ValidarFrequenciaBackup).WithMessage("Frequência de backup deve ser: Diário, Semanal ou Mensal");

            RuleFor(x => x.HoraBackup)
                .NotEmpty().WithMessage("Hora do backup é obrigatória")
                .Must(ValidarHoraBackup).WithMessage("Hora do backup deve estar no formato HH:MM");

            RuleFor(x => x.RetencaoBackup)
                .GreaterThan(0).WithMessage("Retenção de backup deve ser maior que 0")
                .LessThanOrEqualTo(3650).WithMessage("Retenção de backup não pode ser maior que 3650 dias (10 anos)");

            RuleFor(x => x.LocalizacaoBackup)
                .NotEmpty().WithMessage("Localização do backup é obrigatória")
                .MaximumLength(500).WithMessage("Localização do backup deve ter no máximo 500 caracteres");

            // Validações das configurações de sistema
            RuleFor(x => x.LogLevel)
                .NotEmpty().WithMessage("Nível de log é obrigatório")
                .Must(ValidarLogLevel).WithMessage("Nível de log deve ser: Trace, Debug, Information, Warning, Error ou Critical");

            RuleFor(x => x.Observacoes)
                .MaximumLength(1000).WithMessage("Observações devem ter no máximo 1000 caracteres");

            // Validação de data de manutenção
            RuleFor(x => x.DataManutencao)
                .Must(ValidarDataManutencao).WithMessage("Data de manutenção deve ser futura")
                .When(x => x.ManutencaoProgramada && x.DataManutencao.HasValue);
        }

        private bool ValidarTelefone(string telefone)
        {
            if (string.IsNullOrEmpty(telefone))
                return false;

            // Aceita formatos: (11) 99999-9999, (11) 9999-9999, 11999999999
            var regex = @"^\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}$";
            return System.Text.RegularExpressions.Regex.IsMatch(telefone, regex);
        }

        private bool ValidarFrequenciaBackup(string frequencia)
        {
            var frequenciasValidas = new[] { "Diário", "Semanal", "Mensal" };
            return frequenciasValidas.Contains(frequencia);
        }

        private bool ValidarHoraBackup(string hora)
        {
            if (string.IsNullOrEmpty(hora))
                return false;

            return TimeSpan.TryParse(hora, out _);
        }

        private bool ValidarLogLevel(string logLevel)
        {
            var niveisValidos = new[] { "Trace", "Debug", "Information", "Warning", "Error", "Critical" };
            return niveisValidos.Contains(logLevel);
        }

        private bool ValidarDataManutencao(DateTime? dataManutencao)
        {
            if (!dataManutencao.HasValue)
                return true;

            return dataManutencao.Value > DateTime.Now;
        }
    }
}
