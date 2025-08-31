using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEditoraRepositorio
{
    Task<Editora?> GetAsync(int id);
    Task<IEnumerable<Editora>> GetAllAsync();
    Task AddAsync(Editora editora);
    Task UpdateAsync(Editora editora);
    Task RemoveAsync(int id);
}