using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using Interface.Service;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin,Funcionario")] // Temporariamente removido para testes
    public class RelatoriosController : ControllerBase
    {
        private readonly IEmprestimoService _emprestimoService;
        private readonly IExemplarService _exemplarService;
        private readonly ILivroService _livroService;

        public RelatoriosController(
            IEmprestimoService emprestimoService,
            IExemplarService exemplarService,
            ILivroService livroService)
        {
            _emprestimoService = emprestimoService;
            _exemplarService = exemplarService;
            _livroService = livroService;
        }

        [HttpGet("emprestimos-por-periodo")]
        public async Task<ActionResult> GetEmprestimosPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            if (dataFim < dataInicio)
            {
                return BadRequest(new { message = "dataFim deve ser maior ou igual a dataInicio" });
            }

            // Normalizar para o primeiro dia do mês e último dia do mês
            var inicio = new DateTime(dataInicio.Year, dataInicio.Month, 1);
            var fim = new DateTime(dataFim.Year, dataFim.Month, DateTime.DaysInMonth(dataFim.Year, dataFim.Month)).AddDays(1).AddTicks(-1);

            var emprestimos = await _emprestimoService.GetAllAsync();

            // Filtrar no período e agrupar por mês (yyyy-MM)
            var emprestimosNoPeriodo = emprestimos.Where(e => e.DataEmprestimo >= inicio && e.DataEmprestimo <= fim);
            var devolucoesNoPeriodo = emprestimos.Where(e => e.DataDevolucao.HasValue && e.DataDevolucao.Value >= inicio && e.DataDevolucao.Value <= fim);

            // Construir a lista de meses no intervalo
            var meses = new List<DateTime>();
            var cursor = new DateTime(inicio.Year, inicio.Month, 1);
            while (cursor <= fim)
            {
                meses.Add(cursor);
                cursor = cursor.AddMonths(1);
            }

            var resultado = meses.Select(m => new
            {
                month = m.ToString("yyyy-MM"),
                emprestimos = emprestimosNoPeriodo.Count(e => e.DataEmprestimo.Year == m.Year && e.DataEmprestimo.Month == m.Month),
                devolucoes = devolucoesNoPeriodo.Count(e => e.DataDevolucao!.Value.Year == m.Year && e.DataDevolucao!.Value.Month == m.Month)
            });

            return Ok(resultado);
        }

        [HttpGet("livros-mais-emprestados")]
        public async Task<ActionResult> GetLivrosMaisEmprestados([FromQuery] int top = 10)
        {
            if (top <= 0) top = 10;

            // Carregar tudo que precisamos em memória para agregação
            var emprestimos = await _emprestimoService.GetAllAsync();
            var exemplares = await _exemplarService.GetAllAsync();
            var livros = await _livroService.GetAllAsync();

            var exemplarById = exemplares.ToDictionary(x => x.Id);
            var livroById = livros.ToDictionary(l => l.Id);

            // Agregar contagem por LivroId
            var contagemPorLivro = new Dictionary<int, int>();

            foreach (var emp in emprestimos)
            {
                if (!exemplarById.TryGetValue(emp.IdExemplar, out var exemplar))
                {
                    continue;
                }
                var livroId = exemplar.IdLivro;
                if (!contagemPorLivro.ContainsKey(livroId)) contagemPorLivro[livroId] = 0;
                contagemPorLivro[livroId]++;
            }

            var topLivros = contagemPorLivro
                .OrderByDescending(kv => kv.Value)
                .Take(top)
                .Select((kv) =>
                {
                    var livroId = kv.Key;
                    var total = kv.Value;
                    if (!livroById.TryGetValue(livroId, out var livro))
                    {
                        return new { id = livroId, titulo = $"Livro {livroId}", autor = string.Empty, totalEmprestimos = total };
                    }
                    return new
                    {
                        id = livro.Id,
                        titulo = livro.Titulo,
                        autor = livro.NomeAutor ?? string.Empty,
                        totalEmprestimos = total
                    };
                })
                .ToList();

            // Fallback: se não houver empréstimos, retornar top livros cadastrados (com 0 empréstimos)
            if (topLivros.Count == 0)
            {
                topLivros = livros
                    .Take(top)
                    .Select(livro => new
                    {
                        id = livro.Id,
                        titulo = livro.Titulo,
                        autor = livro.NomeAutor ?? string.Empty,
                        totalEmprestimos = 0
                    })
                    .ToList();
            }

            return Ok(new { livros = topLivros });
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
