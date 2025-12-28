using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Cubes.Commands.Common;
using App.Kuby.UseCases.Cubes.Queries.GetAll;
using Domain.Kuby.Models;
using Infrastructure.Kuby.Data.EntitiesConfig;
using Infrastructure.Kuby.Mapping;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
}
