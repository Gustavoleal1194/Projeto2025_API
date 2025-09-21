using Dominio.Dtos;

namespace Interface.Service
{
    public interface IAuthService
    {
        Task<TokenDTO?> LoginAsync(LoginDTO loginDTO);
        Task<bool> ValidarTokenAsync(string token);
        Task<string?> ObterEmailDoTokenAsync(string token);
        Task<string?> ObterRoleDoTokenAsync(string token);
    }
}
