using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Kuby.Data.Migrations
{
    /// <inheritdoc />
    public partial class CubeTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CubeTime",
                columns: table => new
                {
                    CubeTimeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DisplayId = table.Column<int>(type: "INTEGER", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    TotalDuration = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    TimeZoneInfo = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CubeTime", x => x.CubeTimeId);
                });

            migrationBuilder.CreateTable(
                name: "Interval",
                columns: table => new
                {
                    IntervalId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Start = table.Column<DateTime>(type: "TEXT", nullable: false),
                    End = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CubeTimeId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interval", x => x.IntervalId);
                    table.ForeignKey(
                        name: "FK_Interval_CubeTime_CubeTimeId",
                        column: x => x.CubeTimeId,
                        principalTable: "CubeTime",
                        principalColumn: "CubeTimeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Interval_CubeTimeId",
                table: "Interval",
                column: "CubeTimeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Interval");

            migrationBuilder.DropTable(
                name: "CubeTime");
        }
    }
}
