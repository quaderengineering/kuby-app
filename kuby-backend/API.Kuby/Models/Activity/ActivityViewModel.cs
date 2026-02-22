namespace API.Kuby.Models.Activity;

public class ActivityViewModel
{
    public Guid ActivityId { get; set; }

    public string Label { get; set; } = string.Empty;

    public List<TimeEntryModel> TimeEntries { get; set; } = new List<TimeEntryModel>();

    public TimeSpan TotalDuration { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }
}