using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dominio.Entidades
{
    public class Emprestimo
    {
        public int Id { get; set; }
        
        [Required]
        public int IdExemplar { get; set; }
        
        [Required]
        public int IdUsuario { get; set; }
        
        public DateTime DataEmprestimo { get; set; }
        public DateTime DataPrevistaDevolucao { get; set; }
        public DateTime? DataDevolucao { get; set; }
        public DateTime? DataRenovacao { get; set; }
        
        public int QuantidadeRenovacoes { get; set; } = 0;
        public int MaxRenovacoes { get; set; } = 3;
        
        public decimal Multa { get; set; } = 0;
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Emprestado"; // Emprestado, Devolvido, Atrasado, Cancelado
        
        [StringLength(500)]
        public string Observacoes { get; set; } = string.Empty;
        
        public bool Ativo { get; set; } = true;
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        // Relacionamentos
        public virtual Exemplar? Exemplar { get; set; }
        public virtual Usuario? Usuario { get; set; }
        
        // Propriedades calculadas
        public bool EstaAtrasado => Status == "Emprestado" && DateTime.Now > DataPrevistaDevolucao;
        public int DiasAtraso => EstaAtrasado ? (DateTime.Now - DataPrevistaDevolucao).Days : 0;
        public bool PodeRenovar => Status == "Emprestado" && QuantidadeRenovacoes < MaxRenovacoes;
    }
}