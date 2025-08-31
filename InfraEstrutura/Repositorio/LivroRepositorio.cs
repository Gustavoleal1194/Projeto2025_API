using Dominio.Entidades;
using InfraEstrutura.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace InfraEstrutura.Repositorio
{
    public class LivroRepositorio : ILivroRepositorio
    {
        private EmpresaContexto contexto;

        public LivroRepositorio(EmpresaContexto contexto)
        {
            this.contexto = contexto;
        }

        public async Task<Livro> addAsync(Livro livro)
        {
            await this.contexto.Livros.AddAsync(livro);
            await this.contexto.SaveChangesAsync();
            return livro;
        }

        public Task AddAsync(Livro livro)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Livro>> getAllAsync(Expression<Func<Livro, bool>> expression)
        {
            return await this.contexto.Livros
                .Where(expression)
                .OrderBy(p => p.Titulo)
                .ToListAsync();
        }

        public Task<IEnumerable<Livro>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Livro?> getAsync(int id)
        {
            return await this.contexto.Livros.FindAsync(id);
        }

        public Task<Livro?> GetAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task removeAsync(Livro livro)
        {
            this.contexto.Livros.Remove(livro);
            await this.contexto.SaveChangesAsync();
        }

        public Task RemoveAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task updateAsync(Livro livro)
        {
            this.contexto.Entry(livro).State = EntityState.Modified;
            await this.contexto.SaveChangesAsync();
        }

        public Task UpdateAsync(Livro livro)
        {
            throw new NotImplementedException();
        }
    }
}