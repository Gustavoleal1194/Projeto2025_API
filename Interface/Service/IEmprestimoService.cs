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
        Task<IEnumerable<EmprestimoDTO>> GetByExemplarAsync(int idExemplar);
        Task<IEnumerable<EmprestimoDTO>> GetAtivosAsync();
        Task<IEnumerable<EmprestimoDTO>> GetVencidosAsync();
        Task<IEnumerable<EmprestimoDTO>> GetByStatusAsync(string status);
        
        // Métodos específicos para empréstimos
        Task<bool> DevolverAsync(int idEmprestimo);
        Task<bool> RenovarAsync(int idEmprestimo);
    }
}