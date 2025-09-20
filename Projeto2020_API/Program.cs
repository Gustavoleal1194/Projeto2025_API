using InfraEstrutura.Data;
using InfraEstrutura.Repositorio;
using Microsoft.EntityFrameworkCore;
using Projeto2025_API.Mapping;
using Service;
using Interface.Repositorio;
using Interface.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
