namespace App.Kuby.UseCases.Activities.Common;

public class TimeEntriesReadResult
{
    public int TimeEntryId { get; set; }

    public Guid ActivityId { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public TimeSpan Duration { get; set; }
}
