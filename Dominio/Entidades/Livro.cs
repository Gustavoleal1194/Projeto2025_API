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
        public string ISBN { get; set; } = string.Empty;
        public int Ano { get; set; }
        public int IdAutor { get; set; }
        public int IdEditora { get; set; }
        public virtual Autor? Autor { get; set; }
        public virtual Editora? Editora { get; set; }
        public virtual List<Emprestimo> Emprestimos { get; set; } = new();
    }
}
