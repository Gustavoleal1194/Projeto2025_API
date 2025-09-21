using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Repositorio
{
    public interface IAutorRepositorio : IBaseRepository<Autor>
    {
        // Métodos específicos para consultas de Autor
        Task<IEnumerable<Autor>> GetByNacionalidadeAsync(string nacionalidade);
        Task<IEnumerable<Autor>> BuscarAsync(string termo);
        Task<IEnumerable<Autor>> GetComLivrosAsync();
        Task<Autor?> GetByEmailAsync(string email);
    }
}