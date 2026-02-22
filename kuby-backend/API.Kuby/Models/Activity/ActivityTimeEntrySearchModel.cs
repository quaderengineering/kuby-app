namespace API.Kuby.Models.Activity;

public class ActivityTimeEntrySearchModel
{
    public bool IsActive { get; set; }
    public DateOnly DateFrom {  get; set; } 
    public DateOnly DateTo { get; set; }
}
