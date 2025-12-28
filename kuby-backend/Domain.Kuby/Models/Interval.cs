namespace Domain.Kuby.Models;

public class Interval
{
    public int IntervalId { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public TimeSpan Duration { get; set; }

    public int CubeTimeId { get; set; }
    public CubeTime? CubeTime { get; set; }
}
