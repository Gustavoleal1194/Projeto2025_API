using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Dominio.Dtos;
using Interface.Service;
using Projeto2025_API.Validators;
using FluentValidation;
using System.Security.Claims;

namespace Projeto2025_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConfiguracaoController : ControllerBase
    {
        private readonly IConfiguracaoSistemaService _configuracaoService;
        private readonly IValidator<ConfiguracaoSistemaRequestDTO> _validator;

        public ConfiguracaoController(
            IConfiguracaoSistemaService configuracaoService,
            IValidator<ConfiguracaoSistemaRequestDTO> validator)
        {
            _configuracaoService = configuracaoService;
            _validator = validator;
        }

        /// <summary>
        /// Obtém todas as configurações do sistema
        /// </summary>
        [HttpGet("sistema")]
        public async Task<ActionResult<ConfiguracaoSistemaRequestDTO>> GetConfiguracaoSistema()
        {
            try
            {
                var configuracao = await _configuracaoService.GetConfiguracaoSistemaAsync();
                return Ok(configuracao);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Atualiza configurações do sistema
        /// </summary>
        [HttpPut("sistema")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateConfiguracaoSistema([FromBody] ConfiguracaoSistemaRequestDTO configuracao)
        {
            try
            {
                var validationResult = await _validator.ValidateAsync(configuracao);
                if (!validationResult.IsValid)
                {
                    return BadRequest(new { 
                        message = "Dados inválidos", 
                        errors = validationResult.Errors.Select(e => new { 
                            field = e.PropertyName, 
                            message = e.ErrorMessage 
                        })
                    });
                }

                var usuario = User.FindFirst(ClaimTypes.Name)?.Value ?? "Sistema";
                var sucesso = await _configuracaoService.UpdateConfiguracaoSistemaAsync(configuracao, usuario);

                if (sucesso)
                {
                    return Ok(new { message = "Configurações atualizadas com sucesso" });
                }

                return StatusCode(500, new { message = "Erro ao atualizar configurações" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém parâmetros de empréstimo
        /// </summary>
        [HttpGet("emprestimo")]
        public async Task<ActionResult<ConfiguracaoSistemaRequestDTO>> GetParametrosEmprestimo()
        {
            try
            {
                var parametros = await _configuracaoService.GetParametrosEmprestimoAsync();
                return Ok(parametros);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Atualiza parâmetros de empréstimo
        /// </summary>
        [HttpPut("emprestimo")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateParametrosEmprestimo([FromBody] ConfiguracaoSistemaRequestDTO parametros)
        {
            try
            {
                var validationResult = await _validator.ValidateAsync(parametros);
                if (!validationResult.IsValid)
                {
                    return BadRequest(new { 
                        message = "Dados inválidos", 
                        errors = validationResult.Errors.Select(e => new { 
                            field = e.PropertyName, 
                            message = e.ErrorMessage 
                        })
                    });
                }

                var usuario = User.FindFirst(ClaimTypes.Name)?.Value ?? "Sistema";
                var sucesso = await _configuracaoService.UpdateParametrosEmprestimoAsync(parametros, usuario);

                if (sucesso)
                {
                    return Ok(new { message = "Parâmetros de empréstimo atualizados com sucesso" });
                }

                return StatusCode(500, new { message = "Erro ao atualizar parâmetros" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém informações de backup
        /// </summary>
        [HttpGet("backup")]
        public async Task<ActionResult<BackupInfoDTO>> GetBackupInfo()
        {
            try
            {
                var backupInfo = await _configuracaoService.GetBackupInfoAsync();
                return Ok(backupInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Executa backup manual
        /// </summary>
        [HttpPost("backup/executar")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> ExecutarBackup()
        {
            try
            {
                var usuario = User.FindFirst(ClaimTypes.Name)?.Value ?? "Sistema";
                var sucesso = await _configuracaoService.ExecutarBackupAsync(usuario);

                if (sucesso)
                {
                    return Ok(new { message = "Backup executado com sucesso" });
                }

                return StatusCode(500, new { message = "Erro ao executar backup" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém histórico de alterações de uma configuração
        /// </summary>
        [HttpGet("historico/{chave}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ConfiguracaoHistoricoDTO>>> GetHistoricoConfiguracao(string chave)
        {
            try
            {
                var historico = await _configuracaoService.GetHistoricoConfiguracaoAsync(chave);
                return Ok(historico);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém valor de uma configuração específica
        /// </summary>
        [HttpGet("valor/{chave}")]
        public async Task<ActionResult<string>> GetConfiguracaoByChave(string chave)
        {
            try
            {
                var valor = await _configuracaoService.GetConfiguracaoByChaveAsync(chave);
                if (valor == null)
                {
                    return NotFound(new { message = "Configuração não encontrada" });
                }
                return Ok(new { chave, valor });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Atualiza valor de uma configuração específica
        /// </summary>
        [HttpPut("valor/{chave}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateConfiguracaoByChave(string chave, [FromBody] string valor)
        {
            try
            {
                if (string.IsNullOrEmpty(valor))
                {
                    return BadRequest(new { message = "Valor não pode ser vazio" });
                }

                var usuario = User.FindFirst(ClaimTypes.Name)?.Value ?? "Sistema";
                var sucesso = await _configuracaoService.UpdateConfiguracaoByChaveAsync(chave, valor, usuario);

                if (sucesso)
                {
                    return Ok(new { message = "Configuração atualizada com sucesso" });
                }

                return StatusCode(500, new { message = "Erro ao atualizar configuração" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Inicializa configurações padrão do sistema
        /// </summary>
        [HttpPost("inicializar")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> InicializarConfiguracoesPadrao()
        {
            try
            {
                var sucesso = await _configuracaoService.InicializarConfiguracoesPadraoAsync();

                if (sucesso)
                {
                    return Ok(new { message = "Configurações padrão inicializadas com sucesso" });
                }

                return StatusCode(500, new { message = "Erro ao inicializar configurações padrão" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
            }
        }
    }
}