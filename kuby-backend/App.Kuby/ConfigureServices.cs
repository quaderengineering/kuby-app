using App.Kuby.UseCases.CubeBookings.Queries.GetById;
using App.Kuby.UseCases.Cubes.Commands.Create;
using App.Kuby.UseCases.Cubes.Queries.GetAll;
using Mediator;
using Microsoft.Extensions.DependencyInjection;

namespace App.Kuby;

public static class ConfigureServices
{
    public static void AddInjectionApplication(this IServiceCollection services)
    {
        services.AddMediator(options =>
        {
            options.ServiceLifetime = ServiceLifetime.Scoped;
        });

        //FIXME: this is for testing purposes
        services.AddScoped(typeof(IPipelineBehavior<GetCubeBookingQuery, CubeBookingReadResult>), typeof(GetCubeBookingQueryPreProcessor<GetCubeBookingQuery, CubeBookingReadResult>));

        services.AddScoped(typeof(IPipelineBehavior<CreateCubeTimesCommand, IReadOnlyCollection<int>>), typeof(CreateCubeTimesPreProcessor<CreateCubeTimesCommand, IReadOnlyCollection<int>>));
        services.AddScoped(typeof(IPipelineBehavior<GetAllCubeTimesQuery, IReadOnlyCollection<CubeTimeReadAllResult>>), typeof(GetAllCubeTimesPreProcessor<GetAllCubeTimesQuery, IReadOnlyCollection<CubeTimeReadAllResult>>));
    }
}
