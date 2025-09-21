# 📋 Documentação Técnica - Sistema de Biblioteca

## 🚀 Tecnologias Utilizadas

### Framework e Runtime
- **.NET 8.0** - Framework principal
- **ASP.NET Core Web API** - API REST
- **C# 12** - Linguagem de programação

### Banco de Dados e ORM
- **Entity Framework Core 9.0.8** - ORM
- **SQL Server** - Banco de dados relacional
- **Microsoft.EntityFrameworkCore.SqlServer** - Provider SQL Server

### Autenticação e Segurança
- **JWT Bearer 8.0.1** - Autenticação baseada em tokens
- **Microsoft.IdentityModel.Tokens** - Manipulação de tokens JWT
- **System.IdentityModel.Tokens.Jwt** - Geração de tokens JWT
- **PasswordHashService** - Hash de senhas com SHA256

### Mapeamento e Validação
- **AutoMapper 15.0.1** - Mapeamento de objetos
- **FluentValidation 11.3.1** - Validação de dados

### Documentação e Logging
- **Swagger/OpenAPI 6.4.0** - Documentação da API
- **Serilog 9.0.0** - Sistema de logging estruturado

### Infraestrutura
- **CORS 2.3.0** - Cross-Origin Resource Sharing
- **Health Checks 2.2.0** - Monitoramento de saúde da API

## 🏗️ Arquitetura do Sistema

### Padrão DDD (Domain-Driven Design)

O sistema foi desenvolvido seguindo os princípios do Domain-Driven Design, organizando o código em camadas bem definidas:

```
┌─────────────────────────────────────────┐
│           Camada de Apresentação        │
│         (Controllers, Mapping)          │
├─────────────────────────────────────────┤
│           Camada de Aplicação           │
│            (Services)                   │
├─────────────────────────────────────────┤
│            Camada de Domínio            │
│        (Entidades, DTOs)                │
├─────────────────────────────────────────┤
│            Camada de Interface          │
│      (Interfaces de Repos e Services)   │
├─────────────────────────────────────────┤
│         Camada de Infraestrutura        │
│    (Repositórios, Context, Migrations)  │
└─────────────────────────────────────────┘
```

### Entidades do Domínio

#### 📚 Livro
```csharp
public class Livro
{
    public int Id { get; set; }
    public string Titulo { get; set; }
    public string Subtitulo { get; set; }
    public string ISBN { get; set; }
    public int Ano { get; set; }
    public int Edicao { get; set; }
    public int NumeroPaginas { get; set; }
    public string Idioma { get; set; }
    public string Genero { get; set; }
    public string Sinopse { get; set; }
    public decimal Preco { get; set; }
    public string CapaUrl { get; set; }
    public string CodigoBarras { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    
    // Relacionamentos
    public int IdAutor { get; set; }
    public int IdEditora { get; set; }
    public virtual Autor? Autor { get; set; }
    public virtual Editora? Editora { get; set; }
    public virtual List<Exemplar> Exemplares { get; set; }
    
    // Propriedades calculadas
    public int TotalExemplares => Exemplares?.Count(e => e.Ativo) ?? 0;
    public int ExemplaresDisponiveis => Exemplares?.Count(e => e.Ativo && e.Disponivel) ?? 0;
    public bool TemExemplaresDisponiveis => ExemplaresDisponiveis > 0;
}
```

#### 📖 Exemplar
```csharp
public class Exemplar
{
    public int Id { get; set; }
    public int IdLivro { get; set; }
    public string NumeroExemplar { get; set; }
    public string Localizacao { get; set; }
    public string Condicao { get; set; }
    public bool Disponivel { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataAquisicao { get; set; }
    public decimal ValorAquisicao { get; set; }
    public string Fornecedor { get; set; }
    public string Observacoes { get; set; }
    public DateTime DataCriacao { get; set; }
    
    // Relacionamentos
    public virtual Livro? Livro { get; set; }
    public virtual List<Emprestimo> Emprestimos { get; set; }
}
```

