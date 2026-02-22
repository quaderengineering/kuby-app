using API.Kuby.Models.Activity;
using App.Kuby.UseCases.Activities.Common;
using App.Kuby.UseCases.Activities.Queries.GetById;
using App.Kuby.UseCases.Common;
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
                ActivityId = activity.ActivityId,
                TimeEntryId = t.TimeEntryId,
                Start = t.Start,
                End = t.End,
                Duration = t.End - t.Start,
                TimeZoneInfo = t.TimeZoneInfo,
            }).ToList(),
        };
    }

    public static ActivityViewModel MapToViewModel(this ActivityReadAllResult activityTimeReadAllResult)
    {
        return new ActivityViewModel
        {
            ActivityId = activityTimeReadAllResult.ActivityId,
            Label = activityTimeReadAllResult.Label,
            TimeEntries = activityTimeReadAllResult.TimeEntries.Select(t => t.MapToTimeEntry()).ToList(),
            TotalDuration = activityTimeReadAllResult.TotalDuration,
            CreatedAt = activityTimeReadAllResult.CreatedAt,
            IsActive = activityTimeReadAllResult.IsActive
        };
    }

    public static ActivityModel MapToModel(this ActivityReadResult activityTimeReadResult)
    {
        return new ActivityModel
        {
            ActivityId = activityTimeReadResult.ActivityId,
            Label = activityTimeReadResult.Label
        };
    }

    private static TimeEntryModel MapToTimeEntry(this TimeEntriesReadResult timeEntryReadResult)
    {
        return new TimeEntryModel
        {
            TimeEntryId = timeEntryReadResult.TimeEntryId,
            ActivityId = timeEntryReadResult.ActivityId,
            Duration = timeEntryReadResult.Duration,
            End = timeEntryReadResult.End,
            Start = timeEntryReadResult.Start,
        };
    }
}
