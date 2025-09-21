using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service
{
    public class AutorService : IAutorService
    {
        private readonly IAutorRepositorio autorRepositorio;
        private readonly IMapper mapper;

        public AutorService(IAutorRepositorio autorRepositorio, IMapper mapper)
        {
            this.autorRepositorio = autorRepositorio;
            this.mapper = mapper;
        }

        public async Task<AutorDTO> AddAsync(AutorDTO autorDTO)
        {
            // Validar se email já existe
            if (!string.IsNullOrEmpty(autorDTO.Email))
            {
                var autorExistente = await autorRepositorio.GetByEmailAsync(autorDTO.Email);
                if (autorExistente != null)
                {
                    throw new InvalidOperationException("Já existe um autor com este email.");
                }
            }

            var autor = mapper.Map<Autor>(autorDTO);
            await autorRepositorio.AddAsync(autor);
            return mapper.Map<AutorDTO>(autor);
        }

        public async Task<IEnumerable<AutorDTO>> GetAllAsync()
        {
            var autores = await autorRepositorio.GetAllAsync();
            return mapper.Map<IEnumerable<AutorDTO>>(autores);
        }

        public async Task<AutorDTO?> GetAsync(int id)
        {
            var autor = await autorRepositorio.GetByIdAsync(id);
            return autor != null ? mapper.Map<AutorDTO>(autor) : null;
        }

        public async Task RemoveAsync(int id)
        {
            await autorRepositorio.RemoveAsync(id);
        }

        public async Task UpdateAsync(AutorDTO autorDTO)
        {
            var autor = mapper.Map<Autor>(autorDTO);
            await autorRepositorio.UpdateAsync(autor);
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<AutorDTO>> GetByNacionalidadeAsync(string nacionalidade)
        {
            var autores = await autorRepositorio.GetByNacionalidadeAsync(nacionalidade);
            return mapper.Map<IEnumerable<AutorDTO>>(autores);
        }

        public async Task<IEnumerable<AutorDTO>> BuscarAsync(string termo)
        {
            var autores = await autorRepositorio.BuscarAsync(termo);
            return mapper.Map<IEnumerable<AutorDTO>>(autores);
        }

        public async Task<IEnumerable<AutorDTO>> GetComLivrosAsync()
        {
            var autores = await autorRepositorio.GetComLivrosAsync();
            return mapper.Map<IEnumerable<AutorDTO>>(autores);
        }
    }
}