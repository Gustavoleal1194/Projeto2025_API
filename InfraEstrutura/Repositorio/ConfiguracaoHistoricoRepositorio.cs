using Dominio.Entidades;
using InfraEstrutura.Data;
using Interface.Repositorio;
using Microsoft.EntityFrameworkCore;

namespace InfraEstrutura.Repositorio
{
    /// <summary>
    /// Implementação do repositório de histórico de configurações
    /// </summary>
    public class ConfiguracaoHistoricoRepositorio : BaseRepository<ConfiguracaoHistorico>, IConfiguracaoHistoricoRepositorio
    {
        public ConfiguracaoHistoricoRepositorio(EmpresaContexto contexto) : base(contexto)
        {
        }

        public async Task<IEnumerable<ConfiguracaoHistorico>> GetByConfiguracaoIdAsync(int configuracaoId)
        {
            return await _contexto.Set<ConfiguracaoHistorico>()
                .Where(h => h.ConfiguracaoId == configuracaoId)
                .OrderByDescending(h => h.DataAlteracao)
                .ToListAsync();
        }

        public async Task<IEnumerable<ConfiguracaoHistorico>> GetByChaveAsync(string chave)
        {
            return await _contexto.Set<ConfiguracaoHistorico>()
                .Include(h => h.Configuracao)
                .Where(h => h.Configuracao.Chave == chave)
                .OrderByDescending(h => h.DataAlteracao)
                .ToListAsync();
        }

        public async Task<IEnumerable<ConfiguracaoHistorico>> GetByUsuarioAsync(string usuario)
        {
            return await _contexto.Set<ConfiguracaoHistorico>()
                .Include(h => h.Configuracao)
                .Where(h => h.UsuarioAlteracao == usuario)
                .OrderByDescending(h => h.DataAlteracao)
                .ToListAsync();
        }

        public async Task<IEnumerable<ConfiguracaoHistorico>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            return await _contexto.Set<ConfiguracaoHistorico>()
                .Include(h => h.Configuracao)
                .Where(h => h.DataAlteracao >= dataInicio && h.DataAlteracao <= dataFim)
                .OrderByDescending(h => h.DataAlteracao)
                .ToListAsync();
        }

        public async Task<ConfiguracaoHistorico> AddHistoricoAsync(int configuracaoId, string? valorAnterior, string? valorNovo, string usuario, string? ip = null, string? motivo = null, string? userAgent = null)
        {
            var historico = new ConfiguracaoHistorico
            {
                ConfiguracaoId = configuracaoId,
                ValorAnterior = valorAnterior,
                ValorNovo = valorNovo,
                DataAlteracao = DateTime.Now,
                UsuarioAlteracao = usuario,
                IpAlteracao = ip,
                MotivoAlteracao = motivo,
                UserAgent = userAgent
            };

            await AddAsync(historico);
            return historico;
        }
    }
}