#### 📋 Empréstimo
```csharp
public class Emprestimo
{
    public int Id { get; set; }
    public int IdExemplar { get; set; }
    public int IdUsuario { get; set; }
    public DateTime DataEmprestimo { get; set; }
    public DateTime DataPrevistaDevolucao { get; set; }
    public DateTime? DataDevolucao { get; set; }
    public DateTime? DataRenovacao { get; set; }
    public int QuantidadeRenovacoes { get; set; }
    public int MaxRenovacoes { get; set; }
    public decimal Multa { get; set; }
    public string Status { get; set; }
    public string Observacoes { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    
    // Relacionamentos
    public virtual Exemplar? Exemplar { get; set; }
    public virtual Usuario? Usuario { get; set; }
    
    // Propriedades calculadas
    public bool EstaAtrasado => Status == "Emprestado" && DataPrevistaDevolucao < DateTime.Now;
    public int DiasAtraso => EstaAtrasado ? (DateTime.Now - DataPrevistaDevolucao).Days : 0;
    public bool PodeRenovar => Status == "Emprestado" && QuantidadeRenovacoes < MaxRenovacoes;
}
```

#### 👤 Usuário
```csharp
public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public string Telefone { get; set; }
    public string CPF { get; set; }
    public DateTime DataNascimento { get; set; }
    public string Senha { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    
    // Relacionamentos
    public virtual List<Emprestimo> Emprestimos { get; set; }
}
```

#### 👨‍💼 Funcionário
```csharp
public class Funcionario
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public string Telefone { get; set; }
    public string Cargo { get; set; }
    public decimal Salario { get; set; }
    public DateTime DataAdmissao { get; set; }
    public DateTime? DataDemissao { get; set; }
    public string Senha { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
}
```

#### ✍️ Autor
```csharp
public class Autor
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string NomeCompleto { get; set; }
    public string NomeArtistico { get; set; }
    public DateTime DataNascimento { get; set; }
    public string Nacionalidade { get; set; }
    public string Pais { get; set; }
    public string PaisOrigem { get; set; }
    public string Email { get; set; }
    public string Telefone { get; set; }
    public string Website { get; set; }
    public string Endereco { get; set; }
    public string Cidade { get; set; }
    public string Estado { get; set; }
    public string CEP { get; set; }
    public string Pais { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    
    // Relacionamentos
    public virtual List<Livro> Livros { get; set; }
}
```

#### 🏢 Editora
```csharp
public class Editora
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string CNPJ { get; set; }
    public string Email { get; set; }
    public string Telefone { get; set; }
    public string Endereco { get; set; }
    public string Cidade { get; set; }
    public string Estado { get; set; }
    public string CEP { get; set; }
    public string Pais { get; set; }
    public string Site { get; set; }
    public DateTime DataFundacao { get; set; }
    public bool Ativa { get; set; }
    public DateTime DataCriacao { get; set; }
    
    // Relacionamentos
    public virtual List<Livro> Livros { get; set; }
}
```

## 📁 Estrutura do Projeto

### Organização das Camadas

