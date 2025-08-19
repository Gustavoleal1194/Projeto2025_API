using Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InfraEstrutura.Data
{
    public class EmpresaContexto : DbContext

    {
        public EmpresaContexto(DbContextOptions<EmpresaContexto> opcoes) : base(opcoes)
        {
        }


        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Produto> Produtos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Categoria>(builder => {
                builder.Property(p => p.Descricao).IsRequired().HasMaxLength(150);//descrição obrigatoria
                builder.ToTable("Categoria");//nome da tabela
                builder.HasKey(p => p.Id);
                

            });
            modelBuilder.Entity<Produto>(builder =>
            {
                builder.ToTable("produto");
                builder.HasKey(p => p.Id);
                builder.Property(p => p.Descricao).IsRequired().HasMaxLength(150);
                builder.Property(p => p.Valor).HasPrecision(8, 2).IsRequired();
                builder.Property(p => p.Quantidade).IsRequired();
                builder.HasOne(p => p.Categoria).WithMany(p => p.produtos).HasForeignKey(p => p.IdCategoria).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }

}
