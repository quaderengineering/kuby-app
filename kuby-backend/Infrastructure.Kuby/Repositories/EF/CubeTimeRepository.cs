using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Cubes.Commands.Common;
using App.Kuby.UseCases.Cubes.Queries.GetAll;
using Domain.Kuby.Models;
using Infrastructure.Kuby.Data.EntitiesConfig;
using Infrastructure.Kuby.Mapping;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Kuby.Repositories.EF;

internal class CubeTimeRepository : ICubeTimeRepository
{
    private readonly DataContext _dbContext;

    public CubeTimeRepository(DataContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async ValueTask<IReadOnlyCollection<int>> CreateCubeTimesAsync(IReadOnlyCollection<CubeTime> cubeTimes, CancellationToken token)
    {
        await _dbContext.AddRangeAsync(cubeTimes, token).ConfigureAwait(false);
        await _dbContext.SaveChangesAsync(token).ConfigureAwait(false);
        return cubeTimes.Select(ct => ct.CubeTimeId).ToList();
    }

    public async ValueTask<IReadOnlyCollection<IntervalReadResult>> ReadIntervalsByRangeAsync(DateTime dateFrom, DateTime dateTo, CancellationToken token)
    {
        var query = from c in _dbContext.CubeTime
                    join i in _dbContext.Interval
                        on c.CubeTimeId equals i.CubeTimeId

                    where i.Start >= dateFrom && i.Start <= dateTo
                    && i.End >= dateFrom && i.Start <= dateTo

                    select new IntervalReadResult
                    {
                        IntervalId = i.IntervalId,
                        End = i.End,
                        Start = i.Start,
                    };

        return await query.AsNoTracking().ToListAsync(token).ConfigureAwait(false);
    }

    public async ValueTask<IReadOnlyCollection<CubeTimeReadAllResult>> ReadAllAsync(GetAllCubeTimesQuery request, CancellationToken token)
    {
        var times =  await _dbContext.CubeTime
                    .Include(c => c.Intervals)
                    .Where(c => c.Intervals.Any(i =>
                        DateOnly.FromDateTime(i.Start) >= request.DateFrom &&
                        DateOnly.FromDateTime(i.Start) <= request.DateTo &&
                        DateOnly.FromDateTime(i.End) >= request.DateFrom &&
                        DateOnly.FromDateTime(i.End) <= request.DateTo))
                    .AsNoTracking().ToListAsync(token).ConfigureAwait(false);

        return times.Select(c => new CubeTimeReadAllResult
        {
            TimeId = c.CubeTimeId,
            Label = c.Label,
            DisplayId = c.DisplayId,
            Intervals = c.Intervals
                            .Select(interval => interval.MapToIntervalReadResult(c.TimeZoneInfo))
                            .ToList(),
            TotalDuration = c.TotalDuration,
        }).ToList();
    }
}
