using Dominio.Entidades;
using InfraEstrutura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class UsuarioRepositorio : IUsuarioRepositorio
    {
        private readonly EmpresaContexto contexto;

        public UsuarioRepositorio(EmpresaContexto contexto)
        {
            this.contexto = contexto;
        }

        public async Task AddAsync(Usuario usuario)
        {
            await contexto.Usuarios.AddAsync(usuario);
            await contexto.SaveChangesAsync();
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await contexto.Usuarios.ToListAsync();
        }

        public async Task<Usuario?> GetAsync(int id)
        {
            return await contexto.Usuarios.FindAsync(id);
        }

        public async Task RemoveAsync(int id)
        {
            var usuario = await contexto.Usuarios.FindAsync(id);
            if (usuario != null)
            {
                contexto.Usuarios.Remove(usuario);
                await contexto.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(Usuario usuario)
        {
            contexto.Entry(usuario).State = EntityState.Modified;
            await contexto.SaveChangesAsync();
        }
    }
}