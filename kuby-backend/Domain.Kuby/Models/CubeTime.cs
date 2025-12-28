namespace Domain.Kuby.Models;

public class CubeTime
{
    public int CubeTimeId { get; set; }

    public int DisplayId { get; set; }

    public string Label { get; set; } = string.Empty;

    public TimeSpan TotalDuration { get; set; }

    public string TimeZoneInfo { get; set; } = string.Empty;

    public ICollection<Interval> Intervals { get; set; } = new List<Interval>();
}
