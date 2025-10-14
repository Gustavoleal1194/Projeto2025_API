using Dominio.Dtos;

namespace Interface.Service
{
    /// <summary>
    /// Interface para serviço de configurações do sistema
    /// </summary>
    public interface IConfiguracaoSistemaService
    {
        /// <summary>
        /// Obtém todas as configurações do sistema
        /// </summary>
        Task<ConfiguracaoSistemaRequestDTO> GetConfiguracaoSistemaAsync();
        
        /// <summary>
        /// Atualiza configurações do sistema
        /// </summary>
        Task<bool> UpdateConfiguracaoSistemaAsync(ConfiguracaoSistemaRequestDTO configuracao, string usuario);
        
        /// <summary>
        /// Obtém parâmetros de empréstimo
        /// </summary>
        Task<ConfiguracaoSistemaRequestDTO> GetParametrosEmprestimoAsync();
        
        /// <summary>
        /// Atualiza parâmetros de empréstimo
        /// </summary>
        Task<bool> UpdateParametrosEmprestimoAsync(ConfiguracaoSistemaRequestDTO parametros, string usuario);
        
        /// <summary>
        /// Obtém informações de backup
        /// </summary>
        Task<BackupInfoDTO> GetBackupInfoAsync();
        
        /// <summary>
        /// Executa backup manual
        /// </summary>
        Task<bool> ExecutarBackupAsync(string usuario);
        
        /// <summary>
        /// Obtém histórico de configuração por chave
        /// </summary>
        Task<IEnumerable<ConfiguracaoHistoricoDTO>> GetHistoricoConfiguracaoAsync(string chave);
        
        /// <summary>
        /// Obtém configuração específica por chave
        /// </summary>
        Task<string?> GetConfiguracaoByChaveAsync(string chave);
        
        /// <summary>
        /// Atualiza configuração específica por chave
        /// </summary>
        Task<bool> UpdateConfiguracaoByChaveAsync(string chave, string valor, string usuario);
        
        /// <summary>
        /// Inicializa configurações padrão do sistema
        /// </summary>
        Task<bool> InicializarConfiguracoesPadraoAsync();
    }
}
