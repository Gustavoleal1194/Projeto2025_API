using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEmprestimoService
{
    Task<EmprestimoDTO?> GetAsync(int id);
    Task<IEnumerable<EmprestimoDTO>> GetAllAsync();
    Task<EmprestimoDTO> AddAsync(EmprestimoDTO emprestimoDTO);
    Task UpdateAsync(EmprestimoDTO emprestimoDTO);
    Task RemoveAsync(int id);
}