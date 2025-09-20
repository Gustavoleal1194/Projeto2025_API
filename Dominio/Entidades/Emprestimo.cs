using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public class Emprestimo
    {
        public int Id { get; set; }
        public int IdLivro { get; set; }
        public int IdUsuario { get; set; }
        public DateTime DataEmprestimo { get; set; }
        public DateTime DataPrevistaDevolucao { get; set; }
        public DateTime? DataDevolucao { get; set; }
        public DateTime? DataRenovacao { get; set; }
        public int QuantidadeRenovacoes { get; set; } = 0;
        public int MaxRenovacoes { get; set; } = 3;
        public decimal? Multa { get; set; } = 0;
        public string Status { get; set; } = "Emprestado"; // Emprestado, Devolvido, Atrasado, Cancelado
        public string Observacoes { get; set; } = string.Empty;
        public bool Ativo { get; set; } = true;
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public virtual Livro? Livro { get; set; }
        public virtual Usuario? Usuario { get; set; }
    }
}