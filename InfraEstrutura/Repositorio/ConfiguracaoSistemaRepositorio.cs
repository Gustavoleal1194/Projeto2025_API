using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;

namespace InfraEstrutura.Repositorio
{
    /// <summary>
    /// Implementação do repositório de configurações do sistema
    /// </summary>
    public class ConfiguracaoSistemaRepositorio : BaseRepository<ConfiguracaoSistema>, IConfiguracaoSistemaRepositorio
    {
        public ConfiguracaoSistemaRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        public async Task<ConfiguracaoSistema?> GetByChaveAsync(string chave)
        {
            return await _contexto.Set<ConfiguracaoSistema>()
                .FirstOrDefaultAsync(c => c.Chave == chave && c.Ativo);
        }

        public async Task<IEnumerable<ConfiguracaoSistema>> GetByCategoriaAsync(string categoria)
        {
            return await _contexto.Set<ConfiguracaoSistema>()
                .Where(c => c.Categoria == categoria && c.Ativo)
                .OrderBy(c => c.Chave)
                .ToListAsync();
        }

        public async Task<ConfiguracaoSistema> UpdateByChaveAsync(string chave, string valor, string usuario)
        {
            var configuracao = await GetByChaveAsync(chave);
            if (configuracao == null)
            {
                throw new InvalidOperationException($"Configuração com chave '{chave}' não encontrada.");
            }

            var valorAnterior = configuracao.Valor;
            configuracao.Valor = valor;
            configuracao.DataAtualizacao = DateTime.Now;
            configuracao.UsuarioAtualizacao = usuario;

            await _contexto.SaveChangesAsync();

            // Adiciona ao histórico
            var historicoRepo = new ConfiguracaoHistoricoRepositorio(_contexto);
            await historicoRepo.AddHistoricoAsync(configuracao.Id, valorAnterior, valor, usuario);

            return configuracao;
        }

        public async Task<bool> ExistsByChaveAsync(string chave)
        {
            return await _contexto.Set<ConfiguracaoSistema>()
                .AnyAsync(c => c.Chave == chave);
        }

        public async Task<IEnumerable<ConfiguracaoSistema>> GetAtivasAsync()
        {
            return await _contexto.Set<ConfiguracaoSistema>()
                .Where(c => c.Ativo)
                .OrderBy(c => c.Categoria)
                .ThenBy(c => c.Chave)
                .ToListAsync();
        }

        public async Task<ConfiguracaoSistema> CreateOrUpdateAsync(string chave, string valor, string tipo, string categoria, string? descricao, string usuario)
        {
            var configuracao = await GetByChaveAsync(chave);
            
            if (configuracao == null)
            {
                // Criar nova configuração
                configuracao = new ConfiguracaoSistema
                {
                    Chave = chave,
                    Valor = valor,
                    Tipo = tipo,
                    Categoria = categoria,
                    Descricao = descricao,
                    Ativo = true,
                    DataCriacao = DateTime.Now,
                    DataAtualizacao = DateTime.Now,
                    UsuarioAtualizacao = usuario
                };
                
                await AddAsync(configuracao);
            }
            else
            {
                // Atualizar configuração existente
                var valorAnterior = configuracao.Valor;
                configuracao.Valor = valor;
                configuracao.Tipo = tipo;
                configuracao.Categoria = categoria;
                configuracao.Descricao = descricao;
                configuracao.DataAtualizacao = DateTime.Now;
                configuracao.UsuarioAtualizacao = usuario;

                await UpdateAsync(configuracao);

                // Adiciona ao histórico
                var historicoRepo = new ConfiguracaoHistoricoRepositorio(_contexto);
                await historicoRepo.AddHistoricoAsync(configuracao.Id, valorAnterior, valor, usuario);
            }

            return configuracao;
        }
    }
}
