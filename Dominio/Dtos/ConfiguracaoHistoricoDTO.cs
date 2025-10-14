using System;

namespace Dominio.Dtos
{
    /// <summary>
    /// DTO para histórico de configurações
    /// </summary>
    public class ConfiguracaoHistoricoDTO
    {
        public int Id { get; set; }
        public int ConfiguracaoId { get; set; }
        public string? ValorAnterior { get; set; }
        public string? ValorNovo { get; set; }
        public DateTime DataAlteracao { get; set; }
        public string UsuarioAlteracao { get; set; } = string.Empty;
        public string? IpAlteracao { get; set; }
        public string? MotivoAlteracao { get; set; }
        public string? UserAgent { get; set; }
    }
}
