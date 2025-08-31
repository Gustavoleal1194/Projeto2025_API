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
        public async Task<ActionResult<EmprestimoDTO>> AddAsync(EmprestimoDTO emprestimoDTO)
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
        public async Task<ActionResult> UpdateAsync(EmprestimoDTO emprestimoDTO)
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
    }
}