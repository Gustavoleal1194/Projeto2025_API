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
    public class EditoraController : ControllerBase
    {
        private readonly IEditoraService service;

        public EditoraController(IEditoraService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<EditoraDTO>> AddAsync([FromBody] EditoraDTO editoraDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
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
        public async Task<ActionResult> UpdateAsync([FromBody] EditoraDTO editoraDTO)
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

        // Endpoints GET específicos para Editora
        [HttpGet("ativas")]
        public async Task<ActionResult<IEnumerable<EditoraDTO>>> GetAtivasAsync()
        {
            var editoras = await service.GetAtivasAsync();
            return Ok(editoras);
        }

        [HttpGet("por-cidade/{cidade}")]
        public async Task<ActionResult<IEnumerable<EditoraDTO>>> GetByCidadeAsync(string cidade)
        {
            var editoras = await service.GetByCidadeAsync(cidade);
            return Ok(editoras);
        }

        [HttpGet("por-estado/{estado}")]
        public async Task<ActionResult<IEnumerable<EditoraDTO>>> GetByEstadoAsync(string estado)
        {
            var editoras = await service.GetByEstadoAsync(estado);
            return Ok(editoras);
        }

        [HttpGet("buscar/{termo}")]
        public async Task<ActionResult<IEnumerable<EditoraDTO>>> BuscarAsync(string termo)
        {
            var editoras = await service.BuscarAsync(termo);
            return Ok(editoras);
        }
    }
}