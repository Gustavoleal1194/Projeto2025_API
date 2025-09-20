using Dominio.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Service
{
    public interface IFuncionarioService
    {
        Task<FuncionarioDTO?> GetByIdAsync(int id);
        Task<IEnumerable<FuncionarioDTO>> GetAllAsync();
        Task<FuncionarioDTO> AddAsync(FuncionarioDTO funcionarioDTO);
        Task UpdateAsync(FuncionarioDTO funcionarioDTO);
        Task RemoveAsync(int id);
        Task<IEnumerable<FuncionarioDTO>> GetByCargoAsync(string cargo);
        Task<IEnumerable<FuncionarioDTO>> GetAtivosAsync();
        Task<IEnumerable<FuncionarioDTO>> GetInativosAsync();
        Task<FuncionarioDTO?> GetByEmailAsync(string email);
        Task<bool> ExistsAsync(int id);
        Task<int> CountAsync();
    }
}
