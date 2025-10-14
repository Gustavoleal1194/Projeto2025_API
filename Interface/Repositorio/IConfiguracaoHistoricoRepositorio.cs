using Dominio.Entidades;

namespace Interface.Repositorio
{
    /// <summary>
    /// Interface para repositório de histórico de configurações
    /// </summary>
    public interface IConfiguracaoHistoricoRepositorio : IBaseRepository<ConfiguracaoHistorico>
    {
        /// <summary>
        /// Busca histórico por configuração
        /// </summary>
        Task<IEnumerable<ConfiguracaoHistorico>> GetByConfiguracaoIdAsync(int configuracaoId);
        
        /// <summary>
        /// Busca histórico por chave de configuração
        /// </summary>
        Task<IEnumerable<ConfiguracaoHistorico>> GetByChaveAsync(string chave);
        
        /// <summary>
        /// Busca histórico por usuário
        /// </summary>
        Task<IEnumerable<ConfiguracaoHistorico>> GetByUsuarioAsync(string usuario);
        
        /// <summary>
        /// Busca histórico por período
        /// </summary>
        Task<IEnumerable<ConfiguracaoHistorico>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim);
        
        /// <summary>
        /// Adiciona entrada no histórico
        /// </summary>
        Task<ConfiguracaoHistorico> AddHistoricoAsync(int configuracaoId, string? valorAnterior, string? valorNovo, string usuario, string? ip = null, string? motivo = null, string? userAgent = null);
    }
}
