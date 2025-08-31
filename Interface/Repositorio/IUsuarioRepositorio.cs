using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUsuarioRepositorio
{
    Task<Usuario?> GetAsync(int id);
    Task<IEnumerable<Usuario>> GetAllAsync();
    Task AddAsync(Usuario usuario);
    Task UpdateAsync(Usuario usuario);
    Task RemoveAsync(int id);
}