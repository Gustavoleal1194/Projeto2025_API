using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dominio.Entidades
{
    public class Livro
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Titulo { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string Subtitulo { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string ISBN { get; set; } = string.Empty;
        
        public int Ano { get; set; }
        public int Edicao { get; set; } = 1;
        public int NumeroPaginas { get; set; }
        
        [StringLength(50)]
        public string Idioma { get; set; } = "Português";
        
        [StringLength(100)]
        public string Genero { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string Sinopse { get; set; } = string.Empty;
        
        public decimal Preco { get; set; }
        
        [StringLength(500)]
        public string CapaUrl { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string CodigoBarras { get; set; } = string.Empty;
        
        public bool Ativo { get; set; } = true;
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        // Relacionamentos
        public int IdAutor { get; set; }
        public int IdEditora { get; set; }
        public virtual Autor? Autor { get; set; }
        public virtual Editora? Editora { get; set; }
        public virtual List<Exemplar> Exemplares { get; set; } = new();
        
        // Propriedades calculadas
        public int TotalExemplares => Exemplares?.Count(e => e.Ativo) ?? 0;
        public int ExemplaresDisponiveis => Exemplares?.Count(e => e.Ativo && e.Disponivel) ?? 0;
        public bool TemExemplaresDisponiveis => ExemplaresDisponiveis > 0;
        
        // Lógica de disponibilidade: ativo = true quando tem exemplares
        public bool AtivoCalculado => TotalExemplares > 0;
    }
}
