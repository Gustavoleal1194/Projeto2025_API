using AutoMapper;
using Dominio.Dtos;
using Interface.Repositorio;
using Interface.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service
{
    public class FuncionarioService : IFuncionarioService
    {
        private readonly IFuncionarioRepositorio _funcionarioRepositorio;
        private readonly IMapper _mapper;

        public FuncionarioService(IFuncionarioRepositorio funcionarioRepositorio, IMapper mapper)
        {
            _funcionarioRepositorio = funcionarioRepositorio;
            _mapper = mapper;
        }

        public async Task<FuncionarioDTO> AddAsync(FuncionarioDTO funcionarioDTO)
        {
            // Validar se email já existe
            var funcionarioExistente = await _funcionarioRepositorio.GetByEmailAsync(funcionarioDTO.Email);
            if (funcionarioExistente != null)
            {
                throw new InvalidOperationException("Já existe um funcionário com este email.");
            }

            // Fazer hash da senha antes de salvar
            funcionarioDTO.Senha = PasswordHashService.HashPassword(funcionarioDTO.Senha);

            var funcionario = _mapper.Map<Dominio.Entidades.Funcionario>(funcionarioDTO);
            await _funcionarioRepositorio.AddAsync(funcionario);
            return _mapper.Map<FuncionarioDTO>(funcionario);
        }

        public async Task<IEnumerable<FuncionarioDTO>> GetAllAsync()
        {
            var funcionarios = await _funcionarioRepositorio.GetAllAsync();
            return _mapper.Map<IEnumerable<FuncionarioDTO>>(funcionarios);
        }

        public async Task<FuncionarioDTO?> GetByIdAsync(int id)
        {
            var funcionario = await _funcionarioRepositorio.GetByIdAsync(id);
            return funcionario != null ? _mapper.Map<FuncionarioDTO>(funcionario) : null;
        }

        public async Task RemoveAsync(int id)
        {
            await _funcionarioRepositorio.RemoveAsync(id);
        }

        public async Task UpdateAsync(FuncionarioDTO funcionarioDTO)
        {
            // Fazer hash da senha antes de atualizar (se a senha não estiver vazia)
            if (!string.IsNullOrEmpty(funcionarioDTO.Senha))
            {
                funcionarioDTO.Senha = PasswordHashService.HashPassword(funcionarioDTO.Senha);
            }

            var funcionario = _mapper.Map<Dominio.Entidades.Funcionario>(funcionarioDTO);
            await _funcionarioRepositorio.UpdateAsync(funcionario);
        }

        public async Task<IEnumerable<FuncionarioDTO>> GetByCargoAsync(string cargo)
        {
            var funcionarios = await _funcionarioRepositorio.GetByCargoAsync(cargo);
            return _mapper.Map<IEnumerable<FuncionarioDTO>>(funcionarios);
        }

        public async Task<IEnumerable<FuncionarioDTO>> GetAtivosAsync()
        {
            var funcionarios = await _funcionarioRepositorio.GetAtivosAsync();
            return _mapper.Map<IEnumerable<FuncionarioDTO>>(funcionarios);
        }

        public async Task<IEnumerable<FuncionarioDTO>> GetInativosAsync()
        {
            var funcionarios = await _funcionarioRepositorio.GetInativosAsync();
            return _mapper.Map<IEnumerable<FuncionarioDTO>>(funcionarios);
        }

        public async Task<FuncionarioDTO?> GetByEmailAsync(string email)
        {
            var funcionario = await _funcionarioRepositorio.GetByEmailAsync(email);
            return funcionario != null ? _mapper.Map<FuncionarioDTO>(funcionario) : null;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _funcionarioRepositorio.ExistsAsync(id);
        }

        public async Task<int> CountAsync()
        {
            return await _funcionarioRepositorio.CountAsync();
        }

        public async Task ToggleStatusAsync(int id)
        {
            var funcionario = await _funcionarioRepositorio.GetByIdAsync(id);
            if (funcionario == null)
            {
                throw new InvalidOperationException("Funcionário não encontrado.");
            }

            funcionario.Ativo = !funcionario.Ativo;
            await _funcionarioRepositorio.UpdateAsync(funcionario);
        }
    }
}
