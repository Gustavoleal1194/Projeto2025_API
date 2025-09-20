using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public class Autor
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string NomeCompleto { get; set; } = string.Empty;
        public string NomeArtistico { get; set; } = string.Empty;
        public string Nacionalidade { get; set; } = string.Empty;
        public string PaisOrigem { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public string Website { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Cidade { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public string CEP { get; set; } = string.Empty;
        public string Pais { get; set; } = string.Empty;
        public bool Ativo { get; set; } = true;
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public virtual List<Livro> Livros { get; set; } = new();
    }
}
