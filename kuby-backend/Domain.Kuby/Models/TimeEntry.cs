namespace Domain.Kuby.Models;

public class TimeEntry
{
    public int TimeEntryId { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public TimeSpan Duration { get; set; }

    public string TimeZoneInfo { get; set; } = string.Empty;

    public Guid ActivityId { get; set; }
    public Activity? Activity { get; set; }
}
