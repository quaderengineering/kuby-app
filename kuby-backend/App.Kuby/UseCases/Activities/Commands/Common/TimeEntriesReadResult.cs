namespace App.Kuby.UseCases.Activities.Commands.Common;

public class TimeEntriesReadResult
{
    public int TimeEntryId { get; set; }

    public int TimeId { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public TimeSpan Duration { get; set; }
}
