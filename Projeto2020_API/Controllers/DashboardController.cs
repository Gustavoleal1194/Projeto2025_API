using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Interface.Service;
using System.Threading.Tasks;
using System.Linq;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin,Funcionario")] // Temporariamente removido para testes
    public class DashboardController : ControllerBase
    {
        private readonly ILivroService _livroService;
        private readonly IExemplarService _exemplarService;
        private readonly IUsuarioService _usuarioService;
        private readonly IEmprestimoService _emprestimoService;
        private readonly IFuncionarioService _funcionarioService;

        public DashboardController(
            ILivroService livroService,
            IExemplarService exemplarService,
            IUsuarioService usuarioService,
            IEmprestimoService emprestimoService,
            IFuncionarioService funcionarioService)
        {
            _livroService = livroService;
            _exemplarService = exemplarService;
            _usuarioService = usuarioService;
            _emprestimoService = emprestimoService;
            _funcionarioService = funcionarioService;
        }

        [HttpGet("resumo-geral")]
        public async Task<ActionResult> GetResumoGeral()
        {
            try
            {
                var livros = await _livroService.GetAllAsync();
                var exemplares = await _exemplarService.GetAllAsync();
                var usuarios = await _usuarioService.GetAllAsync();
                var emprestimosAtivos = await _emprestimoService.GetAtivosAsync();
                var emprestimosAtrasados = await _emprestimoService.GetVencidosAsync();
                var funcionarios = await _funcionarioService.GetAllAsync();

                var resumo = new
                {
                    TotalLivros = livros.Count(),
                    TotalExemplares = exemplares.Count(),
                    TotalUsuarios = usuarios.Count(),
                    TotalEmprestimosAtivos = emprestimosAtivos.Count(),
                    TotalAtrasos = emprestimosAtrasados.Count(),
                    TotalMultas = emprestimosAtrasados.Sum(e => e.Multa)
                };
                return Ok(resumo);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("estatisticas-emprestimos")]
        public async Task<ActionResult> GetEstatisticasEmprestimos()
        {
            try
            {
                var hoje = System.DateTime.Today;
                var inicioSemana = hoje.AddDays(-(int)hoje.DayOfWeek);
                var inicioMes = new System.DateTime(hoje.Year, hoje.Month, 1);

                var todosEmprestimos = await _emprestimoService.GetAllAsync();

                var estatisticas = new
                {
                    EmprestimosHoje = todosEmprestimos.Count(e => e.DataEmprestimo.Date == hoje),
                    EmprestimosEstaSemana = todosEmprestimos.Count(e => e.DataEmprestimo.Date >= inicioSemana),
                    EmprestimosEsteMes = todosEmprestimos.Count(e => e.DataEmprestimo.Date >= inicioMes),
                    DevolucoesHoje = todosEmprestimos.Count(e => e.DataDevolucao.HasValue && e.DataDevolucao.Value.Date == hoje),
                    DevolucoesEstaSemana = todosEmprestimos.Count(e => e.DataDevolucao.HasValue && e.DataDevolucao.Value.Date >= inicioSemana),
                    DevolucoesEsteMes = todosEmprestimos.Count(e => e.DataDevolucao.HasValue && e.DataDevolucao.Value.Date >= inicioMes)
                };
                return Ok(estatisticas);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
            try
            {
                var alertas = new List<object>();
                
                // Verificar empréstimos atrasados
                var emprestimosAtrasados = await _emprestimoService.GetVencidosAsync();
                if (emprestimosAtrasados.Any())
                {
                    alertas.Add(new
                    {
                        id = 1,
                        type = "warning",
                        message = $"{emprestimosAtrasados.Count()} empréstimo(s) atrasado(s)",
                        priority = "high"
                    });
                }

                // Verificar estoque baixo (exemplares disponíveis)
                var exemplares = await _exemplarService.GetAllAsync();
                var exemplaresDisponiveis = exemplares.Count(e => e.Disponivel);
                if (exemplaresDisponiveis < 5)
                {
                    alertas.Add(new
                    {
                        id = 2,
                        type = "info",
                        message = $"Estoque baixo: apenas {exemplaresDisponiveis} exemplares disponíveis",
                        priority = "medium"
                    });
                }

                // Alerta padrão se não houver problemas
                if (!alertas.Any())
                {
                    alertas.Add(new
                    {
                        id = 3,
                        type = "success",
                        message = "Sistema funcionando normalmente",
                        priority = "low"
                    });
                }

                return Ok(alertas);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
