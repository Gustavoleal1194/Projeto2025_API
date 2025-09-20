using Dominio.Dtos;
using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Service
{
    public interface IAutorService
    {
        Task<AutorDTO?> GetAsync(int id);
        Task<IEnumerable<AutorDTO>> GetAllAsync();
        Task<AutorDTO> AddAsync(AutorDTO autorDTO);
        Task UpdateAsync(AutorDTO autorDTO);
        Task RemoveAsync(int id);
        
        // Métodos específicos para consultas
        Task<IEnumerable<AutorDTO>> GetByNacionalidadeAsync(string nacionalidade);
        Task<IEnumerable<AutorDTO>> BuscarAsync(string termo);
        Task<IEnumerable<AutorDTO>> GetComLivrosAsync();
    }
}