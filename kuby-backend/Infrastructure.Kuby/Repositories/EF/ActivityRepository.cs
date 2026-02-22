using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Activities.Queries.GetAll;
using App.Kuby.UseCases.Activities.Queries.GetById;
using App.Kuby.UseCases.Common;
using Domain.Kuby.Models;
using Infrastructure.Kuby.Data.EntitiesConfig;
using Infrastructure.Kuby.Mapping;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Kuby.Repositories.EF;

internal class ActivityRepository : IActivityRepository
{
    private readonly DataContext _dbContext;

    public ActivityRepository(DataContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async ValueTask<Activity?> GetActivityAsync(Guid activityId, CancellationToken token)
    {
        return await _dbContext.Activity
            .Where(a => a.ActivityId == activityId && a.IsActive)
            .SingleOrDefaultAsync(token).ConfigureAwait(false);
    }

    public async ValueTask<IReadOnlyCollection<Guid>> CreateActivitiesAsync(IReadOnlyCollection<Activity> activities, CancellationToken token)
    {
        var activeActivities = activities.Select(a =>
        {
            a.CreatedAt = DateTime.UtcNow;
            a.IsActive = true;
            return a;
        });
        await _dbContext.AddRangeAsync(activeActivities, token).ConfigureAwait(false);
        await _dbContext.SaveChangesAsync(token).ConfigureAwait(false);
        return activeActivities.Select(a => a.ActivityId).ToList();
    }

    public async ValueTask UpdateActivityAsync(CancellationToken token)
    {
        await _dbContext.SaveChangesAsync(token).ConfigureAwait(false);
    }

    public async ValueTask DeleteActivityAsync(Guid activityId, CancellationToken token)
    {
        var activity = await GetActivityAsync(activityId, token).ConfigureAwait(false);
        activity!.IsActive = false;

        await _dbContext.SaveChangesAsync(token).ConfigureAwait(false);
    }

    public async ValueTask<IReadOnlyCollection<Activity>> ReadActivitiesAsync(IReadOnlyCollection<Guid> activityIds, CancellationToken token)
    {
       return await _dbContext.Activity
            .Where(a => activityIds.Contains(a.ActivityId))
            .AsNoTracking().ToListAsync(token).ConfigureAwait(false);
    }

    public async ValueTask<IReadOnlyCollection<ActivityReadAllResult>> ReadAllAsync(GetAllActivitiesQuery request, CancellationToken token)
    {
        var activities = await _dbContext.Activity
            .Where(a => a.IsActive == request.IsActive)
            .AsNoTracking().ToListAsync(token).ConfigureAwait(false);

        return activities.Select(a => new ActivityReadAllResult
        {
            ActivityId = a.ActivityId,
            Label = a.Label,
            IsActive = a.IsActive,
            CreatedAt = a.CreatedAt,
        }).ToList();
    }

    public async ValueTask<IReadOnlyCollection<ActivityReadAllResult>> ReadAllWithTimeEntriesAsync(GetAllTimeEntriesQuery request, CancellationToken token)
    {
        var activities = await _dbContext.Activity
                    .Include(a => a.TimeEntry)
                    .Where(a => a.IsActive && a.TimeEntry.Any(i =>
                        DateOnly.FromDateTime(i.Start) >= request.DateFrom &&
                        DateOnly.FromDateTime(i.Start) <= request.DateTo &&
                        DateOnly.FromDateTime(i.End) >= request.DateFrom &&
                        DateOnly.FromDateTime(i.End) <= request.DateTo))
                    .AsNoTracking().ToListAsync(token).ConfigureAwait(false);

        return activities.Select(a => new ActivityReadAllResult
        {
            ActivityId = a.ActivityId,
            Label = a.Label,
            TimeEntries = a.TimeEntry
                            .Select(timeEntry => timeEntry.MapToTimeEntryReadResult())
                            .ToList(),
            TotalDuration = TimeSpan.FromTicks(a.TimeEntry.Sum(i => (i.End - i.Start).Ticks)),
        }).ToList();
    }

    public async ValueTask<bool> IsLabelTaken(Activity activity, CancellationToken token)
    {
        return await _dbContext.Activity
            .Where(a => 
            a.Label == activity.Label 
            && a.ActivityId != activity.ActivityId 
            && a.IsActive)
            .Select(a => a.ActivityId)
            .AnyAsync(token).ConfigureAwait(false);
    }

    public async ValueTask<ActivityReadResult?> ReadAsync(Guid activityId, CancellationToken token)
    {
        return await _dbContext.Activity
            .Where(a => a.ActivityId == activityId && a.IsActive)
            .Select(a => new ActivityReadResult
            {
                ActivityId = a.ActivityId,
                Label = a.Label
            }).SingleOrDefaultAsync(token);
    }
}
