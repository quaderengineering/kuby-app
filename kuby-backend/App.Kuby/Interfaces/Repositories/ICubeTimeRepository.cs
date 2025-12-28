using App.Kuby.UseCases.Cubes.Commands.Common;
using App.Kuby.UseCases.Cubes.Queries.GetAll;
using Domain.Kuby.Models;

namespace App.Kuby.Interfaces.Repositories;

public interface ICubeTimeRepository
{
    ValueTask<IReadOnlyCollection<int>> CreateCubeTimesAsync(IReadOnlyCollection<CubeTime> cubeTimes, CancellationToken token);
    ValueTask<IReadOnlyCollection<IntervalReadResult>> ReadIntervalsByRangeAsync(DateTime dateFrom, DateTime dateTo, CancellationToken token);
    ValueTask<IReadOnlyCollection<CubeTimeReadAllResult>> ReadAllAsync(GetAllCubeTimesQuery request, CancellationToken token);
}
