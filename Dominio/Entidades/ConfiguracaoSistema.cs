using System;

namespace Dominio.Entidades
{
    /// <summary>
    /// Entidade para configurações do sistema de biblioteca
    /// Armazena configurações em formato chave-valor com auditoria
    /// </summary>
    public class ConfiguracaoSistema
    {
        public int Id { get; set; }
        
        /// <summary>
        /// Chave única da configuração (ex: "sistema.nome_biblioteca")
        /// </summary>
        public string Chave { get; set; } = string.Empty;
        
        /// <summary>
        /// Valor da configuração (sempre como string, convertido conforme o tipo)
        /// </summary>
        public string Valor { get; set; } = string.Empty;
        
        /// <summary>
        /// Tipo de dados: String, Int, Decimal, Boolean, DateTime
        /// </summary>
        public string Tipo { get; set; } = "String";
        
        /// <summary>
        /// Descrição da configuração para documentação
        /// </summary>
        public string? Descricao { get; set; }
        
        /// <summary>
        /// Categoria da configuração: Sistema, Emprestimo, Backup, Notificacao
        /// </summary>
        public string Categoria { get; set; } = "Sistema";
        
        /// <summary>
        /// Se a configuração está ativa
        /// </summary>
        public bool Ativo { get; set; } = true;
        
        /// <summary>
        /// Data de criação da configuração
        /// </summary>
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        /// <summary>
        /// Data da última atualização
        /// </summary>
        public DateTime DataAtualizacao { get; set; } = DateTime.Now;
        
        /// <summary>
        /// Usuário que fez a última alteração
        /// </summary>
        public string? UsuarioAtualizacao { get; set; }
        
        /// <summary>
        /// Histórico de alterações desta configuração
        /// </summary>
        public virtual ICollection<ConfiguracaoHistorico> Historico { get; set; } = new List<ConfiguracaoHistorico>();
    }
}
