using Dominio.Dtos;
using Interface.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUsuarioService _usuarioService;
        private readonly IFuncionarioService _funcionarioService;

        public AuthController(IAuthService authService, IUsuarioService usuarioService, IFuncionarioService funcionarioService)
        {
            _authService = authService;
            _usuarioService = usuarioService;
            _funcionarioService = funcionarioService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDTO>> Login([FromBody] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await _authService.LoginAsync(loginDTO);
            
            if (token == null)
                return Unauthorized(new { message = "Email ou senha inválidos" });

            // Log para debug
            Console.WriteLine($"Token gerado: {token.Token}");
            Console.WriteLine($"Nome: {token.Nome}");
            Console.WriteLine($"Email: {token.Email}");
            Console.WriteLine($"Role: {token.Role}");

            return Ok(token);
        }

        [HttpPost("validar-token")]
        [Authorize]
        public ActionResult ValidarToken()
        {
            return Ok(new { message = "Token válido" });
        }

        [HttpGet("me")]
        [Authorize]
        public ActionResult ObterUsuarioAtual()
        {
            var email = User.Identity?.Name;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            
            return Ok(new { email, role });
        }

        [HttpPost("registrar")]
        public async Task<ActionResult<UsuarioDTO>> Registrar([FromBody] UsuarioDTO usuarioDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Hash da senha antes de salvar
            usuarioDTO.Senha = PasswordHashService.HashPassword(usuarioDTO.Senha);

            var usuario = await _usuarioService.AddAsync(usuarioDTO);
            return Ok(usuario);
        }

        [HttpPost("registrar-funcionario")]
        [Authorize(Roles = "Admin,Funcionario")]
        public async Task<ActionResult<FuncionarioDTO>> RegistrarFuncionario([FromBody] FuncionarioDTO funcionarioDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Hash da senha antes de salvar
            funcionarioDTO.Senha = PasswordHashService.HashPassword(funcionarioDTO.Senha);

            var funcionario = await _funcionarioService.AddAsync(funcionarioDTO);
            return Ok(funcionario);
        }

        [HttpPost("criar-admin")]
        public async Task<ActionResult<FuncionarioDTO>> CriarAdmin([FromBody] FuncionarioDTO funcionarioDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Verificar se já existe um admin
            var funcionariosExistentes = await _funcionarioService.GetAllAsync();
            if (funcionariosExistentes.Any())
            {
                return BadRequest(new { message = "Já existe pelo menos um funcionário no sistema. Use o endpoint /registrar-funcionario com autenticação." });
            }

            // Hash da senha antes de salvar
            funcionarioDTO.Senha = PasswordHashService.HashPassword(funcionarioDTO.Senha);
            funcionarioDTO.Cargo = "Administrador";
            funcionarioDTO.Salario = 5000.00m;
            funcionarioDTO.DataAdmissao = DateTime.Now;
            funcionarioDTO.Ativo = true;

            var funcionario = await _funcionarioService.AddAsync(funcionarioDTO);
            return Ok(funcionario);
        }

        [HttpGet("teste-token")]
        public ActionResult<TokenDTO> TesteToken()
        {
            var tokenTeste = new TokenDTO
            {
                Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.teste",
                Expiration = DateTime.UtcNow.AddHours(8),
                Tipo = "Bearer",
                Nome = "João Teste",
                Email = "joao@teste.com",
                Role = "Usuario"
            };

            return Ok(tokenTeste);
        }

        [HttpPost("corrigir-senhas")]
        public async Task<ActionResult> CorrigirSenhas()
        {
            try
            {
                // Buscar usuários com senhas em texto simples
                var usuarios = await _usuarioService.GetAllAsync();
                var usuariosComSenhaSimples = usuarios.Where(u => u.Senha == "123456").ToList();

                foreach (var usuario in usuariosComSenhaSimples)
                {
                    // Atualizar senha com hash correto
                    usuario.Senha = PasswordHashService.HashPassword("123456");
                    await _usuarioService.UpdateAsync(usuario);
                }

                return Ok(new { 
                    message = $"Senhas corrigidas para {usuariosComSenhaSimples.Count} usuários",
                    usuarios = usuariosComSenhaSimples.Select(u => new { u.Id, u.Nome, u.Email })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("criar-usuario-teste")]
        public async Task<ActionResult<UsuarioDTO>> CriarUsuarioTeste()
        {
            try
            {
                var usuarioTeste = new UsuarioDTO
                {
                    Nome = "Usuário Teste",
                    Email = "usuario@teste.com",
                    Senha = "123456",
                    Telefone = "11999999999",
                    CPF = "12345678901",
                    DataNascimento = new DateTime(1990, 1, 1)
                };

                // Hash da senha antes de salvar
                usuarioTeste.Senha = PasswordHashService.HashPassword(usuarioTeste.Senha);

                var usuario = await _usuarioService.AddAsync(usuarioTeste);
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("criar-funcionario-teste")]
        public async Task<ActionResult<FuncionarioDTO>> CriarFuncionarioTeste()
        {
            try
            {
                var funcionarioTeste = new FuncionarioDTO
                {
                    Nome = "Funcionário Teste",
                    Email = "funcionario@teste.com",
                    Senha = "123456",
                    Telefone = "11999999999",
                    Cargo = "Funcionário",
                    Salario = 3000.00m,
                    DataAdmissao = DateTime.Now
                };

                // Hash da senha antes de salvar
                funcionarioTeste.Senha = PasswordHashService.HashPassword(funcionarioTeste.Senha);

                var funcionario = await _funcionarioService.AddAsync(funcionarioTeste);
                return Ok(funcionario);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
