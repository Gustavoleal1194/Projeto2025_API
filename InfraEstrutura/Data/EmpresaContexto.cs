using Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
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

        // DbSets para o tema Biblioteca
        public DbSet<Livro> Livros { get; set; }
        public DbSet<Autor> Autores { get; set; }
        public DbSet<Editora> Editoras { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Emprestimo> Emprestimos { get; set; }
        public DbSet<Funcionario> Funcionarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Livro
            modelBuilder.Entity<Livro>(builder =>
            {
                builder.ToTable("Livro");
                builder.HasKey(p => p.Id);
                builder.Property(p => p.Titulo).IsRequired().HasMaxLength(200);
                builder.Property(p => p.Subtitulo).HasMaxLength(200);
                builder.Property(p => p.ISBN).IsRequired().HasMaxLength(20);
                builder.Property(p => p.Ano).IsRequired();
                builder.Property(p => p.Edicao).IsRequired().HasDefaultValue(1);
                builder.Property(p => p.NumeroPaginas).IsRequired();
                builder.Property(p => p.Idioma).IsRequired().HasMaxLength(50).HasDefaultValue("Português");
                builder.Property(p => p.Genero).HasMaxLength(100);
                builder.Property(p => p.Sinopse).HasMaxLength(2000);
                builder.Property(p => p.Preco).IsRequired().HasColumnType("decimal(18,2)");
                builder.Property(p => p.QuantidadeEstoque).IsRequired().HasDefaultValue(0);
                builder.Property(p => p.QuantidadeDisponivel).IsRequired().HasDefaultValue(0);
                builder.Property(p => p.CapaUrl).HasMaxLength(500);
                builder.Property(p => p.CodigoBarras).HasMaxLength(50);
                builder.Property(p => p.Disponivel).IsRequired().HasDefaultValue(true);
                builder.Property(p => p.Ativo).IsRequired().HasDefaultValue(true);
                builder.Property(p => p.DataCriacao).IsRequired().HasDefaultValueSql("GETDATE()");
                
                // Informações do Exemplar
                builder.Property(p => p.NumeroExemplar).HasMaxLength(50);
                builder.Property(p => p.Localizacao).HasMaxLength(100);
                builder.Property(p => p.Condicao).IsRequired().HasMaxLength(20).HasDefaultValue("Bom");
                builder.Property(p => p.ObservacoesExemplar).HasMaxLength(500);
                builder.Property(p => p.ValorAquisicao).HasColumnType("decimal(18,2)");
                builder.Property(p => p.Fornecedor).HasMaxLength(200);
                
                builder.HasIndex(p => p.ISBN).IsUnique();
                builder.HasIndex(p => p.CodigoBarras).IsUnique().HasFilter("[CodigoBarras] IS NOT NULL AND [CodigoBarras] != ''");
                builder.HasIndex(p => p.NumeroExemplar).IsUnique().HasFilter("[NumeroExemplar] IS NOT NULL AND [NumeroExemplar] != ''");
                builder.HasOne(p => p.Autor)
                       .WithMany(a => a.Livros)
                       .HasForeignKey(p => p.IdAutor)
                       .OnDelete(DeleteBehavior.Restrict);
                builder.HasOne(p => p.Editora)
                       .WithMany(e => e.Livros)
                       .HasForeignKey(p => p.IdEditora)
                       .OnDelete(DeleteBehavior.Restrict);
            });

            // Autor
            modelBuilder.Entity<Autor>(builder =>
            {
                builder.ToTable("Autor");
                builder.HasKey(a => a.Id);
                builder.Property(a => a.Nome).IsRequired().HasMaxLength(150);
                builder.Property(a => a.NomeCompleto).HasMaxLength(200);
                builder.Property(a => a.NomeArtistico).HasMaxLength(150);
                builder.Property(a => a.Nacionalidade).HasMaxLength(100);
                builder.Property(a => a.PaisOrigem).HasMaxLength(100);
                builder.Property(a => a.DataNascimento).IsRequired();
                builder.Property(a => a.Website).HasMaxLength(200);
                builder.Property(a => a.Email).HasMaxLength(100);
                builder.Property(a => a.Telefone).HasMaxLength(20);
                builder.Property(a => a.Endereco).HasMaxLength(300);
                builder.Property(a => a.Cidade).HasMaxLength(100);
                builder.Property(a => a.Estado).HasMaxLength(50);
                builder.Property(a => a.CEP).HasMaxLength(10);
                builder.Property(a => a.Pais).HasMaxLength(50);
                builder.Property(a => a.Ativo).IsRequired().HasDefaultValue(true);
                builder.Property(a => a.DataCriacao).IsRequired().HasDefaultValueSql("GETDATE()");
                builder.HasIndex(a => a.Email).IsUnique().HasFilter("[Email] IS NOT NULL AND [Email] != ''");
            });

            // Editora
            modelBuilder.Entity<Editora>(builder =>
            {
                builder.ToTable("Editora");
                builder.HasKey(e => e.Id);
                builder.Property(e => e.Nome).IsRequired().HasMaxLength(150);
                builder.Property(e => e.CNPJ).IsRequired().HasMaxLength(18);
                builder.Property(e => e.Telefone).HasMaxLength(20);
                builder.Property(e => e.Email).HasMaxLength(100);
                builder.Property(e => e.Endereco).HasMaxLength(300);
                builder.Property(e => e.Cidade).HasMaxLength(100);
                builder.Property(e => e.Estado).HasMaxLength(50);
                builder.Property(e => e.CEP).HasMaxLength(10);
                builder.Property(e => e.Pais).HasMaxLength(50);
                builder.Property(e => e.Site).HasMaxLength(200);
                builder.Property(e => e.DataFundacao).IsRequired();
                builder.Property(e => e.Ativa).IsRequired().HasDefaultValue(true);
                builder.Property(e => e.DataCriacao).IsRequired().HasDefaultValueSql("GETDATE()");
                builder.HasIndex(e => e.CNPJ).IsUnique();
                builder.HasIndex(e => e.Email).IsUnique();
            });

            // Usuario
            modelBuilder.Entity<Usuario>(builder =>
            {
                builder.ToTable("Usuario");
                builder.HasKey(u => u.Id);
                builder.Property(u => u.Nome).IsRequired().HasMaxLength(150);
                builder.Property(u => u.Email).IsRequired().HasMaxLength(100);
                builder.Property(u => u.Telefone).HasMaxLength(20);
                builder.Property(u => u.Senha).IsRequired().HasMaxLength(255);
                builder.Property(u => u.CPF).HasMaxLength(14);
                builder.Property(u => u.DataNascimento).IsRequired();
                builder.HasIndex(u => u.Email).IsUnique();
                builder.HasIndex(u => u.CPF).IsUnique().HasFilter("[CPF] IS NOT NULL AND [CPF] != ''");
            });

            // Emprestimo
            modelBuilder.Entity<Emprestimo>(builder =>
            {
                builder.ToTable("Emprestimo");
                builder.HasKey(e => e.Id);
                builder.Property(e => e.DataEmprestimo).IsRequired();
                builder.Property(e => e.DataPrevistaDevolucao).IsRequired();
                builder.Property(e => e.QuantidadeRenovacoes).IsRequired().HasDefaultValue(0);
                builder.Property(e => e.MaxRenovacoes).IsRequired().HasDefaultValue(3);
                builder.Property(e => e.Multa).HasColumnType("decimal(18,2)");
                builder.Property(e => e.Status).IsRequired().HasMaxLength(20).HasDefaultValue("Emprestado");
                builder.Property(e => e.Observacoes).HasMaxLength(500);
                builder.Property(e => e.Ativo).IsRequired().HasDefaultValue(true);
                builder.Property(e => e.DataCriacao).IsRequired().HasDefaultValueSql("GETDATE()");
                builder.HasOne(e => e.Livro)
                       .WithMany(l => l.Emprestimos)
                       .HasForeignKey(e => e.IdLivro)
                       .OnDelete(DeleteBehavior.Restrict);
                builder.HasOne(e => e.Usuario)
                       .WithMany(u => u.Emprestimos)
                       .HasForeignKey(e => e.IdUsuario)
                       .OnDelete(DeleteBehavior.Restrict);
            });

            // Funcionario
            modelBuilder.Entity<Funcionario>(builder =>
            {
                builder.ToTable("Funcionario");
                builder.HasKey(f => f.Id);
                builder.Property(f => f.Nome).IsRequired().HasMaxLength(150);
                builder.Property(f => f.Email).IsRequired().HasMaxLength(100);
                builder.Property(f => f.Telefone).HasMaxLength(20);
                builder.Property(f => f.Senha).IsRequired().HasMaxLength(255);
                builder.Property(f => f.Cargo).IsRequired().HasMaxLength(100);
                builder.Property(f => f.Salario).IsRequired().HasColumnType("decimal(18,2)");
                builder.Property(f => f.DataAdmissao).IsRequired();
                builder.Property(f => f.Ativo).IsRequired().HasDefaultValue(true);
                builder.HasIndex(f => f.Email).IsUnique();
            });
        }
    }
}