```
Projeto2025_API/
├── Dominio/                    # Camada de Domínio
│   ├── Entidades/             # Entidades do domínio
│   │   ├── Autor.cs
│   │   ├── Editora.cs
│   │   ├── Emprestimo.cs
│   │   ├── Exemplar.cs
│   │   ├── Funcionario.cs
│   │   ├── Livro.cs
│   │   └── Usuario.cs
│   └── Dtos/                  # Data Transfer Objects
│       ├── AutorDTO.cs
│       ├── EditoraDTO.cs
│       ├── EmprestimoDTO.cs
│       ├── ExemplarDTO.cs
│       ├── FuncionarioDTO.cs
│       ├── LivroDTO.cs
│       ├── LoginDTO.cs
│       ├── TokenDTO.cs
│       └── UsuarioDTO.cs
├── Interface/                  # Camada de Interface
│   ├── Repositorio/           # Interfaces dos repositórios
│   │   ├── IBaseRepository.cs
│   │   ├── IAutorRepositorio.cs
│   │   ├── IEditoraRepositorio.cs
│   │   ├── IEmprestimoRepositorio.cs
│   │   ├── IExemplarRepositorio.cs
│   │   ├── IFuncionarioRepositorio.cs
│   │   ├── ILivroRepositorio.cs
│   │   └── IUsuarioRepositorio.cs
│   └── Service/               # Interfaces dos serviços
│       ├── IAuthService.cs
│       ├── IAutorService.cs
│       ├── IEditoraService.cs
│       ├── IEmprestimoService.cs
│       ├── IExemplarService.cs
│       ├── IFuncionarioService.cs
│       ├── ILivroService.cs
│       └── IUsuarioService.cs
├── InfraEstrutura/            # Camada de Infraestrutura
│   ├── Data/                  # Contexto do banco de dados
│   │   └── EmpresaContexto.cs
│   ├── Migrations/            # Migrações do EF Core
│   └── Repositorio/           # Implementações dos repositórios
│       ├── BaseRepository.cs
│       ├── AutorRepositorio.cs
│       ├── EditoraRepositorio.cs
│       ├── EmprestimoRepositorio.cs
│       ├── ExemplarRepositorio.cs
│       ├── FuncionarioRepositorio.cs
│       ├── LivroRepositorio.cs
│       └── UsuarioRepositorio.cs
├── Service/                   # Camada de Serviços
│   ├── AuthService.cs
│   ├── AutorService.cs
│   ├── EditoraService.cs
│   ├── EmprestimoService.cs
│   ├── ExemplarService.cs
│   ├── FuncionarioService.cs
│   ├── LivroService.cs
│   ├── UsuarioService.cs
│   └── PasswordHashService.cs
└── Projeto2020_API/           # Camada de Apresentação
    ├── Controllers/           # Controllers da API
    │   ├── AuthController.cs
    │   ├── AutorController.cs
    │   ├── ConfiguracaoController.cs
    │   ├── DashboardController.cs
    │   ├── EditoraController.cs
    │   ├── EmprestimoController.cs
    │   ├── ExemplarController.cs
    │   ├── FuncionarioController.cs
    │   ├── LivroController.cs
    │   ├── RelatoriosController.cs
    │   └── UsuarioController.cs
    ├── Mapping/               # Configuração do AutoMapper
    │   └── MappingProfile.cs
    ├── Program.cs             # Configuração da aplicação
    └── appsettings.json       # Configurações
```

### Responsabilidades de Cada Camada

#### 🏛️ **Camada de Domínio (Dominio/)**
- **Entidades**: Representam os objetos de negócio do sistema
- **DTOs**: Objetos de transferência de dados entre camadas
- **Regras de negócio**: Validações e lógicas específicas do domínio

#### 🔌 **Camada de Interface (Interface/)**
- **Interfaces de Repositórios**: Contratos para acesso a dados
- **Interfaces de Serviços**: Contratos para lógica de negócio
- **Abstrações**: Permitem desacoplamento entre camadas

#### 🏗️ **Camada de Infraestrutura (InfraEstrutura/)**
- **Contexto do Banco**: Configuração do Entity Framework
- **Repositórios**: Implementações concretas de acesso a dados
- **Migrations**: Evolução do esquema do banco de dados

#### ⚙️ **Camada de Serviços (Service/)**
- **Lógica de Negócio**: Implementação das regras de negócio
- **Orquestração**: Coordenação entre repositórios e validações
- **Transformações**: Conversões entre entidades e DTOs

#### 🎯 **Camada de Apresentação (Projeto2020_API/)**
- **Controllers**: Endpoints da API REST
- **Mapeamento**: Configuração do AutoMapper
- **Configuração**: Setup da aplicação e dependências

## 🔧 Serviços Auxiliares

### PasswordHashService
Serviço responsável pelo hash seguro de senhas usando SHA256:

```csharp
public static class PasswordHashService
{
    public static string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var salt = "Biblioteca2025_Salt_Key";
            var saltedPassword = password + salt;
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
```

### MappingProfile (AutoMapper)
Configuração de mapeamento entre entidades e DTOs:

```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Mapeamento Livro <-> LivroDTO
        CreateMap<Livro, LivroDTO>()
            .ForMember(dest => dest.TotalExemplares, opt => opt.MapFrom(src => src.TotalExemplares))
            .ForMember(dest => dest.ExemplaresDisponiveis, opt => opt.MapFrom(src => src.ExemplaresDisponiveis))
            .ForMember(dest => dest.TemExemplaresDisponiveis, opt => opt.MapFrom(src => src.TemExemplaresDisponiveis))
            .ForMember(dest => dest.NomeAutor, opt => opt.MapFrom(src => src.Autor != null ? src.Autor.Nome : null))
            .ForMember(dest => dest.NomeEditora, opt => opt.MapFrom(src => src.Editora != null ? src.Editora.Nome : null));
            
        // Mapeamento reverso (DTO -> Entity) ignorando propriedades calculadas
        CreateMap<LivroDTO, Livro>()
            .ForMember(dest => dest.Exemplares, opt => opt.Ignore())
            .ForMember(dest => dest.Autor, opt => opt.Ignore())
            .ForMember(dest => dest.Editora, opt => opt.Ignore());
    }
}
```

