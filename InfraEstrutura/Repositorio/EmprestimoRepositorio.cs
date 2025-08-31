using Dominio.Entidades;
using InfraEstrutura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class EmprestimoRepositorio : IEmprestimoRepositorio
    {
        private readonly EmpresaContexto contexto;

        public EmprestimoRepositorio(EmpresaContexto contexto)
        {
            this.contexto = contexto;
        }

        public async Task AddAsync(Emprestimo emprestimo)
        {
            await contexto.Emprestimos.AddAsync(emprestimo);
            await contexto.SaveChangesAsync();
        }

        public async Task<IEnumerable<Emprestimo>> GetAllAsync()
        {
            return await contexto.Emprestimos.ToListAsync();
        }

        public async Task<Emprestimo?> GetAsync(int id)
        {
            return await contexto.Emprestimos.FindAsync(id);
        }

        public async Task RemoveAsync(int id)
        {
            var emprestimo = await contexto.Emprestimos.FindAsync(id);
            if (emprestimo != null)
            {
                contexto.Emprestimos.Remove(emprestimo);
                await contexto.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(Emprestimo emprestimo)
        {
            contexto.Entry(emprestimo).State = EntityState.Modified;
            await contexto.SaveChangesAsync();
        }
    }
}