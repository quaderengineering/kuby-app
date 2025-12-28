using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Kuby.Data.EntitiesConfig;

public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
{
    public DataContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<DataContext>();

        var appFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Kuby-App");

        var dbPath = Path.Combine(appFolder, "kuby.db");

        optionsBuilder.UseSqlite($"Data Source={dbPath}");

        return new DataContext(optionsBuilder.Options);
    }
}