## 🔐 Sistema de Autenticação

### JWT Configuration
```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
        };
    });
```

### Roles e Permissões
```csharp
[Authorize(Roles = "Admin")]           // Apenas administradores
[Authorize(Roles = "Admin,Funcionario")] // Admin e funcionários
[Authorize]                            // Qualquer usuário autenticado
```

### Password Hashing
```csharp
public class PasswordHashService
{
    public string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var salt = "biblioteca_salt_2025";
            var saltedPassword = password + salt;
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
```

## 🗄️ Banco de Dados

### String de Conexão
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=dbBiblioteca;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### Migrations
```bash
# Criar nova migration
dotnet ef migrations add NomeDaMigration --project Projeto2020_API

# Aplicar migrations
dotnet ef database update --project Projeto2020_API

# Remover última migration
dotnet ef migrations remove --project Projeto2020_API
```

### Índices e Constraints
```csharp
// EmpresaContexto.cs
modelBuilder.Entity<Usuario>(builder =>
{
    builder.HasIndex(u => u.Email).IsUnique();
    builder.HasIndex(u => u.CPF).IsUnique();
});

modelBuilder.Entity<Funcionario>(builder =>
{
    builder.HasIndex(f => f.Email).IsUnique();
});

modelBuilder.Entity<Editora>(builder =>
{
    builder.HasIndex(e => e.CNPJ).IsUnique();
    builder.HasIndex(e => e.Email).IsUnique();
});
```

## 🔄 Padrão Repository

### Interface Base
```csharp
public interface IBaseRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> RemoveAsync(int id);
    Task<bool> ExistsAsync(int id);
}
```

### Implementação Base
```csharp
public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    protected readonly EmpresaContexto _contexto;
    protected readonly DbSet<T> _dbSet;

    public BaseRepository(EmpresaContexto contexto)
    {
        _contexto = contexto;
        _dbSet = _contexto.Set<T>();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        _dbSet.Add(entity);
        await _contexto.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _contexto.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<bool> RemoveAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity == null) return false;

        _dbSet.Remove(entity);
        await _contexto.SaveChangesAsync();
        return true;
    }

    public virtual async Task<bool> ExistsAsync(int id)
    {
        return await _dbSet.FindAsync(id) != null;
    }
}
```

## 🎯 Padrão Service

### Interface de Serviço
```csharp
public interface ILivroService
{
    Task<IEnumerable<LivroDTO>> GetAllAsync();
    Task<LivroDTO?> GetByIdAsync(int id);
    Task<LivroDTO> AddAsync(LivroDTO livroDTO);
    Task<LivroDTO> UpdateAsync(LivroDTO livroDTO);
    Task<bool> RemoveAsync(int id);
    Task<IEnumerable<LivroDTO>> GetDisponiveisAsync();
    Task<IEnumerable<LivroDTO>> GetEmEstoqueAsync();
    Task<IEnumerable<LivroDTO>> BuscarAsync(string termo);
    Task<IEnumerable<LivroDTO>> GetByGeneroAsync(string genero);
    Task<IEnumerable<LivroDTO>> GetByAutorAsync(int idAutor);
    Task<IEnumerable<LivroDTO>> GetByEditoraAsync(int idEditora);
}
```

### Implementação do Serviço
```csharp
public class LivroService : ILivroService
{
    private readonly ILivroRepositorio _livroRepositorio;
    private readonly IMapper _mapper;

    public LivroService(ILivroRepositorio livroRepositorio, IMapper mapper)
    {
        _livroRepositorio = livroRepositorio;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LivroDTO>> GetAllAsync()
    {
        var livros = await _livroRepositorio.GetAllAsync();
        return _mapper.Map<IEnumerable<LivroDTO>>(livros);
    }

    public async Task<LivroDTO?> GetByIdAsync(int id)
    {
        var livro = await _livroRepositorio.GetByIdAsync(id);
        return livro != null ? _mapper.Map<LivroDTO>(livro) : null;
    }

    public async Task<LivroDTO> AddAsync(LivroDTO livroDTO)
    {
        var livro = _mapper.Map<Livro>(livroDTO);
        await _livroRepositorio.AddAsync(livro);
        return _mapper.Map<LivroDTO>(livro);
    }

    // ... outros métodos
}
```

