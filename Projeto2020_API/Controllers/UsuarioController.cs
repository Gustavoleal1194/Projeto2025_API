using Microsoft.AspNetCore.Mvc;
using Projeto2025_API.Validation;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService service;
        private readonly UsuarioValidation validacao;

        public UsuarioController(IUsuarioService service)
        {
            this.service = service;
            this.validacao = new UsuarioValidation();
        }

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
