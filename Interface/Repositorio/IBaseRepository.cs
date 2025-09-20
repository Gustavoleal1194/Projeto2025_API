using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Repositorio
{
    public interface IBaseRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task RemoveAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<int> CountAsync();
    }
}
