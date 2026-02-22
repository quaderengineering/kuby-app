namespace API.Kuby.Models.Activity;

public class ActivityImportResult
{
    public int ActivityId { get; set; }
    public string ActivityName { get; set; } = string.Empty;
    public int EntriesAdded { get; set; }
    public int EntriesDuplicate { get; set; }
}
