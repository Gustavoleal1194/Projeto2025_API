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
            var usuario = mapper.Map<Usuario>(usuarioDTO);
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
    }
}