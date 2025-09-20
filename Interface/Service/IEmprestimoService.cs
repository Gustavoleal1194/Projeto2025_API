using Dominio.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Service
{
    public interface IEmprestimoService
    {
        Task<EmprestimoDTO?> GetAsync(int id);
        Task<IEnumerable<EmprestimoDTO>> GetAllAsync();
        Task<EmprestimoDTO> AddAsync(EmprestimoDTO emprestimoDTO);
        Task UpdateAsync(EmprestimoDTO emprestimoDTO);
        Task RemoveAsync(int id);
        
        // Métodos específicos para consultas
        Task<IEnumerable<EmprestimoDTO>> GetByUsuarioAsync(int idUsuario);
        Task<IEnumerable<EmprestimoDTO>> GetByLivroAsync(int idLivro);
        Task<IEnumerable<EmprestimoDTO>> GetAtivosAsync();
        Task<IEnumerable<EmprestimoDTO>> GetVencidosAsync();
        Task<IEnumerable<EmprestimoDTO>> GetByStatusAsync(string status);
    }
}