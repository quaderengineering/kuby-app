using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Create;

public class CreateActivitiesCommandHandler : IRequestHandler<CreateActivitiesCommand, IReadOnlyCollection<int>>
{
    private readonly IActivityRepository _activityTimeRepository;

    public CreateActivitiesCommandHandler(IActivityRepository activityTimeRepository)
    {
        _activityTimeRepository = activityTimeRepository;
    }

    public ValueTask<IReadOnlyCollection<int>> Handle(CreateActivitiesCommand request, CancellationToken token)
    {
        return request.UniqueTimes.Any() 
            ? _activityTimeRepository.CreateActivitiesAsync(request.UniqueTimes, token) 
            : ValueTask.FromResult<IReadOnlyCollection<int>>([]);
    }
}
