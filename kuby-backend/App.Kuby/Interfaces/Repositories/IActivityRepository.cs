using App.Kuby.UseCases.Activities.Commands.Common;
using App.Kuby.UseCases.Activities.Queries.GetAll;
using Domain.Kuby.Models;

namespace App.Kuby.Interfaces.Repositories;

public interface IActivityRepository
{
    ValueTask<IReadOnlyCollection<int>> CreateActivitiesAsync(IReadOnlyCollection<Activity> activityTimes, CancellationToken token);
    ValueTask<IReadOnlyCollection<TimeEntriesReadResult>> ReadTimeEntriesByRangeAsync(DateTime dateFrom, DateTime dateTo, CancellationToken token);
    ValueTask<IReadOnlyCollection<ActivityReadAllResult>> ReadAllAsync(GetAllActivitiesQuery request, CancellationToken token);
}
