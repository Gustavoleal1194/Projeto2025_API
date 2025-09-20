using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service
{
    public class EmprestimoService : IEmprestimoService
    {
        private readonly IEmprestimoRepositorio emprestimoRepositorio;
        private readonly IMapper mapper;

        public EmprestimoService(IEmprestimoRepositorio emprestimoRepositorio, IMapper mapper)
        {
            this.emprestimoRepositorio = emprestimoRepositorio;
            this.mapper = mapper;
        }

        public async Task<EmprestimoDTO> AddAsync(EmprestimoDTO emprestimoDTO)
        {
            var emprestimo = mapper.Map<Emprestimo>(emprestimoDTO);
            await emprestimoRepositorio.AddAsync(emprestimo);
            return mapper.Map<EmprestimoDTO>(emprestimo);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetAllAsync()
        {
            var emprestimos = await emprestimoRepositorio.GetAllAsync();
            return mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<EmprestimoDTO?> GetAsync(int id)
        {
            var emprestimo = await emprestimoRepositorio.GetByIdAsync(id);
            return emprestimo != null ? mapper.Map<EmprestimoDTO>(emprestimo) : null;
        }

        public async Task RemoveAsync(int id)
        {
            await emprestimoRepositorio.RemoveAsync(id);
        }

        public async Task UpdateAsync(EmprestimoDTO emprestimoDTO)
        {
            var emprestimo = mapper.Map<Emprestimo>(emprestimoDTO);
            await emprestimoRepositorio.UpdateAsync(emprestimo);
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<EmprestimoDTO>> GetByUsuarioAsync(int idUsuario)
        {
            var emprestimos = await emprestimoRepositorio.GetByUsuarioAsync(idUsuario);
            return mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetByLivroAsync(int idLivro)
        {
            var emprestimos = await emprestimoRepositorio.GetByLivroAsync(idLivro);
            return mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetAtivosAsync()
        {
            var emprestimos = await emprestimoRepositorio.GetAtivosAsync();
            return mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetVencidosAsync()
        {
            var emprestimos = await emprestimoRepositorio.GetVencidosAsync();
            return mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }

        public async Task<IEnumerable<EmprestimoDTO>> GetByStatusAsync(string status)
        {
            var emprestimos = await emprestimoRepositorio.GetByStatusAsync(status);
            return mapper.Map<IEnumerable<EmprestimoDTO>>(emprestimos);
        }
    }
}