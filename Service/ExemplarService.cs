using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
using Interface.Repositorio;
using Interface.Service;

namespace Service
{
    public class ExemplarService : IExemplarService
    {
        private readonly IExemplarRepositorio _exemplarRepositorio;
        private readonly IMapper _mapper;

        public ExemplarService(IExemplarRepositorio exemplarRepositorio, IMapper mapper)
        {
            _exemplarRepositorio = exemplarRepositorio;
            _mapper = mapper;
        }

        public async Task<ExemplarDTO> AddAsync(ExemplarDTO exemplarDTO)
        {
            var exemplar = _mapper.Map<Exemplar>(exemplarDTO);
            await _exemplarRepositorio.AddAsync(exemplar);
            return _mapper.Map<ExemplarDTO>(exemplar);
        }

        public async Task<IEnumerable<ExemplarDTO>> GetAllAsync()
        {
            var exemplares = await _exemplarRepositorio.GetAllAsync();
            return _mapper.Map<IEnumerable<ExemplarDTO>>(exemplares);
        }

        public async Task<ExemplarDTO?> GetAsync(int id)
        {
            var exemplar = await _exemplarRepositorio.GetByIdAsync(id);
            return exemplar != null ? _mapper.Map<ExemplarDTO>(exemplar) : null;
        }

        public async Task RemoveAsync(int id)
        {
            await _exemplarRepositorio.RemoveAsync(id);
        }

        public async Task UpdateAsync(ExemplarDTO exemplarDTO)
        {
            var exemplar = _mapper.Map<Exemplar>(exemplarDTO);
            await _exemplarRepositorio.UpdateAsync(exemplar);
        }

        public async Task<IEnumerable<ExemplarDTO>> GetDisponiveisAsync()
        {
            var exemplares = await _exemplarRepositorio.GetDisponiveisAsync();
            return _mapper.Map<IEnumerable<ExemplarDTO>>(exemplares);
        }

        public async Task<IEnumerable<ExemplarDTO>> GetByLivroAsync(int idLivro)
        {
            var exemplares = await _exemplarRepositorio.GetByLivroAsync(idLivro);
            return _mapper.Map<IEnumerable<ExemplarDTO>>(exemplares);
        }

        public async Task<IEnumerable<ExemplarDTO>> GetByLocalizacaoAsync(string localizacao)
        {
            var exemplares = await _exemplarRepositorio.GetByLocalizacaoAsync(localizacao);
            return _mapper.Map<IEnumerable<ExemplarDTO>>(exemplares);
        }

        public async Task<IEnumerable<ExemplarDTO>> GetByCondicaoAsync(string condicao)
        {
            var exemplares = await _exemplarRepositorio.GetByCondicaoAsync(condicao);
            return _mapper.Map<IEnumerable<ExemplarDTO>>(exemplares);
        }

        public async Task<ExemplarDTO?> GetByNumeroExemplarAsync(string numeroExemplar)
        {
            var exemplar = await _exemplarRepositorio.GetByNumeroExemplarAsync(numeroExemplar);
            return exemplar != null ? _mapper.Map<ExemplarDTO>(exemplar) : null;
        }

        public async Task<IEnumerable<ExemplarDTO>> GetEmprestadosAsync()
        {
            var exemplares = await _exemplarRepositorio.GetEmprestadosAsync();
            return _mapper.Map<IEnumerable<ExemplarDTO>>(exemplares);
        }

        public async Task<IEnumerable<ExemplarDTO>> GetDisponiveisByLivroAsync(int idLivro)
        {
            var exemplares = await _exemplarRepositorio.GetDisponiveisByLivroAsync(idLivro);
            return _mapper.Map<IEnumerable<ExemplarDTO>>(exemplares);
        }

        public async Task<bool> VerificarDisponibilidadeAsync(int idExemplar)
        {
            return await _exemplarRepositorio.VerificarDisponibilidadeAsync(idExemplar);
        }

        public async Task<bool> MarcarComoIndisponivelAsync(int idExemplar)
        {
            var exemplar = await _exemplarRepositorio.GetByIdAsync(idExemplar);
            if (exemplar == null) return false;

            exemplar.Disponivel = false;
            await _exemplarRepositorio.UpdateAsync(exemplar);
            return true;
        }

        public async Task<bool> MarcarComoDisponivelAsync(int idExemplar)
        {
            var exemplar = await _exemplarRepositorio.GetByIdAsync(idExemplar);
            if (exemplar == null) return false;

            exemplar.Disponivel = true;
            await _exemplarRepositorio.UpdateAsync(exemplar);
            return true;
        }
    }
}
