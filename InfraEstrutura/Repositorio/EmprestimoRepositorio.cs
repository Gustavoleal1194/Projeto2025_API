using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;

namespace InfraEstrutura.Repositorio
{
    public class EmprestimoRepositorio : BaseRepository<Emprestimo>, IEmprestimoRepositorio
    {
        public EmprestimoRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        public override async Task<IEnumerable<Emprestimo>> GetAllAsync()
        {
            return await _contexto.Emprestimos
                .Where(e => e.Ativo)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Editora)
                .Include(e => e.Usuario)
                .OrderByDescending(e => e.DataEmprestimo)
                .ToListAsync();
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<Emprestimo>> GetByUsuarioAsync(int idUsuario)
        {
            return await _contexto.Emprestimos
                .Where(e => e.IdUsuario == idUsuario && e.Ativo)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Editora)
                .Include(e => e.Usuario)
                .OrderByDescending(e => e.DataEmprestimo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Emprestimo>> GetByExemplarAsync(int idExemplar)
        {
            return await _contexto.Emprestimos
                .Where(e => e.IdExemplar == idExemplar && e.Ativo)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .Include(e => e.Usuario)
                .OrderByDescending(e => e.DataEmprestimo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Emprestimo>> GetAtivosAsync()
        {
            return await _contexto.Emprestimos
                .Where(e => e.DataDevolucao == null && e.Status == "Emprestado")
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Editora)
                .Include(e => e.Usuario)
                .OrderByDescending(e => e.DataEmprestimo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Emprestimo>> GetVencidosAsync()
        {
            var hoje = DateTime.Now.Date;
            return await _contexto.Emprestimos
                .Where(e => e.Ativo && 
                           e.Status == "Emprestado" && 
                           e.DataPrevistaDevolucao < hoje)
                .OrderBy(e => e.DataPrevistaDevolucao)
                .ToListAsync();
        }

        public async Task<IEnumerable<Emprestimo>> GetByStatusAsync(string status)
        {
            return await _contexto.Emprestimos
                .Where(e => e.Status.ToLower() == status.ToLower())
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Editora)
                .Include(e => e.Usuario)
                .OrderByDescending(e => e.DataEmprestimo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Emprestimo>> GetDevolvidosAsync()
        {
            return await _contexto.Emprestimos
                .Where(e => e.Status == "Devolvido" && e.DataDevolucao.HasValue)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Autor)
                .Include(e => e.Exemplar)
                .ThenInclude(ex => ex!.Livro)
                .ThenInclude(l => l!.Editora)
                .Include(e => e.Usuario)
                .OrderByDescending(e => e.DataDevolucao)
                .ToListAsync();
        }
    }
}