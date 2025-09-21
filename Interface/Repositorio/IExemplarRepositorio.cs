using Dominio.Entidades;

namespace Interface.Repositorio
{
    public interface IExemplarRepositorio : IBaseRepository<Exemplar>
    {
        Task<IEnumerable<Exemplar>> GetDisponiveisAsync();
        Task<IEnumerable<Exemplar>> GetByLivroAsync(int idLivro);
        Task<IEnumerable<Exemplar>> GetByLocalizacaoAsync(string localizacao);
        Task<IEnumerable<Exemplar>> GetByCondicaoAsync(string condicao);
        Task<Exemplar?> GetByNumeroExemplarAsync(string numeroExemplar);
        Task<IEnumerable<Exemplar>> GetEmprestadosAsync();
        Task<IEnumerable<Exemplar>> GetDisponiveisByLivroAsync(int idLivro);
        Task<bool> VerificarDisponibilidadeAsync(int idExemplar);
    }
}
