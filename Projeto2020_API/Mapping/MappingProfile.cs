using AutoMapper;
using Dominio.Entidades;
namespace Projeto2025_API.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Livro, LivroDTO>().ReverseMap();
            CreateMap<Editora, EditoraDTO>().ReverseMap();
            CreateMap<Usuario, UsuarioDTO>().ReverseMap();
            CreateMap<Emprestimo, EmprestimoDTO>().ReverseMap();
            CreateMap<Autor, AutorDTO>().ReverseMap();

        }
    }
}
