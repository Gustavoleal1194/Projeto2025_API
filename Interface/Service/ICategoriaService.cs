using Dominio.Dtos;
using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Interface.Service
{
    public interface ICategoriaService
    {
        Task<CategoriaDTO> addAsync(CategoriaDTO categoria);
        Task removeAsync(int id);
        Task<CategoriaDTO?> getAsync(int id);
        Task<IEnumerable<CategoriaDTO>> getAllAsync(Expression<Func<Categoria, bool>> expression);
        Task updateAsync (CategoriaDTO categoria);
    }
}
