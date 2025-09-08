using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto2025_API.Validation;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class AutorController : ControllerBase
    {
        private readonly IAutorService service;
        private readonly AutorValidation validacao;

        public AutorController(IAutorService service)
        {
            this.service = service;
            this.validacao = new AutorValidation(); // Inicializa a validação manualmente
        }

        [HttpPost]
        public async Task<ActionResult<AutorDTO>> AddAsync(AutorDTO autorDTO)
        {
            var result = validacao.Validate(autorDTO);

            if (result.IsValid)
            {
                var dto = await service.AddAsync(autorDTO);
                return Ok(dto);
            }
            else
            {
                return BadRequest(result.Errors); // Retorna os erros de validação
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AutorDTO>>> GetAllAsync()
        {
            var lista = await service.GetAllAsync();
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AutorDTO>> GetAsync(int id)
        {
            var autor = await service.GetAsync(id);
            if (autor == null)
                return NotFound();
            return Ok(autor);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync(AutorDTO autorDTO)
        {
            var result = validacao.Validate(autorDTO);

            if (result.IsValid)
            {
                await service.UpdateAsync(autorDTO);
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
            await service.RemoveAsync(id);
            return NoContent();
        }
    }
}
