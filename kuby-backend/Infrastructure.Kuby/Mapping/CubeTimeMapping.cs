using App.Kuby.UseCases.Cubes.Commands.Common;
using Domain.Kuby.Models;

namespace Infrastructure.Kuby.Mapping;

public static class CubeTimeMapping
{
    public static IntervalReadResult MapToIntervalReadResult(this Interval interval)
    {
        return new IntervalReadResult
        {
            IntervalId = interval.IntervalId,
            TimeId = interval.CubeTimeId,
            Start = interval.Start,
            End = interval.End,
            Duration = interval.Duration,
        };
    }
}
