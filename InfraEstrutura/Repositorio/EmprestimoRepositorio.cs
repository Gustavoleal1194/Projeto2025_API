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

        // Métodos específicos para consultas
        public async Task<IEnumerable<Emprestimo>> GetByUsuarioAsync(int idUsuario)
        {
            return await _contexto.Emprestimos
                .Where(e => e.IdUsuario == idUsuario && e.Ativo)
                .OrderByDescending(e => e.DataEmprestimo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Emprestimo>> GetByLivroAsync(int idLivro)
        {
            return await _contexto.Emprestimos
                .Where(e => e.IdLivro == idLivro && e.Ativo)
                .OrderByDescending(e => e.DataEmprestimo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Emprestimo>> GetAtivosAsync()
        {
            return await _contexto.Emprestimos
                .Where(e => e.Ativo && e.Status == "Emprestado")
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
                .Where(e => e.Ativo && e.Status.ToLower() == status.ToLower())
                .OrderByDescending(e => e.DataEmprestimo)
                .ToListAsync();
        }
    }
}