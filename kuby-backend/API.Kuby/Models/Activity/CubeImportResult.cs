namespace API.Kuby.Models.Activity;

public class CubeImportResult
{
    public List<ActivityImportResult> ActivityResults { get; set; } = new();
    public List<string> Errors { get; set; } = new();
    public int TotalEntriesAdded => ActivityResults.Sum(r => r.EntriesAdded);
    public int TotalDuplicates => ActivityResults.Sum(r => r.EntriesDuplicate);
}
