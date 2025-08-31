using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IAutorService
{
    Task<AutorDTO?> GetAsync(int id);
    Task<IEnumerable<AutorDTO>> GetAllAsync();
    Task<AutorDTO> AddAsync(AutorDTO autorDTO);
    Task UpdateAsync(AutorDTO autorDTO);
    Task RemoveAsync(int id);
}