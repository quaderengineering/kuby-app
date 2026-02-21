using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Activities.Commands.Common;
using Domain.Kuby.Models;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Create;

public class CreateActivitiesPreProcessor<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse> where TMessage : CreateActivitiesCommand where TResponse : IReadOnlyCollection<int>
{
    private readonly IActivityRepository _activityTimeRepository;

    public CreateActivitiesPreProcessor(IActivityRepository activityTimeRepository)
    {
        _activityTimeRepository = activityTimeRepository;
    }

    public async ValueTask<TResponse> Handle(TMessage message, MessageHandlerDelegate<TMessage, TResponse> next, CancellationToken token)
    {
        // only allow times that have not intervals that are already in the DB (reject duplicates) (for creating, editing would be another story)
        var timeEntries = message.Times.SelectMany(t => t.TimeEntry).ToList();
        var timeEntriesByRange = await _activityTimeRepository
            .ReadTimeEntriesByRangeAsync(GetMinDate(timeEntries), GetMaxDate(timeEntries), token).ConfigureAwait(false);

        message.UniqueTimes = message.Times.Where(t => t.TimeEntry.Any(i => !DoesTimeEntryExist(timeEntriesByRange, i))).ToList();
        return await next(message, token).ConfigureAwait(false);
    }

    private DateTime GetMinDate(IReadOnlyCollection<TimeEntry> timeEntries)
        => timeEntries.Select(i => i.Start).Min();

    private DateTime GetMaxDate(IReadOnlyCollection<TimeEntry> timeEntries)
        => timeEntries.Select(i => i.End).Max();

    private bool DoesTimeEntryExist(IReadOnlyCollection<TimeEntriesReadResult> existingTimeEntries, TimeEntry timeEntries)
        => existingTimeEntries.Any(i => i.Start == timeEntries.Start && i.End == timeEntries.End);
}
