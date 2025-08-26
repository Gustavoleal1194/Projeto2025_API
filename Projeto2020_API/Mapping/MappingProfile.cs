using AutoMapper;
using Dominio.Dtos;
using Dominio.Entidades;
namespace Projeto2025_API.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Categoria, CategoriaDTO>().ReverseMap();
            CreateMap<Produto, ProdutoDTO>().ReverseMap();

        }
    }
}
