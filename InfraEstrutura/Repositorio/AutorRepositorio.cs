using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class AutorRepositorio : BaseRepository<Autor>, IAutorRepositorio
    {
        public AutorRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        public async Task<Autor?> GetAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task AddAsync(Autor autor)
        {
            await base.AddAsync(autor);
        }

        public async Task<IEnumerable<Autor>> GetAllAsync()
        {
            return await base.GetAllAsync();
        }

        public async Task RemoveAsync(int id)
        {
            await base.RemoveAsync(id);
        }

        public async Task UpdateAsync(Autor autor)
        {
            await base.UpdateAsync(autor);
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<Autor>> GetByNacionalidadeAsync(string nacionalidade)
        {
            return await _contexto.Autores
                .Where(a => a.Nacionalidade.ToLower().Contains(nacionalidade.ToLower()))
                .OrderBy(a => a.Nome)
                .ToListAsync();
        }

        public async Task<IEnumerable<Autor>> BuscarAsync(string termo)
        {
            return await _contexto.Autores
                .Where(a => a.Nome.ToLower().Contains(termo.ToLower()) ||
                           a.Nacionalidade.ToLower().Contains(termo.ToLower()))
                .OrderBy(a => a.Nome)
                .ToListAsync();
        }

        public async Task<IEnumerable<Autor>> GetComLivrosAsync()
        {
            return await _contexto.Autores
                .Where(a => _contexto.Livros.Any(l => l.IdAutor == a.Id && l.Ativo))
                .OrderBy(a => a.Nome)
                .ToListAsync();
        }

        public async Task<Autor?> GetByEmailAsync(string email)
        {
            return await _contexto.Autores
                .FirstOrDefaultAsync(a => a.Email == email);
        }
    }
}       