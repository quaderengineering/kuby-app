using Domain.Kuby.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Kuby.Data.EntitiesConfig;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<Display> Display { get; set; }
}
