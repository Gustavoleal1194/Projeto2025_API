using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin,Funcionario")] // Temporariamente removido para testes
    public class RelatoriosController : ControllerBase
    {
        [HttpGet("emprestimos-por-periodo")]
        public async Task<ActionResult> GetEmprestimosPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            // TODO: Implementar lógica de relatório
            var relatorio = new
            {
                DataInicio = dataInicio,
                DataFim = dataFim,
                TotalEmprestimos = 0,
                Emprestimos = new List<object>()
            };
            return Ok(relatorio);
        }

        [HttpGet("livros-mais-emprestados")]
        public async Task<ActionResult> GetLivrosMaisEmprestados([FromQuery] int top = 10)
        {
            // TODO: Implementar lógica de relatório
            var relatorio = new
            {
                Top = top,
                Livros = new List<object>()
            };
            return Ok(relatorio);
        }

        [HttpGet("usuarios-mais-ativos")]
        public async Task<ActionResult> GetUsuariosMaisAtivos([FromQuery] int top = 10)
        {
            // TODO: Implementar lógica de relatório
            var relatorio = new
            {
                Top = top,
                Usuarios = new List<object>()
            };
            return Ok(relatorio);
        }

        [HttpGet("atrasos-por-periodo")]
        public async Task<ActionResult> GetAtrasosPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            // TODO: Implementar lógica de relatório
            var relatorio = new
            {
                DataInicio = dataInicio,
                DataFim = dataFim,
                TotalAtrasos = 0,
                Atrasos = new List<object>()
            };
            return Ok(relatorio);
        }

        [HttpGet("multas-por-periodo")]
        public async Task<ActionResult> GetMultasPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            // TODO: Implementar lógica de relatório
            var relatorio = new
            {
                DataInicio = dataInicio,
                DataFim = dataFim,
                TotalMultas = 0.0m,
                Multas = new List<object>()
            };
            return Ok(relatorio);
        }

        [HttpGet("estoque-baixo")]
        public async Task<ActionResult> GetEstoqueBaixo([FromQuery] int limiteMinimo = 5)
        {
            // TODO: Implementar lógica de relatório
            var relatorio = new
            {
                LimiteMinimo = limiteMinimo,
                Livros = new List<object>()
            };
            return Ok(relatorio);
        }
    }
}
