using App.Kuby.UseCases.Activities.Common;
using App.Kuby.UseCases.Activities.Queries.GetAll;
using Domain.Kuby.Models;

namespace App.Kuby.Interfaces.Repositories;

public interface IActivityRepository
{
    ValueTask<Activity?> GetActivityAsync(Guid activityId, CancellationToken token);
    ValueTask<IReadOnlyCollection<Guid>> CreateActivitiesAsync(IReadOnlyCollection<Activity> activityTimes, CancellationToken token);
    ValueTask UpdateActivityAsync(CancellationToken token);
    ValueTask DeleteActivityAsync(Guid activityId, CancellationToken token);
    ValueTask<IReadOnlyCollection<ActivityReadAllResult>> ReadAllAsync(GetAllActivitiesQuery request, CancellationToken token);
    ValueTask<IReadOnlyCollection<Activity>> ReadActivitiesAsync(IReadOnlyCollection<Guid> activityIds, CancellationToken token);
    ValueTask<bool> IsLabelTaken(Activity activity, CancellationToken token);
}
