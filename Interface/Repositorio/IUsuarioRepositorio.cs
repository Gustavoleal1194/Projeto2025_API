using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Repositorio
{
    public interface IUsuarioRepositorio : IBaseRepository<Usuario>
    {
        // Métodos específicos para consultas de Usuario
        Task<IEnumerable<Usuario>> GetByNomeAsync(string nome);
        Task<Usuario?> GetByCpfAsync(string cpf);
        Task<Usuario?> GetByEmailAsync(string email);
    }
}