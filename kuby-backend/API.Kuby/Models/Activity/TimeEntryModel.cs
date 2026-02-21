namespace API.Kuby.Models.Activity;

public class TimeEntryModel
{
    public int TimeEntryId { get; set; }

    public int ActivityId { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public TimeSpan Duration { get; set; }

    public string TimeZoneInfo { get; set; } = string.Empty;
}
