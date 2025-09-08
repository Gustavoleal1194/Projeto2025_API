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

    public class LivroController : ControllerBase
    {
        private readonly ILivroService service;
        private readonly LivroValidation validacao;

        public LivroController(ILivroService service)
        {
            this.service = service;
            this.validacao = new LivroValidation(); // Instancia o validador manualmente
        }

        [HttpPost]
        public async Task<ActionResult<LivroDTO>> AddAsync(LivroDTO livroDTO)
        {
            var result = validacao.Validate(livroDTO);

            if (result.IsValid)
            {
                var dto = await service.AddAsync(livroDTO);
                return Ok(dto);
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LivroDTO>>> GetAllAsync()
        {
            var lista = await service.GetAllAsync();
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LivroDTO>> GetAsync(int id)
        {
            if (id <= 0)
                return BadRequest("Id inválido.");

            var livro = await service.GetAsync(id);
            if (livro == null)
                return NotFound();

            return Ok(livro);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync(LivroDTO livroDTO)
        {
            var result = validacao.Validate(livroDTO);

            if (result.IsValid)
            {
                await service.UpdateAsync(livroDTO);
                return NoContent();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            if (id <= 0)
                return BadRequest("Id inválido.");

            await service.RemoveAsync(id);
            return NoContent();
        }
    }
}
