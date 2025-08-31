public interface ILivroService
{
    Task<LivroDTO?> GetAsync(int id);
    Task<IEnumerable<LivroDTO>> GetAllAsync();
    Task<LivroDTO> AddAsync(LivroDTO livroDTO);
    Task UpdateAsync(LivroDTO livroDTO);
    Task RemoveAsync(int id);
}
