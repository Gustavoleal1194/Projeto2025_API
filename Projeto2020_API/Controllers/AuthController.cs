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
                return Unauthorized("Email ou senha inválidos");

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
                return BadRequest("Já existe pelo menos um funcionário no sistema. Use o endpoint /registrar-funcionario com autenticação.");
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
    }
}
