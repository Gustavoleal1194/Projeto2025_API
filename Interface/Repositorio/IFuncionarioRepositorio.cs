using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Repositorio
{
    public interface IFuncionarioRepositorio : IBaseRepository<Funcionario>
    {
        Task<IEnumerable<Funcionario>> GetByCargoAsync(string cargo);
        Task<IEnumerable<Funcionario>> GetAtivosAsync();
        Task<IEnumerable<Funcionario>> GetInativosAsync();
        Task<Funcionario?> GetByEmailAsync(string email);
    }
}