## 🗺️ AutoMapper Configuration

### Mapping Profile
```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Livro mappings
        CreateMap<Livro, LivroDTO>()
            .ForMember(dest => dest.TotalExemplares, opt => opt.MapFrom(src => src.TotalExemplares))
            .ForMember(dest => dest.ExemplaresDisponiveis, opt => opt.MapFrom(src => src.ExemplaresDisponiveis))
            .ForMember(dest => dest.TemExemplaresDisponiveis, opt => opt.MapFrom(src => src.TemExemplaresDisponiveis))
            .ForMember(dest => dest.NomeAutor, opt => opt.MapFrom(src => src.Autor != null ? src.Autor.Nome : null))
            .ForMember(dest => dest.NomeEditora, opt => opt.MapFrom(src => src.Editora != null ? src.Editora.Nome : null));

        CreateMap<LivroDTO, Livro>()
            .ForMember(dest => dest.Exemplares, opt => opt.Ignore())
            .ForMember(dest => dest.Autor, opt => opt.Ignore())
            .ForMember(dest => dest.Editora, opt => opt.Ignore());

        // Exemplar mappings
        CreateMap<Exemplar, ExemplarDTO>()
            .ForMember(dest => dest.TituloLivro, opt => opt.MapFrom(src => src.Livro != null ? src.Livro.Titulo : null))
            .ForMember(dest => dest.ISBN, opt => opt.MapFrom(src => src.Livro != null ? src.Livro.ISBN : null))
            .ForMember(dest => dest.NomeAutor, opt => opt.MapFrom(src => src.Livro != null && src.Livro.Autor != null ? src.Livro.Autor.Nome : null))
            .ForMember(dest => dest.NomeEditora, opt => opt.MapFrom(src => src.Livro != null && src.Livro.Editora != null ? src.Livro.Editora.Nome : null));

        CreateMap<ExemplarDTO, Exemplar>()
            .ForMember(dest => dest.Livro, opt => opt.Ignore());

        // Empréstimo mappings
        CreateMap<Emprestimo, EmprestimoDTO>()
            .ForMember(dest => dest.TituloLivro, opt => opt.MapFrom(src => src.Exemplar != null && src.Exemplar.Livro != null ? src.Exemplar.Livro.Titulo : null))
            .ForMember(dest => dest.NumeroExemplar, opt => opt.MapFrom(src => src.Exemplar != null ? src.Exemplar.NumeroExemplar : null))
            .ForMember(dest => dest.NomeUsuario, opt => opt.MapFrom(src => src.Usuario != null ? src.Usuario.Nome : null))
            .ForMember(dest => dest.EmailUsuario, opt => opt.MapFrom(src => src.Usuario != null ? src.Usuario.Email : null));

        CreateMap<EmprestimoDTO, Emprestimo>()
            .ForMember(dest => dest.Exemplar, opt => opt.Ignore())
            .ForMember(dest => dest.Usuario, opt => opt.Ignore());

        // Outros mappings
        CreateMap<Editora, EditoraDTO>().ReverseMap();
        CreateMap<Usuario, UsuarioDTO>().ReverseMap();
        CreateMap<Autor, AutorDTO>().ReverseMap();
        CreateMap<Funcionario, FuncionarioDTO>().ReverseMap();
    }
}
```

## 🧪 Validações e Tratamento de Erros

### Validação de Dados Únicos
```csharp
public async Task<UsuarioDTO> AddAsync(UsuarioDTO usuarioDTO)
{
    // Validar se email já existe
    var usuarioExistente = await usuarioRepositorio.GetByEmailAsync(usuarioDTO.Email);
    if (usuarioExistente != null)
    {
        throw new InvalidOperationException("Já existe um usuário com este email.");
    }

    // Validar se CPF já existe
    if (!string.IsNullOrEmpty(usuarioDTO.CPF))
    {
        var usuarioComCpf = await usuarioRepositorio.GetByCpfAsync(usuarioDTO.CPF);
        if (usuarioComCpf != null)
        {
            throw new InvalidOperationException("Já existe um usuário com este CPF.");
        }
    }

    var usuario = mapper.Map<Usuario>(usuarioDTO);
    await usuarioRepositorio.AddAsync(usuario);
    return mapper.Map<UsuarioDTO>(usuario);
}
```

