using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service
{
    public class EditoraService : IEditoraService
    {
        private readonly IEditoraRepositorio editoraRepositorio;
        private readonly IMapper mapper;

        public EditoraService(IEditoraRepositorio editoraRepositorio, IMapper mapper)
        {
            this.editoraRepositorio = editoraRepositorio;
            this.mapper = mapper;
        }

        public async Task<EditoraDTO> AddAsync(EditoraDTO editoraDTO)
        {
            var editora = mapper.Map<Editora>(editoraDTO);
            await editoraRepositorio.AddAsync(editora);
            return mapper.Map<EditoraDTO>(editora);
        }

        public async Task<IEnumerable<EditoraDTO>> GetAllAsync()
        {
            var editoras = await editoraRepositorio.GetAllAsync();
            return mapper.Map<IEnumerable<EditoraDTO>>(editoras);
        }

        public async Task<EditoraDTO?> GetAsync(int id)
        {
            var editora = await editoraRepositorio.GetByIdAsync(id);
            return editora != null ? mapper.Map<EditoraDTO>(editora) : null;
        }

        public async Task RemoveAsync(int id)
        {
            await editoraRepositorio.RemoveAsync(id);
        }

        public async Task UpdateAsync(EditoraDTO editoraDTO)
        {
            var editora = mapper.Map<Editora>(editoraDTO);
            await editoraRepositorio.UpdateAsync(editora);
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<EditoraDTO>> GetAtivasAsync()
        {
            var editoras = await editoraRepositorio.GetAtivasAsync();
            return mapper.Map<IEnumerable<EditoraDTO>>(editoras);
        }

        public async Task<IEnumerable<EditoraDTO>> GetByCidadeAsync(string cidade)
        {
            var editoras = await editoraRepositorio.GetByCidadeAsync(cidade);
            return mapper.Map<IEnumerable<EditoraDTO>>(editoras);
        }

        public async Task<IEnumerable<EditoraDTO>> GetByEstadoAsync(string estado)
        {
            var editoras = await editoraRepositorio.GetByEstadoAsync(estado);
            return mapper.Map<IEnumerable<EditoraDTO>>(editoras);
        }

        public async Task<IEnumerable<EditoraDTO>> BuscarAsync(string termo)
        {
            var editoras = await editoraRepositorio.BuscarAsync(termo);
            return mapper.Map<IEnumerable<EditoraDTO>>(editoras);
        }
    }
}