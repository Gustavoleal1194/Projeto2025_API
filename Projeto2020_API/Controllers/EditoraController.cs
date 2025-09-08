using Microsoft.AspNetCore.Mvc;
using Projeto2025_API.Validation;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EditoraController : ControllerBase
    {
        private readonly IEditoraService service;
        private readonly EditoraValidation validacao;

        public EditoraController(IEditoraService service)
        {
            this.service = service;
            this.validacao = new EditoraValidation(); // Instancia a validação
        }

        [HttpPost]
        public async Task<ActionResult<EditoraDTO>> AddAsync(EditoraDTO editoraDTO)
        {
            var result = validacao.Validate(editoraDTO);

            if (result.IsValid)
            {
                var dto = await service.AddAsync(editoraDTO);
                return Ok(dto);
            }
            else
            {
                return BadRequest(result.Errors);
            }
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
            if (id <= 0)
                return BadRequest("Id inválido.");

            var editora = await service.GetAsync(id);
            if (editora == null)
                return NotFound();

            return Ok(editora);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync(EditoraDTO editoraDTO)
        {
            var result = validacao.Validate(editoraDTO);

            if (result.IsValid)
            {
                await service.UpdateAsync(editoraDTO);
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
