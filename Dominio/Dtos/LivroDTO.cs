using System.ComponentModel.DataAnnotations;

namespace Dominio.Dtos
{
    public class LivroDTO
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Título é obrigatório")]
        [StringLength(200, ErrorMessage = "Título deve ter no máximo 200 caracteres")]
        public string Titulo { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Subtítulo deve ter no máximo 200 caracteres")]
        public string Subtitulo { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "ISBN é obrigatório")]
        [StringLength(20, ErrorMessage = "ISBN deve ter no máximo 20 caracteres")]
        public string ISBN { get; set; } = string.Empty;
        
        public int Ano { get; set; }
        public int Edicao { get; set; } = 1;
        public int NumeroPaginas { get; set; }
        
        [StringLength(50, ErrorMessage = "Idioma deve ter no máximo 50 caracteres")]
        public string Idioma { get; set; } = "Português";
        
        [StringLength(100, ErrorMessage = "Gênero deve ter no máximo 100 caracteres")]
        public string Genero { get; set; } = string.Empty;
        
        [StringLength(2000, ErrorMessage = "Sinopse deve ter no máximo 2000 caracteres")]
        public string Sinopse { get; set; } = string.Empty;
        
        public decimal Preco { get; set; }
        
        [StringLength(500, ErrorMessage = "URL da capa deve ter no máximo 500 caracteres")]
        public string CapaUrl { get; set; } = string.Empty;
        
        [StringLength(50, ErrorMessage = "Código de barras deve ter no máximo 50 caracteres")]
        public string CodigoBarras { get; set; } = string.Empty;
        
        public bool Ativo { get; set; } = true;
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        // Relacionamentos
        [Required(ErrorMessage = "ID do Autor é obrigatório")]
        public int IdAutor { get; set; }
        
        [Required(ErrorMessage = "ID da Editora é obrigatório")]
        public int IdEditora { get; set; }
        
        // Propriedades calculadas (apenas para exibição)
        public int TotalExemplares { get; set; }
        public int ExemplaresDisponiveis { get; set; }
        public bool TemExemplaresDisponiveis { get; set; }
        
        // Propriedades de navegação (opcionais para exibição)
        public string? NomeAutor { get; set; }
        public string? NomeEditora { get; set; }
    }
}