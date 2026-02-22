using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Common;
using Mediator;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

public class GetAllTimeEntriesQueryHandler : IRequestHandler<GetAllTimeEntriesQuery, IReadOnlyCollection<ActivityReadAllResult>>
{
    private readonly IActivityRepository _activityTimeRepository;

    public GetAllTimeEntriesQueryHandler(IActivityRepository activityTimeRepository)
    {
        _activityTimeRepository = activityTimeRepository;
    }

    public ValueTask<IReadOnlyCollection<ActivityReadAllResult>> Handle(GetAllTimeEntriesQuery request, CancellationToken token)
        => _activityTimeRepository.ReadAllWithTimeEntriesAsync(request, token);
}
