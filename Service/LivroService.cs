using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;

namespace Service
{
    public class LivroService : ILivroService
    {
        private readonly ILivroRepositorio livroRepositorio;
        private readonly IMapper mapper;

        public LivroService(ILivroRepositorio livroRepositorio, IMapper mapper)
        {
            this.livroRepositorio = livroRepositorio;
            this.mapper = mapper;
        }

        public async Task<LivroDTO> AddAsync(LivroDTO livroDTO)
        {
            var livro = mapper.Map<Livro>(livroDTO);
            await livroRepositorio.AddAsync(livro);
            // Após salvar, o livro pode ter o Id gerado pelo banco
            return mapper.Map<LivroDTO>(livro);
        }

        public async Task<IEnumerable<LivroDTO>> GetAllAsync()
        {
            var livros = await livroRepositorio.GetAllAsync();
            return mapper.Map<IEnumerable<LivroDTO>>(livros);
        }

        public async Task<LivroDTO?> GetAsync(int id)
        {
            var livro = await livroRepositorio.GetByIdAsync(id);
            return livro != null ? mapper.Map<LivroDTO>(livro) : null;
        }

        public async Task RemoveAsync(int id)
        {
            await livroRepositorio.RemoveAsync(id);
        }

        public async Task UpdateAsync(LivroDTO livroDTO)
        {
            var livro = mapper.Map<Livro>(livroDTO);
            await livroRepositorio.UpdateAsync(livro);
        }

        // Métodos específicos para consultas
        public async Task<IEnumerable<LivroDTO>> GetDisponiveisAsync()
        {
            var livros = await livroRepositorio.GetDisponiveisAsync();
            return mapper.Map<IEnumerable<LivroDTO>>(livros);
        }

        public async Task<IEnumerable<LivroDTO>> GetByGeneroAsync(string genero)
        {
            var livros = await livroRepositorio.GetByGeneroAsync(genero);
            return mapper.Map<IEnumerable<LivroDTO>>(livros);
        }

        public async Task<IEnumerable<LivroDTO>> GetByAutorAsync(int idAutor)
        {
            var livros = await livroRepositorio.GetByAutorAsync(idAutor);
            return mapper.Map<IEnumerable<LivroDTO>>(livros);
        }

        public async Task<IEnumerable<LivroDTO>> GetByEditoraAsync(int idEditora)
        {
            var livros = await livroRepositorio.GetByEditoraAsync(idEditora);
            return mapper.Map<IEnumerable<LivroDTO>>(livros);
        }

        public async Task<IEnumerable<LivroDTO>> BuscarAsync(string termo)
        {
            var livros = await livroRepositorio.BuscarAsync(termo);
            return mapper.Map<IEnumerable<LivroDTO>>(livros);
        }

        public async Task<IEnumerable<LivroDTO>> GetEmEstoqueAsync()
        {
            var livros = await livroRepositorio.GetEmEstoqueAsync();
            return mapper.Map<IEnumerable<LivroDTO>>(livros);
        }
    }
}