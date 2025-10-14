using System;

namespace Dominio.Entidades
{
    /// <summary>
    /// Entidade para auditoria de alterações nas configurações do sistema
    /// Mantém histórico completo de todas as mudanças
    /// </summary>
    public class ConfiguracaoHistorico
    {
        public int Id { get; set; }
        
        /// <summary>
        /// ID da configuração alterada
        /// </summary>
        public int ConfiguracaoId { get; set; }
        
        /// <summary>
        /// Valor anterior da configuração
        /// </summary>
        public string? ValorAnterior { get; set; }
        
        /// <summary>
        /// Novo valor da configuração
        /// </summary>
        public string? ValorNovo { get; set; }
        
        /// <summary>
        /// Data e hora da alteração
        /// </summary>
        public DateTime DataAlteracao { get; set; } = DateTime.Now;
        
        /// <summary>
        /// Usuário que fez a alteração
        /// </summary>
        public string UsuarioAlteracao { get; set; } = string.Empty;
        
        /// <summary>
        /// IP do usuário que fez a alteração
        /// </summary>
        public string? IpAlteracao { get; set; }
        
        /// <summary>
        /// Motivo da alteração (opcional)
        /// </summary>
        public string? MotivoAlteracao { get; set; }
        
        /// <summary>
        /// Navegador usado na alteração
        /// </summary>
        public string? UserAgent { get; set; }
        
        /// <summary>
        /// Referência para a configuração
        /// </summary>
        public virtual ConfiguracaoSistema Configuracao { get; set; } = null!;
    }
}
