using Dominio.Entidades;
using InfraEstrutura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class AutorRepositorio : IAutorRepositorio
    {
        private readonly EmpresaContexto contexto;

        public AutorRepositorio(EmpresaContexto contexto)
        {
            this.contexto = contexto;
        }

        public async Task AddAsync(Autor autor)
        {
            await contexto.Autores.AddAsync(autor);
            await contexto.SaveChangesAsync();
        }

        public async Task<IEnumerable<Autor>> GetAllAsync()
        {
            return await contexto.Autores.ToListAsync();
        }

        public async Task<Autor?> GetAsync(int id)
        {
            return await contexto.Autores.FindAsync(id);
        }

        public async Task RemoveAsync(int id)
        {
            var autor = await contexto.Autores.FindAsync(id);
            if (autor != null)
            {
                contexto.Autores.Remove(autor);
                await contexto.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(Autor autor)
        {
            contexto.Entry(autor).State = EntityState.Modified;
            await contexto.SaveChangesAsync();
        }
    }
}       