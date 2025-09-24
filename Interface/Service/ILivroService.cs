using Dominio.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Service
{
    public interface ILivroService
    {
        Task<LivroDTO?> GetAsync(int id);
        Task<IEnumerable<LivroDTO>> GetAllAsync();
        Task<LivroDTO> AddAsync(LivroDTO livroDTO);
        Task UpdateAsync(LivroDTO livroDTO);
        Task RemoveAsync(int id);
        
        // Métodos específicos para consultas
        Task<IEnumerable<LivroDTO>> GetDisponiveisAsync();
        Task<IEnumerable<LivroDTO>> GetByGeneroAsync(string genero);
        Task<IEnumerable<LivroDTO>> GetByAutorAsync(int idAutor);
        Task<IEnumerable<LivroDTO>> GetByEditoraAsync(int idEditora);
        Task<IEnumerable<LivroDTO>> BuscarAsync(string termo);
        Task<IEnumerable<LivroDTO>> GetEmEstoqueAsync();
        Task ToggleStatusAsync(int id);
    }
}
