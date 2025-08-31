using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IAutorRepositorio
{
    Task<Autor?> GetAsync(int id);
    Task<IEnumerable<Autor>> GetAllAsync();
    Task AddAsync(Autor autor);
    Task UpdateAsync(Autor autor);
    Task RemoveAsync(int id);
}