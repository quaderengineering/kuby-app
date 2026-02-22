using App.Kuby.UseCases.Activities.Common;
using Domain.Kuby.Models;

namespace Infrastructure.Kuby.Mapping;

public static class ActivityMapping
{
    public static TimeEntriesReadResult MapToTimeEntryReadResult(this TimeEntry timeEntry)
    {
        return new TimeEntriesReadResult
        {
            TimeEntryId = timeEntry.TimeEntryId,
            ActivityId = timeEntry.ActivityId,
            Start = TimeZoneInfo.ConvertTimeFromUtc(timeEntry.Start, TimeZoneInfo.FindSystemTimeZoneById(timeEntry.TimeZoneInfo)),
            End = TimeZoneInfo.ConvertTimeFromUtc(timeEntry.End, TimeZoneInfo.FindSystemTimeZoneById(timeEntry.TimeZoneInfo)),
            Duration = timeEntry.Duration,
        };
    }
}
