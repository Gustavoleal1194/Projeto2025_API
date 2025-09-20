using Dominio.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Service
{
    public interface IEditoraService
    {
        Task<EditoraDTO?> GetAsync(int id);
        Task<IEnumerable<EditoraDTO>> GetAllAsync();
        Task<EditoraDTO> AddAsync(EditoraDTO editoraDTO);
        Task UpdateAsync(EditoraDTO editoraDTO);
        Task RemoveAsync(int id);
        
        // Métodos específicos para consultas
        Task<IEnumerable<EditoraDTO>> GetAtivasAsync();
        Task<IEnumerable<EditoraDTO>> GetByCidadeAsync(string cidade);
        Task<IEnumerable<EditoraDTO>> GetByEstadoAsync(string estado);
        Task<IEnumerable<EditoraDTO>> BuscarAsync(string termo);
    }
}