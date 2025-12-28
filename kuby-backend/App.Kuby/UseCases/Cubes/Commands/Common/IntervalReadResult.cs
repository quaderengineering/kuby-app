namespace App.Kuby.UseCases.Cubes.Commands.Common;

public class IntervalReadResult
{
    public int IntervalId { get; set; }

    public int TimeId { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public TimeSpan Duration { get; set; }
}
