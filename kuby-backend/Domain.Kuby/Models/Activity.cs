namespace Domain.Kuby.Models;

public class Activity
{
    public int ActivityId { get; set; }

    public string Label { get; set; } = string.Empty;

    public TimeSpan TotalDuration { get; set; }

    public ICollection<TimeEntry> TimeEntry { get; set; } = new List<TimeEntry>();
}
