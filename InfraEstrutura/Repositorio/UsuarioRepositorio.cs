using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class UsuarioRepositorio : BaseRepository<Usuario>, IUsuarioRepositorio
    {
        public UsuarioRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<Usuario>> GetByNomeAsync(string nome)
        {
            return await _contexto.Usuarios
                .Where(u => u.Nome.ToLower().Contains(nome.ToLower()))
                .OrderBy(u => u.Nome)
                .ToListAsync();
        }
    }
}