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
        private readonly IMapper _mapper;

        public EmprestimoService(IEmprestimoRepositorio emprestimoRepositorio, IExemplarService exemplarService, IMapper mapper)
        {
            _emprestimoRepositorio = emprestimoRepositorio;
            _exemplarService = exemplarService;
            _mapper = mapper;
        }

        public async Task<EmprestimoDTO> AddAsync(EmprestimoDTO emprestimoDTO)
        {
            // Verificar se o exemplar está disponível
            var disponivel = await _exemplarService.VerificarDisponibilidadeAsync(emprestimoDTO.IdExemplar);
            if (!disponivel)
                throw new InvalidOperationException("Exemplar não está disponível para empréstimo");

            // Marcar exemplar como indisponível
            await _exemplarService.MarcarComoIndisponivelAsync(emprestimoDTO.IdExemplar);

            var emprestimo = _mapper.Map<Emprestimo>(emprestimoDTO);
            await _emprestimoRepositorio.AddAsync(emprestimo);
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