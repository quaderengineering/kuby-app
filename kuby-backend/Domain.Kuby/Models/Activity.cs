using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Kuby.Models;

public class Activity
{
    public Guid ActivityId { get; set; } = Guid.CreateVersion7();

    public string Label { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }

    public bool IsCreatedBySystem { get; set; } = false;

    public ICollection<TimeEntry> TimeEntry { get; set; } = new List<TimeEntry>();

    [NotMapped]
    public bool IsLabelTaken { get; private set; } = false;

    public void SetLabelTakenFlag(bool isLabelTaken)
    {
        IsLabelTaken = isLabelTaken;
    }
}
