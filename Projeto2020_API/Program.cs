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
using Projeto2025_API.Extensions;
using FluentValidation;
using Projeto2025_API.Validators;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Configurar CORS com segurança
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", 
                "http://localhost:3000", 
                "http://localhost:4200",
                "https://*.vercel.app",
                "https://*.netlify.app",
                "https://*.render.com"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});

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

// Configurar serviços de configuração
builder.Services.AddScoped<IConfiguracaoSistemaRepositorio, ConfiguracaoSistemaRepositorio>();
builder.Services.AddScoped<IConfiguracaoHistoricoRepositorio, ConfiguracaoHistoricoRepositorio>();
builder.Services.AddScoped<IConfiguracaoSistemaService, ConfiguracaoSistemaService>();

// Configurar autenticação JWT
builder.Services.AddScoped<IAuthService, AuthService>();

// Configurar FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<UsuarioValidator>();

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
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Projeto2025 API v1");
    c.RoutePrefix = "swagger";
});

// Security middleware
app.UseSecurityHeaders();
app.UseGlobalExceptionHandling();

app.UseHttpsRedirection();

// Rate limiting for auth endpoints
app.UseWhen(context => context.Request.Path.StartsWithSegments("/api/auth"), 
    appBuilder => appBuilder.UseRateLimiting(5, 1)); // 5 requests per minute for auth

// Usar CORS
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<EmpresaContexto>();
    dbContext.Database.Migrate();
}
app.Run();
