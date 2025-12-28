using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.Cubes.Commands.Create;

public class CreateCubeTimesCommandHandler : IRequestHandler<CreateCubeTimesCommand, IReadOnlyCollection<int>>
{
    private readonly ICubeTimeRepository _cubeTimeRepository;

    public CreateCubeTimesCommandHandler(ICubeTimeRepository cubeTimeRepository)
    {
        _cubeTimeRepository = cubeTimeRepository;
    }

    public ValueTask<IReadOnlyCollection<int>> Handle(CreateCubeTimesCommand request, CancellationToken token)
    {
        return request.UniqueTimes.Any() 
            ? _cubeTimeRepository.CreateCubeTimesAsync(request.UniqueTimes, token) 
            : ValueTask.FromResult<IReadOnlyCollection<int>>([]);
    }
}
