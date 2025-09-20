using Dominio.Dtos;
using Interface.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] UsuarioDTO usuarioDTO)
        {
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
    }
}