using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfraEstrutura.Migrations
{
    /// <inheritdoc />
    public partial class FixLivroIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Livro_CodigoBarras",
                table: "Livro");

            migrationBuilder.DropIndex(
                name: "IX_Livro_NumeroExemplar",
                table: "Livro");

            migrationBuilder.CreateIndex(
                name: "IX_Livro_CodigoBarras",
                table: "Livro",
                column: "CodigoBarras",
                unique: true,
                filter: "[CodigoBarras] IS NOT NULL AND [CodigoBarras] != ''");

            migrationBuilder.CreateIndex(
                name: "IX_Livro_NumeroExemplar",
                table: "Livro",
                column: "NumeroExemplar",
                unique: true,
                filter: "[NumeroExemplar] IS NOT NULL AND [NumeroExemplar] != ''");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Livro_CodigoBarras",
                table: "Livro");

            migrationBuilder.DropIndex(
                name: "IX_Livro_NumeroExemplar",
                table: "Livro");

            migrationBuilder.CreateIndex(
                name: "IX_Livro_CodigoBarras",
                table: "Livro",
                column: "CodigoBarras",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Livro_NumeroExemplar",
                table: "Livro",
                column: "NumeroExemplar",
                unique: true);
        }
    }
}
