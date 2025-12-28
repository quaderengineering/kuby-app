namespace API.Kuby.Models.Cube;

public class TimeViewModel
{
    public int TimeId { get; set; }

    public int DisplayId { get; set; }

    public string Label { get; set; } = string.Empty;

    public List<IntervalModel> Intervals { get; set; } = new List<IntervalModel>();

    public TimeSpan TotalDuration { get; set; }
}