using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Create;

public class CreateActivitiesCommandHandler : IRequestHandler<CreateActivitiesCommand, IReadOnlyCollection<Guid>>
{
    private readonly IActivityRepository _activityTimeRepository;

    public CreateActivitiesCommandHandler(IActivityRepository activityTimeRepository)
    {
        _activityTimeRepository = activityTimeRepository;
    }

    public ValueTask<IReadOnlyCollection<Guid>> Handle(CreateActivitiesCommand request, CancellationToken token)
    {
        return _activityTimeRepository.CreateActivitiesAsync(request.Activity, token);
    }
}
