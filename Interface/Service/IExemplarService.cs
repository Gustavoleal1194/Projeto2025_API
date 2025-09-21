using Dominio.Dtos;

namespace Interface.Service
{
    public interface IExemplarService
    {
        Task<ExemplarDTO> AddAsync(ExemplarDTO exemplarDTO);
        Task<IEnumerable<ExemplarDTO>> GetAllAsync();
        Task<ExemplarDTO?> GetAsync(int id);
        Task RemoveAsync(int id);
        Task UpdateAsync(ExemplarDTO exemplarDTO);
        
        // Métodos específicos
        Task<IEnumerable<ExemplarDTO>> GetDisponiveisAsync();
        Task<IEnumerable<ExemplarDTO>> GetByLivroAsync(int idLivro);
        Task<IEnumerable<ExemplarDTO>> GetByLocalizacaoAsync(string localizacao);
        Task<IEnumerable<ExemplarDTO>> GetByCondicaoAsync(string condicao);
        Task<ExemplarDTO?> GetByNumeroExemplarAsync(string numeroExemplar);
        Task<IEnumerable<ExemplarDTO>> GetEmprestadosAsync();
        Task<IEnumerable<ExemplarDTO>> GetDisponiveisByLivroAsync(int idLivro);
        Task<bool> VerificarDisponibilidadeAsync(int idExemplar);
        Task<bool> MarcarComoIndisponivelAsync(int idExemplar);
        Task<bool> MarcarComoDisponivelAsync(int idExemplar);
    }
}
