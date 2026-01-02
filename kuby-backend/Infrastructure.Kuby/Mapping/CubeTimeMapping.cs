using App.Kuby.UseCases.Cubes.Commands.Common;
using Domain.Kuby.Models;

namespace Infrastructure.Kuby.Mapping;

public static class CubeTimeMapping
{
    public static IntervalReadResult MapToIntervalReadResult(this Interval interval, string timeZoneInfo)
    {
        return new IntervalReadResult
        {
            IntervalId = interval.IntervalId,
            TimeId = interval.CubeTimeId,
            Start = TimeZoneInfo.ConvertTimeFromUtc(interval.Start, TimeZoneInfo.FindSystemTimeZoneById(timeZoneInfo)),
            End = TimeZoneInfo.ConvertTimeFromUtc(interval.End, TimeZoneInfo.FindSystemTimeZoneById(timeZoneInfo)),
            Duration = interval.Duration,
        };
    }
}
