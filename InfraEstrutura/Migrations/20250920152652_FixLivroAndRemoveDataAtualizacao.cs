using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfraEstrutura.Migrations
{
    /// <inheritdoc />
    public partial class FixLivroAndRemoveDataAtualizacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "Livro",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "CapaUrl",
                table: "Livro",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CodigoBarras",
                table: "Livro",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Condicao",
                table: "Livro",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Bom");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataAquisicao",
                table: "Livro",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataCriacao",
                table: "Livro",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<bool>(
                name: "Disponivel",
                table: "Livro",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "Edicao",
                table: "Livro",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "Fornecedor",
                table: "Livro",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Genero",
                table: "Livro",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Idioma",
                table: "Livro",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Português");

            migrationBuilder.AddColumn<string>(
                name: "Localizacao",
                table: "Livro",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NumeroExemplar",
                table: "Livro",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "NumeroPaginas",
                table: "Livro",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ObservacoesExemplar",
                table: "Livro",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Preco",
                table: "Livro",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "QuantidadeDisponivel",
                table: "Livro",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "QuantidadeEstoque",
                table: "Livro",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Sinopse",
                table: "Livro",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Subtitulo",
                table: "Livro",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ValorAquisicao",
                table: "Livro",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "Emprestimo",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataCriacao",
                table: "Emprestimo",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataPrevistaDevolucao",
                table: "Emprestimo",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DataRenovacao",
                table: "Emprestimo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxRenovacoes",
                table: "Emprestimo",
                type: "int",
                nullable: false,
                defaultValue: 3);

            migrationBuilder.AddColumn<decimal>(
                name: "Multa",
                table: "Emprestimo",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Observacoes",
                table: "Emprestimo",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "QuantidadeRenovacoes",
                table: "Emprestimo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Emprestimo",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Emprestado");

            migrationBuilder.AlterColumn<string>(
                name: "Endereco",
                table: "Editora",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<bool>(
                name: "Ativa",
                table: "Editora",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "CEP",
                table: "Editora",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CNPJ",
                table: "Editora",
                type: "nvarchar(18)",
                maxLength: 18,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Cidade",
                table: "Editora",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataCriacao",
                table: "Editora",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataFundacao",
                table: "Editora",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Editora",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Editora",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Pais",
                table: "Editora",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Site",
                table: "Editora",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Editora",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Livro_CodigoBarras",
                table: "Livro",
                column: "CodigoBarras",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Livro_ISBN",
                table: "Livro",
                column: "ISBN",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Livro_NumeroExemplar",
                table: "Livro",
                column: "NumeroExemplar",
                unique: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Livro_CodigoBarras",
                table: "Livro");

            migrationBuilder.DropIndex(
                name: "IX_Livro_ISBN",
                table: "Livro");

            migrationBuilder.DropIndex(
                name: "IX_Livro_NumeroExemplar",
                table: "Livro");

            migrationBuilder.DropIndex(
                name: "IX_Editora_CNPJ",
                table: "Editora");

            migrationBuilder.DropIndex(
                name: "IX_Editora_Email",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "CapaUrl",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "CodigoBarras",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Condicao",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "DataAquisicao",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "DataCriacao",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Disponivel",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Edicao",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Fornecedor",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Genero",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Idioma",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Localizacao",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "NumeroExemplar",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "NumeroPaginas",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "ObservacoesExemplar",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Preco",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "QuantidadeDisponivel",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "QuantidadeEstoque",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Sinopse",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Subtitulo",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "ValorAquisicao",
                table: "Livro");

            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "DataCriacao",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "DataPrevistaDevolucao",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "DataRenovacao",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "MaxRenovacoes",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "Multa",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "Observacoes",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "QuantidadeRenovacoes",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Emprestimo");

            migrationBuilder.DropColumn(
                name: "Ativa",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "CEP",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "CNPJ",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "Cidade",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "DataCriacao",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "DataFundacao",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "Pais",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "Site",
                table: "Editora");

            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Editora");

            migrationBuilder.AlterColumn<string>(
                name: "Endereco",
                table: "Editora",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300);
        }
    }
}
