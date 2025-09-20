using Dominio.Dtos;
using Interface.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmprestimoController : ControllerBase
    {
        private readonly IEmprestimoService service;

        public EmprestimoController(IEmprestimoService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<EmprestimoDTO>> AddAsync([FromBody] EmprestimoDTO emprestimoDTO)
        {
            var dto = await service.AddAsync(emprestimoDTO);
            return Ok(dto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetAllAsync()
        {
            var lista = await service.GetAllAsync();
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmprestimoDTO>> GetAsync(int id)
        {
            var emprestimo = await service.GetAsync(id);
            if (emprestimo == null)
                return NotFound();
            return Ok(emprestimo);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] EmprestimoDTO emprestimoDTO)
        {
            await service.UpdateAsync(emprestimoDTO);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveAsync(int id)
        {
            await service.RemoveAsync(id);
            return NoContent();
        }

        // Endpoints GET específicos para Emprestimo
        [HttpGet("por-usuario/{idUsuario}")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetByUsuarioAsync(int idUsuario)
        {
            var emprestimos = await service.GetByUsuarioAsync(idUsuario);
            return Ok(emprestimos);
        }

        [HttpGet("por-livro/{idLivro}")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetByLivroAsync(int idLivro)
        {
            var emprestimos = await service.GetByLivroAsync(idLivro);
            return Ok(emprestimos);
        }

        [HttpGet("ativos")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetAtivosAsync()
        {
            var emprestimos = await service.GetAtivosAsync();
            return Ok(emprestimos);
        }

        [HttpGet("vencidos")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetVencidosAsync()
        {
            var emprestimos = await service.GetVencidosAsync();
            return Ok(emprestimos);
        }

        [HttpGet("por-status/{status}")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetByStatusAsync(string status)
        {
            var emprestimos = await service.GetByStatusAsync(status);
            return Ok(emprestimos);
        }
    }
}