### Tratamento de Erros Global
```csharp
// Program.cs
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var response = httpContext.Response;
        response.ContentType = "application/json";

        var errorResponse = new
        {
            error = exception.Message,
            details = exception.InnerException?.Message,
            timestamp = DateTime.UtcNow
        };

        response.StatusCode = exception switch
        {
            ArgumentException => StatusCodes.Status400BadRequest,
            InvalidOperationException => StatusCodes.Status400BadRequest,
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            _ => StatusCodes.Status500InternalServerError
        };

        await response.WriteAsync(JsonSerializer.Serialize(errorResponse), cancellationToken);
        return true;
    }
}
```

## 📊 Performance e Otimizações

### Queries Otimizadas
```csharp
// Incluir relacionamentos necessários
public async Task<IEnumerable<Livro>> GetAllAsync()
{
    return await _contexto.Livros
        .Include(l => l.Autor)
        .Include(l => l.Editora)
        .Include(l => l.Exemplares.Where(e => e.Ativo))
        .Where(l => l.Ativo)
        .ToListAsync();
}

// Usar projeção para reduzir dados transferidos
public async Task<IEnumerable<LivroDTO>> GetDisponiveisAsync()
{
    return await _contexto.Livros
        .Where(l => l.Ativo && l.Exemplares.Any(e => e.Ativo && e.Disponivel))
        .Select(l => new LivroDTO
        {
            Id = l.Id,
            Titulo = l.Titulo,
            ISBN = l.ISBN,
            NomeAutor = l.Autor != null ? l.Autor.Nome : null,
            NomeEditora = l.Editora != null ? l.Editora.Nome : null
        })
        .ToListAsync();
}
```

### Índices de Banco de Dados
```sql
-- Índices para melhorar performance
CREATE INDEX IX_Livro_Titulo ON Livro(Titulo);
CREATE INDEX IX_Livro_Genero ON Livro(Genero);
CREATE INDEX IX_Emprestimo_DataEmprestimo ON Emprestimo(DataEmprestimo);
CREATE INDEX IX_Emprestimo_Status ON Emprestimo(Status);
CREATE INDEX IX_Exemplar_Disponivel ON Exemplar(Disponivel);
```

## 🔧 Configuração de Desenvolvimento

### appsettings.Development.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "JwtSettings": {
    "SecretKey": "MinhaChaveSecretaSuperSeguraParaJWT2025",
    "Issuer": "Projeto2025API",
    "Audience": "Projeto2025API",
    "ExpirationHours": 8
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=dbBiblioteca;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### launchSettings.json
```json
{
  "profiles": {
    "Projeto2020_API": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "https://localhost:5072;http://localhost:5072",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

## 🚀 Deploy e Produção

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Projeto2020_API/Projeto2020_API.csproj", "Projeto2020_API/"]
RUN dotnet restore "Projeto2020_API/Projeto2020_API.csproj"
COPY . .
WORKDIR "/src/Projeto2020_API"
RUN dotnet build "Projeto2020_API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Projeto2020_API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Projeto2020_API.dll"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  biblioteca-api:
    build: .
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=dbBiblioteca;User Id=sa;Password=YourPassword123!;TrustServerCertificate=true;
    depends_on:
      - sqlserver

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

volumes:
  sqlserver_data:
```

## 📈 Monitoramento e Logs

### Serilog Configuration
```csharp
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// appsettings.json
{
  "Serilog": {
    "Using": ["Serilog.Sinks.Console", "Serilog.Sinks.File"],
    "MinimumLevel": "Information",
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/log-.txt",
          "rollingInterval": "Day"
        }
      }
    ]
  }
}
```

### Health Checks
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<EmpresaContexto>()
    .AddSqlServer(connectionString);

app.MapHealthChecks("/health");
```

## 🔒 Segurança

### CORS Configuration
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

### Rate Limiting
```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("ApiPolicy", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});
```

## 📚 Documentação da API

### Swagger Configuration
```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Sistema de Biblioteca API",
        Version = "v1",
        Description = "API completa para gerenciamento de biblioteca"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
});
```

---

Esta documentação técnica fornece uma visão completa da arquitetura, implementação e configuração do sistema de biblioteca. Para mais detalhes sobre endpoints específicos, consulte a documentação do Swagger em `/swagger`.
