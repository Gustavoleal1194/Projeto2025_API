using Dominio.Entidades;
using InfraEstrutura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class EditoraRepositorio : IEditoraRepositorio
    {
        private readonly EmpresaContexto contexto;

        public EditoraRepositorio(EmpresaContexto contexto)
        {
            this.contexto = contexto;
        }

        public async Task AddAsync(Editora editora)
        {
            await contexto.Editoras.AddAsync(editora);
            await contexto.SaveChangesAsync();
        }

        public async Task<IEnumerable<Editora>> GetAllAsync()
        {
            return await contexto.Editoras.ToListAsync();
        }

        public async Task<Editora?> GetAsync(int id)
        {
            return await contexto.Editoras.FindAsync(id);
        }

        public async Task RemoveAsync(int id)
        {
            var editora = await contexto.Editoras.FindAsync(id);
            if (editora != null)
            {
                contexto.Editoras.Remove(editora);
                await contexto.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(Editora editora)
        {
            contexto.Entry(editora).State = EntityState.Modified;
            await contexto.SaveChangesAsync();
        }
    }
}