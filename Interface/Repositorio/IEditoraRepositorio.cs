using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Repositorio
{
    public interface IEditoraRepositorio : IBaseRepository<Editora>
    {
        // Métodos específicos para consultas de Editora
        Task<IEnumerable<Editora>> GetAtivasAsync();
        Task<IEnumerable<Editora>> GetByCidadeAsync(string cidade);
        Task<IEnumerable<Editora>> GetByEstadoAsync(string estado);
        Task<IEnumerable<Editora>> BuscarAsync(string termo);
        Task<Editora?> GetByCnpjAsync(string cnpj);
        Task<Editora?> GetByEmailAsync(string email);
    }
}