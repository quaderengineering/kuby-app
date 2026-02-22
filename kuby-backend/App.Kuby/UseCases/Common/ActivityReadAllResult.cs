using App.Kuby.UseCases.Activities.Common;

namespace App.Kuby.UseCases.Common;

public class ActivityReadAllResult
{
    public Guid ActivityId { get; set; }

    public string Label { get; set; } = string.Empty;

    public List<TimeEntriesReadResult> TimeEntries { get; set; } = new List<TimeEntriesReadResult>();

    public TimeSpan TotalDuration { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }
}
