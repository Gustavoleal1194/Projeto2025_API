using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEditoraService
{
    Task<EditoraDTO?> GetAsync(int id);
    Task<IEnumerable<EditoraDTO>> GetAllAsync();
    Task<EditoraDTO> AddAsync(EditoraDTO editoraDTO);
    Task UpdateAsync(EditoraDTO editoraDTO);
    Task RemoveAsync(int id);
}