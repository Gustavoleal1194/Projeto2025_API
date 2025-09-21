using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfraEstrutura.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateWithExemplar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Autor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    NomeCompleto = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NomeArtistico = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Nacionalidade = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PaisOrigem = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Website = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Endereco = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Cidade = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CEP = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Pais = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Autor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Editora",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    CNPJ = table.Column<string>(type: "nvarchar(18)", maxLength: 18, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Endereco = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Cidade = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CEP = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Pais = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DataFundacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Site = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Ativa = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Editora", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Funcionario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Cargo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Salario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DataAdmissao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataDemissao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Funcionario", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CPF = table.Column<string>(type: "nvarchar(14)", maxLength: 14, nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Livro",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Subtitulo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ISBN = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Ano = table.Column<int>(type: "int", nullable: false),
                    Edicao = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    NumeroPaginas = table.Column<int>(type: "int", nullable: false),
                    Idioma = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Português"),
                    Genero = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Sinopse = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Preco = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CapaUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CodigoBarras = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    IdAutor = table.Column<int>(type: "int", nullable: false),
                    IdEditora = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Livro", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Livro_Autor_IdAutor",
                        column: x => x.IdAutor,
                        principalTable: "Autor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Livro_Editora_IdEditora",
                        column: x => x.IdEditora,
                        principalTable: "Editora",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Exemplar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdLivro = table.Column<int>(type: "int", nullable: false),
                    NumeroExemplar = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Localizacao = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Condicao = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Bom"),
                    Disponivel = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DataAquisicao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    ValorAquisicao = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    Fornecedor = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Observacoes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exemplar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Exemplar_Livro_IdLivro",
                        column: x => x.IdLivro,
                        principalTable: "Livro",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Emprestimo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdExemplar = table.Column<int>(type: "int", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    DataEmprestimo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataPrevistaDevolucao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataDevolucao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataRenovacao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    QuantidadeRenovacoes = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MaxRenovacoes = table.Column<int>(type: "int", nullable: false, defaultValue: 3),
                    Multa = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Emprestado"),
                    Observacoes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emprestimo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Emprestimo_Exemplar_IdExemplar",
                        column: x => x.IdExemplar,
                        principalTable: "Exemplar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Emprestimo_Usuario_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Autor_Email",
                table: "Autor",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL AND [Email] != ''");

            migrationBuilder.CreateIndex(
                name: "IX_Editora_CNPJ",
                table: "Editora",
                column: "CNPJ",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Editora_Email",
                table: "Editora",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Emprestimo_IdExemplar",
                table: "Emprestimo",
                column: "IdExemplar");

            migrationBuilder.CreateIndex(
                name: "IX_Emprestimo_IdUsuario",
                table: "Emprestimo",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Exemplar_IdLivro",
                table: "Exemplar",
                column: "IdLivro");

            migrationBuilder.CreateIndex(
                name: "IX_Exemplar_NumeroExemplar",
                table: "Exemplar",
                column: "NumeroExemplar",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Funcionario_Email",
                table: "Funcionario",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Livro_CodigoBarras",
                table: "Livro",
                column: "CodigoBarras",
                unique: true,
                filter: "[CodigoBarras] IS NOT NULL AND [CodigoBarras] != ''");

            migrationBuilder.CreateIndex(
                name: "IX_Livro_IdAutor",
                table: "Livro",
                column: "IdAutor");

            migrationBuilder.CreateIndex(
                name: "IX_Livro_IdEditora",
                table: "Livro",
                column: "IdEditora");

            migrationBuilder.CreateIndex(
                name: "IX_Livro_ISBN",
                table: "Livro",
                column: "ISBN",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_CPF",
                table: "Usuario",
                column: "CPF",
                unique: true,
                filter: "[CPF] IS NOT NULL AND [CPF] != ''");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_Email",
                table: "Usuario",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Emprestimo");

            migrationBuilder.DropTable(
                name: "Funcionario");

            migrationBuilder.DropTable(
                name: "Exemplar");

            migrationBuilder.DropTable(
                name: "Usuario");

            migrationBuilder.DropTable(
                name: "Livro");

            migrationBuilder.DropTable(
                name: "Autor");

            migrationBuilder.DropTable(
                name: "Editora");
        }
    }
}
