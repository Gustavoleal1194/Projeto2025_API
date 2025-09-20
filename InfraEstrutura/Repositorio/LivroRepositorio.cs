using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace InfraEstrutura.Repositorio
{
    public class LivroRepositorio : BaseRepository<Livro>, ILivroRepositorio
    {
        public LivroRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        public async Task<IEnumerable<Livro>> GetDisponiveisAsync()
        {
            return await _contexto.Livros
                .Where(l => l.Disponivel && l.Ativo && l.QuantidadeDisponivel > 0)
                .OrderBy(l => l.Titulo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Livro>> GetByGeneroAsync(string genero)
        {
            return await _contexto.Livros
                .Where(l => l.Genero.ToLower().Contains(genero.ToLower()) && l.Ativo)
                .OrderBy(l => l.Titulo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Livro>> GetByAutorAsync(int idAutor)
        {
            return await _contexto.Livros
                .Where(l => l.IdAutor == idAutor && l.Ativo)
                .OrderBy(l => l.Titulo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Livro>> GetByEditoraAsync(int idEditora)
        {
            return await _contexto.Livros
                .Where(l => l.IdEditora == idEditora && l.Ativo)
                .OrderBy(l => l.Titulo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Livro>> BuscarAsync(string termo)
        {
            return await _contexto.Livros
                .Where(l => l.Ativo && (
                    l.Titulo.ToLower().Contains(termo.ToLower()) ||
                    l.Subtitulo.ToLower().Contains(termo.ToLower()) ||
                    l.ISBN.Contains(termo) ||
                    l.Sinopse.ToLower().Contains(termo.ToLower())
                ))
                .OrderBy(l => l.Titulo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Livro>> GetEmEstoqueAsync()
        {
            return await _contexto.Livros
                .Where(l => l.Ativo && l.QuantidadeEstoque > 0)
                .OrderBy(l => l.Titulo)
                .ToListAsync();
        }
    }
}