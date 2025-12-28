using Domain.Kuby.Models;
using Mediator;

namespace App.Kuby.UseCases.Cubes.Commands.Create;

public record CreateCubeTimesCommand(IReadOnlyCollection<CubeTime> Times) : IRequest<IReadOnlyCollection<int>>
{
    public IReadOnlyCollection<CubeTime> UniqueTimes { get; set; } = new List<CubeTime>();
}