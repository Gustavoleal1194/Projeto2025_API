using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto2025_API.Validation;
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
        private readonly EmprestimoValidation validacao;

        public EmprestimoController(IEmprestimoService service)
        {
            this.service = service;
            this.validacao = new EmprestimoValidation(); // Validador instanciado
        }

        [HttpPost]
        public async Task<ActionResult<EmprestimoDTO>> AddAsync(EmprestimoDTO emprestimoDTO)
        {
            var result = validacao.Validate(emprestimoDTO);

            if (result.IsValid)
            {
                var dto = await service.AddAsync(emprestimoDTO);
                return Ok(dto);
            }
            else
            {
                return BadRequest(result.Errors);
            }
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
            if (id <= 0)
                return BadRequest("Id inválido.");

            var emprestimo = await service.GetAsync(id);
            if (emprestimo == null)
                return NotFound();

            return Ok(emprestimo);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync(EmprestimoDTO emprestimoDTO)
        {
            var result = validacao.Validate(emprestimoDTO);

            if (result.IsValid)
            {
                await service.UpdateAsync(emprestimoDTO);
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
