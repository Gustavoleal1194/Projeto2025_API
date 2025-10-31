using InfraEstrutura.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class ContextoEmpresaFactory : IDesignTimeDbContextFactory<EmpresaContexto>
{
    public EmpresaContexto CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<EmpresaContexto>();

        // String de conexão adaptada para ambiente Docker
        optionsBuilder.UseSqlServer(@"Server=sqlserver;Database=dbBiblioteca;User Id=sa;Password=MinhaSenha123!;TrustServerCertificate=True;");
        
        return new EmpresaContexto(optionsBuilder.Options);
    }
}
