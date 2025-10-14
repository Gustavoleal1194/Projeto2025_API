using Dominio.Entidades;

namespace Interface.Repositorio
{
    /// <summary>
    /// Interface para repositório de configurações do sistema
    /// </summary>
    public interface IConfiguracaoSistemaRepositorio : IBaseRepository<ConfiguracaoSistema>
    {
        /// <summary>
        /// Busca configuração por chave
        /// </summary>
        Task<ConfiguracaoSistema?> GetByChaveAsync(string chave);
        
        /// <summary>
        /// Busca configurações por categoria
        /// </summary>
        Task<IEnumerable<ConfiguracaoSistema>> GetByCategoriaAsync(string categoria);
        
        /// <summary>
        /// Atualiza configuração por chave
        /// </summary>
        Task<ConfiguracaoSistema> UpdateByChaveAsync(string chave, string valor, string usuario);
        
        /// <summary>
        /// Verifica se configuração existe por chave
        /// </summary>
        Task<bool> ExistsByChaveAsync(string chave);
        
        /// <summary>
        /// Busca todas as configurações ativas
        /// </summary>
        Task<IEnumerable<ConfiguracaoSistema>> GetAtivasAsync();
        
        /// <summary>
        /// Cria ou atualiza configuração
        /// </summary>
        Task<ConfiguracaoSistema> CreateOrUpdateAsync(string chave, string valor, string tipo, string categoria, string? descricao, string usuario);
    }
}
