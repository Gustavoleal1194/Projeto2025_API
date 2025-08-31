using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

public interface ILivroRepositorio
{
    Task<Livro?> GetAsync(int id);
    Task<IEnumerable<Livro>> GetAllAsync();
    Task AddAsync(Livro livro);
    Task UpdateAsync(Livro livro);
    Task RemoveAsync(int id);
}