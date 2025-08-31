using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutorController : ControllerBase
    {
        private readonly IAutorService service;

        public AutorController(IAutorService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AutorDTO>> AddAsync(AutorDTO autorDTO)
        {
            var dto = await service.AddAsync(autorDTO);
            return Ok(dto);
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
            await service.UpdateAsync(autorDTO);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveAsync(int id)
        {
            await service.RemoveAsync(id);
            return NoContent();
        }
    }
}