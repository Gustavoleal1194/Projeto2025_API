using Dominio.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Service
{
    public interface IUsuarioService
    {
        Task<UsuarioDTO?> GetAsync(int id);
        Task<IEnumerable<UsuarioDTO>> GetAllAsync();
        Task<UsuarioDTO> AddAsync(UsuarioDTO usuarioDTO);
        Task UpdateAsync(UsuarioDTO usuarioDTO);
        Task RemoveAsync(int id);
        
        // Métodos específicos para consultas
        Task<IEnumerable<UsuarioDTO>> GetByNomeAsync(string nome);
        Task<UsuarioDTO?> GetByCpfAsync(string cpf);
    }
}