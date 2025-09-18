using App.Kuby.Interfaces.Repositories;
using Infrastructure.Kuby.Repositories.EF;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Kuby;

public static class ConfigureServices
{
    public static void AddInjectionInfrastructure(this IServiceCollection services)
    {
        // Repositories
        services.AddScoped<ICubeBookingRepository, CubeBookingRepository>();
    }
}
