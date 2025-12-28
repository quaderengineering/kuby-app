namespace API.Kuby.Models.Cube;

public class TimeModel
{
    public int TimeId { get; set; }

    public int DisplayId { get; set; }

    public string Label { get; set; } = string.Empty;

    public List<IntervalModel> Intervals { get; set; } = new List<IntervalModel>();

    public string TimeZoneInfo { get; set; } = string.Empty;
}
