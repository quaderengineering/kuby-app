namespace App.Kuby.UseCases.Activities.Queries.GetById;

public class ActivityReadResult
{
    public Guid ActivityId { get; set; }

    public string Label { get; set; } = string.Empty;
}
