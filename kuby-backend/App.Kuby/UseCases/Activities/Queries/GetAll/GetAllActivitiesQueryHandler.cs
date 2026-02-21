using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

public class GetAllActivitiesQueryHandler : IRequestHandler<GetAllActivitiesQuery, IReadOnlyCollection<ActivityReadAllResult>>
{
    private readonly IActivityRepository _activityTimeRepository;

    public GetAllActivitiesQueryHandler(IActivityRepository activityTimeRepository)
    {
        _activityTimeRepository = activityTimeRepository;
    }

    public ValueTask<IReadOnlyCollection<ActivityReadAllResult>> Handle(GetAllActivitiesQuery request, CancellationToken token)
        => _activityTimeRepository.ReadAllAsync(request, token);
}
