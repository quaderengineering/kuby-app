using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Activities.Common;
using Domain.Kuby.Models;
using FluentValidation;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Import;

public class ImportActivitiesCommandPreProcessor<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse> where TMessage : ImportActivitiesCommand
{
    private readonly IActivityRepository _activityRepository;
    private readonly ITimeEntryRepository _timeEntryRepository;

    public ImportActivitiesCommandPreProcessor(IActivityRepository activityRepository, ITimeEntryRepository timeEntryRepository)
    {
        _activityRepository = activityRepository;
        _timeEntryRepository = timeEntryRepository;
    }

    public async ValueTask<TResponse> Handle(TMessage message, MessageHandlerDelegate<TMessage, TResponse> next, CancellationToken token)
    {
        var existingActivities = await _activityRepository.ReadActivitiesAsync(
            message.Activities.Select(a => a.ActivityId).ToList(), token);

        if (!existingActivities.Any())
            // FIXME: should be notfound exc 404
            throw new ValidationException($"No matching Activities were found.");

        var timeEntries = message.Activities.SelectMany(a => a.TimeEntry).ToList();
        var timeEntriesByRange = await _timeEntryRepository
            .ReadTimeEntriesByRangeAsync(GetMinDate(timeEntries), GetMaxDate(timeEntries), token).ConfigureAwait(false);

        message.TimeEntriesToCreate = timeEntries.Where(t => !DoesTimeEntryExist(timeEntriesByRange, t)).ToList();

        return await next(message, token).ConfigureAwait(false);
    }

    private DateTime GetMinDate(IReadOnlyCollection<TimeEntry> timeEntries)
        => timeEntries.Select(i => i.Start).Min();

    private DateTime GetMaxDate(IReadOnlyCollection<TimeEntry> timeEntries)
        => timeEntries.Select(i => i.End).Max();

    private bool DoesTimeEntryExist(IReadOnlyCollection<TimeEntriesReadResult> existingTimeEntries, TimeEntry timeEntries)
        => existingTimeEntries.Any(i => i.Start == timeEntries.Start && i.End == timeEntries.End);
}
