using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Dominio.Dtos
{
    public class CategoriaDTO
    {
        public int Id { get; set; }

        public string Descricao { get; set; } = String.Empty;

        [JsonIgnore]
        public virtual List<Produto> produtos { get; set; } = new List<Produto>();

    }
}
