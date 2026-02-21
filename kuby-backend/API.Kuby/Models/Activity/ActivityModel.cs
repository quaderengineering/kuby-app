namespace API.Kuby.Models.Activity;

public class ActivityModel
{
    public int ActivityId { get; set; }

    public string Label { get; set; } = string.Empty;

    public List<TimeEntryModel> TimeEntries { get; set; } = new List<TimeEntryModel>();
}
