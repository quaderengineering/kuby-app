using API.Kuby.Models.Activity;
using App.Kuby.UseCases.Activities.Commands.Common;
using App.Kuby.UseCases.Activities.Queries.GetAll;
using Domain.Kuby.Models;

namespace API.Kuby.Mapping;

public static class ActivityMapping
{
    public static Activity MapToDomainModel(this ActivityModel activity)
    {
        return new Activity
        {
            ActivityId = activity.ActivityId,
            Label = activity.Label,
            TimeEntry = activity.TimeEntries.Select(t => new TimeEntry
            {
                TimeEntryId = t.TimeEntryId,
                Start = t.Start,
                End = t.End,
                Duration = t.End - t.Start,
                TimeZoneInfo = t.TimeZoneInfo,
            }).ToList(),
            TotalDuration = TimeSpan.FromTicks(activity.TimeEntries.Sum(t => (t.End - t.Start).Ticks))
        };
    }

    public static ActivityViewModel MapToViewModel(this ActivityReadAllResult activityTimeReadAllResult)
    {
        return new ActivityViewModel
        {
            ActivityId = activityTimeReadAllResult.TimeId,
            Label = activityTimeReadAllResult.Label,
            TimeEntries = activityTimeReadAllResult.TimeEntries.Select(t => t.MapToTimeEntry()).ToList(),
            TotalDuration = activityTimeReadAllResult.TotalDuration,
        };
    }

    private static TimeEntryModel MapToTimeEntry(this TimeEntriesReadResult timeEntryReadResult)
    {
        return new TimeEntryModel
        {
            TimeEntryId = timeEntryReadResult.TimeEntryId,
            ActivityId = timeEntryReadResult.TimeId,
            Duration = timeEntryReadResult.Duration,
            End = timeEntryReadResult.End,
            Start = timeEntryReadResult.Start,
        };
    }
}
