using System;
using System.Collections.Generic;

namespace Dominio.Dtos
{
    /// <summary>
    /// DTO para informações de backup
    /// </summary>
    public class BackupInfoDTO
    {
        public string Status { get; set; } = "Ativo";
        public BackupConfiguracaoDTO Configuracao { get; set; } = new();
        public UltimoBackupDTO UltimoBackup { get; set; } = new();
        public ProximoBackupDTO ProximoBackup { get; set; } = new();
        public List<BackupHistoricoDTO> Historico { get; set; } = new();
        public BackupEstatisticasDTO Estatisticas { get; set; } = new();
    }

    public class BackupConfiguracaoDTO
    {
        public bool BackupAutomatico { get; set; } = true;
        public string Frequencia { get; set; } = "Diário";
        public string Hora { get; set; } = "02:00";
        public int Retencao { get; set; } = 30;
        public string Localizacao { get; set; } = "C:\\Backups\\Biblioteca";
        public string Formato { get; set; } = "SQL";
        public bool Compressao { get; set; } = true;
        public bool Criptografia { get; set; } = false;
        public bool Notificacao { get; set; } = true;
        public string EmailNotificacao { get; set; } = "admin@biblioteca.com";
    }

    public class UltimoBackupDTO
    {
        public DateTime Data { get; set; }
        public string Tamanho { get; set; } = string.Empty;
        public string Status { get; set; } = "Sucesso";
        public string Duracao { get; set; } = "00:05:30";
        public string Arquivo { get; set; } = string.Empty;
        public string Localizacao { get; set; } = string.Empty;
    }

    public class ProximoBackupDTO
    {
        public DateTime Data { get; set; }
        public string TempoRestante { get; set; } = string.Empty;
    }

    public class BackupHistoricoDTO
    {
        public DateTime Data { get; set; }
        public string Tamanho { get; set; } = string.Empty;
        public string Status { get; set; } = "Sucesso";
        public string Duracao { get; set; } = string.Empty;
    }

    public class BackupEstatisticasDTO
    {
        public int TotalBackups { get; set; }
        public int BackupsSucesso { get; set; }
        public int BackupsFalha { get; set; }
        public string TamanhoMedio { get; set; } = string.Empty;
        public string DuracaoMedia { get; set; } = string.Empty;
        public decimal TaxaSucesso { get; set; }
    }
}
