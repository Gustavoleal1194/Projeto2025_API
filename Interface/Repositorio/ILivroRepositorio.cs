using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Interface.Repositorio
{
    public interface ILivroRepositorio : IBaseRepository<Livro>
    {
        // Métodos específicos para consultas de Livro
        Task<IEnumerable<Livro>> GetDisponiveisAsync();
        Task<IEnumerable<Livro>> GetByGeneroAsync(string genero);
        Task<IEnumerable<Livro>> GetByAutorAsync(int idAutor);
        Task<IEnumerable<Livro>> GetByEditoraAsync(int idEditora);
        Task<IEnumerable<Livro>> BuscarAsync(string termo);
        Task<IEnumerable<Livro>> GetEmEstoqueAsync();
    }
}