using AutoMapper;
using Dominio.Entidades;

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
            var livro = await livroRepositorio.GetAsync(id);
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
    }
}