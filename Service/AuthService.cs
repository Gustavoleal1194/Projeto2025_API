using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Service
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IFuncionarioRepositorio _funcionarioRepositorio;
        private readonly IUsuarioRepositorio _usuarioRepositorio;

        public AuthService(
            IConfiguration configuration,
            IFuncionarioRepositorio funcionarioRepositorio,
            IUsuarioRepositorio usuarioRepositorio)
        {
            _configuration = configuration;
            _funcionarioRepositorio = funcionarioRepositorio;
            _usuarioRepositorio = usuarioRepositorio;
        }

        public async Task<TokenDTO?> LoginAsync(LoginDTO loginDTO)
        {
            // Primeiro tenta como funcionário
            var funcionario = await _funcionarioRepositorio.GetByEmailAsync(loginDTO.Email);
            if (funcionario != null && funcionario.Ativo && VerificarSenha(loginDTO.Senha, funcionario.Senha))
            {
                // Se for administrador, dá role Admin, senão Funcionario
                var role = funcionario.Cargo?.ToLower() == "administrador" ? "Admin" : "Funcionario";
                return GerarToken(funcionario.Id, funcionario.Nome, funcionario.Email, role);
            }

            // Se não for funcionário, tenta como usuário
            var usuario = await _usuarioRepositorio.GetByEmailAsync(loginDTO.Email);
            if (usuario != null && VerificarSenha(loginDTO.Senha, usuario.Senha))
            {
                return GerarToken(usuario.Id, usuario.Nome, usuario.Email, "Usuario");
            }

            return null;
        }

        public async Task<bool> ValidarTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string?> ObterEmailDoTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                return jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            }
            catch
            {
                return null;
            }
        }

        public async Task<string?> ObterRoleDoTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                return jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            }
            catch
            {
                return null;
            }
        }

        private TokenDTO GerarToken(int id, string nome, string email, string role)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var expiration = DateTime.UtcNow.AddHours(8);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, nome),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiration,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new TokenDTO
            {
                Token = tokenHandler.WriteToken(token),
                Expiration = expiration,
                Id = id,
                Nome = nome,
                Email = email,
                Role = role
            };
        }

        private bool VerificarSenha(string senhaDigitada, string senhaHash)
        {
            return PasswordHashService.VerifyPassword(senhaDigitada, senhaHash);
        }
    }
}
