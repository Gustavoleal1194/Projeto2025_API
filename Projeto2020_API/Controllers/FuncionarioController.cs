using Dominio.Dtos;
using Interface.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FuncionarioController : ControllerBase
    {
        private readonly IFuncionarioService _service;

        public FuncionarioController(IFuncionarioService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<FuncionarioDTO>> AddAsync([FromBody] FuncionarioDTO funcionarioDTO)
        {
            var dto = await _service.AddAsync(funcionarioDTO);
            return Ok(dto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FuncionarioDTO>>> GetAllAsync()
        {
            var lista = await _service.GetAllAsync();
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FuncionarioDTO>> GetByIdAsync(int id)
        {
            var funcionario = await _service.GetByIdAsync(id);
            if (funcionario == null)
                return NotFound();
            return Ok(funcionario);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] FuncionarioDTO funcionarioDTO)
        {
            await _service.UpdateAsync(funcionarioDTO);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveAsync(int id)
        {
            await _service.RemoveAsync(id);
            return NoContent();
        }

        [HttpGet("cargo/{cargo}")]
        public async Task<ActionResult<IEnumerable<FuncionarioDTO>>> GetByCargoAsync(string cargo)
        {
            var funcionarios = await _service.GetByCargoAsync(cargo);
            return Ok(funcionarios);
        }

        [HttpGet("ativos")]
        public async Task<ActionResult<IEnumerable<FuncionarioDTO>>> GetAtivosAsync()
        {
            var funcionarios = await _service.GetAtivosAsync();
            return Ok(funcionarios);
        }

        [HttpGet("inativos")]
        public async Task<ActionResult<IEnumerable<FuncionarioDTO>>> GetInativosAsync()
        {
            var funcionarios = await _service.GetInativosAsync();
            return Ok(funcionarios);
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<FuncionarioDTO>> GetByEmailAsync(string email)
        {
            var funcionario = await _service.GetByEmailAsync(email);
            if (funcionario == null)
                return NotFound();
            return Ok(funcionario);
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> CountAsync()
        {
            var count = await _service.CountAsync();
            return Ok(count);
        }

        [HttpGet("exists/{id}")]
        public async Task<ActionResult<bool>> ExistsAsync(int id)
        {
            var exists = await _service.ExistsAsync(id);
            return Ok(exists);
        }
    }
}
