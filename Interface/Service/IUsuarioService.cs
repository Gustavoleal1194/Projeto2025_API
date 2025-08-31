using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUsuarioService
{
    Task<UsuarioDTO?> GetAsync(int id);
    Task<IEnumerable<UsuarioDTO>> GetAllAsync();
    Task<UsuarioDTO> AddAsync(UsuarioDTO usuarioDTO);
    Task UpdateAsync(UsuarioDTO usuarioDTO);
    Task RemoveAsync(int id);
}