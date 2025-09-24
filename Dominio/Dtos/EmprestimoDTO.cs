using System.ComponentModel.DataAnnotations;

namespace Dominio.Dtos
{
    public class EmprestimoDTO
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "ID do Exemplar é obrigatório")]
        public int IdExemplar { get; set; }
        
        [Required(ErrorMessage = "ID do Usuário é obrigatório")]
        public int IdUsuario { get; set; }
        
        public DateTime DataEmprestimo { get; set; }
        public DateTime DataPrevistaDevolucao { get; set; }
        public DateTime? DataDevolucao { get; set; }
        public DateTime? DataRenovacao { get; set; }
        
        public int QuantidadeRenovacoes { get; set; } = 0;
        public int MaxRenovacoes { get; set; } = 3;
        
        public decimal Multa { get; set; } = 0;
        
        [Required(ErrorMessage = "Status é obrigatório")]
        [StringLength(20, ErrorMessage = "Status deve ter no máximo 20 caracteres")]
        public string Status { get; set; } = "Emprestado";
        
        [StringLength(500, ErrorMessage = "Observações devem ter no máximo 500 caracteres")]
        public string Observacoes { get; set; } = string.Empty;
        
        public bool Ativo { get; set; } = true;
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        // Propriedades de navegação (opcionais para exibição)
        public string? TituloLivro { get; set; }
        public string? NumeroExemplar { get; set; }
        public string? NomeUsuario { get; set; }
        public string? EmailUsuario { get; set; }
        
        // Propriedades calculadas
        public bool EstaAtrasado => Status == "Emprestado" && DateTime.Now.Date > DataPrevistaDevolucao.Date;
        public int DiasAtraso => EstaAtrasado ? (DateTime.Now.Date - DataPrevistaDevolucao.Date).Days : 0;
        public bool PodeRenovar => Status == "Emprestado" && QuantidadeRenovacoes < MaxRenovacoes;
    }
}