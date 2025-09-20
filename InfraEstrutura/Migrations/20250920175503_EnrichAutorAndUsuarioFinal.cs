using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfraEstrutura.Migrations
{
    /// <inheritdoc />
    public partial class EnrichAutorAndUsuarioFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CPF",
                table: "Usuario",
                type: "nvarchar(14)",
                maxLength: 14,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataNascimento",
                table: "Usuario",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "Autor",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "Biografia",
                table: "Autor",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CEP",
                table: "Autor",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Cidade",
                table: "Autor",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataCriacao",
                table: "Autor",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataFalecimento",
                table: "Autor",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Autor",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Endereco",
                table: "Autor",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Autor",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FormacaoAcademica",
                table: "Autor",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GeneroLiterario",
                table: "Autor",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NomeArtistico",
                table: "Autor",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NomeCompleto",
                table: "Autor",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Pais",
                table: "Autor",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaisOrigem",
                table: "Autor",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Premios",
                table: "Autor",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Autor",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Autor",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_CPF",
                table: "Usuario",
                column: "CPF",
                unique: true,
                filter: "[CPF] IS NOT NULL AND [CPF] != ''");

            migrationBuilder.CreateIndex(
                name: "IX_Autor_Email",
                table: "Autor",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL AND [Email] != ''");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Usuario_CPF",
                table: "Usuario");

            migrationBuilder.DropIndex(
                name: "IX_Autor_Email",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "CPF",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "DataNascimento",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Biografia",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "CEP",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Cidade",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "DataCriacao",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "DataFalecimento",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Endereco",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "FormacaoAcademica",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "GeneroLiterario",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "NomeArtistico",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "NomeCompleto",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Pais",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "PaisOrigem",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Premios",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Autor");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Autor");
        }
    }
}
