using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;

namespace Service
{
    public class EmprestimoService : IEmprestimoService
    {
        private readonly IEmprestimoRepositorio _emprestimoRepositorio;
        private readonly IExemplarService _exemplarService;
        private readonly IUsuarioService _usuarioService;
        private readonly IMapper _mapper;

        public EmprestimoService(IEmprestimoRepositorio emprestimoRepositorio, IExemplarService exemplarService, IUsuarioService usuarioService, IMapper mapper)
        {
            _emprestimoRepositorio = emprestimoRepositorio;
            _exemplarService = exemplarService;
            _usuarioService = usuarioService;
            _mapper = mapper;
        }

        public async Task<EmprestimoDTO> AddAsync(EmprestimoDTO emprestimoDTO)
        {
            // Log para debug
            Console.WriteLine($"Tentando criar empréstimo para exemplar ID: {emprestimoDTO.IdExemplar}, usuário ID: {emprestimoDTO.IdUsuario}");
            
            // Verificar se o exemplar existe
            var exemplar = await _exemplarService.GetAsync(emprestimoDTO.IdExemplar);
            if (exemplar == null)
            {
                Console.WriteLine($"Exemplar com ID {emprestimoDTO.IdExemplar} não encontrado");
                throw new InvalidOperationException($"Exemplar com ID {emprestimoDTO.IdExemplar} não encontrado");
            }

            Console.WriteLine($"Exemplar encontrado: ID={exemplar.Id}, Ativo={exemplar.Ativo}, Disponivel={exemplar.Disponivel}");

            // Verificar se o exemplar está ativo
            if (!exemplar.Ativo)
            {
                Console.WriteLine($"Exemplar {emprestimoDTO.IdExemplar} não está ativo");
                throw new InvalidOperationException("Exemplar não está ativo");
            }

            // Verificar se o exemplar está disponível
            if (!exemplar.Disponivel)
            {
                Console.WriteLine($"Exemplar {emprestimoDTO.IdExemplar} não está disponível");
                throw new InvalidOperationException("Exemplar não está disponível para empréstimo");
            }

            // Verificar se não há empréstimos ativos para este exemplar
            var emprestimosAtivos = await _emprestimoRepositorio.GetAtivosAsync();
            var exemplarEmprestado = emprestimosAtivos.Any(e => e.IdExemplar == emprestimoDTO.IdExemplar);
            
            Console.WriteLine($"Empréstimos ativos encontrados: {emprestimosAtivos.Count()}");
            Console.WriteLine($"Exemplar emprestado: {exemplarEmprestado}");
            
            // Verificar também por status "Emprestado"
            var emprestimosComStatus = await _emprestimoRepositorio.GetAllAsync();
            var exemplarEmprestadoPorStatus = emprestimosComStatus.Any(e => e.IdExemplar == emprestimoDTO.IdExemplar && e.Status == "Emprestado");
            
            Console.WriteLine($"Empréstimos com status 'Emprestado' para exemplar {emprestimoDTO.IdExemplar}: {exemplarEmprestadoPorStatus}");
            
            if (exemplarEmprestado || exemplarEmprestadoPorStatus)
            {
                Console.WriteLine($"Exemplar {emprestimoDTO.IdExemplar} já está emprestado");
                throw new InvalidOperationException("Exemplar já está emprestado");
            }

            Console.WriteLine($"Exemplar {emprestimoDTO.IdExemplar} validado com sucesso");

            // Verificar se o usuário existe
            var usuario = await _usuarioService.GetAsync(emprestimoDTO.IdUsuario);
            if (usuario == null)
            {
                Console.WriteLine($"Usuário com ID {emprestimoDTO.IdUsuario} não encontrado");
                throw new InvalidOperationException($"Usuário com ID {emprestimoDTO.IdUsuario} não encontrado");
            }
            Console.WriteLine($"Usuário {emprestimoDTO.IdUsuario} validado com sucesso");

            // Criar o empréstimo primeiro
            var emprestimo = _mapper.Map<Emprestimo>(emprestimoDTO);
            await _emprestimoRepositorio.AddAsync(emprestimo);
            Console.WriteLine($"Empréstimo criado com sucesso para exemplar {emprestimoDTO.IdExemplar}");

            // Só depois marcar exemplar como indisponível
            await _exemplarService.MarcarComoIndisponivelAsync(emprestimoDTO.IdExemplar);
            Console.WriteLine($"Exemplar {emprestimoDTO.IdExemplar} marcado como indisponível");
            
            return _mapper.Map<EmprestimoDTO>(emprestimo);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetAllAsync()
        {
            var emprestimos = await _emprestimoRepositorio.GetAllAsync();
            return _mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<EmprestimoDTO?> GetAsync(int id)
        {
            var emprestimo = await _emprestimoRepositorio.GetByIdAsync(id);
            return emprestimo != null ? _mapper.Map<EmprestimoDTO>(emprestimo) : null;
        }

        public async Task RemoveAsync(int id)
        {
            await _emprestimoRepositorio.RemoveAsync(id);
        }

        public async Task UpdateAsync(EmprestimoDTO emprestimoDTO)
        {
            var emprestimo = _mapper.Map<Emprestimo>(emprestimoDTO);
            await _emprestimoRepositorio.UpdateAsync(emprestimo);
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<EmprestimoDTO>> GetByUsuarioAsync(int idUsuario)
        {
            var emprestimos = await _emprestimoRepositorio.GetByUsuarioAsync(idUsuario);
            return _mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetByExemplarAsync(int idExemplar)
        {
            var emprestimos = await _emprestimoRepositorio.GetByExemplarAsync(idExemplar);
            return _mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetAtivosAsync()
        {
            var emprestimos = await _emprestimoRepositorio.GetAtivosAsync();
            return _mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetVencidosAsync()
        {
            var emprestimos = await _emprestimoRepositorio.GetVencidosAsync();
            return _mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetByStatusAsync(string status)
        {
            var emprestimos = await _emprestimoRepositorio.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetDevolvidosAsync()
        {
            var emprestimos = await _emprestimoRepositorio.GetDevolvidosAsync();
            return _mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        // Métodos específicos para empréstimos
        public async Task<bool> DevolverAsync(int idEmprestimo)
        {
            var emprestimo = await _emprestimoRepositorio.GetByIdAsync(idEmprestimo);
            if (emprestimo == null) return false;

            // Marcar como devolvido
            emprestimo.Status = "Devolvido";
            emprestimo.DataDevolucao = DateTime.Now;
            await _emprestimoRepositorio.UpdateAsync(emprestimo);

            // Marcar exemplar como disponível
            await _exemplarService.MarcarComoDisponivelAsync(emprestimo.IdExemplar);

            return true;
        }

        public async Task<bool> RenovarAsync(int idEmprestimo)
        {
            var emprestimo = await _emprestimoRepositorio.GetByIdAsync(idEmprestimo);
            if (emprestimo == null || !emprestimo.PodeRenovar) return false;

            // Renovar empréstimo
            emprestimo.QuantidadeRenovacoes++;
            emprestimo.DataRenovacao = DateTime.Now;
            emprestimo.DataPrevistaDevolucao = DateTime.Now.AddDays(14); // 14 dias adicionais
            await _emprestimoRepositorio.UpdateAsync(emprestimo);

            return true;
        }

    }
}