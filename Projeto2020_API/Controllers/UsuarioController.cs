using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Projeto2025_API.Validation;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService service;
        private readonly UsuarioValidation validacao;
        private readonly IConfiguration _config;

        public UsuarioController(IUsuarioService service, IConfiguration config)
        {
            this.service = service;
            this.validacao = new UsuarioValidation();
            _config = config;
        }

        // Endpoint para Login e geração de Token JWT
        [HttpPost("login")]
        public IActionResult Login([FromBody] UsuarioDTO loginDetalhes)
        {
            if (ValidarUsuario(loginDetalhes))
            {
                var tokenString = GerarTokenJWT();
                return Ok(new
                {
                    access_token = tokenString,
                    token_type = "Bearer",
                    expires_in = 60 * 60 // 60 minutos
                });
            }
            else
            {
                return Unauthorized();
            }
        }

        private string GerarTokenJWT()
        {
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, "1"),
                new Claim(JwtRegisteredClaimNames.UniqueName, "ana"),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool ValidarUsuario(UsuarioDTO loginDetalhes)
        {
            // Aqui você pode melhorar para validar no banco, por ex.
            return loginDetalhes.Nome == "ana" && loginDetalhes.Senha == "123456";
        }

        // CRUD Usuário (com validação)

        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> AddAsync(UsuarioDTO usuarioDTO)
        {
            var result = validacao.Validate(usuarioDTO);

            if (result.IsValid)
            {
                var dto = await service.AddAsync(usuarioDTO);
                return Ok(dto);
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetAllAsync()
        {
            var lista = await service.GetAllAsync();
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetAsync(int id)
        {
            if (id <= 0)
                return BadRequest("Id inválido.");

            var usuario = await service.GetAsync(id);
            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync(UsuarioDTO usuarioDTO)
        {
            var result = validacao.Validate(usuarioDTO);

            if (result.IsValid)
            {
                await service.UpdateAsync(usuarioDTO);
                return NoContent();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveAsync(int id)
        {
            if (id <= 0)
                return BadRequest("Id inválido.");

            await service.RemoveAsync(id);
            return NoContent();
        }
    }
}
