using App.Kuby.UseCases.Activities.Commands.Create;
using App.Kuby.UseCases.Activities.Queries.GetAll;
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

        services.AddScoped(typeof(IPipelineBehavior<CreateActivitiesCommand, IReadOnlyCollection<int>>), typeof(CreateActivitiesPreProcessor<CreateActivitiesCommand, IReadOnlyCollection<int>>));
        services.AddScoped(typeof(IPipelineBehavior<GetAllActivitiesQuery, IReadOnlyCollection<ActivityReadAllResult>>), typeof(GetAllActivitiesPreProcessor<GetAllActivitiesQuery, IReadOnlyCollection<ActivityReadAllResult>>));
    }
}
