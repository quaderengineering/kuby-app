using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Activities.Common;
using Domain.Kuby.Models;
using Infrastructure.Kuby.Data.EntitiesConfig;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Kuby.Repositories.EF;

internal class TimeEntryRepository : ITimeEntryRepository
{
    private readonly DataContext _dbContext;

    public TimeEntryRepository(DataContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async ValueTask<IReadOnlyCollection<int>> CreateTimeEntriesAsync(IReadOnlyCollection<TimeEntry> timeEntries, CancellationToken token)
    {
        await _dbContext.AddRangeAsync(timeEntries, token).ConfigureAwait(false);
        await _dbContext.SaveChangesAsync(token).ConfigureAwait(false);
        return timeEntries.Select(a => a.TimeEntryId).ToList();
    }

    public async ValueTask<IReadOnlyCollection<TimeEntriesReadResult>> ReadTimeEntriesByRangeAsync(DateTime dateFrom, DateTime dateTo, CancellationToken token)
    {
        var query = from i in _dbContext.TimeEntry

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
}
