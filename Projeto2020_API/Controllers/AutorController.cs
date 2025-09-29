using Dominio.Dtos;
using Interface.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public AutorController(IAutorService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AutorDTO>> AddAsync([FromBody] AutorDTO autorDTO)
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

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAsync(int id, [FromBody] AutorDTO autorDTO)
        {
            autorDTO.Id = id; // Garantir que o ID seja o correto
            await service.UpdateAsync(autorDTO);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveAsync(int id)
        {
            await service.RemoveAsync(id);
            return NoContent();
        }

        // Endpoints GET específicos para Autor
        [HttpGet("por-nacionalidade/{nacionalidade}")]
        public async Task<ActionResult<IEnumerable<AutorDTO>>> GetByNacionalidadeAsync(string nacionalidade)
        {
            var autores = await service.GetByNacionalidadeAsync(nacionalidade);
            return Ok(autores);
        }

        [HttpGet("buscar/{termo}")]
        public async Task<ActionResult<IEnumerable<AutorDTO>>> BuscarAsync(string termo)
        {
            var autores = await service.BuscarAsync(termo);
            return Ok(autores);
        }

        [HttpGet("com-livros")]
        public async Task<ActionResult<IEnumerable<AutorDTO>>> GetComLivrosAsync()
        {
            var autores = await service.GetComLivrosAsync();
            return Ok(autores);
        }

        [HttpPut("{id}/toggle-status")]
        public async Task<ActionResult> ToggleStatusAsync(int id)
        {
            await service.ToggleStatusAsync(id);
            return NoContent();
        }
    }
}