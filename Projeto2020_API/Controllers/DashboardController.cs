using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Funcionario")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("resumo-geral")]
        public async Task<ActionResult> GetResumoGeral()
        {
            // TODO: Implementar lógica do dashboard
            var resumo = new
            {
                TotalLivros = 0,
                TotalExemplares = 0,
                TotalUsuarios = 0,
                TotalEmprestimosAtivos = 0,
                TotalAtrasos = 0,
                TotalMultas = 0.0m
            };
            return Ok(resumo);
        }

        [HttpGet("estatisticas-emprestimos")]
        public async Task<ActionResult> GetEstatisticasEmprestimos()
        {
            // TODO: Implementar lógica do dashboard
            var estatisticas = new
            {
                EmprestimosHoje = 0,
                EmprestimosEstaSemana = 0,
                EmprestimosEsteMes = 0,
                DevolucoesHoje = 0,
                DevolucoesEstaSemana = 0,
                DevolucoesEsteMes = 0
            };
            return Ok(estatisticas);
        }

        [HttpGet("grafico-emprestimos-mensal")]
        public async Task<ActionResult> GetGraficoEmprestimosMensal([FromQuery] int ano = 2025)
        {
            // TODO: Implementar lógica do dashboard
            var grafico = new
            {
                Ano = ano,
                Dados = new List<object>()
            };
            return Ok(grafico);
        }

        [HttpGet("grafico-generos-populares")]
        public async Task<ActionResult> GetGraficoGenerosPopulares()
        {
            // TODO: Implementar lógica do dashboard
            var grafico = new
            {
                Generos = new List<object>()
            };
            return Ok(grafico);
        }

        [HttpGet("alertas")]
        public async Task<ActionResult> GetAlertas()
        {
            // TODO: Implementar lógica do dashboard
            var alertas = new List<object>();
            return Ok(alertas);
        }
    }
}
