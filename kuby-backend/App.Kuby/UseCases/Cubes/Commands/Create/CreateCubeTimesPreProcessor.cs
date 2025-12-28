using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Cubes.Commands.Common;
using Domain.Kuby.Models;
using Mediator;

namespace App.Kuby.UseCases.Cubes.Commands.Create;

public class CreateCubeTimesPreProcessor<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse> where TMessage : CreateCubeTimesCommand where TResponse : IReadOnlyCollection<int>
{
    private readonly ICubeTimeRepository _cubeTimeRepository;

    public CreateCubeTimesPreProcessor(ICubeTimeRepository cubeTimeRepository)
    {
        _cubeTimeRepository = cubeTimeRepository;
    }

    public async ValueTask<TResponse> Handle(TMessage message, MessageHandlerDelegate<TMessage, TResponse> next, CancellationToken token)
    {
        //TODO: only allow times that have not intervals that are already in the DB (reject duplicates) (for creating, editing would be another story)
        var intervals = message.Times.SelectMany(t => t.Intervals).ToList();
        var intervalsByRange = await _cubeTimeRepository
            .ReadIntervalsByRangeAsync(GetMinDate(intervals), GetMaxDate(intervals), token).ConfigureAwait(false);

        message.UniqueTimes = message.Times.Where(t => t.Intervals.Any(i => !DoesIntervalExist(intervalsByRange, i))).ToList();
        return await next(message, token).ConfigureAwait(false);
    }

    private DateTime GetMinDate(IReadOnlyCollection<Interval> intervals)
        => intervals.Select(i => i.Start).Min();

    private DateTime GetMaxDate(IReadOnlyCollection<Interval> intervals)
        => intervals.Select(i => i.End).Max();

    private bool DoesIntervalExist(IReadOnlyCollection<IntervalReadResult> existingIntervals, Interval interval)
        => existingIntervals.Any(i => i.Start == interval.Start && i.End == interval.End);
}
