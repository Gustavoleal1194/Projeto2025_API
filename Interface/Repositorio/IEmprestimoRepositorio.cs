using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Interface.Repositorio
{
    public interface IEmprestimoRepositorio : IBaseRepository<Emprestimo>
    {
        // Métodos específicos para consultas de Emprestimo
        Task<IEnumerable<Emprestimo>> GetByUsuarioAsync(int idUsuario);
        Task<IEnumerable<Emprestimo>> GetByExemplarAsync(int idExemplar);
        Task<IEnumerable<Emprestimo>> GetAtivosAsync();
        Task<IEnumerable<Emprestimo>> GetVencidosAsync();
        Task<IEnumerable<Emprestimo>> GetByStatusAsync(string status);
        Task<IEnumerable<Emprestimo>> GetDevolvidosAsync();
    }
}