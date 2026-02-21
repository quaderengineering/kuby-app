using App.Kuby.UseCases.Activities.Commands.Common;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

public class ActivityReadAllResult
{
    public int TimeId { get; set; }

    public string Label { get; set; } = string.Empty;

    public List<TimeEntriesReadResult> TimeEntries { get; set; } = new List<TimeEntriesReadResult>();

    public TimeSpan TotalDuration { get; set; }
}
