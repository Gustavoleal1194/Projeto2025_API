using InfraEstrutura.Data;
using InfraEstrutura.Repositorio;
using Microsoft.EntityFrameworkCore;
using Projeto2025_API.Mapping;
using Service;
using Interface.Repositorio;
using Interface.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "Projeto2025 API", 
        Version = "v1",
        Description = "API para sistema de biblioteca com autenticação JWT"
    });
    
    // Configurar autenticação JWT no Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando o esquema Bearer. Exemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
//configurar contexto
builder.Services.AddDbContext<EmpresaContexto>(p =>
    p.UseSqlServer(
        builder.Configuration.GetConnectionString("default"),
        b => b.MigrationsAssembly("InfraEstrutura")
    )
);
//configurar o mapping
builder.Services.AddAutoMapper(p => p.AddProfile<MappingProfile>());
//configurar inje��o de dependencia

builder.Services.AddScoped<ILivroRepositorio, LivroRepositorio>();
builder.Services.AddScoped<ILivroService, LivroService>();

builder.Services.AddScoped<IExemplarRepositorio, ExemplarRepositorio>();
builder.Services.AddScoped<IExemplarService, ExemplarService>();

builder.Services.AddScoped<IAutorRepositorio, AutorRepositorio>();
builder.Services.AddScoped<IAutorService, AutorService>();

builder.Services.AddScoped<IEditoraRepositorio, EditoraRepositorio>();
builder.Services.AddScoped<IEditoraService, EditoraService>();

builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

builder.Services.AddScoped<IEmprestimoRepositorio, EmprestimoRepositorio>();
builder.Services.AddScoped<IEmprestimoService, EmprestimoService>();

builder.Services.AddScoped<IFuncionarioRepositorio, FuncionarioRepositorio>();
builder.Services.AddScoped<IFuncionarioService, FuncionarioService>();

// Configurar autenticação JWT
builder.Services.AddScoped<IAuthService, AuthService>();

// Configurar JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? "MinhaChaveSecretaSuperSeguraParaJWT2025!@#";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "Projeto2025API";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "Projeto2025API";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
