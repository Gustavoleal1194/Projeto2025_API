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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Livro
            modelBuilder.Entity<Livro>(builder =>
            {
                builder.ToTable("Livro");
                builder.HasKey(p => p.Id);
                builder.Property(p => p.Titulo).IsRequired().HasMaxLength(200);
                builder.Property(p => p.ISBN).IsRequired().HasMaxLength(20);
                builder.Property(p => p.Ano).IsRequired();
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
                builder.Property(a => a.Nacionalidade).HasMaxLength(100);
                builder.Property(a => a.DataNascimento).IsRequired();
            });

            // Editora
            modelBuilder.Entity<Editora>(builder =>
            {
                builder.ToTable("Editora");
                builder.HasKey(e => e.Id);
                builder.Property(e => e.Nome).IsRequired().HasMaxLength(150);
                builder.Property(e => e.Endereco).HasMaxLength(200);
            });

            // Usuario
            modelBuilder.Entity<Usuario>(builder =>
            {
                builder.ToTable("Usuario");
                builder.HasKey(u => u.Id);
                builder.Property(u => u.Nome).IsRequired().HasMaxLength(150);
                builder.Property(u => u.Email).IsRequired().HasMaxLength(100);
                builder.Property(u => u.Telefone).HasMaxLength(20);
            });

            // Emprestimo
            modelBuilder.Entity<Emprestimo>(builder =>
            {
                builder.ToTable("Emprestimo");
                builder.HasKey(e => e.Id);
                builder.Property(e => e.DataEmprestimo).IsRequired();
                builder.HasOne(e => e.Livro)
                       .WithMany(l => l.Emprestimos)
                       .HasForeignKey(e => e.IdLivro)
                       .OnDelete(DeleteBehavior.Restrict);
                builder.HasOne(e => e.Usuario)
                       .WithMany(u => u.Emprestimos)
                       .HasForeignKey(e => e.IdUsuario)
                       .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
    }