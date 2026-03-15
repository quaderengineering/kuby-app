using Domain.Kuby.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Kuby.Data.EntitiesConfig;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<Activity> Activity { get; set; }
    public DbSet<TimeEntry> TimeEntry { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var pauseActivityId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        modelBuilder.Entity<Activity>().HasData(
           new Activity
           {
               ActivityId = pauseActivityId,
               Label = "Pause",
               IsActive = true,
               IsCreatedBySystem = true,
               CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
           }
       );
    }
}
