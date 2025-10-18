using App.Kuby.Interfaces.Repositories;
using Infrastructure.Kuby.Data.EntitiesConfig;
using Infrastructure.Kuby.Repositories.EF;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Kuby;

public static class ConfigureServices
{
    public static void AddInjectionInfrastructure(this IServiceCollection services)
    {
        // Repositories
        services.AddScoped<ICubeBookingRepository, CubeBookingRepository>();

        CreateDbConfigurations(services);
    }

    private static void CreateDbConfigurations(IServiceCollection services)
    {
        var appFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Kuby-App");

        if (!Directory.Exists(appFolder))
            Directory.CreateDirectory(appFolder);

        var dbPath = Path.Combine(appFolder, "kuby.db");

        services.AddDbContext<DataContext>(options =>
            options.UseSqlite($"Data Source={dbPath}"));
    }
}
