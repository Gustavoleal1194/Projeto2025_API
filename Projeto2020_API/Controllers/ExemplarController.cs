using Dominio.Dtos;
using Interface.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExemplarController : ControllerBase
    {
        private readonly IExemplarService _exemplarService;

        public ExemplarController(IExemplarService exemplarService)
        {
            _exemplarService = exemplarService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExemplarDTO>>> GetAll()
        {
            var exemplares = await _exemplarService.GetAllAsync();
            return Ok(exemplares);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExemplarDTO>> Get(int id)
        {
            var exemplar = await _exemplarService.GetAsync(id);
            if (exemplar == null)
                return NotFound();

            return Ok(exemplar);
        }

        [HttpPost]
        public async Task<ActionResult<ExemplarDTO>> Add([FromBody] ExemplarDTO exemplarDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exemplar = await _exemplarService.AddAsync(exemplarDTO);
            return CreatedAtAction(nameof(Get), new { id = exemplar.Id }, exemplar);
        }

        [HttpPut]
        public async Task<ActionResult> Update([FromBody] ExemplarDTO exemplarDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _exemplarService.UpdateAsync(exemplarDTO);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _exemplarService.RemoveAsync(id);
            return NoContent();
        }

        [HttpGet("disponiveis")]
        public async Task<ActionResult<IEnumerable<ExemplarDTO>>> GetDisponiveis()
        {
            var exemplares = await _exemplarService.GetDisponiveisAsync();
            return Ok(exemplares);
        }

        [HttpGet("por-livro/{idLivro}")]
        public async Task<ActionResult<IEnumerable<ExemplarDTO>>> GetByLivro(int idLivro)
        {
            var exemplares = await _exemplarService.GetByLivroAsync(idLivro);
            return Ok(exemplares);
        }

        [HttpGet("disponiveis-por-livro/{idLivro}")]
        public async Task<ActionResult<IEnumerable<ExemplarDTO>>> GetDisponiveisByLivro(int idLivro)
        {
            var exemplares = await _exemplarService.GetDisponiveisByLivroAsync(idLivro);
            return Ok(exemplares);
        }

        [HttpGet("por-localizacao/{localizacao}")]
        public async Task<ActionResult<IEnumerable<ExemplarDTO>>> GetByLocalizacao(string localizacao)
        {
            var exemplares = await _exemplarService.GetByLocalizacaoAsync(localizacao);
            return Ok(exemplares);
        }

        [HttpGet("por-condicao/{condicao}")]
        public async Task<ActionResult<IEnumerable<ExemplarDTO>>> GetByCondicao(string condicao)
        {
            var exemplares = await _exemplarService.GetByCondicaoAsync(condicao);
            return Ok(exemplares);
        }

        [HttpGet("por-numero/{numeroExemplar}")]
        public async Task<ActionResult<ExemplarDTO>> GetByNumeroExemplar(string numeroExemplar)
        {
            var exemplar = await _exemplarService.GetByNumeroExemplarAsync(numeroExemplar);
            if (exemplar == null)
                return NotFound();

            return Ok(exemplar);
        }

        [HttpGet("emprestados")]
        public async Task<ActionResult<IEnumerable<ExemplarDTO>>> GetEmprestados()
        {
            var exemplares = await _exemplarService.GetEmprestadosAsync();
            return Ok(exemplares);
        }

        [HttpGet("{id}/verificar-disponibilidade")]
        public async Task<ActionResult<bool>> VerificarDisponibilidade(int id)
        {
            var disponivel = await _exemplarService.VerificarDisponibilidadeAsync(id);
            return Ok(disponivel);
        }

        [HttpGet("{id}/debug")]
        public async Task<ActionResult<object>> DebugExemplar(int id)
        {
            var exemplar = await _exemplarService.GetAsync(id);
            if (exemplar == null)
            {
                return Ok(new { 
                    existe = false, 
                    mensagem = "Exemplar não encontrado" 
                });
            }

            return Ok(new {
                existe = true,
                id = exemplar.Id,
                ativo = exemplar.Ativo,
                disponivel = exemplar.Disponivel,
                numeroExemplar = exemplar.NumeroExemplar,
                tituloLivro = exemplar.TituloLivro,
                mensagem = exemplar.Ativo && exemplar.Disponivel ? "Exemplar disponível" : "Exemplar não disponível"
            });
        }

        [HttpPost("{id}/marcar-indisponivel")]
        public async Task<ActionResult> MarcarComoIndisponivel(int id)
        {
            var sucesso = await _exemplarService.MarcarComoIndisponivelAsync(id);
            if (!sucesso)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/marcar-disponivel")]
        public async Task<ActionResult> MarcarComoDisponivel(int id)
        {
            var sucesso = await _exemplarService.MarcarComoDisponivelAsync(id);
            if (!sucesso)
                return NotFound();

            return NoContent();
        }
    }
}
