using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfraEstrutura.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarConfiguracoesSistema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConfiguracaoSistema",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Chave = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Valor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "String"),
                    Descricao = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UsuarioAtualizacao = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfiguracaoSistema", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConfiguracaoHistorico",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConfiguracaoId = table.Column<int>(type: "int", nullable: false),
                    ValorAnterior = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValorNovo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataAlteracao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UsuarioAlteracao = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IpAlteracao = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: true),
                    MotivoAlteracao = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfiguracaoHistorico", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConfiguracaoHistorico_ConfiguracaoSistema_ConfiguracaoId",
                        column: x => x.ConfiguracaoId,
                        principalTable: "ConfiguracaoSistema",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConfiguracaoHistorico_ConfiguracaoId",
                table: "ConfiguracaoHistorico",
                column: "ConfiguracaoId");

            migrationBuilder.CreateIndex(
                name: "IX_ConfiguracaoHistorico_DataAlteracao",
                table: "ConfiguracaoHistorico",
                column: "DataAlteracao");

            migrationBuilder.CreateIndex(
                name: "IX_ConfiguracaoHistorico_UsuarioAlteracao",
                table: "ConfiguracaoHistorico",
                column: "UsuarioAlteracao");

            migrationBuilder.CreateIndex(
                name: "IX_ConfiguracaoSistema_Categoria",
                table: "ConfiguracaoSistema",
                column: "Categoria");

            migrationBuilder.CreateIndex(
                name: "IX_ConfiguracaoSistema_Chave",
                table: "ConfiguracaoSistema",
                column: "Chave",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfiguracaoHistorico");

            migrationBuilder.DropTable(
                name: "ConfiguracaoSistema");
        }
    }
}
