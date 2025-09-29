using System.ComponentModel.DataAnnotations;

namespace Dominio.Dtos
{
    public class ExemplarDTO
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "ID do Livro é obrigatório")]
        public int IdLivro { get; set; }
        
        [Required(ErrorMessage = "Número do Exemplar é obrigatório")]
        [StringLength(50, ErrorMessage = "Número do Exemplar deve ter no máximo 50 caracteres")]
        public string NumeroExemplar { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Localização deve ter no máximo 100 caracteres")]
        public string Localizacao { get; set; } = string.Empty;
        
        [StringLength(20, ErrorMessage = "Condição deve ter no máximo 20 caracteres")]
        public string Condicao { get; set; } = "Bom";
        
        public bool Disponivel { get; set; } = true;
        public bool Ativo { get; set; } = true;
        
        public DateTime DataAquisicao { get; set; } = DateTime.Now;
        public decimal ValorAquisicao { get; set; } = 0;
        
        [StringLength(100, ErrorMessage = "Fornecedor deve ter no máximo 100 caracteres")]
        public string Fornecedor { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "Observações devem ter no máximo 500 caracteres")]
        public string Observacoes { get; set; } = string.Empty;
        
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        // Propriedades de navegação (opcionais para exibição)
        public string? TituloLivro { get; set; }
        public string? ISBN { get; set; }
        public string? NomeAutor { get; set; }
        public string? NomeEditora { get; set; }
        public string? CapaUrl { get; set; }
    }
}

