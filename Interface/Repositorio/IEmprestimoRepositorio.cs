using Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEmprestimoRepositorio
{
    Task<Emprestimo?> GetAsync(int id);
    Task<IEnumerable<Emprestimo>> GetAllAsync();
    Task AddAsync(Emprestimo emprestimo);
    Task UpdateAsync(Emprestimo emprestimo);
    Task RemoveAsync(int id);
}