using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.Cubes.Queries.GetAll;

public class GetAllCubeTimesQueryHandler : IRequestHandler<GetAllCubeTimesQuery, IReadOnlyCollection<CubeTimeReadAllResult>>
{
    private readonly ICubeTimeRepository _cubeTimeRepository;

    public GetAllCubeTimesQueryHandler(ICubeTimeRepository cubeTimeRepository)
    {
        _cubeTimeRepository = cubeTimeRepository;
    }

    public ValueTask<IReadOnlyCollection<CubeTimeReadAllResult>> Handle(GetAllCubeTimesQuery request, CancellationToken token)
        => _cubeTimeRepository.ReadAllAsync(request, token);
}
