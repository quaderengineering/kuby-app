using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Activities.Commands.Common;
using App.Kuby.UseCases.Activities.Queries.GetAll;
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

    public async ValueTask<IReadOnlyCollection<int>> CreateActivitiesAsync(IReadOnlyCollection<Activity> activities, CancellationToken token)
    {
        await _dbContext.AddRangeAsync(activities, token).ConfigureAwait(false);
        await _dbContext.SaveChangesAsync(token).ConfigureAwait(false);
        return activities.Select(a => a.ActivityId).ToList();
    }

    public async ValueTask<IReadOnlyCollection<TimeEntriesReadResult>> ReadTimeEntriesByRangeAsync(DateTime dateFrom, DateTime dateTo, CancellationToken token)
    {
        var query = from c in _dbContext.Activity
                    join i in _dbContext.TimeEntry
                        on c.ActivityId equals i.ActivityId

                    where i.Start >= dateFrom && i.Start <= dateTo
                    && i.End >= dateFrom && i.Start <= dateTo

                    select new TimeEntriesReadResult
                    {
                        TimeEntryId = i.TimeEntryId,
                        End = i.End,
                        Start = i.Start,
                    };

        return await query.AsNoTracking().ToListAsync(token).ConfigureAwait(false);
    }

    public async ValueTask<IReadOnlyCollection<ActivityReadAllResult>> ReadAllAsync(GetAllActivitiesQuery request, CancellationToken token)
    {
        var times =  await _dbContext.Activity
                    .Include(c => c.TimeEntry)
                    .Where(c => c.TimeEntry.Any(i =>
                        DateOnly.FromDateTime(i.Start) >= request.DateFrom &&
                        DateOnly.FromDateTime(i.Start) <= request.DateTo &&
                        DateOnly.FromDateTime(i.End) >= request.DateFrom &&
                        DateOnly.FromDateTime(i.End) <= request.DateTo))
                    .AsNoTracking().ToListAsync(token).ConfigureAwait(false);

        return times.Select(c => new ActivityReadAllResult
        {
            TimeId = c.ActivityId,
            Label = c.Label,
            TimeEntries = c.TimeEntry
                            .Select(timeEntry => timeEntry.MapToTimeEntryReadResult())
                            .ToList(),
            TotalDuration = TimeSpan.FromTicks(c.TimeEntry.Sum(i => (i.End - i.Start).Ticks)),
        }).ToList();
    }
}
