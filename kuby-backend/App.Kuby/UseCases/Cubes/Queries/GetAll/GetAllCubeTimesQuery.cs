using Mediator;

namespace App.Kuby.UseCases.Cubes.Queries.GetAll;

public record GetAllCubeTimesQuery(DateOnly DateFrom, DateOnly DateTo) : IRequest<IReadOnlyCollection<CubeTimeReadAllResult>>;
