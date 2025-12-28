using App.Kuby.UseCases.Cubes.Commands.Common;

namespace App.Kuby.UseCases.Cubes.Queries.GetAll;

public class CubeTimeReadAllResult
{
    public int TimeId { get; set; }

    public int DisplayId { get; set; }

    public string Label { get; set; } = string.Empty;

    public List<IntervalReadResult> Intervals { get; set; } = new List<IntervalReadResult>();

    public TimeSpan TotalDuration { get; set; }
}
