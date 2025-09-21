using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class EditoraRepositorio : BaseRepository<Editora>, IEditoraRepositorio
    {
        public EditoraRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        public async Task<Editora?> GetAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task AddAsync(Editora editora)
        {
            await base.AddAsync(editora);
        }

        public async Task<IEnumerable<Editora>> GetAllAsync()
        {
            return await base.GetAllAsync();
        }

        public async Task RemoveAsync(int id)
        {
            await base.RemoveAsync(id);
        }

        public async Task UpdateAsync(Editora editora)
        {
            await base.UpdateAsync(editora);
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<Editora>> GetAtivasAsync()
        {
            return await _contexto.Editoras
                .Where(e => e.Ativa)
                .OrderBy(e => e.Nome)
                .ToListAsync();
        }

        public async Task<IEnumerable<Editora>> GetByCidadeAsync(string cidade)
        {
            return await _contexto.Editoras
                .Where(e => e.Cidade.ToLower().Contains(cidade.ToLower()) && e.Ativa)
                .OrderBy(e => e.Nome)
                .ToListAsync();
        }

        public async Task<IEnumerable<Editora>> GetByEstadoAsync(string estado)
        {
            return await _contexto.Editoras
                .Where(e => e.Estado.ToLower().Contains(estado.ToLower()) && e.Ativa)
                .OrderBy(e => e.Nome)
                .ToListAsync();
        }

        public async Task<IEnumerable<Editora>> BuscarAsync(string termo)
        {
            return await _contexto.Editoras
                .Where(e => e.Ativa && (
                    e.Nome.ToLower().Contains(termo.ToLower()) ||
                    e.Cidade.ToLower().Contains(termo.ToLower()) ||
                    e.Estado.ToLower().Contains(termo.ToLower()) ||
                    e.Email.ToLower().Contains(termo.ToLower())
                ))
                .OrderBy(e => e.Nome)
                .ToListAsync();
        }

        public async Task<Editora?> GetByCnpjAsync(string cnpj)
        {
            return await _contexto.Editoras
                .FirstOrDefaultAsync(e => e.CNPJ == cnpj);
        }

        public async Task<Editora?> GetByEmailAsync(string email)
        {
            return await _contexto.Editoras
                .FirstOrDefaultAsync(e => e.Email == email);
        }
    }
}