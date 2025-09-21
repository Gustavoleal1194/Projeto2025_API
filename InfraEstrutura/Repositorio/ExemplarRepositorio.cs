using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;

namespace InfraEstrutura.Repositorio
{
    public class ExemplarRepositorio : BaseRepository<Exemplar>, IExemplarRepositorio
    {
        public ExemplarRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        public async Task<IEnumerable<Exemplar>> GetDisponiveisAsync()
        {
            return await _contexto.Exemplares
                .Where(e => e.Disponivel && e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .OrderBy(e => e.Livro!.Titulo)
                .ThenBy(e => e.NumeroExemplar)
                .ToListAsync();
        }

        public async Task<IEnumerable<Exemplar>> GetByLivroAsync(int idLivro)
        {
            return await _contexto.Exemplares
                .Where(e => e.IdLivro == idLivro && e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .OrderBy(e => e.NumeroExemplar)
                .ToListAsync();
        }

        public async Task<IEnumerable<Exemplar>> GetByLocalizacaoAsync(string localizacao)
        {
            return await _contexto.Exemplares
                .Where(e => e.Localizacao.ToLower().Contains(localizacao.ToLower()) && e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .OrderBy(e => e.Localizacao)
                .ThenBy(e => e.Livro!.Titulo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Exemplar>> GetByCondicaoAsync(string condicao)
        {
            return await _contexto.Exemplares
                .Where(e => e.Condicao.ToLower().Contains(condicao.ToLower()) && e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .OrderBy(e => e.Condicao)
                .ThenBy(e => e.Livro!.Titulo)
                .ToListAsync();
        }

        public async Task<Exemplar?> GetByNumeroExemplarAsync(string numeroExemplar)
        {
            return await _contexto.Exemplares
                .Where(e => e.NumeroExemplar == numeroExemplar && e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Exemplar>> GetEmprestadosAsync()
        {
            return await _contexto.Exemplares
                .Where(e => !e.Disponivel && e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .Include(e => e.Emprestimos.Where(emp => emp.Ativo && emp.Status == "Emprestado"))
                .ThenInclude(emp => emp.Usuario)
                .OrderBy(e => e.Livro!.Titulo)
                .ThenBy(e => e.NumeroExemplar)
                .ToListAsync();
        }

        public async Task<IEnumerable<Exemplar>> GetDisponiveisByLivroAsync(int idLivro)
        {
            return await _contexto.Exemplares
                .Where(e => e.IdLivro == idLivro && e.Disponivel && e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .OrderBy(e => e.NumeroExemplar)
                .ToListAsync();
        }

        public async Task<bool> VerificarDisponibilidadeAsync(int idExemplar)
        {
            var exemplar = await _contexto.Exemplares
                .Where(e => e.Id == idExemplar && e.Ativo)
                .FirstOrDefaultAsync();

            return exemplar?.Disponivel ?? false;
        }

        public override async Task<IEnumerable<Exemplar>> GetAllAsync()
        {
            return await _contexto.Exemplares
                .Where(e => e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .OrderBy(e => e.Livro!.Titulo)
                .ThenBy(e => e.NumeroExemplar)
                .ToListAsync();
        }

        public override async Task<Exemplar?> GetByIdAsync(int id)
        {
            return await _contexto.Exemplares
                .Where(e => e.Id == id && e.Ativo)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Livro)
                .ThenInclude(l => l!.Editora)
                .Include(e => e.Emprestimos.Where(emp => emp.Ativo))
                .ThenInclude(emp => emp.Usuario)
                .FirstOrDefaultAsync();
        }
    }
}
