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

        [HttpGet("por-exemplar/{idExemplar}")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetByExemplarAsync(int idExemplar)
        {
            var emprestimos = await service.GetByExemplarAsync(idExemplar);
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

        [HttpGet("emprestados")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetEmprestadosAsync()
        {
            var emprestimos = await service.GetByStatusAsync("Emprestado");
            return Ok(emprestimos);
        }

        [HttpGet("atrasados")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetAtrasadosAsync()
        {
            var emprestimos = await service.GetVencidosAsync();
            return Ok(emprestimos);
        }

        [HttpGet("devolvidos")]
        public async Task<ActionResult<IEnumerable<EmprestimoDTO>>> GetDevolvidosAsync()
        {
            var emprestimos = await service.GetDevolvidosAsync();
            return Ok(emprestimos);
        }

        [HttpPost("{id}/devolver")]
        public async Task<ActionResult> DevolverAsync(int id)
        {
            var sucesso = await service.DevolverAsync(id);
            if (!sucesso)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/renovar")]
        public async Task<ActionResult> RenovarAsync(int id)
        {
            var sucesso = await service.RenovarAsync(id);
            if (!sucesso)
                return BadRequest("Não é possível renovar este empréstimo");

            return NoContent();
        }
    }
}