using Dominio.Dtos;
using Interface.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService service;

        public UsuarioController(IUsuarioService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> AddAsync([FromBody] UsuarioDTO usuarioDTO)
        {
            var dto = await service.AddAsync(usuarioDTO);
            return Ok(dto);
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
            var usuario = await service.GetAsync(id);
            if (usuario == null)
                return NotFound();
            return Ok(usuario);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAsync(int id, [FromBody] UsuarioDTO usuarioDTO)
        {
            usuarioDTO.Id = id; // Garantir que o ID seja o correto
            await service.UpdateAsync(usuarioDTO);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveAsync(int id)
        {
            await service.RemoveAsync(id);
            return NoContent();
        }

        // Endpoint GET específico para Usuario
        [HttpGet("por-nome/{nome}")]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetByNomeAsync(string nome)
        {
            var usuarios = await service.GetByNomeAsync(nome);
            return Ok(usuarios);
        }

        [HttpGet("por-cpf/{cpf}")]
        public async Task<ActionResult<UsuarioDTO>> GetByCpfAsync(string cpf)
        {
            var usuario = await service.GetByCpfAsync(cpf);
            if (usuario == null)
                return NotFound();
            return Ok(usuario);
        }

        [HttpPut("{id}/toggle-status")]
        public async Task<ActionResult> ToggleStatusAsync(int id)
        {
            await service.ToggleStatusAsync(id);
            return NoContent();
        }

        // Endpoint para obter dados do usuário logado
        [HttpGet("meus-dados")]
        public async Task<ActionResult<UsuarioDTO>> GetMeusDados()
        {
            // Obter o ID do usuário do token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                // Fallback para obter do email
                var emailClaim = User.FindFirst(ClaimTypes.Email);
                if (emailClaim == null)
                    return Unauthorized("Token inválido");

                // Buscar usuário por email para obter o ID
                var usuario = await service.GetByEmailAsync(emailClaim.Value);
                if (usuario == null)
                    return Unauthorized("Usuário não encontrado");

                return Ok(usuario);
            }

            var userId = int.Parse(userIdClaim.Value);
            var usuarioPorId = await service.GetAsync(userId);
            if (usuarioPorId == null)
                return NotFound("Usuário não encontrado");

            return Ok(usuarioPorId);
        }
    }
}