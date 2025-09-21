using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dominio.Entidades
{
    public class Exemplar
    {
        public int Id { get; set; }
        
        [Required]
        public int IdLivro { get; set; }
        
        [Required]
        [StringLength(50)]
        public string NumeroExemplar { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Localizacao { get; set; } = string.Empty; // Estante, Prateleira, etc.
        
        [StringLength(20)]
        public string Condicao { get; set; } = "Bom"; // Bom, Regular, Ruim, Danificado
        
        public bool Disponivel { get; set; } = true;
        public bool Ativo { get; set; } = true;
        
        public DateTime DataAquisicao { get; set; } = DateTime.Now;
        public decimal ValorAquisicao { get; set; } = 0;
        
        [StringLength(100)]
        public string Fornecedor { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Observacoes { get; set; } = string.Empty;
        
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        // Relacionamentos
        public virtual Livro? Livro { get; set; }
        public virtual List<Emprestimo> Emprestimos { get; set; } = new();
    }
}
