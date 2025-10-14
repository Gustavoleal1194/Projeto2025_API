using System;

namespace Dominio.Dtos
{
    /// <summary>
    /// DTO para configurações do sistema
    /// </summary>
    public class ConfiguracaoSistemaDTO
    {
        public int Id { get; set; }
        public string Chave { get; set; } = string.Empty;
        public string Valor { get; set; } = string.Empty;
        public string Tipo { get; set; } = "String";
        public string? Descricao { get; set; }
        public string Categoria { get; set; } = "Sistema";
        public bool Ativo { get; set; } = true;
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
        public string? UsuarioAtualizacao { get; set; }
    }
}
