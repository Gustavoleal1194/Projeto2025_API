using System;

namespace Dominio.Dtos
{
    /// <summary>
    /// DTO para requisições de configuração do sistema
    /// Contém todas as configurações organizadas por categoria
    /// </summary>
    public class ConfiguracaoSistemaRequestDTO
    {
        // Configurações Gerais do Sistema
        public string NomeBiblioteca { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string HorarioFuncionamento { get; set; } = string.Empty;
        public string DiasFuncionamento { get; set; } = string.Empty;
        
        // Limites do Sistema
        public int MaxUsuarios { get; set; } = 1000;
        public int MaxLivros { get; set; } = 10000;
        public int MaxExemplares { get; set; } = 50000;
        public int MaxEmprestimosPorUsuario { get; set; } = 5;
        
        // Parâmetros de Empréstimo
        public int MaxRenovacoes { get; set; } = 3;
        public int DiasEmprestimo { get; set; } = 14;
        public decimal MultaPorDia { get; set; } = 1.0m;
        public decimal ValorMaximoMulta { get; set; } = 50.0m;
        public int DiasParaAtraso { get; set; } = 1;
        public int DiasParaBloqueio { get; set; } = 7;
        public int DiasAntecedenciaRenovacao { get; set; } = 2;
        public int DiasAntecedenciaReserva { get; set; } = 7;
        public int DiasValidadeReserva { get; set; } = 3;
        
        // Configurações de Notificação
        public bool NotificacaoEmail { get; set; } = true;
        public bool NotificacaoSMS { get; set; } = false;
        public bool NotificacaoAtraso { get; set; } = true;
        public bool NotificacaoVencimento { get; set; } = true;
        public bool NotificacaoRenovacao { get; set; } = true;
        public string EmailNotificacao { get; set; } = "noreply@biblioteca.com";
        public string TemplateEmail { get; set; } = "Padrão";
        public string TemplateSMS { get; set; } = "Padrão";
        
        // Configurações de Backup
        public bool BackupAutomatico { get; set; } = true;
        public string FrequenciaBackup { get; set; } = "Diário";
        public string HoraBackup { get; set; } = "02:00";
        public int RetencaoBackup { get; set; } = 30;
        public string LocalizacaoBackup { get; set; } = "C:\\Backups\\Biblioteca";
        public bool CompressaoBackup { get; set; } = true;
        public bool CriptografiaBackup { get; set; } = false;
        
        // Configurações de Sistema
        public string LogLevel { get; set; } = "Information";
        public bool ManutencaoProgramada { get; set; } = false;
        public DateTime? DataManutencao { get; set; }
        public string Observacoes { get; set; } = string.Empty;
        
        // Regras de Negócio
        public bool PermitirRenovacaoAtraso { get; set; } = false;
        public bool PermitirEmprestimoBloqueado { get; set; } = false;
        public bool PermitirReservaBloqueado { get; set; } = false;
        public bool PermitirEmprestimoMulta { get; set; } = false;
        public bool PermitirReservaLimite { get; set; } = true;
        public bool PermitirEmprestimoLimite { get; set; } = true;
    }
}
