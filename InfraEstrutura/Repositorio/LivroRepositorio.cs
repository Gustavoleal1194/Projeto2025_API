using Dominio.Entidades;
using InfraEstrutura.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace InfraEstrutura.Repositorio
{
    public class LivroRepositorio : ILivroRepositorio
    {
        private readonly EmpresaContexto contexto;

        public LivroRepositorio(EmpresaContexto contexto)
        {
            this.contexto = contexto;
        }

        public async Task AddAsync(Livro livro)
        {
            await contexto.Livros.AddAsync(livro);
            await contexto.SaveChangesAsync();
        }

        public async Task<IEnumerable<Livro>> GetAllAsync()
        {
            return await contexto.Livros
                .OrderBy(p => p.Titulo)
                .ToListAsync();
        }

        public async Task<Livro?> GetAsync(int id)
        {
            return await contexto.Livros.FindAsync(id);
        }

        public async Task RemoveAsync(int id)
        {
            var livro = await contexto.Livros.FindAsync(id);
            if (livro != null)
            {
                contexto.Livros.Remove(livro);
                await contexto.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(Livro livro)
        {
            contexto.Entry(livro).State = EntityState.Modified;
            await contexto.SaveChangesAsync();
        }
    }
}