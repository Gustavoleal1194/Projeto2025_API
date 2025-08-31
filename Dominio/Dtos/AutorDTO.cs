using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

public class AutorDTO
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Nacionalidade { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }
}