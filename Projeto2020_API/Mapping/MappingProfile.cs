using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
namespace Projeto2025_API.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Livro, LivroDTO>()
                .ForMember(dest => dest.TotalExemplares, opt => opt.MapFrom(src => src.TotalExemplares))
                .ForMember(dest => dest.ExemplaresDisponiveis, opt => opt.MapFrom(src => src.ExemplaresDisponiveis))
                .ForMember(dest => dest.TemExemplaresDisponiveis, opt => opt.MapFrom(src => src.TemExemplaresDisponiveis))
                .ForMember(dest => dest.Ativo, opt => opt.MapFrom(src => src.AtivoCalculado))
                .ForMember(dest => dest.NomeAutor, opt => opt.MapFrom(src => src.Autor != null ? src.Autor.Nome : null))
                .ForMember(dest => dest.NomeEditora, opt => opt.MapFrom(src => src.Editora != null ? src.Editora.Nome : null));
                
            CreateMap<LivroDTO, Livro>()
                .ForMember(dest => dest.Exemplares, opt => opt.Ignore())
                .ForMember(dest => dest.Autor, opt => opt.Ignore())
                .ForMember(dest => dest.Editora, opt => opt.Ignore());
                
            CreateMap<Exemplar, ExemplarDTO>()
                .ForMember(dest => dest.TituloLivro, opt => opt.MapFrom(src => src.Livro != null ? src.Livro.Titulo : null))
                .ForMember(dest => dest.ISBN, opt => opt.MapFrom(src => src.Livro != null ? src.Livro.ISBN : null))
                .ForMember(dest => dest.NomeAutor, opt => opt.MapFrom(src => src.Livro != null && src.Livro.Autor != null ? src.Livro.Autor.Nome : null))
                .ForMember(dest => dest.NomeEditora, opt => opt.MapFrom(src => src.Livro != null && src.Livro.Editora != null ? src.Livro.Editora.Nome : null));
                
            CreateMap<ExemplarDTO, Exemplar>()
                .ForMember(dest => dest.Livro, opt => opt.Ignore());
                
            CreateMap<Editora, EditoraDTO>().ReverseMap();
            CreateMap<Usuario, UsuarioDTO>().ReverseMap();
            CreateMap<Emprestimo, EmprestimoDTO>()
                .ForMember(dest => dest.TituloLivro, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null ? src.Exemplar.Livro.Titulo : null))
                .ForMember(dest => dest.NumeroExemplar, opt => opt.MapFrom(src => src.Exemplar != null ? src.Exemplar.NumeroExemplar : null))
                .ForMember(dest => dest.NomeUsuario, opt => opt.MapFrom(src => src.Usuario != null ? src.Usuario.Nome : null))
                .ForMember(dest => dest.EmailUsuario, opt => opt.MapFrom(src => src.Usuario != null ? src.Usuario.Email : null))
                .ForMember(dest => dest.NomeAutor, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null && src.Exemplar.Livro.Autor != null ? src.Exemplar.Livro.Autor.Nome : null))
                .ForMember(dest => dest.NomeEditora, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null && src.Exemplar.Livro.Editora != null ? src.Exemplar.Livro.Editora.Nome : null))
                .ForMember(dest => dest.Genero, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null ? src.Exemplar.Livro.Genero : null))
                .ForMember(dest => dest.Ano, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null ? src.Exemplar.Livro.Ano : (int?)null))
                .ForMember(dest => dest.Sinopse, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null ? src.Exemplar.Livro.Sinopse : null))
                .ForMember(dest => dest.CapaUrl, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null ? src.Exemplar.Livro.CapaUrl : null))
                .ForMember(dest => dest.NumeroPaginas, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null ? src.Exemplar.Livro.NumeroPaginas : (int?)null))
                .ForMember(dest => dest.Idioma, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null ? src.Exemplar.Livro.Idioma : null));
                
            CreateMap<EmprestimoDTO, Emprestimo>()
                .ForMember(dest => dest.Exemplar, opt => opt.Ignore())
                .ForMember(dest => dest.Usuario, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.Status) ? "Emprestado" : src.Status))
                .ForMember(dest => dest.DataEmprestimo, opt => opt.MapFrom(src => src.DataEmprestimo == DateTime.MinValue ? DateTime.Now : src.DataEmprestimo))
                .ForMember(dest => dest.DataPrevistaDevolucao, opt => opt.MapFrom(src => src.DataPrevistaDevolucao == DateTime.MinValue ? DateTime.Now.AddDays(14) : src.DataPrevistaDevolucao));
            CreateMap<Autor, AutorDTO>().ReverseMap();
            CreateMap<Funcionario, FuncionarioDTO>().ReverseMap();
        }
    }
}
