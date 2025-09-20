using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InfraEstrutura.Repositorio
{
    public class FuncionarioRepositorio : BaseRepository<Funcionario>, IFuncionarioRepositorio
    {
        public FuncionarioRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        public async Task<IEnumerable<Funcionario>> GetByCargoAsync(string cargo)
        {
            return await _contexto.Funcionarios
                .Where(f => f.Cargo.ToLower().Contains(cargo.ToLower()))
                .ToListAsync();
        }

        public async Task<IEnumerable<Funcionario>> GetAtivosAsync()
        {
            return await _contexto.Funcionarios
                .Where(f => f.Ativo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Funcionario>> GetInativosAsync()
        {
            return await _contexto.Funcionarios
                .Where(f => !f.Ativo)
                .ToListAsync();
        }

        public async Task<Funcionario?> GetByEmailAsync(string email)
        {
            return await _contexto.Funcionarios
                .FirstOrDefaultAsync(f => f.Email.ToLower() == email.ToLower());
        }
    }
}
