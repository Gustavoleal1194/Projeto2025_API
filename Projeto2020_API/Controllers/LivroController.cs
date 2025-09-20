using Dominio.Dtos;
using Interface.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<ActionResult<LivroDTO>> AddAsync([FromBody] LivroDTO livroDTO)
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
        public async Task<ActionResult> UpdateAsync([FromBody] LivroDTO livroDTO)
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

        // Endpoints GET específicos para Livro
        [HttpGet("disponiveis")]
        public async Task<ActionResult<IEnumerable<LivroDTO>>> GetDisponiveisAsync()
        {
            var livros = await service.GetDisponiveisAsync();
            return Ok(livros);
        }

        [HttpGet("por-genero/{genero}")]
        public async Task<ActionResult<IEnumerable<LivroDTO>>> GetByGeneroAsync(string genero)
        {
            var livros = await service.GetByGeneroAsync(genero);
            return Ok(livros);
        }

        [HttpGet("por-autor/{idAutor}")]
        public async Task<ActionResult<IEnumerable<LivroDTO>>> GetByAutorAsync(int idAutor)
        {
            var livros = await service.GetByAutorAsync(idAutor);
            return Ok(livros);
        }

        [HttpGet("por-editora/{idEditora}")]
        public async Task<ActionResult<IEnumerable<LivroDTO>>> GetByEditoraAsync(int idEditora)
        {
            var livros = await service.GetByEditoraAsync(idEditora);
            return Ok(livros);
        }

        [HttpGet("buscar/{termo}")]
        public async Task<ActionResult<IEnumerable<LivroDTO>>> BuscarAsync(string termo)
        {
            var livros = await service.BuscarAsync(termo);
            return Ok(livros);
        }

        [HttpGet("em-estoque")]
        public async Task<ActionResult<IEnumerable<LivroDTO>>> GetEmEstoqueAsync()
        {
            var livros = await service.GetEmEstoqueAsync();
            return Ok(livros);
        }
    }
}