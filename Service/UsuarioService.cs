using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepositorio usuarioRepositorio;
        private readonly IMapper mapper;

        public UsuarioService(IUsuarioRepositorio usuarioRepositorio, IMapper mapper)
        {
            this.usuarioRepositorio = usuarioRepositorio;
            this.mapper = mapper;
        }

        public async Task<UsuarioDTO> AddAsync(UsuarioDTO usuarioDTO)
        {
            // Validar se email já existe
            var usuarioExistente = await usuarioRepositorio.GetByEmailAsync(usuarioDTO.Email);
            if (usuarioExistente != null)
            {
                throw new InvalidOperationException("Já existe um usuário com este email.");
            }

            // Validar se CPF já existe
            if (!string.IsNullOrEmpty(usuarioDTO.CPF))
            {
                var usuarioComCpf = await usuarioRepositorio.GetByCpfAsync(usuarioDTO.CPF);
                if (usuarioComCpf != null)
                {
                    throw new InvalidOperationException("Já existe um usuário com este CPF.");
                }
            }

            var usuario = mapper.Map<Usuario>(usuarioDTO);
            
            // Fazer hash da senha se fornecida
            if (!string.IsNullOrEmpty(usuarioDTO.Senha))
            {
                usuario.Senha = PasswordHashService.HashPassword(usuarioDTO.Senha);
            }
            
            await usuarioRepositorio.AddAsync(usuario);
            return mapper.Map<UsuarioDTO>(usuario);
        }

        public async Task<IEnumerable<UsuarioDTO>> GetAllAsync()
        {
            var usuarios = await usuarioRepositorio.GetAllAsync();
            return mapper.Map<IEnumerable<UsuarioDTO>>(usuarios);
        }

        public async Task<UsuarioDTO?> GetAsync(int id)
        {
            var usuario = await usuarioRepositorio.GetByIdAsync(id);
            return usuario != null ? mapper.Map<UsuarioDTO>(usuario) : null;
        }

        public async Task RemoveAsync(int id)
        {
            await usuarioRepositorio.RemoveAsync(id);
        }

        public async Task UpdateAsync(UsuarioDTO usuarioDTO)
        {
            // Fazer hash da senha antes de atualizar (se a senha não estiver vazia)
            if (!string.IsNullOrEmpty(usuarioDTO.Senha))
            {
                usuarioDTO.Senha = PasswordHashService.HashPassword(usuarioDTO.Senha);
            }

            var usuario = mapper.Map<Usuario>(usuarioDTO);
            await usuarioRepositorio.UpdateAsync(usuario);
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<UsuarioDTO>> GetByNomeAsync(string nome)
        {
            var usuarios = await usuarioRepositorio.GetByNomeAsync(nome);
            return mapper.Map<IEnumerable<UsuarioDTO>>(usuarios);
        }

        public async Task<UsuarioDTO?> GetByCpfAsync(string cpf)
        {
            var usuario = await usuarioRepositorio.GetByCpfAsync(cpf);
            return usuario != null ? mapper.Map<UsuarioDTO>(usuario) : null;
        }

        public async Task ToggleStatusAsync(int id)
        {
            var usuario = await usuarioRepositorio.GetByIdAsync(id);
            if (usuario == null)
            {
                throw new InvalidOperationException("Usuário não encontrado.");
            }

            usuario.Ativo = !usuario.Ativo;
            await usuarioRepositorio.UpdateAsync(usuario);
        }

        public async Task<UsuarioDTO?> GetByEmailAsync(string email)
        {
            var usuario = await usuarioRepositorio.GetByEmailAsync(email);
            if (usuario == null)
                return null;

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                CPF = usuario.CPF,
                Telefone = usuario.Telefone,
                DataNascimento = usuario.DataNascimento,
                Ativo = usuario.Ativo
            };
        }
    }
}