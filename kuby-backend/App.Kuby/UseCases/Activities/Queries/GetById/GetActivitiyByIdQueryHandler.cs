using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Common;
using Mediator;

namespace App.Kuby.UseCases.Activities.Queries.GetById;

public class GetActivityByIdQueryHandler : IRequestHandler<GetActivityByIdQuery, ActivityReadResult>
{
    private readonly IActivityRepository _activityTimeRepository;

    public GetActivityByIdQueryHandler(IActivityRepository activityTimeRepository)
    {
        _activityTimeRepository = activityTimeRepository;
    }

    public ValueTask<ActivityReadResult> Handle(GetActivityByIdQuery request, CancellationToken token)
        => _activityTimeRepository.ReadAsync(request.ActivityId, token);
}
