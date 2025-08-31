using Microsoft.AspNetCore.Mvc;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LivroController : ControllerBase
    {
        private readonly ILivroService service;

        public LivroController(ILivroService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<LivroDTO>> AddAsync(LivroDTO livroDTO)
        {
            var dto = await service.AddAsync(livroDTO);
            return Ok(dto);
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
            var livro = await service.GetAsync(id);
            if (livro == null)
                return NotFound();
            return Ok(livro);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync(LivroDTO livroDTO)
        {
            await service.UpdateAsync(livroDTO);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            await service.RemoveAsync(id);
            return NoContent();
        }
    }
}