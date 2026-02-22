using App.Kuby.UseCases.Activities.Commands.Create;
using App.Kuby.UseCases.Activities.Commands.Import;
using App.Kuby.UseCases.Activities.Commands.Update;
using App.Kuby.UseCases.Activities.Queries.GetAll;
using App.Kuby.UseCases.Common;
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

        services.AddScoped(typeof(IPipelineBehavior<CreateActivitiesCommand, IReadOnlyCollection<Guid>>), typeof(CreateActivitiesCommandPreProcessor<CreateActivitiesCommand, IReadOnlyCollection<Guid>>));
        services.AddScoped(typeof(IPipelineBehavior<UpdateActivityCommand, Unit>), typeof(UpdateActivityCommandPreProcessor<UpdateActivityCommand, Unit>));
        services.AddScoped(typeof(IPipelineBehavior<DeleteActivityCommand, Unit>), typeof(DeleteActivityCommandPreProcessor<DeleteActivityCommand, Unit>));
        services.AddScoped(typeof(IPipelineBehavior<ImportActivitiesCommand, IReadOnlyCollection<int>>), typeof(ImportActivitiesCommandPreProcessor<ImportActivitiesCommand, IReadOnlyCollection<int>>));
    }
}
