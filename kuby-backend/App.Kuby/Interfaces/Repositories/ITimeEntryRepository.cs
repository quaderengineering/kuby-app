using App.Kuby.UseCases.Activities.Common;
using App.Kuby.UseCases.Activities.Queries.GetAll;
using Domain.Kuby.Models;

namespace App.Kuby.Interfaces.Repositories;

public interface ITimeEntryRepository
{
    ValueTask<IReadOnlyCollection<int>> CreateTimeEntriesAsync(IReadOnlyCollection<TimeEntry> timeEntries, CancellationToken token);
    ValueTask<IReadOnlyCollection<TimeEntriesReadResult>> ReadTimeEntriesByRangeAsync(DateTime dateFrom, DateTime dateTo, CancellationToken token);
}
