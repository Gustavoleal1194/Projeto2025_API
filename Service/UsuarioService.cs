using AutoMapper;
using Dominio.Entidades;
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
            var usuario = await usuarioRepositorio.GetAsync(id);
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
    }
}