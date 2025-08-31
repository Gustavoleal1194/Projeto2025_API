using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EditoraController : ControllerBase
    {
        private readonly IEditoraService service;

        public EditoraController(IEditoraService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<EditoraDTO>> AddAsync(EditoraDTO editoraDTO)
        {
            var dto = await service.AddAsync(editoraDTO);
            return Ok(dto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EditoraDTO>>> GetAllAsync()
        {
            var lista = await service.GetAllAsync();
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EditoraDTO>> GetAsync(int id)
        {
            var editora = await service.GetAsync(id);
            if (editora == null)
                return NotFound();
            return Ok(editora);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync(EditoraDTO editoraDTO)
        {
            await service.UpdateAsync(editoraDTO);
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