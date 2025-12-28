using API.Kuby.Models.Cube;
using App.Kuby.UseCases.Cubes.Commands.Common;
using App.Kuby.UseCases.Cubes.Queries.GetAll;
using Domain.Kuby.Models;

namespace API.Kuby.Mapping;

public static class CubeTimeMapping
{
    public static CubeTime MapToDomainModel(this TimeModel cubeTime)
    {
        return new CubeTime
        {
            CubeTimeId = cubeTime.TimeId,
            DisplayId = cubeTime.DisplayId,
            Label = cubeTime.Label,
            TimeZoneInfo = cubeTime.TimeZoneInfo,
            Intervals = cubeTime.Intervals.Select(i => new Interval
            {
                IntervalId = i.IntervalId,
                Start = i.Start,
                End = i.End,
                Duration = i.End - i.Start
            }).ToList(),
            TotalDuration = TimeSpan.FromTicks(cubeTime.Intervals.Sum(i => (i.End - i.Start).Ticks))
        };
    }

    public static TimeViewModel MapToViewModel(this CubeTimeReadAllResult cubeTimeReadAllResult)
    {
        return new TimeViewModel
        {
            TimeId = cubeTimeReadAllResult.TimeId,
            DisplayId = cubeTimeReadAllResult.DisplayId,
            Label = cubeTimeReadAllResult.Label,
            Intervals = cubeTimeReadAllResult.Intervals.Select(i => i.MapToInterval()).ToList(),
            TotalDuration = cubeTimeReadAllResult.TotalDuration,
        };
    }

    private static IntervalModel MapToInterval(this IntervalReadResult intervalReadResult)
    {
        return new IntervalModel
        {
            IntervalId = intervalReadResult.IntervalId,
            TimeId = intervalReadResult.TimeId,
            Duration = intervalReadResult.Duration,
            End = intervalReadResult.End,
            Start = intervalReadResult.Start,
        };
    }
}
