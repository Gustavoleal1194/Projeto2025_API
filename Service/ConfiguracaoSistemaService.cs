using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;
using System.Text.Json;

namespace Service
{
    /// <summary>
    /// Serviço para gerenciamento de configurações do sistema
    /// </summary>
    public class ConfiguracaoSistemaService : IConfiguracaoSistemaService
    {
        private readonly IConfiguracaoSistemaRepositorio _configuracaoRepositorio;
        private readonly IConfiguracaoHistoricoRepositorio _historicoRepositorio;
        private readonly IMapper _mapper;

        public ConfiguracaoSistemaService(
            IConfiguracaoSistemaRepositorio configuracaoRepositorio,
            IConfiguracaoHistoricoRepositorio historicoRepositorio,
            IMapper mapper)
        {
            _configuracaoRepositorio = configuracaoRepositorio;
            _historicoRepositorio = historicoRepositorio;
            _mapper = mapper;
        }

        public async Task<ConfiguracaoSistemaRequestDTO> GetConfiguracaoSistemaAsync()
        {
            var configuracoes = await _configuracaoRepositorio.GetAtivasAsync();
            return MapearConfiguracoesParaDTO(configuracoes);
        }

        public async Task<bool> UpdateConfiguracaoSistemaAsync(ConfiguracaoSistemaRequestDTO configuracao, string usuario)
        {
            try
            {
                var configuracoes = MapearDTOParaConfiguracoes(configuracao);
                
                foreach (var config in configuracoes)
                {
                    await _configuracaoRepositorio.CreateOrUpdateAsync(
                        config.Chave, 
                        config.Valor, 
                        config.Tipo, 
                        config.Categoria, 
                        config.Descricao, 
                        usuario);
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<ConfiguracaoSistemaRequestDTO> GetParametrosEmprestimoAsync()
        {
            var configuracoes = await _configuracaoRepositorio.GetByCategoriaAsync("Emprestimo");
            return MapearConfiguracoesParaDTO(configuracoes);
        }

        public async Task<bool> UpdateParametrosEmprestimoAsync(ConfiguracaoSistemaRequestDTO parametros, string usuario)
        {
            try
            {
                var configuracoes = MapearParametrosEmprestimoParaConfiguracoes(parametros);
                
                foreach (var config in configuracoes)
                {
                    await _configuracaoRepositorio.CreateOrUpdateAsync(
                        config.Chave, 
                        config.Valor, 
                        config.Tipo, 
                        config.Categoria, 
                        config.Descricao, 
                        usuario);
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<BackupInfoDTO> GetBackupInfoAsync()
        {
            // Por enquanto retorna dados mock, pode ser implementado com lógica real de backup
            return new BackupInfoDTO
            {
                Status = "Ativo",
                Configuracao = new BackupConfiguracaoDTO
                {
                    BackupAutomatico = true,
                    Frequencia = "Diário",
                    Hora = "02:00",
                    Retencao = 30,
                    Localizacao = "C:\\Backups\\Biblioteca",
                    Formato = "SQL",
                    Compressao = true,
                    Criptografia = false,
                    Notificacao = true,
                    EmailNotificacao = "admin@biblioteca.com"
                },
                UltimoBackup = new UltimoBackupDTO
                {
                    Data = DateTime.Now.AddDays(-1),
                    Tamanho = "125.5 MB",
                    Status = "Sucesso",
                    Duracao = "00:05:30",
                    Arquivo = "backup_20250921_020000.sql",
                    Localizacao = "C:\\Backups\\Biblioteca\\backup_20250921_020000.sql"
                },
                ProximoBackup = new ProximoBackupDTO
                {
                    Data = DateTime.Now.AddDays(1),
                    TempoRestante = "05:00:00"
                },
                Historico = new List<BackupHistoricoDTO>
                {
                    new() { Data = DateTime.Now.AddDays(-1), Tamanho = "125.5 MB", Status = "Sucesso", Duracao = "00:05:30" },
                    new() { Data = DateTime.Now.AddDays(-2), Tamanho = "124.8 MB", Status = "Sucesso", Duracao = "00:05:25" },
                    new() { Data = DateTime.Now.AddDays(-3), Tamanho = "125.1 MB", Status = "Sucesso", Duracao = "00:05:35" }
                },
                Estatisticas = new BackupEstatisticasDTO
                {
                    TotalBackups = 30,
                    BackupsSucesso = 29,
                    BackupsFalha = 1,
                    TamanhoMedio = "125.1 MB",
                    DuracaoMedia = "00:05:30",
                    TaxaSucesso = 96.67m
                }
            };
        }

        public async Task<bool> ExecutarBackupAsync(string usuario)
        {
            try
            {
                // Aqui seria implementada a lógica real de backup
                // Por enquanto apenas simula o processo
                await Task.Delay(1000); // Simula processamento
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<IEnumerable<ConfiguracaoHistoricoDTO>> GetHistoricoConfiguracaoAsync(string chave)
        {
            var historico = await _historicoRepositorio.GetByChaveAsync(chave);
            return _mapper.Map<IEnumerable<ConfiguracaoHistoricoDTO>>(historico);
        }

        public async Task<string?> GetConfiguracaoByChaveAsync(string chave)
        {
            var configuracao = await _configuracaoRepositorio.GetByChaveAsync(chave);
            return configuracao?.Valor;
        }

        public async Task<bool> UpdateConfiguracaoByChaveAsync(string chave, string valor, string usuario)
        {
            try
            {
                await _configuracaoRepositorio.UpdateByChaveAsync(chave, valor, usuario);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> InicializarConfiguracoesPadraoAsync()
        {
            try
            {
                var configuracoesPadrao = ObterConfiguracoesPadrao();
                
                foreach (var config in configuracoesPadrao)
                {
                    await _configuracaoRepositorio.CreateOrUpdateAsync(
                        config.Chave, 
                        config.Valor, 
                        config.Tipo, 
                        config.Categoria, 
                        config.Descricao, 
                        "Sistema");
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private ConfiguracaoSistemaRequestDTO MapearConfiguracoesParaDTO(IEnumerable<ConfiguracaoSistema> configuracoes)
        {
            var dto = new ConfiguracaoSistemaRequestDTO();
            var configDict = configuracoes.ToDictionary(c => c.Chave, c => c.Valor);

            // Mapear configurações do sistema
            dto.NomeBiblioteca = configDict.GetValueOrDefault("sistema.nome_biblioteca", "Biblioteca Municipal");
            dto.Endereco = configDict.GetValueOrDefault("sistema.endereco", "Rua das Flores, 123");
            dto.Telefone = configDict.GetValueOrDefault("sistema.telefone", "(11) 99999-9999");
            dto.Email = configDict.GetValueOrDefault("sistema.email", "contato@biblioteca.com");
            dto.HorarioFuncionamento = configDict.GetValueOrDefault("sistema.horario_funcionamento", "08:00 - 18:00");
            dto.DiasFuncionamento = configDict.GetValueOrDefault("sistema.dias_funcionamento", "Segunda a Sexta");

            // Mapear limites do sistema
            dto.MaxUsuarios = int.Parse(configDict.GetValueOrDefault("sistema.max_usuarios", "1000"));
            dto.MaxLivros = int.Parse(configDict.GetValueOrDefault("sistema.max_livros", "10000"));
            dto.MaxExemplares = int.Parse(configDict.GetValueOrDefault("sistema.max_exemplares", "50000"));
            dto.MaxEmprestimosPorUsuario = int.Parse(configDict.GetValueOrDefault("sistema.max_emprestimos_por_usuario", "5"));

            // Mapear parâmetros de empréstimo
            dto.MaxRenovacoes = int.Parse(configDict.GetValueOrDefault("emprestimo.max_renovacoes", "3"));
            dto.DiasEmprestimo = int.Parse(configDict.GetValueOrDefault("emprestimo.dias_emprestimo", "14"));
            dto.MultaPorDia = decimal.Parse(configDict.GetValueOrDefault("emprestimo.multa_por_dia", "1.0"));
            dto.ValorMaximoMulta = decimal.Parse(configDict.GetValueOrDefault("emprestimo.valor_maximo_multa", "50.0"));
            dto.DiasParaAtraso = int.Parse(configDict.GetValueOrDefault("emprestimo.dias_para_atraso", "1"));
            dto.DiasParaBloqueio = int.Parse(configDict.GetValueOrDefault("emprestimo.dias_para_bloqueio", "7"));

            // Mapear configurações de notificação
            dto.NotificacaoEmail = bool.Parse(configDict.GetValueOrDefault("notificacao.email", "true"));
            dto.NotificacaoSMS = bool.Parse(configDict.GetValueOrDefault("notificacao.sms", "false"));
            dto.EmailNotificacao = configDict.GetValueOrDefault("notificacao.email_endereco", "noreply@biblioteca.com");

            // Mapear configurações de backup
            dto.BackupAutomatico = bool.Parse(configDict.GetValueOrDefault("backup.automatico", "true"));
            dto.FrequenciaBackup = configDict.GetValueOrDefault("backup.frequencia", "Diário");
            dto.HoraBackup = configDict.GetValueOrDefault("backup.hora", "02:00");
            dto.RetencaoBackup = int.Parse(configDict.GetValueOrDefault("backup.retencao", "30"));

            return dto;
        }

        private IEnumerable<ConfiguracaoSistema> MapearDTOParaConfiguracoes(ConfiguracaoSistemaRequestDTO dto)
        {
            var configuracoes = new List<ConfiguracaoSistema>();

            // Configurações do sistema
            configuracoes.AddRange(new[]
            {
                new ConfiguracaoSistema { Chave = "sistema.nome_biblioteca", Valor = dto.NomeBiblioteca, Tipo = "String", Categoria = "Sistema", Descricao = "Nome da biblioteca" },
                new ConfiguracaoSistema { Chave = "sistema.endereco", Valor = dto.Endereco, Tipo = "String", Categoria = "Sistema", Descricao = "Endereço da biblioteca" },
                new ConfiguracaoSistema { Chave = "sistema.telefone", Valor = dto.Telefone, Tipo = "String", Categoria = "Sistema", Descricao = "Telefone de contato" },
                new ConfiguracaoSistema { Chave = "sistema.email", Valor = dto.Email, Tipo = "String", Categoria = "Sistema", Descricao = "Email de contato" },
                new ConfiguracaoSistema { Chave = "sistema.horario_funcionamento", Valor = dto.HorarioFuncionamento, Tipo = "String", Categoria = "Sistema", Descricao = "Horário de funcionamento" },
                new ConfiguracaoSistema { Chave = "sistema.dias_funcionamento", Valor = dto.DiasFuncionamento, Tipo = "String", Categoria = "Sistema", Descricao = "Dias de funcionamento" },
                new ConfiguracaoSistema { Chave = "sistema.max_usuarios", Valor = dto.MaxUsuarios.ToString(), Tipo = "Int", Categoria = "Sistema", Descricao = "Máximo de usuários" },
                new ConfiguracaoSistema { Chave = "sistema.max_livros", Valor = dto.MaxLivros.ToString(), Tipo = "Int", Categoria = "Sistema", Descricao = "Máximo de livros" },
                new ConfiguracaoSistema { Chave = "sistema.max_exemplares", Valor = dto.MaxExemplares.ToString(), Tipo = "Int", Categoria = "Sistema", Descricao = "Máximo de exemplares" },
                new ConfiguracaoSistema { Chave = "sistema.max_emprestimos_por_usuario", Valor = dto.MaxEmprestimosPorUsuario.ToString(), Tipo = "Int", Categoria = "Sistema", Descricao = "Máximo de empréstimos por usuário" }
            });

            // Parâmetros de empréstimo
            configuracoes.AddRange(new[]
            {
                new ConfiguracaoSistema { Chave = "emprestimo.max_renovacoes", Valor = dto.MaxRenovacoes.ToString(), Tipo = "Int", Categoria = "Emprestimo", Descricao = "Máximo de renovações" },
                new ConfiguracaoSistema { Chave = "emprestimo.dias_emprestimo", Valor = dto.DiasEmprestimo.ToString(), Tipo = "Int", Categoria = "Emprestimo", Descricao = "Dias de empréstimo" },
                new ConfiguracaoSistema { Chave = "emprestimo.multa_por_dia", Valor = dto.MultaPorDia.ToString(), Tipo = "Decimal", Categoria = "Emprestimo", Descricao = "Multa por dia de atraso" },
                new ConfiguracaoSistema { Chave = "emprestimo.valor_maximo_multa", Valor = dto.ValorMaximoMulta.ToString(), Tipo = "Decimal", Categoria = "Emprestimo", Descricao = "Valor máximo de multa" },
                new ConfiguracaoSistema { Chave = "emprestimo.dias_para_atraso", Valor = dto.DiasParaAtraso.ToString(), Tipo = "Int", Categoria = "Emprestimo", Descricao = "Dias para considerar atraso" },
                new ConfiguracaoSistema { Chave = "emprestimo.dias_para_bloqueio", Valor = dto.DiasParaBloqueio.ToString(), Tipo = "Int", Categoria = "Emprestimo", Descricao = "Dias para bloquear usuário" }
            });

            // Configurações de notificação
            configuracoes.AddRange(new[]
            {
                new ConfiguracaoSistema { Chave = "notificacao.email", Valor = dto.NotificacaoEmail.ToString(), Tipo = "Boolean", Categoria = "Notificacao", Descricao = "Notificação por email" },
                new ConfiguracaoSistema { Chave = "notificacao.sms", Valor = dto.NotificacaoSMS.ToString(), Tipo = "Boolean", Categoria = "Notificacao", Descricao = "Notificação por SMS" },
                new ConfiguracaoSistema { Chave = "notificacao.email_endereco", Valor = dto.EmailNotificacao, Tipo = "String", Categoria = "Notificacao", Descricao = "Email para notificações" }
            });

            // Configurações de backup
            configuracoes.AddRange(new[]
            {
                new ConfiguracaoSistema { Chave = "backup.automatico", Valor = dto.BackupAutomatico.ToString(), Tipo = "Boolean", Categoria = "Backup", Descricao = "Backup automático" },
                new ConfiguracaoSistema { Chave = "backup.frequencia", Valor = dto.FrequenciaBackup, Tipo = "String", Categoria = "Backup", Descricao = "Frequência do backup" },
                new ConfiguracaoSistema { Chave = "backup.hora", Valor = dto.HoraBackup, Tipo = "String", Categoria = "Backup", Descricao = "Hora do backup" },
                new ConfiguracaoSistema { Chave = "backup.retencao", Valor = dto.RetencaoBackup.ToString(), Tipo = "Int", Categoria = "Backup", Descricao = "Retenção do backup em dias" }
            });

            return configuracoes;
        }

        private IEnumerable<ConfiguracaoSistema> MapearParametrosEmprestimoParaConfiguracoes(ConfiguracaoSistemaRequestDTO dto)
        {
            return MapearDTOParaConfiguracoes(dto).Where(c => c.Categoria == "Emprestimo");
        }

        private IEnumerable<ConfiguracaoSistema> ObterConfiguracoesPadrao()
        {
            var dto = new ConfiguracaoSistemaRequestDTO();
            return MapearDTOParaConfiguracoes(dto);
        }
    }
}
