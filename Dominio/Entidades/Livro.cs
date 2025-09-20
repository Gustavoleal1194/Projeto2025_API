using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public class Livro
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Subtitulo { get; set; } = string.Empty;
        public string ISBN { get; set; } = string.Empty;
        public int Ano { get; set; }
        public int Edicao { get; set; } = 1;
        public int NumeroPaginas { get; set; }
        public string Idioma { get; set; } = "Português";
        public string Genero { get; set; } = string.Empty;
        public string Sinopse { get; set; } = string.Empty;
        public decimal Preco { get; set; }
        public int QuantidadeEstoque { get; set; } = 0;
        public int QuantidadeDisponivel { get; set; } = 0;
        public string CapaUrl { get; set; } = string.Empty;
        public string CodigoBarras { get; set; } = string.Empty;
        public bool Disponivel { get; set; } = true;
        public bool Ativo { get; set; } = true;
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        // Informações do Exemplar
        public string NumeroExemplar { get; set; } = string.Empty;
        public string Localizacao { get; set; } = string.Empty; // Estante, Prateleira, etc.
        public string Condicao { get; set; } = "Bom"; // Bom, Regular, Ruim
        public string ObservacoesExemplar { get; set; } = string.Empty;
        public DateTime? DataAquisicao { get; set; }
        public decimal? ValorAquisicao { get; set; }
        public string Fornecedor { get; set; } = string.Empty;
        
        public int IdAutor { get; set; }
        public int IdEditora { get; set; }
        public virtual Autor? Autor { get; set; }
        public virtual Editora? Editora { get; set; }
        public virtual List<Emprestimo> Emprestimos { get; set; } = new();
    }
}
